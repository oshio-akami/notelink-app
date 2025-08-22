"use server";

import { getClient } from "@/libs/hono";
import { redirect } from "next/navigation";

const previewArticles = [
  {
    title: "グループの切り替え方法",
    content: `上部に表示されているグループ名をクリックすると、所属している他のグループ一覧が表示されます。そこから簡単にグループを切り替えることができます。`,
  },
  {
    title: "新しいグループを作ってみましょう",
    content: `画面右上のボタンから、新しいグループを作成できます。用途に応じて複数のグループを作って切り替えることができます。`,
  },
  {
    title: "グループにユーザーを招待できます",
    content: `サイドバーの「メンバー」から他のユーザーをこのグループに招待できます。`,
  },
  {
    title: "ようこそ！",
    content: `これはプレビュー用のグループです。このアプリでは、ユーザーが自由に投稿を行えるグループ機能を提供しています。`,
  },
];

/**
 * 新しいグループを作成する非同期関数
 */
const createGroup = async () => {
  const client = await getClient();
  const res = await client.api.group.create.$post({
    json: {
      groupName: "プレビューグループ",
    },
  });
  const body = await res.json();
  return body.created;
};
/**
 * プレビュー用のグループを作成し、記事を投稿する非同期関数
 */
export default async function createPreviewGroup() {
  const previewGroup = await createGroup();
  if (!previewGroup?.groupId) {
    return;
  }
  const client = await getClient();
  for (const article of previewArticles) {
    await client.api.article.$post({
      json: {
        groupId: previewGroup?.groupId,
        title: article.title,
        content: article.content,
      },
    });
  }
  redirect("/home");
}
