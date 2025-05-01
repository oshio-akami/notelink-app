import ArticleCard from "../articleCard/ArticleCard";
import styles from "./articleView.module.css"

type Props={
  articles:{
    userProfiles: {
      userId: string;
      displayName: string;
      image: string | null;
    };
    title: string;
    content: string | null;
    image: string | null;
    createdAt: string;
  }[] | null
}

export default function ArticleView({articles}:Props){
  const articleElements=articles?.map((article)=>{
    return <ArticleCard key={article.createdAt} article={article}/>;
  })
  return(
    <div className={styles.articles}>
      {articleElements}
    </div>
  )
}