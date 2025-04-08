
import client from "@/libs/hono";
import GroupCard from "./_components/groupCard/GroupCard";
import { auth } from "@/auth";
import styles from "./page.module.css"

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
   console.log(body);
   const groupCards=body.map((c)=>{
    return <GroupCard key={c.groupId} groupName={c.groupName} />;
   })
  return(
    <>
      <p>テスト 参加しているグループ一覧</p>
      <div className={styles.groups}>
        {groupCards}
      </div>
        <div>DashBoard</div>

    </>
  )
}