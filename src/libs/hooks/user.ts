"use client";

import useSWR from "swr";
import client from "@/libs/honoClient";

export const useProfile = () => {
  const fetcher = async () => {
    const res = await client.api.user.profile.$get();
    const body = await res.json();
    return body.profile;
  };
  const { data, error, isLoading, mutate } = useSWR("/profile", fetcher);
  return {
    profile: data,
    isLoading,
    error,
    mutate,
  };
};
