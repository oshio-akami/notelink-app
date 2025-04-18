"use client"

import styles from "./leaveGroupButton.module.css"
import leaveGroup from "@/actions/group/leaveGroup"
import { Button,Popover,Text,PopoverTarget,PopoverDropdown } from "@mantine/core"

type Props={
  groupId:string,
}

export default function LeaveGroupButton({groupId}:Props){
  const handleClick=async()=>{
    const success=await leaveGroup(groupId);
  }
  return(
    <Popover width="60%"  trapFocus offset={{ mainAxis: 10, crossAxis: 40 }} >
        <PopoverTarget><Button>退会</Button></PopoverTarget>
        <PopoverDropdown className={styles.box} w={300} h={100}>
        <Text>本当に退会しますか？</Text>
        <Button onClick={handleClick}>退会する</Button>
        </PopoverDropdown>
      </Popover>
  )
}