"use client";

import styles from "./postForm.module.scss";
import { TextInput, Button, LoadingOverlay, Box } from "@mantine/core";
import { useActionState, useEffect, useRef, useState } from "react";
import { postArticle } from "@/actions/article/articleActions";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useDisclosure } from "@mantine/hooks";
import { PostFormSchema } from "@/utils/types/formSchema";
import RichTextEditor from "@/components/editor/richTextEditor/richTextEditor";
import { blobToUploadUrl } from "@/libs/htmlUtils";

const errorElements = (errors: string[]) => {
  return errors.map((error) => {
    return (
      <p key={error} className={styles.error}>
        {error}
      </p>
    );
  });
};

type Props = {
  groupId: string;
};

export default function PostForm({ groupId }: Props) {
  const upload = async (_: unknown, formData: FormData) => {
    const content = formData.get("content");
    const replaceContent = await blobToUploadUrl(content as string);
    formData.set("content", replaceContent);
    await postArticle(_, formData);
  };
  const [content, setContent] = useState("");
  const blobToFileRef = useRef<Map<string, File>>(new Map());
  const [, formAction, isPending] = useActionState(upload, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostFormSchema });
    },
    shouldValidate: "onBlur",
    onSubmit: () => {
      open();
    },
  });
  const [visible, { open, close }] = useDisclosure(false);
  useEffect(() => {
    if (!isPending) {
      close();
    }
  }, [isPending, close]);
  return (
    <div>
      <form {...getFormProps(form)} className={styles.form} action={formAction}>
        <Box pos="relative">
          <LoadingOverlay
            visible={visible}
            zIndex={10}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <div className={styles.formContents}>
            <TextInput
              type="hidden"
              name={fields.groupId.name}
              value={groupId}
            />
            <div>
              <TextInput name={fields.title.name} placeholder="タイトル" />
              {fields.title.errors && errorElements(fields.title.errors)}
            </div>
            <div>
              <RichTextEditor
                onChange={(html, blobToFile) => {
                  setContent(html);
                  blobToFileRef.current = new Map(blobToFile);
                }}
                width="100%"
                minHeight="400px"
              />
              <TextInput
                type="hidden"
                name={fields.content.name}
                value={content}
              ></TextInput>
              {fields.content.errors && errorElements(fields.content.errors)}
            </div>
          </div>
        </Box>
        <Button className={styles.button} type="submit">
          {isPending ? "投稿中..." : "投稿する"}
        </Button>
      </form>
    </div>
  );
}
