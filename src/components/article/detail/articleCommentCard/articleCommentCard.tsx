"use client";

import { Card, Text, Avatar } from "@mantine/core";
import styles from "./articleCommentCard.module.scss";

import { formatDate } from "@/libs/utils";
import { IconDotsVertical } from "@tabler/icons-react";
import ArticleCommentMenuPopup from "../articleCommentMenuPopup/articleCommentMenuPopup";

type Props = {
  id: string;
  displayName: string;
  createdAt: string;
  avatar: string;
  content: string;
};

/**コメントを表示するカードコンポーネント */
export default function ArticleCommentCard({
  id,
  displayName,
  createdAt,
  avatar,
  content,
}: Props) {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Avatar className={styles.avatar} src={avatar}></Avatar>
        <Text fw={700}>{displayName}</Text>
        <Text className={styles.date}>{formatDate(createdAt)}</Text>
        <div className={styles.menu}>
          <ArticleCommentMenuPopup commentId={id}>
            <IconDotsVertical />
          </ArticleCommentMenuPopup>
        </div>
      </div>
      <div className={styles.contents}>
        <pre>{content}</pre>
      </div>
    </Card>
  );
}
