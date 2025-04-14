import styles from "./header.module.css";
import { IconUserCircle,IconBell } from "@tabler/icons-react";
import { auth } from "@/auth";
import { ProfileWindow } from "@/components/ui/ProfileWindow";
import SearchBar from "@/components/ui/searchBar/SearchBar";
import { Image } from "@mantine/core";
import  GroupsWindow  from "@/components/ui/groupsWindow/GroupsWindow";
import getJoinedGroups from "@/actions/user/getJoinedGroups";
import CreateGroupModal from "@/components/ui/createGroupModal/CreateGroupModal";

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

export async function Header({params}:Props) {
  const {id}=await params;
  const session = await auth();
  const groups=await getJoinedGroups();
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
        <SearchBar />
        {session?.user? (
          <ProfileWindow
            name={session.user.name||""}
            mail={session.user.email||""}
            icon={session.user.image||""}
          >
            <Image className={styles.userIcon} alt="" src={session.user.image||""} />
          </ProfileWindow>
        ) : (
          <div className={styles.guestIcon}>
            <IconUserCircle className={styles.userIcon} />
            <p>ゲスト</p>
          </div>
        )}
        <IconBell className={styles.setting}></IconBell>
        <CreateGroupModal></CreateGroupModal>
      </div>
    </div>
  );
}
