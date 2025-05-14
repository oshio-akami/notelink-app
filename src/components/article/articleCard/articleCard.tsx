"use client";

import { Card, Text, Avatar, TextInput } from "@mantine/core";
import styles from "./articleCard.module.scss";
import IconButton from "@/components/shared/iconButton/iconButton";
import { IconThumbUp, IconBookmark } from "@tabler/icons-react";
import { formatDate } from "@/libs/utils";
import { Article } from "@/utils/types/articleType";

type Props = {
  article: Article;
};

export default function ArticleCard({ article }: Props) {
  if (!article) {
    return <></>;
  }
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
        <Text size="1.2rem" fw={600} lh={1.3}>
          {article.title}
        </Text>
        <Text size="1.2rem" lh={1.3}>
          {article.content}
        </Text>
      </div>
      <div className={styles.actions}>
        <IconButton icon={<IconThumbUp />} />
        <IconButton icon={<IconBookmark />} />
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
