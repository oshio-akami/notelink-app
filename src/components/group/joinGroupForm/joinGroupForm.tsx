"use client"

import joinInviteGroup from "@/actions/group/joinInviteGroup";
import styles from "./joinGroupForm.module.css";
import { TextInput,Button, Text,Box,LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";


export default function JoinGroupForm() {
  const [token,setToken]=useState("");
  const [message,setMessage]=useState("");
 const [visible, { toggle }] = useDisclosure(false);

  const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    toggle();
    const result=await joinInviteGroup(token);
    setMessage(result??"");
    toggle();
  }
  
  return (
    <Box pos="relative" >
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }}/>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p>グループに参加</p>
          <TextInput
            placeholder="招待コードを入力"
            onChange={(e)=>setToken(e.target.value)}
            ></TextInput>
          <Button className={styles.button} type="submit">参加する</Button>
          <Text c="red">{message}</Text>
        </form>
    </Box>
  );
}
