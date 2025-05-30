"use server";

import { getClient } from "@/libs/hono";

export const addBookmark = async (articleId: string) => {
  const client = await getClient();
  const res = await client.api.article.bookmark[":articleId"].$post({
    param: {
      articleId: articleId,
    },
  });
  const body = await res.json();
  return { success: body.success };
};

export const removeBookmark = async (articleId: string) => {
  const client = await getClient();
  const res = await client.api.article.bookmark[":articleId"].$delete({
    param: {
      articleId: articleId,
    },
  });
  const body = await res.json();
  return { success: body.success };
};
