"use client";

import styles from "./articleDetailPageView.module.scss";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import ArticleDetail from "../articleDetail/articleDetail";
import { Button, Text } from "@mantine/core";
import { Article } from "@/utils/types/articleType";
import { useGroupId } from "@/libs/context/groupContext/groupContext";

type Props = {
  hasJoined: boolean;
  article: Article | null;
};

/**投稿の詳細ページ */
export default function ArticleDetailPageView({ hasJoined, article }: Props) {
  const router = useRouter();
  const groupId = useGroupId();
  const handleGoHome = () => {
    router.push(`/group/${groupId}/home`);
  };
  return (
    <>
      <div className={styles.header}>
        <IconArrowLeft cursor="pointer" size="2rem" onClick={handleGoHome} />
      </div>
      <div className={styles.content}>
        {hasJoined && article ? (
          <>
            <ArticleDetail article={article} />
            <div style={{ height: "50vh" }} />
          </>
        ) : !hasJoined ? (
          <div className={styles.notFound}>
            <Text size="1.5rem">投稿はグループメンバーだけが閲覧できます</Text>
            <Button onClick={handleGoHome}>ホームに戻る</Button>
          </div>
        ) : (
          <div className={styles.notFound}>
            <Text size="1.5rem">投稿が存在しません</Text>
            <Button onClick={handleGoHome} size="sm">
              ホームに戻る
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
