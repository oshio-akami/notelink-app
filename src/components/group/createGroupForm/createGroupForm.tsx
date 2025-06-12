"use client";

import styles from "./createGroupForm.module.scss";
import {
  TextInput,
  Button,
  Textarea,
  LoadingOverlay,
  Box,
  Text,
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
      <Text key={error} className={styles.error}>
        {error}
      </Text>
    );
  });
};

type Props = {
  disable: boolean;
  setDisable: (disable: boolean) => void;
};

const groupNameMaxLength = 20;
const descriptionMaxLength = 100;

export default function CreateGroupForm({ disable, setDisable }: Props) {
  const [, formAction, isPending] = useActionState(createGroup, undefined);
  const [groupName, setGroupName] = useState("");
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createGroupFormSchema });
    },
    shouldValidate: "onBlur",
  });
  const checkInput = () => {
    return (
      fields.description.value !== undefined &&
      fields.groupName.value !== undefined &&
      fields.description.value !== "" &&
      fields.groupName.value !== ""
    );
  };

  useEffect(() => {
    setDisable(isPending);
  }, [isPending, setDisable]);
  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={isPending}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form
          {...getFormProps(form)}
          className={styles.form}
          action={formAction}
        >
          <Text ta="center" c="gray" pt={10} pb={40}>
            新しいグループを作成して他のメンバーを招待しましょう
          </Text>
          <div className={styles.label}>
            <label>グループ名*</label>
            {fields.groupName.errors && errorElements(fields.groupName.errors)}
            <TextInput
              name={fields.groupName.name}
              maxLength={groupNameMaxLength}
              placeholder="グループ名を入力してください"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
            ></TextInput>
            <Text className={styles.counter}>
              {fields.groupName.value === undefined
                ? 0
                : fields.groupName.value.length}
              /{groupNameMaxLength}
            </Text>
          </div>
          <div className={styles.label}>
            <label>グループの説明*</label>
            {fields.description.errors &&
              errorElements(fields.description.errors)}
            <Textarea
              name={fields.description.name}
              maxLength={descriptionMaxLength}
              placeholder="グループの目的や説明を入力してください"
            />
            <Text className={styles.counter}>
              {fields.description.value === undefined
                ? 0
                : fields.description.value.length}
              /{descriptionMaxLength}
            </Text>
          </div>

          <Button
            className={styles.button}
            type="submit"
            disabled={disable || !checkInput()}
          >
            {isPending ? "グループを作成中..." : "新しいグループを作成する"}
          </Button>
        </form>
      </Box>
    </>
  );
}
