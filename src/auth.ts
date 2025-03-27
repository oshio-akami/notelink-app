import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {db} from "@/db/index"
import { users,accounts ,authenticators ,sessions} from "./db/schema";


export const { auth, handlers, signIn, signOut } = NextAuth({
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
  adapter: DrizzleAdapter(db,{
    usersTable:users,
    accountsTable:accounts,
    sessionsTable:sessions,
    authenticatorsTable:authenticators,
  }),
});
