"use client";

import { Card, Text, Avatar, Spoiler } from "@mantine/core";
import styles from "./articleCard.module.scss";
import IconButton from "@/components/shared/iconButton/iconButton";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconMessageCircle,
} from "@tabler/icons-react";
import { formatDate, withShortPress } from "@/libs/utils";
import { Article } from "@/utils/types/articleType";
import DOMPurify from "dompurify";
import { addBookmark, removeBookmark } from "@/actions/article/bookmarkActions";
import { useRouter } from "next/navigation";
import { useGroupId } from "@/libs/context/groupContext/groupContext";

type Props = {
  article: Article;
  onBookmarkChange: (articleId: string, isBookmark: boolean) => void;
};

/**投稿を表示するカードコンポーネント */
export default function ArticleCard({ article, onBookmarkChange }: Props) {
  const router = useRouter();
  const groupId = useGroupId();
  const shortPress = withShortPress(() => pushArticleRoute());
  const pushArticleRoute = () => {
    router.push(`/group/${groupId}/article/${article.id}`);
  };
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
        <Spoiler maxHeight={250} showLabel="続きを見る" hideLabel="折りたたむ">
          <div {...shortPress}>
            <Text size="1.5rem" fw={600} lh={1.5} mb={10}>
              {article.title}
            </Text>

            <Text
              size="1.2rem"
              lh={1.3}
              dangerouslySetInnerHTML={{ __html: sanitizeContent }}
            />
          </div>
        </Spoiler>
      </div>
      <div className={styles.actions}>
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
        <IconButton
          onClick={pushArticleRoute}
          icon={<IconMessageCircle />}
          rightSection={<Text>{article.commentCount}</Text>}
        />
      </div>
    </Card>
  );
}
