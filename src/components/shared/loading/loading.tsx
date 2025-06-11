"use client";
import { Box, Loader, Text } from "@mantine/core";
import styles from "./loading.module.scss";

type Props = {
  text?: string;
  size?: string;
  /**default | wave */
  type?: string;
};

const formatDotSize = (size: string) => {
  const match = size.match(/^([\d.]+)([a-z%]+)$/i);
  if (!match) return size;

  const [, num, unit] = match;
  const halved = parseFloat(num) / 4;
  return `${halved}${unit}`;
};

/**ローディングを表示するコンポーネント */
export default function Loading({
  text = "",
  size = "1rem",
  type = "default",
}: Props) {
  return (
    <div className={styles.loading}>
      <Text size={size}>{text}</Text>
      {type === "wave" ? (
        <div className={styles.loader}>
          {[0, 1, 2].map((i) => (
            <Box
              className={styles.dot}
              key={i}
              w={formatDotSize(size)}
              h={formatDotSize(size)}
              style={{
                animationDelay: `${i * 0.2}s`,
              }}
            ></Box>
          ))}
        </div>
      ) : (
        <Loader size={size} color="#4c6cb3" />
      )}
    </div>
  );
}
