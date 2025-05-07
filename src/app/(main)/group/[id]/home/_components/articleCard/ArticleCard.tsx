"use client"

import { Card, Text,Avatar, Flex } from "@mantine/core";
import styles from "./articleCard.module.css"
import ArticleButton from "../articleButton/ArticleButton";

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
  if(!article){
    return(<></>)
  }
  return(
    <Card withBorder className={styles.card}>
      <div className={styles.header}>
        <Flex align="center">
          <Avatar src={article.userProfiles.image}></Avatar>
          <Text fw={700}>{article.userProfiles.displayName}</Text>
        </Flex>
        <Text>{date(article.createdAt)}</Text>
      </div>
      <div className={styles.contents}>
        <Text >{article.title}</Text>
        <Text >{article.content}</Text>
        <ArticleButton />
      </div>
      
    </Card>
  )
}