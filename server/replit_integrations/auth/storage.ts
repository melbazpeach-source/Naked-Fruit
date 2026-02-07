import { users, type User, type UpsertUser } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(data: { email: string; password: string; firstName?: string; lastName?: string }): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(data: { email: string; password: string; firstName?: string; lastName?: string }): Promise<User> {
    const superadminEmail = process.env.SUPERADMIN_EMAIL;
    const role = superadminEmail && data.email.toLowerCase() === superadminEmail.toLowerCase()
      ? "superadmin"
      : "user";

    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
        password: data.password,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        role,
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const { role, ...safeData } = userData as any;
    const [user] = await db
      .insert(users)
      .values(safeData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...safeData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
}

export const authStorage = new AuthStorage();
