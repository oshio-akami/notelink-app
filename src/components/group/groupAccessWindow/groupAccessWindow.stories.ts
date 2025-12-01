import type { Meta, StoryObj } from "@storybook/react";
import GroupAccessWindow from "./groupAccessWindow";
import { within } from "@storybook/testing-library";

const meta: Meta<typeof GroupAccessWindow> = {
  title: "Group/GroupAccessWindow",
  component: GroupAccessWindow,
  tags: ["autodocs"],
} satisfies Meta<typeof GroupAccessWindow>;

export default meta;

type Story = StoryObj<typeof GroupAccessWindow>;

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
