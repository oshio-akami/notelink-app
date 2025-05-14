import styles from "./iconButton.module.scss";
import type { IconProps } from "@tabler/icons-react";

type Props = {
  icon: React.ReactElement<IconProps>;
};

export default function IconButton({ icon }: Props) {
  return <div className={styles.button}>{icon}</div>;
}
