import { getClient } from "@/libs/hono";
import ArticleView from "@/components/article/articleView/ArticleView";
import HomeSidebar from "@/components/layout/homeSidebar/HomeSidebar";
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  AppShellAside,
  ScrollArea,
} from "@mantine/core";
import styles from "./page.module.scss";

type Props = {
  params: Promise<{ id: string }>;
};

const getArticles = async (groupId: string) => {
  const client = await getClient();
  const res = await client.api.article[":groupId"].articles[":mine?"].$get({
    param: {
      groupId: groupId,
    },
  });
  const body = await res.json();
  return body.articles!;
};
const getRecommend = async (groupId: string) => {
  const client = await getClient();
  const res = await client.api.article[":groupId"].articles[":mine?"].$get({
    param: {
      groupId: groupId,
    },
  });
  const body = await res.json();
  return body.articles!;
};

export default async function Home({ params }: Props) {
  const { id } = await params;

  return (
    <div className={styles.wrapper}>
      <ScrollArea h="calc(100vh-60px" w="100%" type="never">
        <Tabs defaultValue="default">
          <TabsList grow classNames={{ list: styles.list }}>
            <TabsTab value="default">新着</TabsTab>
            <TabsTab value="bookmark">ブックマーク</TabsTab>
          </TabsList>

          <TabsPanel value="default">
            <ArticleView articles={await getArticles(id)} />
          </TabsPanel>
          <TabsPanel value="recommend">
            <ArticleView articles={await getRecommend(id)} />
          </TabsPanel>
          <TabsPanel value="bookmark">
            <ArticleView articles={await getArticles(id)} />
          </TabsPanel>
        </Tabs>
      </ScrollArea>
      <AppShellAside p={20} withBorder={false} zIndex={-1} bg={"#f8fbff"}>
        <div className={styles.sidebar}>
          <HomeSidebar />
        </div>
      </AppShellAside>
    </div>
  );
}
