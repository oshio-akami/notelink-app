import type { Meta, StoryObj } from "@storybook/react";
import GroupCard from "./groupCard";

const meta: Meta<typeof GroupCard> = {
  title: "Group/GroupCard",
  component: GroupCard,
  argTypes: {
    groupName: { control: "text" },
    groupId: { control: "text" },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GroupCard>;

export const Default: Story = {
  args: {
    groupName: "Example Group",
    groupId: "12345",
  },
};
