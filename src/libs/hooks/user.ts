"use client";

import useSWR from "swr";
import client from "@/libs/honoClient";
import { isRoleAdmin, ROLE_MEMBER } from "../roleUtils";

export const useGroupProfile = (groupId: string) => {
  const fetcher = async () => {
    const res = await client.api.user[":groupId"].profile.$get({
      param: {
        groupId: groupId,
      },
    });
    const body = await res.json();
    return body.profile;
  };
  const { data, error, isLoading, mutate } = useSWR("/profile", fetcher);
  return {
    profile: data,
    isRoleAdmin: isRoleAdmin(data?.roleId ?? ROLE_MEMBER),
    isLoading,
    error,
    mutate,
  };
};
