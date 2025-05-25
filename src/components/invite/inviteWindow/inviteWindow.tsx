"use client";

import styles from "./inviteWindow.module.scss";
import JoinButton from "../JoinButton/joinButton";

type Props = {
  groupName: string;
  inviteToken: string;
};

export default function InviteWindow({ groupName, inviteToken }: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <p>【{groupName}】に招待されています</p>
        <JoinButton inviteToken={inviteToken} />
      </div>
    </div>
  );
}
