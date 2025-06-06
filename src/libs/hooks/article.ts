import client from "@/libs/honoClient";
import useSWR from "swr";

/**投稿一覧を取得するカスタムフック */
export const useArticles = (groupId: string) => {
  const fetcher = async () => {
    const res = await client.api.article[":groupId"].articles[":mine?"].$get({
      param: {
        groupId: groupId,
      },
    });
    const body = await res.json();
    return body.articles!;
  };

  const key = `/articles/${groupId}`;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  return {
    articles: data,
    isLoading,
    error,
    mutate,
  };
};

/**投稿を取得するカスタムフック */
