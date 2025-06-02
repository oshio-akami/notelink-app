"use client";

import { createContext, useContext } from "react";

export const GroupContext = createContext<string | null>(null);
export const useGroupId = () => useContext(GroupContext);
