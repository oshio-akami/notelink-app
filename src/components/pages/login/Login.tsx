import { Input ,PasswordInput,Button} from "@mantine/core"
import styles from "./login.module.css"
import {signIn } from "next-auth/react"

export function Login(){
  return(
    <div className={styles.loginPage}>
      <h1>ログイン</h1>
      <div className={styles.loginWindow}>
        <ul>
          <li><Input placeholder="メールドレス"></Input></li>
        <li><PasswordInput placeholder="パスワード"></PasswordInput></li>
        <li><Button>ログイン</Button></li>
        <li><p className={styles.split}>他の方法でログイン</p></li>
        <li><img src='/image/web_light_sq_SI.svg' alt="login" onClick={()=>signIn("google",{ callbackUrl:"/dashboard" },{ prompt: "select_account" })}></img></li>
        </ul>
      </div>
    </div>
  )
}