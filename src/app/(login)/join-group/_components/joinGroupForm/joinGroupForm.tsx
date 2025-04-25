"use client"

import joinInviteGroup from "@/actions/group/joinInviteGroup";
import styles from "./joinGroupForm.module.css";
import { TextInput,Button, Text } from "@mantine/core";
import { useState } from "react";


export default function JoinGroupForm() {
  const [token,setToken]=useState("");
  const [message,setMessage]=useState("");

  const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const result=await joinInviteGroup(token);
    setMessage(result??"");
  }
  
  return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <p>グループに参加</p>
        <TextInput
           placeholder="招待コードを入力"
           onChange={(e)=>setToken(e.target.value)}
          ></TextInput>
        <Button className={styles.button} type="submit">参加する</Button>
        <Text c="red">{message}</Text>
      </form>
  );
}
