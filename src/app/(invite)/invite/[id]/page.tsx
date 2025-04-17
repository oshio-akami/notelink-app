import styles from "./page.module.css"
import getGroupName from "@/actions/group/getGroupName";
import validateInviteToken from "@/actions/group/validateInviteToken"
import hasJoinedGroup from "@/actions/user/hasJoinedGroup";
import setCurrentGroup from "@/actions/user/setCurrentGroup";
import JoinButton from "./_components/JoinButton/JoinButton";

type Props={
  params:Promise<{id:string}>,
}

export default async function Invite({params}:Props){
  const {id}=await params;
  const validateToken=await validateInviteToken(id);
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
  const groupName=await getGroupName(validateToken.message);
  return(
    <div className={styles.page}> 
      <div className={styles.box}>
        <p>【{groupName.groupName}】に招待されています</p>
        <JoinButton inviteToken={id} />
      </div>
    </div>
  )
  
}