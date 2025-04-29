import { getClient } from "@/libs/hono"
import ArticleView from "./_components/articleView/ArticleView";

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

export default async function Home({params}:Props){
  const {id}=await params;
  const articles=await getArticles(id);
  return(
    <>
      <ArticleView articles={articles}/>
    </>
  )
}