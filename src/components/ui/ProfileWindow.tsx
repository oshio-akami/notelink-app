"use client"

import styles from "./profileWindow.module.css"
import { Popover ,List} from "@mantine/core"
import { ReactNode } from "hono/jsx"
import { signIn, signOut } from "next-auth/react"
import { IconUser ,IconPencil,IconLogout,IconUserPlus} from "@tabler/icons-react"

type Props={
  name:string
  mail:string
  icon:string
  children:ReactNode
}

export function ProfileWindow({name,mail,icon,children}:Props){
  return (
    <>
      <Popover width={320} trapFocus offset={{ mainAxis: 10, crossAxis: 40 }} >
        <Popover.Target>{children}</Popover.Target>
        <Popover.Dropdown className={styles.window}>
          <div className={styles.profile}>
            <img className={styles.icon} alt="" src={icon} />
            <ul>
              <li>{name}</li>
              <li>{mail}</li>
            </ul>
            
          </div>
          <div className={styles.setting}>
            <List>
              <List.Item icon={<IconPencil/>}>プロフィールの編集</List.Item>
              <List.Item icon={<IconUser/>}>アカウント設定</List.Item>
              <List.Item icon={<IconUserPlus/>} 
                onClick={()=>signIn("google")}>
                  別のアカウントでログイン</List.Item>
              <List.Item icon={<IconLogout/>} onClick={() => signOut()}>ログアウト</List.Item>
            </List>
          </div>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}