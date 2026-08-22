import { cookies } from "next/headers";
import crypto from "crypto";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

const SESSION_SECRET =
  process.env.SESSION_SECRET || "super-secret-key-pt-hub-123456";

// Sign session payload with HMAC SHA256
function signSession(data: any): string {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

// Verify signature and parse payload
function verifySession(token: string): any | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null; // Signature validation failed
  }

  try {
    const jsonStr = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(jsonStr);
  } catch (error) {
    return null;
  }
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

export function verifyPassword(
  password: string,
  salt: string,
  hash: string,
): boolean {
  const newHash = hashPassword(password, salt);
  return newHash === hash;
}

export async function createSession(userId: string): Promise<string> {
  // Set session to expire in 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const token = signSession({
    userId,
    expiresAt: expiresAt.getTime(),
  });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function checkSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return false;

  const session = verifySession(token);
  if (!session) return false;

  if (new Date().getTime() > session.expiresAt) {
    cookieStore.delete("admin_session");
    return false;
  }

  return true;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  const session = verifySession(token);
  if (!session) return null;

  if (new Date().getTime() > session.expiresAt) {
    cookieStore.delete("admin_session");
    return null;
  }

  if (session.userId === "static_admin_user") {
    return {
      id: "static_admin_user",
      email: (process.env.ADMIN_EMAIL || "ptmanager@gmail.com")
        .toLowerCase()
        .trim(),
      name: "Administrator",
    };
  }

  return null;
}
