import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";
import { emailService } from "@/lib/email/emailService";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 5;

// In-memory rate limiting tracker for unknown identifiers or IP addresses
interface RateLimitRecord {
  attempts: number;
  lockoutUntil?: number;
}
const ipRateLimitMap = new Map<string, RateLimitRecord>();

function cleanExpiredRateLimits() {
  const now = Date.now();
  for (const [key, val] of ipRateLimitMap.entries()) {
    if (val.lockoutUntil && val.lockoutUntil <= now) {
      ipRateLimitMap.delete(key);
    }
  }
}

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email/username and password are required" },
        { status: 400 }
      );
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Unknown Browser / Device";

    cleanExpiredRateLimits();

    const normalizedInput = email.toLowerCase().trim();

    // Check IP-based lockout first
    const ipRecord = ipRateLimitMap.get(ipAddress);
    const nowTimestamp = Date.now();
    if (ipRecord?.lockoutUntil && ipRecord.lockoutUntil > nowTimestamp) {
      const remainingSeconds = Math.ceil((ipRecord.lockoutUntil - nowTimestamp) / 1000);
      const remainingMinutes = Math.max(1, Math.ceil(remainingSeconds / 60));
      return NextResponse.json(
        {
          error: `Too many failed login attempts from this network. Access blocked for ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}. Please try again later.`,
          isLocked: true,
          remainingSeconds,
          remainingMinutes,
          lockoutUntil: new Date(ipRecord.lockoutUntil).toISOString(),
        },
        { status: 423 }
      );
    }

    // Find user by exact email or prefix/name
    let user = await prisma.user.findUnique({
      where: { email: normalizedInput },
    });

    if (!user && !normalizedInput.includes("@")) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { startsWith: `${normalizedInput}@` } },
            { name: { equals: normalizedInput } },
          ],
        },
      });
    }

    // Case 1: User exists in database
    if (user) {
      const now = new Date();

      // Check if user is currently locked out
      if (user.lockoutUntil && user.lockoutUntil > now) {
        const remainingMs = user.lockoutUntil.getTime() - now.getTime();
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        const remainingMinutes = Math.max(1, Math.ceil(remainingSeconds / 60));

        return NextResponse.json(
          {
            error: `Your account is temporarily blocked for ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""} due to 5 consecutive failed login attempts. An alert email was sent to your registered address.`,
            isLocked: true,
            remainingSeconds,
            remainingMinutes,
            lockoutUntil: user.lockoutUntil.toISOString(),
          },
          { status: 423 }
        );
      }

      // If lockout period has expired, reset failed attempts
      if (user.lockoutUntil && user.lockoutUntil <= now) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockoutUntil: null,
          },
        });
        user.failedLoginAttempts = 0;
        user.lockoutUntil = null;
      }

      // Check if account is deactivated
      if (!user.isActive) {
        return NextResponse.json(
          { error: "Account is disabled. Please contact your school administrator." },
          { status: 401 }
        );
      }

      const isValid = await verifyPassword(password, user.password);

      // Incorrect password entered
      if (!isValid) {
        const currentFailed = user.failedLoginAttempts || 0;
        const newFailedAttempts = currentFailed + 1;

        // Reached 5 failed attempts -> Lockout user for 5 minutes and send alert email
        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockoutUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: newFailedAttempts,
              lockoutUntil,
            },
          });

          // Log security event in audit logs
          await logAuditAction({
            userId: user.id,
            userName: user.name,
            action: "ACCOUNT_LOCKED",
            entity: "User",
            entityId: user.id,
            details: `Account temporarily blocked for ${LOCKOUT_MINUTES} minutes after 5 consecutive failed password attempts. Alert email triggered.`,
            metadata: {
              email: user.email,
              failedAttempts: newFailedAttempts,
              lockoutMinutes: LOCKOUT_MINUTES,
            },
            req,
          });

          // Dispatch security alert email to user
          emailService
            .sendAccountLockoutAlert({
              userId: user.id,
              userEmail: user.email,
              userName: user.name,
              lockMinutes: LOCKOUT_MINUTES,
              ipAddress,
              userAgent,
            })
            .catch((err) =>
              console.error("Failed to send account lockout security alert email:", err)
            );

          return NextResponse.json(
            {
              error: `Account blocked for ${LOCKOUT_MINUTES} minutes due to 5 consecutive failed login attempts. A security alert email has been sent to ${user.email}.`,
              isLocked: true,
              remainingSeconds: LOCKOUT_MINUTES * 60,
              remainingMinutes: LOCKOUT_MINUTES,
              lockoutUntil: lockoutUntil.toISOString(),
            },
            { status: 423 }
          );
        }

        // Less than 5 attempts: increment counter and warn user
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: newFailedAttempts,
          },
        });

        await logAuditAction({
          userId: user.id,
          userName: user.name,
          action: "FAILED_LOGIN",
          entity: "User",
          entityId: user.id,
          details: `Failed password attempt (${newFailedAttempts}/${MAX_FAILED_ATTEMPTS}) for account ${user.email}.`,
          metadata: {
            email: user.email,
            attemptCount: newFailedAttempts,
            maxAllowed: MAX_FAILED_ATTEMPTS,
          },
          req,
        });

        const attemptsRemaining = MAX_FAILED_ATTEMPTS - newFailedAttempts;

        return NextResponse.json(
          {
            error: `Invalid email or password. You have ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining before your account is blocked for ${LOCKOUT_MINUTES} minutes.`,
            attemptsRemaining,
            failedAttempts: newFailedAttempts,
          },
          { status: 401 }
        );
      }

      // Password matches! Reset failed attempts and clear lockout
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockoutUntil: null,
          lastLogin: new Date(),
        },
      });

      // Also reset IP rate limit record
      ipRateLimitMap.delete(ipAddress);

      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as "SUPER_ADMIN" | "PRINCIPAL" | "STAFF_EDITOR",
        avatar: user.avatar,
      };

      const expiresIn = rememberMe ? "7d" : "24h";
      const token = signToken(sessionUser, expiresIn);

      await logAuditAction({
        userId: user.id,
        userName: user.name,
        action: "LOGIN",
        entity: "User",
        entityId: user.id,
        details: `Successful login with role ${user.role} (${rememberMe ? "Remembered Session" : "Active Session"})`,
        metadata: {
          email: user.email,
          role: user.role,
          sessionType: rememberMe ? "7 Days" : "24 Hours",
        },
        req,
      });

      const response = NextResponse.json({
        success: true,
        token,
        tokenType: "Bearer",
        expiresIn,
        user: sessionUser,
      });

      const cookieOptions: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      };

      if (rememberMe) {
        cookieOptions.maxAge = 7 * 24 * 60 * 60; // 7 days
      }

      response.cookies.set("cis_admin_token", token, cookieOptions);

      return response;
    }

    // Case 2: User does not exist (unknown email / username)
    // Track attempts on this IP to protect against credential stuffing
    const currentIpRecord = ipRateLimitMap.get(ipAddress) || { attempts: 0 };
    currentIpRecord.attempts += 1;

    if (currentIpRecord.attempts >= MAX_FAILED_ATTEMPTS) {
      currentIpRecord.lockoutUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
      ipRateLimitMap.set(ipAddress, currentIpRecord);

      await logAuditAction({
        userName: "Anonymous / Unknown",
        action: "IP_BLOCKED",
        entity: "Security",
        details: `Network temporarily blocked for ${LOCKOUT_MINUTES} minutes after 5 failed login attempts with non-existent account (${normalizedInput}).`,
        metadata: {
          attemptedAccount: normalizedInput,
          lockoutMinutes: LOCKOUT_MINUTES,
        },
        req,
      });

      return NextResponse.json(
        {
          error: `Too many failed login attempts. Access blocked for ${LOCKOUT_MINUTES} minutes. Please try again later.`,
          isLocked: true,
          remainingSeconds: LOCKOUT_MINUTES * 60,
          remainingMinutes: LOCKOUT_MINUTES,
        },
        { status: 423 }
      );
    }

    ipRateLimitMap.set(ipAddress, currentIpRecord);

    const ipAttemptsRemaining = MAX_FAILED_ATTEMPTS - currentIpRecord.attempts;

    return NextResponse.json(
      {
        error: `Invalid email or password. You have ${ipAttemptsRemaining} attempt${ipAttemptsRemaining === 1 ? "" : "s"} remaining before temporary lockout.`,
        attemptsRemaining: ipAttemptsRemaining,
      },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

