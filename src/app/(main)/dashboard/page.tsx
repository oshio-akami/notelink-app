
import client from "@/libs/hono";
import GroupCard from "@/components/ui/groupCard/GroupCard";
import { auth } from "@/auth";
import styles from "./page.module.css"
import { Grid,GridCol } from "@mantine/core";

export default async function Groups(){
  const session=await auth();
  if(!session?.user.id){
    return <></>;
  }
  const groups=await client.api.posts.getGroups.$post({
    json:{
      userId:session?.user.id,
   }
  })
   const body=await groups.json();
   const groupCards=body.map((c)=>{
    return <GridCol key={c.groupId} span={{base:12,md:6,lg:3}}><GroupCard groupName={c.groupName} /></GridCol>;
   })
  return(
    <>
      <p>テスト 参加しているグループ一覧</p>
      <Grid className={styles.groups}>
        {groupCards}
      </Grid>
        <div>DashBoard</div>

    </>
  )
}