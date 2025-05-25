import type { Meta, StoryObj } from "@storybook/react";
import JoinGroupForm from "./joinGroupForm";

const meta: Meta<typeof JoinGroupForm> = {
  title: "Group/JoinGroupForm",
  component: JoinGroupForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof JoinGroupForm>;

export const Default: Story = {};
