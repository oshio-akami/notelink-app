"use client";

import joinInviteGroup from "@/actions/group/joinInviteGroup";
import styles from "./joinGroupForm.module.scss";
import { TextInput, Button, Text, Box, LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { z } from "zod";

type Props = {
  disable: boolean;
  setDisable: (disable: boolean) => void;
};

export default function JoinGroupForm({ disable, setDisable }: Props) {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [visible, { toggle }] = useDisclosure(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token == "") {
      setMessage("*招待コードを入力してください");
      return;
    }
    const valid = z.string().uuid().safeParse(token);
    if (!valid.success) {
      setMessage("*招待コードの形式が正しくありません");
      return;
    }
    toggle();
    const result = await joinInviteGroup(token);
    setMessage(result ?? "");
    toggle();
  };
  useEffect(() => {
    setDisable(visible);
  }, [visible, setDisable]);

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form className={styles.form} onSubmit={handleSubmit}>
        <Text ta="center" c="gray" pt={10} pb={10}>
          招待コードを入力してグループに参加しましょう
        </Text>
        <div>
          <Text>招待コード*</Text>
          <Text className={styles.error}>{message}</Text>
          <TextInput
            pb={20}
            placeholder="招待コードを入力してください"
            onChange={(e) => setToken(e.target.value)}
          ></TextInput>
        </div>
        <Button
          className={styles.button}
          type="submit"
          disabled={disable || !token || token === ""}
        >
          {visible ? "グループに加入中..." : "グループに加入する"}
        </Button>
      </form>
    </Box>
  );
}
