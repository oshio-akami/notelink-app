import { Card, Text } from "@mantine/core";

type Props={
  article:{
    title: string,
    content:string|null,
    image: string | null,
    createdAt: string,
  }|null,
}

export default function ArticleCard({article}:Props){
  return(
    <div>
      <Card withBorder>
        <Text fw={500} size="1.5rem">{article?.title}</Text>
        <Text>内容：{article?.content}</Text>
        <Text>作成日：{article?.createdAt}</Text>
      </Card>
    </div>
  )
}