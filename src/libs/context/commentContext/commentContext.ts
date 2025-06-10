import { createContext, useContext } from "react";

type CommentContextType = {
  articleId: string;
  handleDeleteComment: (commentId: string) => void;
};

export const CommentContext = createContext<CommentContextType | null>(null);

export const useCommentContext = () => {
  const ctx = useContext(CommentContext);
  if (!ctx)
    throw new Error("useCommentContext はプロバイダ内で使用する必要があります");
  return ctx;
};
