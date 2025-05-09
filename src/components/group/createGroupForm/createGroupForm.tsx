"use client"

import styles from "./createGroupForm.module.css";
import { TextInput,Button } from "@mantine/core";
import { useState } from "react";
import { useActionState } from "react";
import { createGroup } from "@/actions/group/createGroup";
import { getFormProps, useForm } from '@conform-to/react';
import { parseWithZod } from "@conform-to/zod";
import { createGroupFormSchema } from "@/utils/types/formSchema";

export default function CreateGroupForm() {
  const [groupName,setGroupName]=useState("");
  const [lastResult,formAction,isPending]=useActionState(createGroup,undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createGroupFormSchema });
    },
    shouldValidate:"onBlur",
  });
  return (
    <form {...getFormProps(form)} className={styles.form} action={formAction}>
      <p>グループを作成</p>
      <TextInput 
        placeholder="グループ名"
        name={fields.groupName.name}
        value={groupName}
        onChange={(event)=>setGroupName(event.target.value)}>
        </TextInput>
        <p className={styles.error}>{lastResult?.error?lastResult?.error.groupName:""}</p>
      <Button className={styles.button} type="submit">{isPending?"グループを作成中...":"新しいグループを作成する"}</Button>
    </form>
  );
}
