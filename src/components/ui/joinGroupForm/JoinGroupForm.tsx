import styles from "./joinGroupForm.module.css";
import { TextInput, Button } from "@mantine/core";


export default function joinGroupForm() {

  return (
    <>
      <form className={styles.group}>
        <p>グループの作成</p>
        <TextInput placeholder="グループ名"></TextInput>
        <Button className={styles.button}>新しいグループを作成する</Button>
      </form>
      <div className={styles.group}>
        <p>グループに参加</p>
        <TextInput placeholder="招待コードを入力"></TextInput>
        <Button className={styles.button}>参加する</Button>
      </div>
    </>
  );
}
