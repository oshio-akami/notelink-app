import styles from "./header.module.css";
import { IconUserCircle,IconBell } from "@tabler/icons-react";
import { auth } from "@/auth";
import { ProfileWindow } from "@/components/ui/ProfileWindow";
import SearchBar from "@/components/ui/searchBar/SearchBar";
import { Image } from "@mantine/core";

export const runtime = "edge";

export async function Header() {
  const session = await auth();
  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <p>アプリ名</p>
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
        <p className={styles.projectName}>プロジェクト名</p>
      </div>
    </div>
  );
}
