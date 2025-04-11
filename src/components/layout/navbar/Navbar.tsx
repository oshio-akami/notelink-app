"use client"

import styles from "./navbar.module.css";
import { IconDashboard ,IconChecklist,IconUsersGroup,IconClipboardText,IconSettings} from "@tabler/icons-react";
import { NavLink } from "@mantine/core";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

const iconSize=24;
const linksMockData=[
  {label:'ホーム',link:'/home',active:"home",icon:<IconDashboard size={iconSize} stroke={1.5} />},
  {label:'グループ作成',link:'/create-group',active:"create-group",icon:<IconChecklist size={iconSize} stroke={1.5} />},
  {label:'メンバー',link:'/member',active:"member",icon:<IconUsersGroup size={iconSize} stroke={1.5} />},
  {label:'投稿',link:'/post',active:"post",icon:<IconClipboardText size={iconSize} stroke={1.5} />},
  {label:'設定',link:'/settings/userSetting',active:"settings",icon:<IconSettings size={iconSize} stroke={1.5} />},
]

const createLink=(session:Session|null,link:string)=>{
  if(!session?.user.currentGroupId){
    return `/group/0${link}`;
  }
  return `/group/${session.user.currentGroupId}${link}`;
}

export function NavBar(){
  const session=useSession();
  const path=usePathname();
  const links=linksMockData.map((target)=>(
    <NavLink className={styles.nav} key={target.link}
      onClick={()=>redirect(createLink(session.data,target.link))}
      label={target.label}
      leftSection={target.icon}
      active={path.indexOf(createLink(session.data,target.link))!==-1}
      color="#f0f0f0"
      variant="filled"
      autoContrast
     />
  ));
  return(
    <nav className={styles.navbar}>
      {links}
    </nav>
  )
}