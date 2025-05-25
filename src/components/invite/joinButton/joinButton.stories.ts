import { createMock } from "storybook-addon-module-mock";
import * as joinInviteModule from "@/actions/group/joinInviteGroup";
import JoinButton from "./joinButton";
import type { Meta, StoryObj } from "@storybook/react";

// joinInviteGroup をモックする
const mockModule = createMock(joinInviteModule, "default");

const meta: Meta<typeof JoinButton> = {
  title: "Invite/JoinButton",
  component: JoinButton,
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof JoinButton> = {
  args: {
    inviteToken: "dummy-token-abc123",
  },
  parameters: {
    moduleMock: {
      mock: () => {
        mockModule.mockImplementation(async (token: string) => {
          console.log("Mock joinInviteGroup called with:", token);
          return "success";
        });
      },
    },
  },
};
