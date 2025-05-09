import { getClient } from "@/libs/hono";
import PostForm from "@/components/article/postForm/PostForm";
import ArticleView from "@/components/article/articleView/ArticleView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Post({ params }: Props) {
  const { id } = await params;
  const client = await getClient();
  const res = await client.api.article[":groupId"].articles[":mine?"].$get({
    param: {
      groupId: id,
      mine: "true",
    },
  });
  const body = await res.json();
  const articles = body.articles;
  return (
    <>
      <PostForm groupId={id} />
      <ArticleView articles={articles} />
    </>
  );
}
