import styles from "./groupCard.module.css"

type Props={
  groupName:string,
}

export default function GroupCard({groupName}:Props){
  return(
    <div className={styles.card}>
      <h1 className={styles.title}>{groupName}</h1>
      <p>description</p>
      <p>description</p>
    </div>
  )
}