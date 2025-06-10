"use client";

import { createContext, useContext } from "react";

type GroupContextType = {
  groupId: string;
};

export const GroupContext = createContext<GroupContextType | null>(null);
export const useGroup = () => {
  const ctx = useContext(GroupContext);
  if (!ctx)
    throw new Error("useGroupContext はプロバイダ内で使用する必要があります");
  return ctx;
};
