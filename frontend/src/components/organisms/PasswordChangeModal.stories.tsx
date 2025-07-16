import type { Meta, StoryObj } from '@storybook/nextjs';
import PasswordChangeModal from './PasswordChangeModal';

const meta: Meta<typeof PasswordChangeModal> = {
  title: 'Organisms/PasswordChangeModal',
  component: PasswordChangeModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'onClose' },
    onSuccess: { action: 'onSuccess' },
    onError: { action: 'onError' },
  },
  args: {
    isOpen: true,
  },
};

export default meta;
type Story = StoryObj<typeof PasswordChangeModal>;

export const Default: Story = {
  args: {},
};
