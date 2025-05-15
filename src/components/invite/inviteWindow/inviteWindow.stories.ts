import type { Meta, StoryObj } from "@storybook/react";
import InviteWindow from "./inviteWindow";

const meta: Meta<typeof InviteWindow> = {
  title: "Invite/InviteWindow",
  component: InviteWindow,
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof InviteWindow> = {
  args: {
    groupName: "サンプルグループ",
    inviteToken: "abc123",
  },
};
