import { createMock } from "storybook-addon-module-mock";
import * as signOutModule from "@/actions/user/signOut";
import { ProfileWindow } from "./profileWindow";
import type { Meta, StoryObj } from "@storybook/react";

const mockModule = createMock(signOutModule, "default");

const meta: Meta<typeof ProfileWindow> = {
  title: "User/ProfileWindow",
  component: ProfileWindow,
  tags: ["autodocs"],
  args: {
    name: "John Doe",
    about: "Software Developer",
    icon: "https://via.placeholder.com/40",
    children: <button>プロフィールを開く</button>,
  },
};

export default meta;
export const Default: StoryObj<typeof ProfileWindow> = {
  parameters: {
    moduleMock: {
      mock: () => {
        mockModule.mockImplementation(async () => {
          console.log("signOut");
        });
      },
    },
  },
};
