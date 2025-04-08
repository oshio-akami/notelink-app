"use client"

import styles from "./joinGroupForm.module.css";
import { TextInput,Button } from "@mantine/core";
import { useState } from "react";


export default function JoinGroupForm() {
  const [code,setCode]=useState("");

  const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    console.log("code : "+ code);
  }
  
  return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <p>グループに参加</p>
        <TextInput
           placeholder="招待コードを入力"
           onChange={(e)=>setCode(e.target.value)}
          ></TextInput>
        <Button className={styles.button} type="submit">参加する</Button>
      </form>
  );
}
