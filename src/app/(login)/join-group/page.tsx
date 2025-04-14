import styles from "./page.module.css";
import JoinGroupForm from "./_components/joinGroupForm/joinGroupForm";
import CreateGroupForm from "./_components/createGroupForm/createGroupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const runtime = "edge";


export default async function Page() {
  const session =await auth();
    if(session){
      redirect(`/group/${session.user.currentGroupId}/home`);
    }
  return(
    <div className={styles.formWrapper}>
      <CreateGroupForm />
      <JoinGroupForm />
    </div>
  );
}
