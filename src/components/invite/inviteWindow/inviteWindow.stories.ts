import type { Meta, StoryObj } from "@storybook/react";
import InviteWindow from "./inviteWindow";
import { UserProfile } from "@/utils/types/profileType";

const meta: Meta<typeof InviteWindow> = {
  title: "Invite/InviteWindow",
  component: InviteWindow,
  parameters: {
    docs: {
      description: {
        component:
          "InviteWindow コンポーネントは、グループへの招待情報を表示します。グループ名、参加人数の表示、メンバーのアバターリスト、そして参加用のボタンが含まれます。",
      },
    },
  },
  argTypes: {
    groupName: {
      description: "招待されているグループの名称",
      control: { type: "text" },
    },
    inviteToken: {
      description: "グループに参加するための一意のトークン",
      control: { type: "text" },
    },
    members: {
      description: "グループのメンバー情報の配列（UserProfile型）",
      control: { type: "object" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InviteWindow>;

const sampleMembers: UserProfile[] = [
  {
    userId: "1",
    displayName: "Alice",
    image: "https://via.placeholder.com/40",
    role: "member",
  },
  {
    userId: "2",
    displayName: "Bob",
    image: "https://via.placeholder.com/40",
    role: "member",
  },
  {
    userId: "3",
    displayName: "Charlie",
    image: "https://via.placeholder.com/40",
    role: "member",
  },
  {
    userId: "4",
    displayName: "Diana",
    image: "https://via.placeholder.com/40",
    role: "member",
  },
  {
    userId: "5",
    displayName: "Evan",
    image: "https://via.placeholder.com/40",
    role: "member",
  },
  {
    userId: "6",
    displayName: "Faythe",
    image: "https://via.placeholder.com/40",
    role: "member",
  },
];

export const Default: Story = {
  args: {
    groupName: "スタディグループ",
    inviteToken: "abc-123",
    members: sampleMembers,
  },
};

export const FewMembers: Story = {
  args: {
    groupName: "ブッククラブ",
    inviteToken: "xyz-789",
    members: sampleMembers.slice(0, 3),
  },
};
