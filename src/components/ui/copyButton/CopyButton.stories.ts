import type { Meta ,StoryObj } from '@storybook/react';
import CopyButton from './CopyButton';

const meta = {
  title: 'CopyButtonButton',
  component: CopyButton,
  argTypes: {
    text: { control: 'text' },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;

type Story=StoryObj<typeof CopyButton>;
export const Default:Story={
  args:{
    text:"コピーするテキスト"
  },
}