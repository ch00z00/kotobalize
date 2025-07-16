import type { Meta, StoryObj } from '@storybook/nextjs';
import Header from './Header';

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type HeaderProps = {
  user?: User | null;
};

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<HeaderProps>;

export const LoggedOut: Story = {
  args: {
    user: null,
  },
};

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'テストユーザー',
      image: 'https://via.placeholder.com/40',
    },
  },
};
