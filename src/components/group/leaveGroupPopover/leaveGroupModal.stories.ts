import { createMock } from "storybook-addon-module-mock";
import * as leaveGroupModule from "@/actions/group/leaveGroup";
import LeaveGroupModal from "./leaveGroupModal";
import type { Meta, StoryObj } from "@storybook/react";

const mockModule = createMock(leaveGroupModule, "default");

const meta: Meta<typeof LeaveGroupModal> = {
  title: "Group/LeaveGroupButton",
  component: LeaveGroupModal,
  tags: ["autodocs"], // Autodocsを有効化
  args: {
    groupId: "mock-group-id",
  },
};

export default meta;

export const Default: StoryObj<typeof LeaveGroupModal> = {
  parameters: {
    moduleMock: {
      mock: () => {
        mockModule.mockImplementation(async (groupId) => {
          console.log(`Mock leaveGroup called with groupId: ${groupId}`);
          return true;
        });
      },
    },
  },
};
