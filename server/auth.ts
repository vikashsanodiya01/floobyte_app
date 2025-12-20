import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

declare module "express-session" {
  interface SessionData {
    isAuthenticated?: boolean;
    adminUser?: string;
  }
}

const isAuthDisabled = process.env.DISABLE_AUTH === "true";

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (isAuthDisabled) return true;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  
  if (!adminUsername || !adminPasswordHash) {
    console.error("Admin credentials not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH environment variables.");
    return false;
  }
  
  if (username !== adminUsername) {
    return false;
  }
  
  return bcrypt.compareSync(password, adminPasswordHash);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (isAuthDisabled || req.session?.isAuthenticated) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized. Please log in." });
}

export function getAuthStatus(req: Request): { isAuthenticated: boolean; user?: string } {
  return {
    isAuthenticated: isAuthDisabled ? true : !!req.session?.isAuthenticated,
    user: req.session?.adminUser
  };
}

export async function regenerateSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    const oldSession = req.session;
    req.session.regenerate((err) => {
      if (err) {
        reject(err);
        return;
      }
      req.session.isAuthenticated = oldSession.isAuthenticated;
      req.session.adminUser = oldSession.adminUser;
      resolve();
    });
  });
}
