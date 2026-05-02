import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

function parseAllowlist(): string[] | null {
  const raw = process.env["ADMIN_ALLOWED_EMAILS"];
  if (!raw) return null;
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);
}

let warnedNoAllowlist = false;

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const auth = getAuth(req);
  const userId =
    (auth?.sessionClaims as { userId?: string } | undefined)?.userId ??
    auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  const allowlist = parseAllowlist();
  if (!allowlist || allowlist.length === 0) {
    if (!warnedNoAllowlist) {
      req.log.warn(
        "ADMIN_ALLOWED_EMAILS no está configurado: cualquier usuario autenticado puede acceder al panel.",
      );
      warnedNoAllowlist = true;
    }
    req.userId = userId;
    next();
    return;
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const emails = user.emailAddresses
      .map((e) => e.emailAddress.toLowerCase())
      .filter(Boolean);
    const isAllowed = emails.some((e) => allowlist.includes(e));
    if (!isAllowed) {
      req.log.warn({ userId, emails }, "Usuario sin permisos de admin");
      res.status(403).json({ error: "Sin permisos de administrador" });
      return;
    }
    req.userId = userId;
    next();
  } catch (err) {
    req.log.error({ err, userId }, "Error verificando permisos de admin");
    res.status(500).json({ error: "Error verificando permisos" });
    return;
  }
}
