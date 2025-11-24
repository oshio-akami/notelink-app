/**APIから取得する記事 */
export type Article = {
  userProfiles: {
    userId: string;
    displayName: string;
    image: string;
  };
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  isBookmark: boolean;
  commentCount: number;
};

/**DBから取得後正規化した記事 */
export type DBNormalizedArticle = {
  userProfiles: {
    userId: string;
    displayName: string;
    image: string;
  };
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: Date;
  isBookmark: boolean;
  commentCount: number;
};

/**DBから取得する記事 */
export type DBArticle = {
  userProfiles: {
    userId: string;
    displayName: string;
    image: string;
  };
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: Date;
  isBookmark: string | null;
  commentCount: number;
};

/**APIから取得するコメント */
export type Comment = {
  userProfiles: {
    userId: string;
    displayName: string;
    image: string;
  };
  id: string;
  articleId: string;
  groupId: string;
  userId: string;
  createdAt: string;
  content: string;
};

/**APIから取得するブックマーク */
export type Bookmark = {
  userId: string;
  createdAt: Date;
  articleId: string;
};

/**Postするときの記事の構造 */
export type PostArticle = {
  groupId: string;
  id: string;
  image: string;
  userId: string;
  createdAt: Date;
  title: string;
  content: string;
};

/**Postするときのコメントの構造 */
export type PostComment = {
  groupId: string;
  articleId: string;
  id: string;
  userId: string;
  createdAt: Date;
  comment: string;
};
