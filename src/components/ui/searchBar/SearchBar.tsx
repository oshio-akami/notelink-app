"use client"
import { TextInput,Input } from "@mantine/core"
import { useState } from "react"
import { IconSearch } from "@tabler/icons-react";
import styles from "./searchBar.module.css"

export default function SearchBar(){
  const [value,setValue]=useState("");
  return(
    <TextInput className={styles.textInput}
    placeholder="プロジェクト内を検索"
    value={value}
    onChange={(event) => setValue(event.currentTarget.value)}
    leftSection={<IconSearch />}
    rightSection={value !== '' ? <Input.ClearButton onClick={() => setValue('')} /> : undefined}
    rightSectionPointerEvents="auto"></TextInput>
  )
}