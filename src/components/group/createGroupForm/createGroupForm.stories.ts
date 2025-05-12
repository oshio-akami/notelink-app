import { createMock } from "storybook-addon-module-mock";
import * as createGroupModule from "@/actions/group/createGroup";
import CreateGroupForm from "./createGroupForm";
import type { Meta, StoryObj } from "@storybook/react";

const mockModule = createMock(createGroupModule, "createGroup");

const mockCreateGroup = mockModule.mockImplementation(async (_, formData) => {
  console.log(formData);
  return { success: true };
});

const meta: Meta<typeof CreateGroupForm> = {
  title: "Group/CreateGroupForm",
  component: CreateGroupForm,
  tags: ["autodocs"],
  parameters: {
    moduleMock: {
      mock: () => mockCreateGroup,
    },
  },
};

export default meta;

export const Default: StoryObj<typeof CreateGroupForm> = {
  args: {
    onPendingChange: (pending: boolean) => console.log("pending:", pending),
  },
};
