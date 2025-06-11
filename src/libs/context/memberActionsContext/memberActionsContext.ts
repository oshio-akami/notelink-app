import { createContext, useContext } from "react";

type MemberActionsContextType = {
  handleDeleteMember: (userId: string) => void;
};

export const MemberActionsContext =
  createContext<MemberActionsContextType | null>(null);

export const useMemberActionsContext = () => {
  const context = useContext(MemberActionsContext);
  if (!context) {
    throw new Error(
      "useMemberActionsContext はプロバイダ内で使用する必要があります"
    );
  }
  return context;
};
