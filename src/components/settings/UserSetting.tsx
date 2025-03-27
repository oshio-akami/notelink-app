import styles from "./settings.module.css"

export default function UserSetting(){
  return(
    <div className={styles.setting}>
      <h1 className={styles.header}>ユーザー設定</h1>
      <div className={styles.group}></div>
    </div>
  )
}