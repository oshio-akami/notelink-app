import type { Meta, StoryObj } from "@storybook/react";
import PostForm from "./postForm";

const meta: Meta<typeof PostForm> = {
  title: "Article/PostForm",
  component: PostForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PostForm>;

export const Default: Story = {
  args: {
    groupId: "sample-group-id",
  },
};
