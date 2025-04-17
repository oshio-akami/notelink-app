import styles from "./page.module.css";
import JoinGroupForm from "./_components/joinGroupForm/joinGroupForm";
import CreateGroupForm from "./_components/createGroupForm/createGroupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import hasJoinGroup from "@/actions/user/hasJoinedGroup";
import getJoinedGroups from "@/actions/user/getJoinedGroups";
import setCurrentGroup from "@/actions/user/setCurrentGroup";

export const runtime = "edge";


export default async function Page() {
  const session =await auth();
    if(session?.user?.currentGroupId){
      const hasJoinedGroup=await hasJoinGroup(session?.user?.currentGroupId);
      if(hasJoinedGroup){
        redirect(`/group/${session.user.currentGroupId}/home`);
      }
    }
    const groups=await getJoinedGroups()
    if(groups&&groups?.length>0){
      await setCurrentGroup(groups[0].groupId);
    }
  return(
    <div className={styles.formWrapper}>
      <CreateGroupForm />
      <JoinGroupForm />
    </div>
  );
}
