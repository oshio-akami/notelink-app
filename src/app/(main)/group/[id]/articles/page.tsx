import ArticleView from "@/components/article/articleView/ArticleView";
import { AppShellAside, ScrollArea } from "@mantine/core";
import styles from "./page.module.scss";
import MemberList from "@/components/member/memberList/memberList";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Home({ params }: Props) {
  const { id } = await params;

  return (
    <div className={styles.wrapper}>
      <ScrollArea h="calc(100vh-60px" w="100%" type="never">
        <ArticleView groupId={id} />
      </ScrollArea>
      <AppShellAside p={20} withBorder={false} zIndex={-1} bg={"#f8fbff"}>
        <div className={styles.sidebar}>
          <MemberList />
        </div>
      </AppShellAside>
    </div>
  );
}
