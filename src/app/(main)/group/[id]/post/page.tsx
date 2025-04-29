import PostForm from "./_component/postForm/PostForm";

type Props={
  params:Promise<{id:string}>,
}

export default async function Post({params}:Props){
  const {id}=await params;
  return(
    <PostForm groupId={id} />
  )
}