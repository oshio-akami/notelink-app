"use client";

import { createContext, useContext } from "react";

export const GroupContext = createContext<string | null>(null);
export const useGroupId = () => {
  const ctx = useContext(GroupContext);
  if (!ctx)
    throw new Error("useGroupContext はプロバイダ内で使用する必要があります");
  return ctx;
};
