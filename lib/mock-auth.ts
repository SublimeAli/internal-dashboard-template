import { cookies } from "next/headers";
import { currentUser } from "@/data/users";
import type { User } from "@/lib/types";

const COOKIE = "dashboard-session";

export async function getSession(): Promise<User | null> {
  const c = await cookies();
  const v = c.get(COOKIE)?.value;
  if (!v) return null;
  return currentUser;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

export const SESSION_COOKIE = COOKIE;
