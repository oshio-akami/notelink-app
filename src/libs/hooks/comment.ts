import useSWR from "swr";
import client from "@/libs/honoClient";

export const useArticleComments = (groupId: string, articleId: string) => {
  const fetcher = async () => {
    const res = await client.api.article.comments[":groupId"][
      ":articleId"
    ].$get({
      param: { groupId, articleId },
    });
    const body = await res.json();
    return body.comments!;
  };
  const key = `/comments/${groupId}/${articleId}`;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  return {
    comments: data,
    isLoading,
    error,
    mutate,
  };
};
