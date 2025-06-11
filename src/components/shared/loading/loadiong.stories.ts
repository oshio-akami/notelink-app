import type { Meta, StoryObj } from "@storybook/react";
import Loading from "./loading";

const meta: Meta<typeof Loading> = {
  title: "Shared/Loading",
  component: Loading,
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text" },
    size: { control: "text" },
    type: {
      control: "radio",
      options: ["default", "wave"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  args: {
    text: "読み込み中...",
    size: "1rem",
    type: "default",
  },
};

export const Wave: Story = {
  args: {
    text: "読み込み中...",
    size: "1rem",
    type: "wave",
  },
};
