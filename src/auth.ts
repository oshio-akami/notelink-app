import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/index";
import { users, accounts, sessions, userProfiles } from "./db/schema";
import { v4 as uuidV4 } from "uuid";
import { Adapter, AdapterAccountType } from "next-auth/adapters";
import { encode as defaultEncode } from "next-auth/jwt";

export const runtime = "edge";

const adapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
}) as Adapter;

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
    CredentialsProvider({
      name: "guestLogin",
      credentials: {},
      async authorize() {
        const created = await db
          .insert(users)
          .values({
            id: uuidV4(),
            name: "ゲストユーザー",
            email: `guest.${uuidV4()}@example.com`,
          })
          .returning();
        const user = created[0];
        await db.insert(accounts).values({
          userId: user.id,
          provider: "credentials",
          providerAccountId: user.id,
          type: "email" as AdapterAccountType,
        });
        await db.insert(userProfiles).values({
          userId: user.id,
          displayName: user.name ?? "ゲストユーザー",
          image: user.image ?? "",
          about: "",
        });
        return user ?? null;
      },
    }),
  ],
  adapter: adapter,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuidV4();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }
        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.id) {
        return;
      }
      await db.insert(userProfiles).values({
        userId: user.id,
        displayName: user.name ?? "ユーザー",
        image: user.image,
        about: "",
      });
    },
  },
});
