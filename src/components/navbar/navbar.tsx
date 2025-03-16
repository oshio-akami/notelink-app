import styles from "./navbar.module.css";
import { NavLink } from "@mantine/core";
import { IconDashboard ,IconChecklist,IconChartDots,IconUsersGroup,IconClipboardText,IconSettings} from "@tabler/icons-react";

const iconSize=24;
const linksMockData=[
  {label:'ダッシュボード',link:'dashboard',icon:<IconDashboard size={iconSize} stroke={1.5} />},
  {label:'タスク',link:'task',icon:<IconChecklist size={iconSize} stroke={1.5} />},
  {label:'ガントチャート',link:'ganttchart',icon:<IconChartDots size={iconSize} stroke={1.5} />},
  {label:'メンバー',link:'member',icon:<IconUsersGroup size={iconSize} stroke={1.5} />},
  {label:'備忘録',link:'memo',icon:<IconClipboardText size={iconSize} stroke={1.5} />},
  {label:'設定',link:'setting',icon:<IconSettings size={iconSize} stroke={1.5} />},
]

export function NavBar(){
  const links=linksMockData.map((link)=>(
    <NavLink className={styles.nav} key={link.link}
      href={link.link}
      label={link.label}
      leftSection={link.icon}
    ></NavLink>
  ));
  return(
    <nav className={styles.navbar}>
      {links}
    </nav>
    
  )
}