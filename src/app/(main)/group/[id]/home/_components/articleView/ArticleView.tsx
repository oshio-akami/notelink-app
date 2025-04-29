import ArticleCard from "../articleCard/ArticleCard";


type Props={
  articles:{
    title: string,
    content:string|null,
    image: string | null,
    createdAt: string,
  }[]|null,
}

export default function ArticleView({articles}:Props){
  const articleElements=articles?.map((article)=>{
    return <ArticleCard key={article.createdAt} article={article}/>;
  })
  return(
    <>
      {articleElements}
    </>
  )
}