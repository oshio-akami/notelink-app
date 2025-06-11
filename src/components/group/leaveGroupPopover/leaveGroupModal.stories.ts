import LeaveGroupModal from "./leaveGroupModal";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof LeaveGroupModal> = {
  title: "Group/LeaveGroupButton",
  component: LeaveGroupModal,
  tags: ["autodocs"], // Autodocsを有効化
};

export default meta;

export const Default: StoryObj<typeof LeaveGroupModal> = {};
