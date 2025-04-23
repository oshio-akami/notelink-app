"use server"
import { headers } from "next/headers"

export async function header(){
  return await headers();
}