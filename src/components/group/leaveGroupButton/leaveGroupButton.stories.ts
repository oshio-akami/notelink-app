import { createMock } from "storybook-addon-module-mock";
import * as leaveGroupModule from "@/actions/group/leaveGroup";
import LeaveGroupButton from "./leaveGroupButton";
import type { Meta, StoryObj } from "@storybook/react";

const mockModule = createMock(leaveGroupModule, "default");

const meta: Meta<typeof LeaveGroupButton> = {
  title: "Group/LeaveGroupButton",
  component: LeaveGroupButton,
  tags: ["autodocs"], // Autodocsを有効化
  args: {
    groupId: "mock-group-id",
  },
};

export default meta;

export const Default: StoryObj<typeof LeaveGroupButton> = {
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
