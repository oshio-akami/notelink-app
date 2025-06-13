"use client";

import { TextInput, Text } from "@mantine/core";
import CopyButton from "@/components/shared/copyButton/CopyButton";
import styles from "./inviteInfo.module.scss";

type Props = {
  inviteToken: string;
};

const createInviteLink = (inviteToken: string) => {
  return `${process.env.NEXT_PUBLIC_DEFAULT_URL}/invite/${inviteToken}`;
};

export default function InviteInfo({ inviteToken }: Props) {
  const link = createInviteLink(inviteToken);

  return (
    <div className={styles.page}>
      <div>
        <Text>招待用URL</Text>
        <div className={styles.info}>
          <TextInput value={link} readOnly flex={1}></TextInput>
          <CopyButton text={link}></CopyButton>
        </div>
      </div>
      <div>
        <Text>招待用コード</Text>
        <div className={styles.info}>
          <TextInput value={inviteToken} readOnly flex={1}></TextInput>
          <CopyButton text={inviteToken}></CopyButton>
        </div>
      </div>
    </div>
  );
}
