import LeaveGroupModal from "./leaveGroupModal";
import type { Meta, StoryObj, Decorator } from "@storybook/react";
import { GroupContextProvider } from "@/libs/context/groupContext/groupContextProvider";

const groupContext: Decorator = (Story) => (
  <GroupContextProvider groupId="test id" groupName="test name">
    <Story />
  </GroupContextProvider>
);

const meta: Meta<typeof LeaveGroupModal> = {
  title: "Group/LeaveGroupButton",
  component: LeaveGroupModal,
  decorators: [groupContext],
  tags: ["autodocs"],
  args: {
    opened: true,
  },
};

export default meta;

export const Default: StoryObj<typeof LeaveGroupModal> = {};
