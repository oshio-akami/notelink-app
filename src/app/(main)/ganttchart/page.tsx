

import client from "@/libs/hono"

export default async function GanttChart(){
  const res=await client.api.posts.name.$get({
    json:{
      name:"name",
    }
  });
  const data=await res.json();
  return(
    <>
      <p>{data[0].name}</p>
      <div>GanttChart</div>
    </>
  )
}