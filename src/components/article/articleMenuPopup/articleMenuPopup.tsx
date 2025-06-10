import { Popover, Text } from "@mantine/core";
import { ReactNode } from "react";
import styles from "./articleMenuPopup.module.scss";
import { useArticleActionsContext } from "@/libs/context/articleContext/articleActionsContext";

type Props = {
  children: ReactNode;
  articleId: string;
};

export default function ArticleMenuPopup({ children, articleId }: Props) {
  const { handleDeleteArticle } = useArticleActionsContext();
  return (
    <>
      <Popover trapFocus offset={{ mainAxis: -35, crossAxis: 100 }}>
        <Popover.Target>{children}</Popover.Target>
        <Popover.Dropdown className={styles.popup}>
          <Text
            c="red"
            onClick={() => {
              handleDeleteArticle(articleId);
            }}
          >
            投稿を削除
          </Text>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}
