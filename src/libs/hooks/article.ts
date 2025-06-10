import { deleteArticle } from "@/actions/article/articleActions";
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

  const handleUpdateArticle = async () => {};
  /**投稿を削除する関数 */
  const handleDeleteArticle = async (articleId: string) => {
    mutate(
      (prev) => prev?.filter((article) => article.id !== articleId),
      false
    );
    try {
      await deleteArticle(groupId, articleId);
    } catch {
      mutate();
    }
  };
  /**ブックマーク変更時の処理をする関数 */
  const onBookmarkChange = (id: string, isBookmark: boolean) => {
    mutate(
      (prevArticles) =>
        prevArticles?.map((article) =>
          article.id === id ? { ...article, isBookmark } : article
        ),
      false
    );
  };

  return {
    articles: data,
    isLoading,
    error,
    mutate,
    handleUpdateArticle,
    handleDeleteArticle,
    onBookmarkChange,
  };
};
