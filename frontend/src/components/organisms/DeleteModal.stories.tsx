import type { Meta, StoryObj } from '@storybook/react';
import DeleteModal from './DeleteModal';

const meta: Meta<typeof DeleteModal> = {
  title: 'Organisms/DeleteModal',
  component: DeleteModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'onClose' },
    onConfirm: { action: 'onConfirm' },
    title: { control: 'text' },
    message: { control: 'text' },
    isLoading: { control: 'boolean' },
    confirmText: { control: 'text' },
    loadingText: { control: 'text' },
  },
  args: {
    isOpen: true,
  },
};

export default meta;
type Story = StoryObj<typeof DeleteModal>;

export const Default: Story = {
  args: {
    title: 'テーマの削除',
    message: 'このテーマを本当に削除しますか？\nこの操作は元に戻せません。',
    isLoading: false,
    confirmText: '削除',
    loadingText: '削除中...',
  },
};

export const ForLogout: Story = {
  args: {
    title: 'ログアウト',
    message: '本当にログアウトしますか？',
    confirmText: 'ログアウト',
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};
