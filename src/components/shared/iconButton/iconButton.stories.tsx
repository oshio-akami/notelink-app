import type { Meta, StoryObj } from "@storybook/react";
import IconButton from "./iconButton";
import { IconBookmark, IconThumbUp } from "@tabler/icons-react";

const meta: Meta<typeof IconButton> = {
  title: "Shared/IconButton",
  component: IconButton,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const BookMark: Story = {
  args: {
    icon: <IconBookmark />,
  },
};

export const GoodMark: Story = {
  args: {
    icon: <IconThumbUp />,
  },
};
