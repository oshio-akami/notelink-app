"use client";

import { Card, Text, Avatar } from "@mantine/core";
import styles from "./articleDetail.module.scss";
import { formatDate } from "@/libs/utils";
import { Article } from "@/utils/types/articleType";
import DOMPurify from "dompurify";
import ArticleCommentView from "../articleCommentView/articleCommentView";
import { useRef } from "react";

type Props = {
  article: Article;
};

/**コメントも含めた投稿の詳細表示 */
export default function ArticleDetail({ article }: Props) {
  const commentRef = useRef<HTMLDivElement>(null);
  if (!article) {
    return <></>;
  }
  const sanitizeContent = DOMPurify.sanitize(article.content);

  return (
    <>
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
        <div className={styles.comments} ref={commentRef}>
          <ArticleCommentView
            articleId={article.id}
            articlePostUserId={article.userProfiles.userId}
          />
        </div>
      </Card>
    </>
  );
}
