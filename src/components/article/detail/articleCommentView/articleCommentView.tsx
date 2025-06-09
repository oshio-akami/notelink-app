"use client";

import { Textarea, Avatar, Button } from "@mantine/core";
import styles from "./articleCommentView.module.scss";
import { useGroupId } from "@/libs/context/groupContext/groupContext";
import Loading from "@/components/shared/loading/loading";
import { useState } from "react";
import { useArticleComment } from "@/libs/hooks/comment";
import ArticleCommentCard from "../articleCommentCard/articleCommentCard";
import { useProfile } from "@/libs/hooks/user";

import { CommentContext } from "@/libs/context/commentContext/commentContext";

type Props = {
  articleId: string;
  articlePostUserId: string;
};

/**コメント一覧を表示するコンポーネント */
export default function ArticleCommentView({
  articleId,
  articlePostUserId,
}: Props) {
  const groupId = useGroupId() ?? "";
  const { profile, isRoleAdmin, isLoading } = useProfile(groupId);
  const [comment, setComment] = useState("");
  const { comments, handleDeleteComment, handlePostComment } =
    useArticleComment(groupId, articleId);
  /**コメント一覧をコメントカードコンポーネントに変換 */
  const commentElements = () => {
    if (comments === undefined) {
      return <Loading />;
    }
    return comments.map((comment) => (
      <ArticleCommentCard
        key={comment.id}
        id={comment.id}
        hasDeletePermission={
          isRoleAdmin ||
          comment.userId === profile?.userId ||
          articlePostUserId === profile?.userId
        }
        displayName={comment.userProfiles.displayName}
        avatar={comment.userProfiles.image ?? ""}
        createdAt={comment.createdAt}
        content={comment.content ?? ""}
      />
    ));
  };
  return (
    <>
      <CommentContext.Provider
        value={{ groupId, articleId, handleDeleteComment }}
      >
        <div className={styles.comment} id="comment">
          <Avatar className={styles.avatar} src={profile?.image} />

          <Textarea
            className={styles.textarea}
            classNames={{ input: styles.input }}
            placeholder="コメントをする..."
            autosize
            minRows={1}
            maxRows={20}
            variant="unstyled"
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
          />
          <Button
            onClick={() => {
              handlePostComment(
                {
                  userId: profile!.userId,
                  displayName: profile!.displayName,
                  image: profile!.image ?? "",
                },
                comment
              );
              setComment("");
            }}
            disabled={isLoading || comment === ""}
          >
            送信
          </Button>
        </div>
        <div className={styles.comments}>{commentElements()}</div>
      </CommentContext.Provider>
    </>
  );
}
