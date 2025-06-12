"use client";

import { ReactNode } from "react";
import { GroupContext } from "@/libs/context/groupContext/groupContext";

export const GroupContextProvider = ({
  groupId,
  groupName,
  children,
}: {
  groupId: string;
  groupName: string;
  children: ReactNode;
}) => {
  return (
    <GroupContext.Provider value={{ groupId, groupName }}>
      {children}
    </GroupContext.Provider>
  );
};
