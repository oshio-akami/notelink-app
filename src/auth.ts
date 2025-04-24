import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {db} from "@/db/index"
import { users,accounts  ,sessions, userProfiles} from "./db/schema";
 
import { Adapter } from "next-auth/adapters";

export const runtime = "edge";

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
  adapter: DrizzleAdapter(db,{
    usersTable:users,
    accountsTable:accounts,
    sessionsTable:sessions,
  }) as Adapter,

  events:{
    async createUser({user}){
      if(!user.id){
        return;
      }
      await db.insert(userProfiles).values({
        userId:user.id,
        displayName:user.name??"ユーザー",
        image:user.image,
        about:"",
      })
    }
  }
});
