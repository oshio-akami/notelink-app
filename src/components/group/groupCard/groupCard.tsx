"use client"

import { Card, CardSection, Image ,Text} from "@mantine/core"
import styles from "./groupCard.module.css"
import setCurrentGroup from "@/actions/user/setCurrentGroup"

type Props={
  groupName:string,
  groupId:string,
}

export default function GroupCard({groupName,groupId}:Props){
  return(
    <Card onClick={()=>{setCurrentGroup(groupId)}} className={styles.card} shadow="sm" padding="lg" radius="md" withBorder>
      <CardSection>
        <Image src="https://placecats.com/300/200" height={160} alt="nya-" />
      </CardSection>
      <Text fw={500}>{groupName}</Text>
      <Text size="sm">description</Text>
    </Card>
  )
}