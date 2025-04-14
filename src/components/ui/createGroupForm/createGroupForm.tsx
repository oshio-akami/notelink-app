"use client";

import styles from "./createGroupForm.module.css";
import {
  TextInput,
  Button,
  Textarea,
  Radio,
  Group,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { createGroup } from "@/actions/group/createGroup";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createGroupFormSchema } from "@/utils/types/formSchema";
import { useDisclosure } from "@mantine/hooks";

const errorElements=(errors:string[])=>{
  return errors.map((error)=>{
    return <p key={error} className={styles.error}>{error}</p>;
  })
}

type Props = {
  onPendingChange: (value: boolean) => void;
};

export default function CreateGroupForm({onPendingChange}:Props) {
  const [groupName, setGroupName] = useState("");
  const [_, formAction, isPending] = useActionState(
    createGroup,
    undefined
  );
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createGroupFormSchema });
    },
    shouldValidate: "onBlur",
    onSubmit:()=>toggle(),
  });

  useEffect(()=>{
    onPendingChange(isPending)
  },[isPending]);
  
  const [visible, { toggle }] = useDisclosure(false);
  return (
    <>
    
    <form {...getFormProps(form)} className={styles.form} action={formAction}>
      <Box pos="relative">
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }}/>
        <h1>グループを作成</h1>
        <label>グループ名</label>
        <TextInput
          name={fields.groupName.name}
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
        ></TextInput>
        {fields.groupName.errors&&errorElements(fields.groupName.errors)}
        <label>グループの説明</label>
        <Textarea />
        <Radio.Group
          label="他ユーザーのグループへの参加方法"
          description="この設定は後から変更できます"
        >
          <Group>
            <Radio value="true" label="承認制" />
            <Radio value="false" label="自由参加" />
          </Group>
        </Radio.Group>
      </Box>
      <Button className={styles.button} type="submit">
        {isPending ? "グループを作成中..." : "新しいグループを作成する"}
      </Button>
    </form>
    </>
  );
}
