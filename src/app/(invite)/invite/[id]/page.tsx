import styles from "./page.module.css"
import { hasJoinedGroup } from "@/libs/apiLibs";
import setCurrentGroup from "@/actions/user/setCurrentGroup";
import JoinButton from "./_components/JoinButton/JoinButton";
import {getClient} from "@/libs/hono";

type Props={
  params:Promise<{id:string}>,
}

const validate=async(token:string)=>{
  const client=await getClient();
  const res=await client.api.invite.validate[":token"].$get({
    param:{
      token:token,
    }
  });
  const body=await res.json();
  return body;
}
const getGroupName=async(groupId:string)=>{
  const client=await getClient();
  const res=await client.api.group[":groupId"].name.$get({
    param:{
      groupId:groupId,
    }
  });
  const body=await res.json();
  return body.groupName;
}

export default async function Invite({params}:Props){
  const {id}=await params;
  const validateToken=await validate(id);
  if(!validateToken.success||!validateToken.message){
    return(
      <div className={styles.page}> 
        <div className={styles.box}>
          <p>{validateToken.message}</p>
        </div>
      </div>
    )
  }
  const groupId=validateToken.message;
  const hasJoined=await hasJoinedGroup(groupId);
  if(hasJoined){
    await setCurrentGroup(groupId);
  }
  const groupName=await getGroupName(groupId);
  return(
    <div className={styles.page}> 
      <div className={styles.box}>
        <p>【{groupName}】に招待されています</p>
        <JoinButton inviteToken={id} />
      </div>
    </div>
  )
  
}