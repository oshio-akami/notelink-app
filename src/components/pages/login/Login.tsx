import { Input ,PasswordInput,Button} from "@mantine/core"
import styles from "./login.module.css"
import {signIn } from "next-auth/react"

export function Login(){
  return(
    <div className={styles.loginPage}>
      <h1>Login</h1>
      <div className={styles.loginWindow}>
        <ul>
          <li><Input placeholder="e-mail"></Input></li>
        <li><PasswordInput placeholder="password"></PasswordInput></li>
        <li><Button>Login</Button></li>
        <li><p className={styles.split}>or</p></li>
        <li><img src="web_light_sq_SI.svg" alt="" onClick={()=>signIn("google",{ callbackUrl:"/dashboard" })}/></li>
        </ul>
      </div>
    </div>
  )
}