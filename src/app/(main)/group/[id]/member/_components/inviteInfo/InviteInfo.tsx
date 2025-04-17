import client from "@/libs/hono";
import { TextInput ,Text} from "@mantine/core";
import Copy from "@/components/ui/copyButton/CopyButton";
import styles from "./inviteInfo.module.css"


type Props={
  params:Promise<{id:string}>,
}

const getInviteToken=async(groupId:string)=>{
  const res=await client.api.posts.getInviteToken.$post({
    json:{
      groupId:groupId,
    }
  });
  const body=await res.json();
  return body;
}
const createInviteToken=async(groupId:string)=>{
 
  const res=await client.api.posts.createInviteToken.$post({
    json:{
      groupId:groupId,
    }
  })
  const body= await res.json();
  return body[0];
}

const getInviteData=async(groupId:string)=>{
  const data=await getInviteToken(groupId);
  if(!data.success){
    const inviteData=await createInviteToken(groupId);
    return inviteData.token;
  }
  return data.data;
}

const createInviteLink=(inviteToken:string)=>{
  return `${process.env.NEXT_PUBLIC_URL}/invite/${inviteToken}`;
}

export default async function InviteInfo({params}:Props){
  const {id}=await params;
  const data=await getInviteData(id);
  const link=createInviteLink(data??"");

  return(
    <div className={styles.page}>
      <div className={styles.info}>
        <Text w={100}>招待URL : </Text>
        <TextInput width={400}  value={link} readOnly flex={1}></TextInput>
        <Copy text={link}></Copy>
      </div>
      <div className={styles.info}>
        <Text w={100}>招待コード : </Text>
        <TextInput width={400}  value={data??""} readOnly flex={1}></TextInput>
        <Copy text={data??""}></Copy>
      </div>
    </div>
  )
}