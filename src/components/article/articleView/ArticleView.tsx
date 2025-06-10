"use client";
import { Article } from "@/utils/types/articleType";
import ArticleCard from "../articleCard/articleCard";
import styles from "./articleView.module.scss";
import { Tabs, Text } from "@mantine/core";
import { useMemo } from "react";
import Loading from "@/components/shared/loading/loading";
import { useArticles } from "@/libs/hooks/article";
import { ArticleActionsContext } from "@/libs/context/articleContext/articleActionsContext";

type Props = {
  groupId: string;
};

/**投稿一覧を表示するコンポーネント */
export default function ArticleView({ groupId }: Props) {
  const { articles, handleDeleteArticle, onBookmarkChange } =
    useArticles(groupId);
  /** 投稿データの配列をArticleCardコンポーネントの配列に変換する関数*/
  const articleElements = (articles: Article[]) => {
    return articles.map((article) => (
      <ArticleCard key={article.id} article={article} />
    ));
  };
  /**ブックマーク一覧を取得する関数 */
  const bookmarkedArticles = useMemo(() => {
    return articles?.filter((article) => article.isBookmark) ?? [];
  }, [articles]);

  const value = {
    groupId,
    handleDeleteArticle,
    onBookmarkChange,
  };

  return (
    <>
      <ArticleActionsContext.Provider value={value}>
        <Tabs defaultValue="default">
          <Tabs.List grow classNames={{ list: styles.list }}>
            <Tabs.Tab value="default">新着</Tabs.Tab>
            <Tabs.Tab value="bookmark">ブックマーク</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="default" className={styles.articles} key="default">
            {articles == undefined ? (
              <div className={styles.noArticles}>
                <Loading text="読み込み中" size="1.5rem" />
              </div>
            ) : articles && articles?.length > 0 ? (
              articleElements(articles)
            ) : (
              <div className={styles.noArticles}>
                <Text size="1.5rem" mb={20}>
                  まだ記事がありません
                </Text>
                <Text size="1.5rem">新しい記事を投稿してみましょう</Text>
              </div>
            )}
          </Tabs.Panel>
          <Tabs.Panel
            value="bookmark"
            className={styles.articles}
            key="bookmark"
          >
            {bookmarkedArticles.length > 0 ? (
              articleElements(bookmarkedArticles)
            ) : (
              <div className={styles.noArticles}>
                <Text size="1.5rem" mb={20}>
                  ブックマークした記事がありません
                </Text>
                <Text size="1.5rem">記事をブックマークしてみましょう</Text>
              </div>
            )}
          </Tabs.Panel>
        </Tabs>
      </ArticleActionsContext.Provider>
    </>
  );
}
