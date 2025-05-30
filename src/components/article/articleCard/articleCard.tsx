"use client";

import { Card, Text, Avatar, TextInput } from "@mantine/core";
import styles from "./articleCard.module.scss";
import IconButton from "@/components/shared/iconButton/iconButton";
import {
  IconThumbUp,
  IconBookmark,
  IconBookmarkFilled,
} from "@tabler/icons-react";
import { formatDate } from "@/libs/utils";
import { Article } from "@/utils/types/articleType";
import DOMPurify from "dompurify";
import { addBookmark, removeBookmark } from "@/actions/article/bookmarkActions";

type Props = {
  article: Article;
  onBookmarkChange: (articleId: string, isBookmark: boolean) => void;
};

export default function ArticleCard({ article, onBookmarkChange }: Props) {
  if (!article) {
    return <></>;
  }
  const sanitizeContent = DOMPurify.sanitize(article.content!);
  return (
    <Card withBorder className={styles.card}>
      <div className={styles.header}>
        <Avatar
          className={styles.avatar}
          src={article.userProfiles.image}
        ></Avatar>
        <div>
          <Text fw={700}>{article.userProfiles.displayName}</Text>
          <Text className={styles.date}>{formatDate(article.createdAt)}</Text>
        </div>
      </div>
      <div className={styles.contents}>
        <Text size="1.5rem" fw={600} lh={1.5} mb={10}>
          {article.title}
        </Text>
        <Text
          size="1.2rem"
          lh={1.3}
          dangerouslySetInnerHTML={{ __html: sanitizeContent }}
        />
      </div>
      <div className={styles.actions}>
        <IconButton icon={<IconThumbUp />} />
        <IconButton
          icon={<IconBookmark />}
          activeIcon={<IconBookmarkFilled color="red" />}
          defaultActive={article.isBookmark}
          onClick={(isActive) => {
            if (isActive) {
              addBookmark(article.id);
            } else {
              removeBookmark(article.id);
            }
            onBookmarkChange(article.id, isActive);
          }}
        />
        <TextInput
          className={styles.comment}
          variant="filled"
          placeholder="コメントをする"
          radius="xl"
        ></TextInput>
      </div>
    </Card>
  );
}
