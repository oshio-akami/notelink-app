"use client"

import { useState } from "react";
import { useEffect } from "react";
import client from "@/libs/hono";

export default function Home() {
  const [name,setName]=useState<string>();
  useEffect(()=>{
    client.api.posts.table
    .$get()
    .then((res)=>res.json())
    .then((json)=>{
      setName(json[0].name);
    });
  },[]);

  return (
    <p>{typeof name!=="undefined" ? `Hello ${name}!`: "Loading..."}</p>
  );
}
