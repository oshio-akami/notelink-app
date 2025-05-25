import InviteInfo from "./InviteInfo";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof InviteInfo> = {
  title: "Invite/InviteInfo",
  component: InviteInfo,
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof InviteInfo> = {
  args: {
    inviteToken: "sample-token-123456",
  },
};
