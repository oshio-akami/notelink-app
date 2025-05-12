"use client";

import styles from "./createGroupForm.module.css";
import {
  TextInput,
  Button,
  Textarea,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { createGroup } from "@/actions/group/createGroup";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createGroupFormSchema } from "@/utils/types/formSchema";

const errorElements = (errors: string[]) => {
  return errors.map((error) => {
    return (
      <p key={error} className={styles.error}>
        {error}
      </p>
    );
  });
};

type Props = {
  onPendingChange: (value: boolean) => void;
};

export default function CreateGroupForm({ onPendingChange }: Props) {
  const [, formAction, isPending] = useActionState(createGroup, undefined);
  const [groupName, setGroupName] = useState("");
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createGroupFormSchema });
    },
    shouldValidate: "onBlur",
  });

  useEffect(() => {
    onPendingChange(isPending);
  }, [isPending, onPendingChange]);
  return (
    <>
      <form {...getFormProps(form)} className={styles.form} action={formAction}>
        <Box pos="relative">
          <LoadingOverlay
            visible={isPending}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <h1>グループを作成</h1>
          <label>グループ名</label>
          <TextInput
            name={fields.groupName.name}
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            mb={30}
          ></TextInput>
          {fields.groupName.errors && errorElements(fields.groupName.errors)}
          <label>グループの説明</label>
          <Textarea mb={30} />
        </Box>
        <Button className={styles.button} type="submit">
          {isPending ? "グループを作成中..." : "新しいグループを作成する"}
        </Button>
      </form>
    </>
  );
}
