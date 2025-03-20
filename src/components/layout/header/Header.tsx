import styles from "./header.module.css"
import { IconUserCircle,IconSettings} from "@tabler/icons-react";
import { auth } from "@/auth";
import { ProfileWindow } from "@/components/ui/ProfileWindow";

export async function Header(){
  const session=await auth();
  return(
    <div className={styles.header}>
      {session ?
        <ProfileWindow name={session.user?.name} mail={session.user?.email} icon={session.user?.image}>
          <img className={styles.userIcon} alt=""  src={session.user.image} />
        </ProfileWindow>
        :<div className={styles.guestIcon}>
          <IconUserCircle className={styles.userIcon} /> 
          <p>ゲスト</p>
        </div>
      }
      <p className={styles.projectName}>プロジェクト名</p>
      <IconSettings className={styles.setting}></IconSettings>
    </div>
  )
}