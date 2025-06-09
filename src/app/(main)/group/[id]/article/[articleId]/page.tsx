import HomeSidebar from "@/components/layout/homeSidebar/HomeSidebar";
import { AppShellAside, ScrollArea } from "@mantine/core";
import styles from "./page.module.scss";
import { hasJoinedGroup } from "@/libs/apiUtils";
import { getClient } from "@/libs/hono";
import ArticleDetailPageView from "@/components/article/detail/articleDetailPageView/articleDetailPageView";

type Props = {
  params: Promise<{ id: string; articleId: string }>;
};

export default async function Home({ params }: Props) {
  const { id, articleId } = await params;
  const hasJoined = await hasJoinedGroup(id);
  const getArticle = async () => {
    const client = await getClient();
    const res = await client.api.article[":groupId"][":articleId"].$get({
      param: {
        articleId: articleId,
        groupId: id,
      },
    });
    const body = await res.json();
    return body.article;
  };

  const article = await getArticle();
  return (
    <>
      <div className={styles.wrapper} id="top">
        <ScrollArea h="calc(100vh - 60px)" w="100%" type="never">
          <ArticleDetailPageView hasJoined={hasJoined} article={article} />
        </ScrollArea>
        <AppShellAside p={20} withBorder={false} zIndex={-1} bg={"#f8fbff"}>
          <div className={styles.sidebar}>
            <HomeSidebar />
          </div>
        </AppShellAside>
      </div>
    </>
  );
}
