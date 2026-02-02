import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAuth() {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session || !session.user) throw new Error("Unauthorized");
  return session;
}

export function requireRole(role: "PATIENT" | "DOCTOR" | "ADMIN") {
  return async () => {
    const session = await requireAuth();
    if (session?.user?.role !== role) {
      throw new Error("Forbidden");
    }
    return session;
  };
}
