import { Article } from "@/utils/types/articleType";
import ArticleCard from "../articleCard/articleCard";
import styles from "./articleView.module.scss";

type Props = {
  articles: Article[];
};

export default function ArticleView({ articles }: Props) {
  const articleElements = articles?.map((article) => {
    return <ArticleCard key={article.createdAt} article={article} />;
  });
  return <div className={styles.articles}>{articleElements}</div>;
}
