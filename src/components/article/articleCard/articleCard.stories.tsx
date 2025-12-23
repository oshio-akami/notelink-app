import type { Meta, StoryObj, Decorator } from "@storybook/react";
import ArticleCard from "./articleCard";
import { ArticleActionsContext } from "@/libs/context/articleContext/articleActionsContext";
import { GroupContextProvider } from "@/libs/context/groupContext/groupContextProvider";

const withArticleActions: Decorator = (Story) => (
  <GroupContextProvider groupId="test id" groupName="test name">
    <ArticleActionsContext.Provider
      value={{
        handleDeleteArticle: (articleId: string) => {
          console.log("delete", articleId);
        },
        onBookmarkChange: (articleId: string, bookmarked: boolean) => {
          console.log("bookmark", articleId, bookmarked);
        },
      }}
    >
      <Story />
    </ArticleActionsContext.Provider>
  </GroupContextProvider>
);

const meta: Meta<typeof ArticleCard> = {
  title: "Article/ArticleCard",
  component: ArticleCard,
  decorators: [withArticleActions],
  args: {
    article: {
      userProfiles: {
        userId: "1",
        displayName: "Alice",
        image: "https://via.placeholder.com/40",
      },
      id: "test",
      title: "First Article",
      content: "Test Content",
      image: "",
      createdAt: "2023-10-10T12:00:00Z",
      isBookmark: false,
      commentCount: 0,
    },
  },
};

export default meta;
export const Default: StoryObj<typeof ArticleCard> = {};
