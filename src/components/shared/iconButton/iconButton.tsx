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
  border?: boolean;
};

export default function IconButton({
  icon,
  activeIcon = icon,
  onClick = () => {},
  defaultActive = false,
  leftSection,
  rightSection,
  border = false,
}: Props) {
  const [isActive, setActive] = useState(defaultActive);
  return (
    <div
      className={styles.button}
      style={{ border: border ? "1px solid lightgray" : undefined }}
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
