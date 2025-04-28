import { TextInput ,Text} from "@mantine/core";
import Copy from "@/components/ui/copyButton/CopyButton";
import styles from "./inviteInfo.module.css"


type Props={
  inviteToken:string,
}

const createInviteLink=(inviteToken:string)=>{
  return `${process.env.CF_PAGES_URL||process.env.NEXT_PUBLIC_DEFAUT_URL}/invite/${inviteToken}`;
}

export default async function InviteInfo({inviteToken}:Props){

  const link=createInviteLink(inviteToken);

  return(
    <div className={styles.page}>
      <div className={styles.info}>
        <Text w={100}>招待URL : </Text>
        <TextInput width={400}  value={link} readOnly flex={1}></TextInput>
        <Copy text={link}></Copy>
      </div>
      <div className={styles.info}>
        <Text w={100}>招待コード : </Text>
        <TextInput width={400}  value={inviteToken} readOnly flex={1}></TextInput>
        <Copy text={inviteToken}></Copy>
      </div>
    </div>
  )
}