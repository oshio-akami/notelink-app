import styles from "./iconButton.module.scss";
import type { IconProps } from "@tabler/icons-react";
import { useState } from "react";

type Props = {
  icon: React.ReactElement<IconProps>;
  activeIcon?: React.ReactElement<IconProps>;
  onClick?: (isActive: boolean) => void;
  defaultActive?: boolean;
  leftSection?: React.ReactElement;
  rightSection?: React.ReactElement;
};

export default function IconButton({
  icon,
  activeIcon = icon,
  onClick = () => {},
  defaultActive = false,
  leftSection,
  rightSection,
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
      {rightSection && leftSection}
      {isActive && activeIcon ? activeIcon : icon}
      {rightSection && rightSection}
    </div>
  );
}
