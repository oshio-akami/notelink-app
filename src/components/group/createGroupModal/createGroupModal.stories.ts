import type { Meta, StoryObj } from "@storybook/react";
import CreateGroupModal from "./createGroupModal";
import { within } from "@storybook/testing-library";

const meta: Meta<typeof CreateGroupModal> = {
  title: "Group/CreateGroupModal",
  component: CreateGroupModal,
  tags: ["autodocs"],
} satisfies Meta<typeof CreateGroupModal>;

export default meta;

type Story = StoryObj<typeof CreateGroupModal>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.getByRole("button", {
      name: "グループの作成・参加",
    });
    button.click();
  },
};
