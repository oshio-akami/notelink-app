import { createMock } from "storybook-addon-module-mock";
import * as createGroupModule from "@/actions/group/createGroup";
import CreateGroupForm from "./createGroupForm";
import type { Meta, StoryObj } from "@storybook/react";

const mockModule = createMock(createGroupModule, "createGroup");

const meta: Meta<typeof CreateGroupForm> = {
  title: "Group/CreateGroupForm",
  component: CreateGroupForm,
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof CreateGroupForm> = {
  args: {
    onPendingChange: (pending: boolean) => console.log("pending:", pending),
  },
  parameters: {
    moduleMock: {
      mock: () => {
        mockModule.mockImplementation(async (_, formData) => {
          console.log(formData);
          return { success: true };
        });
      },
    },
  },
};
