"use client"

import { Accordion, Card, Text,Avatar, Flex, Button } from "@mantine/core";
import styles from "./articleCard.module.css"
import ArticleButton from "../articleButton/ArticleButton";
import { useSession } from "next-auth/react";

type Props={
  article:{
    userProfiles: {
      userId: string;
      displayName: string;
      image: string | null;
    };
    title: string;
    content: string | null;
    image: string | null;
    createdAt: string;
  }| null,
}

const date=(dateString:string)=> {
  const date=new Date(dateString)
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; 
  const rtf = new Intl.RelativeTimeFormat('ja', { numeric: 'auto' });
  const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  if (diff < 60) {
    return rtf.format(-Math.floor(diff), 'seconds');
  } else if (diff < 3600) {
    return rtf.format(-Math.floor(diff / 60), 'minutes');
  } else if (diff < 86400) {
    return rtf.format(-Math.floor(diff / 3600), 'hours'); 
  } else if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日${hours}:${minutes}`;
  } else {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
}

export default function ArticleCard({article}:Props){
  const {data}=useSession();
  if(!article){
    return(<></>)
  }
  return(
    <Card withBorder className={styles.card}>
      <div className={styles.header}>
        <Flex align="center">
          <Avatar src={article.userProfiles.image}></Avatar>
          <Text>{article.userProfiles.displayName}</Text>
        </Flex>
        <Flex gap={20} align="center">
          <Text>投稿時間：{date(article.createdAt)}</Text>
          {data?.user?.id===article.userProfiles.userId&&<Button color="red">削除する</Button>}
        </Flex>
      </div>
      <div className={styles.title}>
        <Text fw={500} size="1.5rem">{article.title}</Text>
      </div>
      <Accordion>
      </Accordion>
      <Text className={styles.content}>{article.content}</Text>
      <ArticleButton />
      
    </Card>
  )
}