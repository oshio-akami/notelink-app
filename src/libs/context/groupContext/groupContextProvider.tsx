"use client";

import { ReactNode } from "react";
import { GroupContext } from "@/libs/context/groupContext/groupContext";

export const GroupContextProvider = ({
  groupId,
  children,
}: {
  groupId: string;
  children: ReactNode;
}) => {
  return (
    <GroupContext.Provider value={groupId}>{children}</GroupContext.Provider>
  );
};
