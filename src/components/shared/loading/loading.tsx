"use client";
import { Loader, Text } from "@mantine/core";
import styles from "./loading.module.scss";

type Props = {
  text?: string;
  size?: string;
};

/**ローディングを表示するコンポーネント */
export default function Loading({ text = "", size = "1rem" }: Props) {
  return (
    <div className={styles.loading}>
      <Text size={size}>{text}</Text>
      <Loader size={size} color="#4c6cb3" />
    </div>
  );
}
