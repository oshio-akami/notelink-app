import PostForm from "@/components/article/postForm/postForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Post({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <PostForm groupId={id} />
    </>
  );
}
