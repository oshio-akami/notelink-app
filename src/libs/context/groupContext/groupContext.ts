"use client";

import { createContext, useContext } from "react";

export const GroupContext = createContext<string | null>(null);
export const useGroupId = () => {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("useCommentContext must be used within Provider");
  return ctx;
};
