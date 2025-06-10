import { createContext, useContext } from "react";

type ArticleActionsContextType = {
  handleDeleteArticle: (articleId: string) => void;
  onBookmarkChange: (articleId: string, bookmarked: boolean) => void;
};

export const ArticleActionsContext =
  createContext<ArticleActionsContextType | null>(null);

export const useArticleActionsContext = () => {
  const context = useContext(ArticleActionsContext);
  if (!context) {
    throw new Error(
      "useArticleActionsContext はプロバイダ内で使用する必要があります"
    );
  }
  return context;
};
