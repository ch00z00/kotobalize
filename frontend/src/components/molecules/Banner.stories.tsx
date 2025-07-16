import type { Meta, StoryObj } from '@storybook/nextjs';
import Banner from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'Molecules/Banner',
  component: Banner,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    type: { control: 'radio', options: ['success', 'error'] },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Success: Story = {
  args: {
    message: '操作は正常に完了しました。',
    type: 'success',
  },
};

export const Error: Story = {
  args: {
    message: 'エラーが発生しました。もう一度お試しください。',
    type: 'error',
  },
};
