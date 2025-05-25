import type { Meta, StoryObj } from "@storybook/react";
import RichTextEditor from "./richTextEditor";

const meta: Meta<typeof RichTextEditor> = {
  title: "Editor/RichTextEditor",
  tags: ["autodocs"],
  component: RichTextEditor,
  argTypes: {
    onChange: { action: "onChange" },
  },
};

export default meta;

type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  args: {
    onChange: (html: string) => {
      console.log("更新:", html);
    },
  },
};
