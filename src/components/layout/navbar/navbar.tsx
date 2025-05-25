import styles from "./navbar.module.scss";
import {
  IconDashboard,
  IconUsersGroup,
  IconClipboardText,
} from "@tabler/icons-react";
import HomeMenu from "@/components/navbar/homeMenu/homeMenu";
import GroupMenu from "@/components/navbar/groupMenu/groupMenu";
import { getClient } from "@/libs/hono";

const iconSize = 24;

const homeMenuData = [
  {
    label: "ホーム",
    link: "/home",
    icon: <IconDashboard size={iconSize} stroke={1.5} />,
  },
  {
    label: "投稿",
    link: "/post",
    icon: <IconClipboardText size={iconSize} stroke={1.5} />,
  },
  {
    label: "メンバー",
    link: "/member",
    icon: <IconUsersGroup size={iconSize} stroke={1.5} />,
  },
];

type Props = {
  id: string;
};

/**API からユーザーの現在のグループの情報を取得する非同期関数 */
const getGroups = async () => {
  const client = await getClient();
  const res = await client.api.user.groups.$get();
  const body = await res.json();
  return body.groups;
};

/**ナビゲーションバーコンポーネント */
export async function NavBar({ id }: Props) {
  const groups = await getGroups();
  return (
    <>
      <nav className={styles.navbar}>
        <HomeMenu menus={homeMenuData} groupId={id} />
        {groups && <GroupMenu groups={groups} />}
      </nav>
    </>
  );
}
