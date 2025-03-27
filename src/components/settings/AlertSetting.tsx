import styles from "./settings.module.css"

export default function AlertSetting(){
  return(
    <div className={styles.setting}>
      <h1 className={styles.header}>通知設定</h1>
      <div className={styles.group}></div>
    </div>
  )
}