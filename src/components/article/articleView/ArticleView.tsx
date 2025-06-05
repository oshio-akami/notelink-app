"use client";
import { Article } from "@/utils/types/articleType";
import ArticleCard from "../articleCard/articleCard";
import styles from "./articleView.module.scss";
import useSWR from "swr";
import { Tabs, Text } from "@mantine/core";
import client from "@/libs/honoClient";
import { useMemo, useState } from "react";
import Loading from "@/components/shared/loading/loading";

type Props = {
  groupId: string;
};

export default function ArticleView({ groupId }: Props) {
  const [tab, setTab] = useState("default");
  const fetcher = async () => {
    const res = await client.api.article[":groupId"].articles[":mine?"].$get({
      param: {
        groupId: groupId,
      },
    });
    const body = await res.json();
    return body.articles!;
  };
  const { data: articles, mutate } = useSWR("/articles", fetcher);

  const onBookmarkChange = (id: string, isBookmark: boolean) => {
    mutate(
      (prevArticles) =>
        prevArticles?.map((article) =>
          article.id === id ? { ...article, isBookmark } : article
        ),
      false
    );
  };
  const articleElements = (articles: Article[]) => {
    return articles.map((article) => (
      <ArticleCard
        key={article.id}
        article={article}
        onBookmarkChange={onBookmarkChange}
      />
    ));
  };
  const bookmarkedArticles = useMemo(() => {
    return articles?.filter((article) => article.isBookmark) ?? [];
  }, [articles]);

  return (
    <>
      <Tabs
        defaultValue="default"
        onChange={(value) => {
          setTab(value as "default" | "bookmark");
        }}
      >
        <Tabs.List grow classNames={{ list: styles.list }}>
          <Tabs.Tab value="default">新着</Tabs.Tab>
          <Tabs.Tab value="bookmark">ブックマーク</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel
          value="default"
          className={styles.articles}
          key={tab === "default" ? "default" : "other"}
        >
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
          key={tab === "bookmark" ? "bookmark" : "other"}
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
    </>
  );
}
