import InviteInfo from "../inviteInfo/InviteInfo";
import styles from "./inviteLinkView.module.scss";

type Props = {
  inviteToken: string;
};
export default function InviteLinkView({ inviteToken }: Props) {
  return (
    <div className={styles.wrapper}>
      <InviteInfo inviteToken={inviteToken} />
    </div>
  );
}
