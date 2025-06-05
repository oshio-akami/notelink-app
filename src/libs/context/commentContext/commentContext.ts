import { createContext, useContext } from "react";

type CommentContextType = {
  articleId: string;
  groupId: string;
  handleDeleteComment: (commentId: string) => void;
};

export const CommentContext = createContext<CommentContextType | null>(null);

export const useCommentContext = () => {
  const ctx = useContext(CommentContext);
  if (!ctx) throw new Error("useCommentContext must be used within Provider");
  return ctx;
};
