"use client"

import CreateGroupForm from "@/components/ui/createGroupForm/createGroupForm";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";


export default function CreateGroupModal(){
  const [opened,{open,close}]=useDisclosure(false);
  const [isPending,setIsPending]=useState(false);
  return(
    <>
      <Modal opened={opened} onClose={close} closeOnClickOutside={!isPending} closeOnEscape={!isPending} withCloseButton={!isPending} size={"lg"}>
        <CreateGroupForm onPendingChange={setIsPending}/>
      </Modal>
      <Button onClick={open} >グループの作成・参加</Button>
    </>
  )
}