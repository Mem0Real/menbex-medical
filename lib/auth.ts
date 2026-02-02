import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

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

export async function requireAdmin() {
  const session = await getServerSession(authOptions as AuthOptions);

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("NOT_AUTHORIZED");
  }

  return session;
}

export async function requireDoctor() {
  const session = await getServerSession(authOptions as AuthOptions);

  if (!session || session.user.role !== "DOCTOR") {
    throw new Error("NOT_AUTHORIZED");
  }

  return session;
}
