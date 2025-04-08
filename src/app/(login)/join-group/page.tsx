import styles from "./page.module.css";
import JoinGroupForm from "./_components/joinGroupForm/joinGroupForm";
import CreateGroupForm from "./_components/createGroupForm/createGroupForm";

export const runtime = "edge";


export default async function Page() {
  
  return(
    <div className={styles.formWrapper}>
      <CreateGroupForm />
      <JoinGroupForm />
    </div>
  );
}
