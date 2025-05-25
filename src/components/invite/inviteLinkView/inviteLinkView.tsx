import { Text } from "@mantine/core";
import InviteInfo from "../inviteInfo/InviteInfo";
import styles from "./inviteLinkView.module.scss";

type Props = {
  inviteToken: string;
};
export default function InviteLinkView({ inviteToken }: Props) {
  return (
    <div className={styles.wrapper}>
      <Text fw={700}>他のユーザーを招待する</Text>
      <InviteInfo inviteToken={inviteToken} />
    </div>
  );
}
