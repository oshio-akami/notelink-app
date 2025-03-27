import styles from "./settingNavbar.module.css";
import { NavLink } from "@mantine/core";
import { headers } from "next/headers";

type Props = {
  params:string,
}


const linksMockData = [
  { label: "プロフィール設定", link: "userSetting" },
  { label: "プロジェクト設定", link: "projectSetting" },
  { label: "メンバー設定", link: "memberSetting" },
  { label: "通知設定", link: "alertSetting" },
];

function className(params:string,link:string):string{
  
  return params==link?styles.targetNav:styles.nav;
}

export async function SettingNavBar(props:Props) {
  const headerList = await headers();
  const headerURL = headerList.get("x-url");
  const links = linksMockData.map((target) => (
    <NavLink
      className={className(props.params,target.link)}
      key={target.link}
      href={target.link}
      label={target.label}
      active={headerURL?.indexOf(target.link) !== -1}
      color="white"
      variant="filled"
      autoContrast
    ></NavLink>
  ));
  return (
    <div>
      <nav className={styles.navbar}>
        <h1 className={styles.title}>設定</h1>
        {links}
      </nav>
    </div>
  );
}
