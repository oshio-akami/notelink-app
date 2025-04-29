"use client";

import styles from "./postForm.module.css"
import {
  TextInput,
  Button,
  Textarea,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { useActionState, useEffect } from "react";
import { postArticle } from "@/actions/article/articleActions";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useDisclosure } from "@mantine/hooks";
import { PostFormSchema } from "@/utils/types/formSchema";


const errorElements=(errors:string[])=>{
  return errors.map((error)=>{
    return <p key={error} className={styles.error}>{error}</p>;
  })
}

type Props = {
  groupId:string
};

export default function PostForm({groupId}:Props) {
  const [, formAction, isPending] = useActionState(
    postArticle,
    undefined
  );
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostFormSchema });
    },
    shouldValidate: "onBlur",
    onSubmit:()=>open(),
  });
  const [visible, { open,close }] = useDisclosure(false);
  useEffect(()=>{
    if(!isPending){
      close();
    }
  },[isPending,close]);
  return (
    <>
    
    <form {...getFormProps(form)} className={styles.form} action={formAction}>
      <Box pos="relative" >
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }}/>
        <h1 className={styles.title}>投稿</h1>
        <TextInput type="hidden"
          name={fields.groupId.name}
          value={groupId} 
        />
        <label >タイトル</label>
        <TextInput
          name={fields.title.name}
        />
        {fields.title.errors&&errorElements(fields.title.errors)}
        <label >内容</label>
        <Textarea mb={30} 
          name={fields.content.name}
        />
        {fields.content.errors&&errorElements(fields.content.errors)}
      </Box>
      <Button className={styles.button} type="submit">
        {isPending ? "投稿中..." : "投稿する"}
      </Button>
    </form>
    </>
  );
}
