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
      <div className={styles.info}>
        <Text w={100}>招待URL : </Text>
        <TextInput width={400} value={link} readOnly flex={1}></TextInput>
        <CopyButton text={link}></CopyButton>
      </div>
      <div className={styles.info}>
        <Text w={100}>招待コード : </Text>
        <TextInput
          width={400}
          value={inviteToken}
          readOnly
          flex={1}
        ></TextInput>
        <CopyButton text={inviteToken}></CopyButton>
      </div>
    </div>
  );
}
