"use client"

import styles from "./navbar.module.css";
import { IconDashboard ,IconUsersGroup,IconClipboardText} from "@tabler/icons-react";
import { NavLink } from "@mantine/core";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";

const iconSize=24;
const linksMockData=[
  {label:'ホーム',link:'/home',active:"home",icon:<IconDashboard size={iconSize} stroke={1.5} />},
  {label:'投稿',link:'/post',active:"post",icon:<IconClipboardText size={iconSize} stroke={1.5} />},
  {label:'メンバー',link:'/member',active:"member",icon:<IconUsersGroup size={iconSize} stroke={1.5} />},
  //{label:'設定',link:'/settings/userSetting',active:"settings",icon:<IconSettings size={iconSize} stroke={1.5} />},
]

type Props={
  id:string,
}

const createLink=(id:string,link:string)=>{
  return `/group/${id}${link}`;
}



export function NavBar({id}:Props){
  const path=usePathname();
  const links=linksMockData.map((target)=>(
    <NavLink className={styles.nav} key={target.link}
      onClick={()=>redirect(createLink(id,target.link))}
      label={target.label}
      leftSection={target.icon}
      active={path.indexOf(createLink(id,target.link))!==-1}
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