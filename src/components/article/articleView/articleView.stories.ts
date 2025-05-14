import type { Meta, StoryObj } from "@storybook/react";
import ArticleView from "./ArticleView";
import { Article } from "@/utils/types/articleType";

const sampleArticles: Article[] = [
  {
    userProfiles: {
      userId: "1",
      displayName: "Alice",
      image: "https://via.placeholder.com/40",
    },
    title: "First Article",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec justo eget dolor pretium tempor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
    image: null,
    createdAt: "2023-10-10T12:00:00Z",
  },
  {
    userProfiles: {
      userId: "2",
      displayName: "Bob",
      image: "https://via.placeholder.com/40",
    },
    title: "Second Article",
    content:
      "Quisque ac sapien in erat gravida laoreet. Curabitur nec malesuada sapien. Vivamus vel magna vel elit convallis dignissim. Integer ac purus fringilla, malesuada nulla vitae, scelerisque mi. Sed in elit quam.",
    image: null,
    createdAt: "2023-10-11T12:00:00Z",
  },
  {
    userProfiles: {
      userId: "3",
      displayName: "Bob",
      image: "https://via.placeholder.com/40",
    },
    title: "Second Article",
    content:
      "Aenean at faucibus augue. Curabitur nec risus id diam feugiat porttitor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse a fermentum arcu. Nullam sed congue ante.",
    image: null,
    createdAt: "2023-10-11T12:00:00Z",
  },
  {
    userProfiles: {
      userId: "4",
      displayName: "Charlie",
      image: "https://via.placeholder.com/40",
    },
    title: "Third Article",
    content:
      "Phasellus sed leo feugiat, porta libero vitae, bibendum sapien. Vivamus condimentum sapien sed nisi finibus convallis. Ut sit amet libero sed nisl cursus mattis. Sed nec efficitur lorem, nec congue tortor. Nam nec ante vitae arcu gravida ultrices.",
    image: "https://via.placeholder.com/600x300",
    createdAt: "2023-10-12T15:30:00Z",
  },
  {
    userProfiles: {
      userId: "5",
      displayName: "Diana",
      image: "https://via.placeholder.com/40",
    },
    title: "Fourth Article",
    content:
      "Donec quis nunc nec ligula congue lacinia. Sed vehicula mi eget tortor congue, ut lacinia nisi vestibulum. Integer at turpis sed orci tempor pretium in nec metus. Nulla facilisi. Integer fermentum erat et mauris imperdiet.",
    image: null,
    createdAt: "2023-10-13T09:45:00Z",
  },
];

const meta: Meta<typeof ArticleView> = {
  title: "Article/ArticleView",
  component: ArticleView,
  tags: ["autodocs"],
  args: {
    articles: sampleArticles,
  },
};

export default meta;
export const Default: StoryObj<typeof ArticleView> = {};
