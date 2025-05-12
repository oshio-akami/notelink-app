import type { Meta, StoryObj } from "@storybook/react";
import GroupsWindow from "./groupsWindow";
import { Button } from "@mantine/core";

const meta: Meta<typeof GroupsWindow> = {
  title: "Group/GroupsWindow",
  parameters: {
    layout: "centered",
  },
  component: GroupsWindow,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GroupsWindow>;

export const Default: Story = {
  args: {
    groups: [
      { groupId: "1", groupName: "テストグループ１" },
      { groupId: "2", groupName: "テストグループ２" },
      { groupId: "3", groupName: "テストグループ３" },
      { groupId: "1", groupName: "テストグループ４" },
      { groupId: "2", groupName: "テストグループ５" },
    ],
    children: <Button>グループを見る</Button>,
  },
};
