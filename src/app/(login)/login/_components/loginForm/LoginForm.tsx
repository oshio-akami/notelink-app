"use client"
import { Input ,PasswordInput,Button} from "@mantine/core"
import styles from "./loginForm.module.css"
import {signIn } from "next-auth/react"
import { Image } from "@mantine/core"

export function LoginForm(){
  return(
    <>
    <script src="https://accounts.google.com/gsi/client" async></script>

    <div className={styles.loginPage}>
      <h1>ログイン</h1>
      <div className={styles.loginWindow}>
        <ul>
          <li><Input placeholder="メールドレス"></Input></li>
          <li><PasswordInput placeholder="パスワード"></PasswordInput></li>
          <li><Button>ログイン</Button></li>
          <li><p className={styles.split}>他の方法でログイン</p></li>
          <li className={styles.googleLogin} onClick={()=>signIn("google",{ callbackUrl:"/join-group" })}> 
            <Image className={styles.googleLogo} 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="login" 
            />
            <p>Googleでログイン</p>
          </li>
        </ul>
      </div>
    </div>
    </>
  )
}