import { getClient } from "@/libs/hono"
import ArticleView from "./_components/articleView/ArticleView";
import HomeSidebar from "./_components/homeSidebar/HomeSidebar";
import { Grid, GridCol, Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import styles from "./page.module.css"

type Props={
  params:Promise<{id:string}>
}

const getArticles=async(groupId:string)=>{
  const client =await getClient();
  const res=await client.api.article[":groupId"].articles.$get({
    param:{
      groupId:groupId,
    }
  });
  const body=await res.json();
  return body.articles;
}
const getRecommend=async(groupId:string)=>{
  const client =await getClient();
  const res=await client.api.article[":groupId"].articles.$get({
    param:{
      groupId:groupId,
    }
  });
  const body=await res.json();
  return body.articles;
}


export default async function Home({params}:Props){
  const {id}=await params;

  return (
    <Grid>
      <GridCol span={9}>
        <div className={styles.sticky}>
        <Tabs defaultValue="default">
          <TabsList grow justify="center"  classNames={{list:styles.list}}>
            <TabsTab value="default">ホーム</TabsTab>
            <TabsTab value="recommend">おすすめ</TabsTab>
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
        </div>
      </GridCol>
      <GridCol span={3}>
        <HomeSidebar />
      </GridCol>
    </Grid>
  );
}