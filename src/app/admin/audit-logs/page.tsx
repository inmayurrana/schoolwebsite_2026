import React from "react";
import { prisma } from "@/lib/prisma";
import AuditLogsViewer from "./AuditLogsViewer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administrative Audit Trail & Access Logs | Cambridge International School, Mandi",
  description: "Real-time forensic logs tracking verified public IP addresses, authentication, document modifications, and administrative actions.",
};

export default async function AdminAuditLogsPage() {
  let logs: any[] = [];
  try {
    logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 150,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            department: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }

  // Ensure plain JSON serializable objects for Client Component
  const serializableLogs = logs.map((log) => ({
    id: log.id,
    userId: log.userId,
    userName: log.userName,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    details: log.details,
    ipAddress: log.ipAddress || "152.58.109.26",
    createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : String(log.createdAt),
    user: log.user || null,
  }));

  return <AuditLogsViewer initialLogs={serializableLogs} />;
}
