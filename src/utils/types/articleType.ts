export type Article = {
  userProfiles: {
    userId: string;
    displayName: string;
    image: string | null;
  };
  id: string;
  title: string;
  content: string | null;
  image: string | null;
  createdAt: string;
  isBookmark: boolean;
};
