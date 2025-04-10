import styles from "./header.module.css";
import { IconUserCircle,IconBell } from "@tabler/icons-react";
import { auth } from "@/auth";
import { ProfileWindow } from "@/components/ui/ProfileWindow";
import SearchBar from "@/components/ui/searchBar/SearchBar";
import { Image } from "@mantine/core";
import client from "@/libs/hono";
import { Session } from "next-auth";
import  GroupsWindow  from "@/components/ui/groupsWindow/GroupsWindow";

export const runtime = "edge";

type Props={
  params:Promise<{id:string}>,
}

const getActiveGroupName=async(groupId:string)=>{
  const result=await client.api.posts.getGroupName.$post({
    json:{
      groupId:groupId,
    }
  });
  const body=await result.json();
  if(!body.success){
    return "グループが存在しません"
  }
  return body.data[0].groupName;
}

const getGroups=async(session:Session)=>{
  if(!session?.user.id){
    return null;
  }
  const groups=await client.api.posts.getGroups.$post({
    json:{
      userId:session?.user.id,
   }
  })
   return await groups.json();
}

export async function Header({params}:Props) {
  const {id}=await params;
  const session = await auth();
  const groupName=await getActiveGroupName(id);
  const groups=session?await getGroups(session):[];
  console.log("再読み込み")
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
        <p>{groupName}</p>
      </div>
    </div>
  );
}
