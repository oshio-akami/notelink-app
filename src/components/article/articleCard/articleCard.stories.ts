import type { Meta, StoryObj } from "@storybook/react";
import ArticleCard from "./articleCard";

const meta: Meta<typeof ArticleCard> = {
  title: "Article/ArticleCard",
  component: ArticleCard,
  tags: ["autodocs"],
  args: {
    article: {
      userProfiles: {
        userId: "1",
        displayName: "Alice",
        image: "https://via.placeholder.com/40",
      },
      id: "test",
      title: "First Article",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec justo eget dolor pretium tempor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
      image: null,
      createdAt: "2023-10-10T12:00:00Z",
      isBookmark: false,
    },
  },
};

export default meta;
export const Default: StoryObj<typeof ArticleCard> = {};
