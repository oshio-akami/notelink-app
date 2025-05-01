import styles from "./header.module.css";
import { IconUserCircle,IconBell} from "@tabler/icons-react";
import { ProfileWindow } from "@/components/ui/profileWindow/ProfileWindow";
import { Image } from "@mantine/core";
import  GroupsWindow  from "@/components/ui/groupsWindow/GroupsWindow";
import CreateGroupModal from "@/components/ui/createGroupModal/CreateGroupModal";
import {getClient} from "@/libs/hono";

export const runtime = "edge";

type Props={
  params:Promise<{id:string}>,
}

const getCurrentGroupName=async(groups:{groupId:string,groupName:string}[],currentGroupId:string)=>{
  const currentGroup=groups.find(c=>c.groupId===currentGroupId);
  if(!currentGroup){
    return "グループが存在しません"
  }
  return currentGroup.groupName;
}
const getJoinedGroups=async()=>{
  const client=await getClient();
  const res=await client.api.user.groups.$get();
  const body=await res.json();
  return body.groups;
}
const getUserProfile=async()=>{
  const client=await getClient();
  const res=await client.api.user.profile.$get();
  const body=await res.json();
  return body.profile;
}

export async function Header({params}:Props) {
  const {id}=await params;
  const groups=await getJoinedGroups();
  const userProfile=await getUserProfile();
  const groupName=groups?await getCurrentGroupName(groups,id):"グループが存在しません";
  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <p>アプリ名 | </p>
        {groups?(
        <GroupsWindow groups={groups} >
          <p className={styles.groupIcon}>{groupName}</p>
        </GroupsWindow>
        ):(
          <p>group error</p>
        )}
      </div>
      <div className={styles.rightSection}>
        {userProfile? (
          <ProfileWindow
            name={userProfile.displayName||""}
            about={userProfile.about||""}
            icon={userProfile.image||""}
          >
            <Image className={styles.userIcon} alt="" src={userProfile.image||""} />
          </ProfileWindow>
        ) : (
          <div className={styles.guestIcon}>
            <IconUserCircle className={styles.userIcon} />
            <p>ゲスト</p>
          </div>
        )}
        <IconBell className={styles.setting}></IconBell>
        <CreateGroupModal />
      </div>
    </div>
  );
}
