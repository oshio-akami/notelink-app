import NextAuth, { DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {db} from "@/db/index"
import { users,accounts  ,sessions} from "./db/schema";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {JWT} from "next-auth/jwt"
import { Adapter } from "next-auth/adapters";

export const runtime = "edge";

declare module "next-auth" {
  interface User{
    currentGroupId
    :string;
    roleId:string;
  }
  interface Session extends DefaultSession {
    user: {
      currentGroupId
      : string;
      roleId: string;
    } & DefaultSession["user"];
  }
 }
 declare module "next-auth/jwt"{
  interface JWT{
    currentGroupId
    :string;
    roleId:string;
  }
 }

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true ,
  secret:process.env.NEXTAUTH_SECRET,
  providers:[
    GoogleProvider({
      clientId:process.env.GOOGLE_CLIENT_ID??"",
      clientSecret:process.env.GOOGLE_CLIENT_SECRET??"",
      authorization: {
        params: { prompt: "select_account" },
      },
    })
  ],
  callbacks:{
    async jwt({ token, user }) {
      if (user) {
        token.currentGroupId
         = user.currentGroupId
        ;
        token.roleId = user.roleId;
      }
      return token;
    },
    async session({session,token}){
      if(token){
        session.user.currentGroupId
        =token.currentGroupId
        ;
        session.user.roleId=token.roleId;
      }
      return session;
    }
  },
  adapter: DrizzleAdapter(db,{
    usersTable:users,
    accountsTable:accounts,
    sessionsTable:sessions,
  }) as Adapter,
});
