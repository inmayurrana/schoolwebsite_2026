import { GET as handleCallback } from "@/app/api/auth/google/callback/route";

/**
 * GET /api/auth/callback/google
 * Alias endpoint for NextAuth standard callback URL convention.
 * Delegates directly to the Google OAuth callback handler.
 */
export const GET = handleCallback;
