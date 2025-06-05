"use client";

import { Textarea, Avatar, Button, TextInput } from "@mantine/core";
import styles from "./articleCommentView.module.scss";
import { useGroupId } from "@/libs/context/groupContext/groupContext";
import Loading from "@/components/shared/loading/loading";
import { postComment } from "@/actions/article/articleActions";
import { useActionState, useEffect } from "react";
import { useForm, getFormProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { postCommentSchema } from "@/utils/types/formSchema";
import { useArticleComments } from "@/libs/hooks/comment";
import ArticleCommentCard from "../articleCommentCard/articleCommentCard";
import { useProfile } from "@/libs/hooks/user";
import { deleteComment } from "@/actions/article/articleActions";
import { CommentContext } from "@/libs/context/commentContext/commentContext";

type Props = {
  articleId: string;
};

/**コメント一覧を表示するコンポーネント */
export default function ArticleCommentView({ articleId }: Props) {
  const groupId = useGroupId() ?? "";
  const { profile } = useProfile();
  const { comments, mutate } = useArticleComments(groupId, articleId);
  const [actionResult, formAction, isPending] = useActionState(
    postComment,
    undefined
  );
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: postCommentSchema });
    },
    shouldValidate: "onBlur",
  });
  const handleDeleteComment = async (commentId: string) => {
    mutate(
      (prev) => prev?.filter((comment) => comment.id !== commentId), // 即座に画面更新
      false
    );
    try {
      await deleteComment(commentId, groupId);
    } catch {
      mutate();
    }
  };
  const commentElements = () => {
    if (comments === undefined) {
      return <Loading />;
    }
    return comments.map((comment) => (
      <ArticleCommentCard
        key={comment.id}
        id={comment.id}
        displayName={comment.userProfiles.displayName}
        avatar={comment.userProfiles.image ?? ""}
        createdAt={comment.createdAt}
        content={comment.content ?? ""}
      />
    ));
  };
  useEffect(() => {
    if (actionResult?.status === "success") {
      mutate();
    }
  }, [actionResult, mutate]);
  return (
    <>
      <CommentContext.Provider
        value={{ groupId, articleId, handleDeleteComment }}
      >
        <form {...getFormProps(form)} action={formAction}>
          <div className={styles.comment}>
            <Avatar className={styles.avatar} src={profile?.image} />

            <Textarea
              name={fields.comment.name}
              className={styles.textarea}
              classNames={{ input: styles.input }}
              disabled={isPending}
              placeholder="コメントをする..."
              autosize
              minRows={1}
              maxRows={20}
              variant="unstyled"
            />
            <TextInput
              type="hidden"
              name={fields.groupId.name}
              value={groupId}
            />
            <TextInput
              type="hidden"
              name={fields.articleId.name}
              value={articleId}
            />
            <Button
              type="submit"
              disabled={
                isPending ||
                !fields.comment.value ||
                fields.comment.value === ""
              }
            >
              送信
            </Button>
          </div>
        </form>
        <div className={styles.comments}>{commentElements()}</div>
      </CommentContext.Provider>
    </>
  );
}
