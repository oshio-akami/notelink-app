import styles from "./navbar.module.css";
import { NavLink } from "@mantine/core";
import { IconDashboard ,IconChecklist,IconChartDots,IconUsersGroup,IconClipboardText,IconSettings} from "@tabler/icons-react";
import { headers } from "next/headers";

export const runtime = "edge";

const iconSize=24;
const linksMockData=[
  {label:'ダッシュボード',link:'/dashboard',active:"dashboard",icon:<IconDashboard size={iconSize} stroke={1.5} />},
  {label:'グループ作成',link:'/create-group',active:"create-group",icon:<IconChecklist size={iconSize} stroke={1.5} />},
  {label:'ガントチャート',link:'/ganttchart',active:"ganttchart",icon:<IconChartDots size={iconSize} stroke={1.5} />},
  {label:'メンバー',link:'/member',active:"member",icon:<IconUsersGroup size={iconSize} stroke={1.5} />},
  {label:'備忘録',link:'/memo',active:"memo",icon:<IconClipboardText size={iconSize} stroke={1.5} />},
  {label:'設定',link:'/settings/userSetting',active:"settings",icon:<IconSettings size={iconSize} stroke={1.5} />},
]

export async function NavBar(){
  const headerList=await headers();
  const headerURL=headerList.get('x-url')?.split("/")[3];
   const links=linksMockData.map((target)=>(
    <NavLink className={styles.nav} key={target.link}
      href={target.link}
      label={target.label}
      leftSection={target.icon}
      active={headerURL?.indexOf(target.active)!==-1}
      color="#f0f0f0"
      variant="filled"
      autoContrast
    ></NavLink>
  ));
  return(
    <nav className={styles.navbar}>
      {links}
    </nav>
    
  )
}