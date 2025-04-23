import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import {db} from "@/db/index"
import { users} from "./db/schema";
import { getToken } from "next-auth/jwt";

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
  session:{
    strategy:"jwt"
  },
  callbacks:{
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({session,token}){
      if(token&&session.user){
        session.user.id=token.sub as string;
      }
      return session;
    }
  },
  events:{
    async createUser({user}){
      if(!user.id){
        return;
      }
      await db.insert(users).values({
        id:user.id,
        displayName:user.name??"ユーザー",
        image:user.image,
        about:"",
      })
    },
  }
});