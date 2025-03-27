import styles from "./settings.module.css"

export default function MemberSetting(){
  return(
    <div className={styles.setting}>
      <h1 className={styles.header}>メンバー設定</h1>
      <div className={styles.group}></div>
    </div>
  )
}