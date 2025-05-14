import { createMock } from "storybook-addon-module-mock";
import * as createPreviewGroupModule from "@/actions/group/createPreviewGroup";
import { LoginForm } from "./loginForm";
import type { Meta, StoryObj } from "@storybook/react";

const mockModule = createMock(createPreviewGroupModule, "default");

const mockCreatePreviewGroup = mockModule.mockImplementation(async () => {
  console.log("Mock createPreviewGroup");
});

const meta: Meta<typeof LoginForm> = {
  title: "Auth/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  parameters: {
    moduleMock: {
      mocks: {
        "@/actions/group/createPreviewGroup": {
          default: mockCreatePreviewGroup,
        },
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof LoginForm> = {};
