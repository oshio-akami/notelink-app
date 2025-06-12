import type { Meta, StoryObj } from "@storybook/react";
import GroupAccessModal from "./groupAccessModal";
import { within } from "@storybook/testing-library";

const meta: Meta<typeof GroupAccessModal> = {
  title: "Group/GroupAccessModal",
  component: GroupAccessModal,
  tags: ["autodocs"],
} satisfies Meta<typeof GroupAccessModal>;

export default meta;

type Story = StoryObj<typeof GroupAccessModal>;

export const Default: Story = {
  args: {
    opened: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.getByRole("button", {
      name: "グループの作成・参加",
    });
    button.click();
  },
};
