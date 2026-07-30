import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import { loginSchema } from "@/lib/validations";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // Dynamic imports keep mongoose/bcrypt off the Edge middleware bundle.
        const { connectDB } = await import("@/lib/mongodb");
        const { AdminUser } = await import("@/models/AdminUser");

        await connectDB();

        const user = await AdminUser.findOne({
          email: email.toLowerCase(),
          isActive: true,
        }).select("+passwordHash");

        if (!user) {
          return null;
        }

        const passwordValid = await compare(password, user.passwordHash);

        if (!passwordValid) {
          return null;
        }

        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          (typeof token.id === "string" && token.id) ||
          (typeof token.sub === "string" && token.sub) ||
          "";
        session.user.role =
          typeof token.role === "string" ? token.role : undefined;
      }
      return session;
    },
    authorized({ auth: session, request }) {
      const pathname = request.nextUrl.pathname;
      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login";

      if (!isAdminRoute || isLoginPage) {
        return true;
      }

      return !!session?.user;
    },
  },
});

export const credentialsPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
