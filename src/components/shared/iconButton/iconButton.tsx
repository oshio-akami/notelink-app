import styles from "./iconButton.module.scss";
import type { IconProps } from "@tabler/icons-react";
import { useState } from "react";

type Props = {
  icon: React.ReactElement<IconProps>;
  activeIcon?: React.ReactElement<IconProps>;
  onClick?: (isActive: boolean) => void;
  defaultActive?: boolean;
};

export default function IconButton({
  icon,
  activeIcon = icon,
  onClick = () => {},
  defaultActive = false,
}: Props) {
  const [isActive, setActive] = useState(defaultActive);
  return (
    <div
      className={styles.button}
      onClick={() => {
        setActive(!isActive);
        onClick(!isActive);
      }}
    >
      {isActive && activeIcon ? activeIcon : icon}
    </div>
  );
}
