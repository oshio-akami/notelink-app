import { Popover, Text } from "@mantine/core";
import { ReactNode } from "react";
import styles from "./articleCommentMenuPopup.module.scss";
import { useCommentContext } from "@/libs/context/commentContext/commentContext";

type Props = {
  children: ReactNode;
  commentId: string;
};

export default function ArticleCommentMenuPopup({
  children,
  commentId,
}: Props) {
  const { handleDeleteComment } = useCommentContext();
  return (
    <>
      <Popover trapFocus offset={{ mainAxis: -35, crossAxis: 100 }}>
        <Popover.Target>{children}</Popover.Target>
        <Popover.Dropdown className={styles.popup}>
          <Text
            c="red"
            onClick={() => {
              handleDeleteComment(commentId);
            }}
          >
            投稿を削除
          </Text>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}
