import type { Meta, StoryObj } from "@storybook/react";
import GroupMenu from "./switchGroupMenu";

// モック（サンプル）のグループデータ
const groupsMock = [
  { groupId: "1", groupName: "グループ 1" },
  { groupId: "2", groupName: "グループ 2" },
  { groupId: "3", groupName: "サンプル 3" },
];

const meta: Meta<typeof GroupMenu> = {
  title: "Menu/GroupMenu",
  tags: ["autodocs"],
  component: GroupMenu,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default: StoryObj<typeof GroupMenu> = {
  args: {
    groups: groupsMock,
  },
};
