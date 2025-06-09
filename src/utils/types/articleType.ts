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
