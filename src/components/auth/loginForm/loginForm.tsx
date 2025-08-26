"use client";
import styles from "./loginForm.module.scss";
import { signIn } from "next-auth/react";
import { Image } from "@mantine/core";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const searchParams =
    useSearchParams() || new URLSearchParams("callbackUrl=/mocked-url");
  const callbackUrl = searchParams.get("callbackUrl") || "/join-group";
  return (
    <>
      <script src="https://accounts.google.com/gsi/client" async></script>

      <div className={styles.loginPage}>
        <div className={styles.header}>
          <Image className={styles.logo} src="/sample_logo.webp" alt="logo" />
        </div>
        <div className={styles.loginWindow}>
          <h1>ログイン</h1>
          <ul>
            <li>
              <p className={styles.split}>Googleアカウントでログイン</p>
            </li>
            <li
              className={styles.googleLogin}
              onClick={() => signIn("google", { callbackUrl: callbackUrl })}
            >
              <Image
                className={styles.googleLogo}
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="login"
              />
              <p>Googleでログイン</p>
            </li>
            <li>
              <p className={styles.split}>ゲスト用の一時アカウントでログイン</p>
            </li>
            <li
              className={styles.googleLogin}
              onClick={() =>
                signIn("credentials", { callbackUrl: callbackUrl })
              }
            >
              <p>ゲストとして参加</p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
