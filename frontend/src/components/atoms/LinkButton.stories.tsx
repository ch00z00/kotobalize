import type { Meta, StoryObj } from '@storybook/react';
import LinkButton from './LinkButton';

const meta: Meta<typeof LinkButton> = {
  title: 'Atoms/LinkButton',
  component: LinkButton,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
    },
    href: { control: 'text' },
  },
  args: {
    href: '#',
  },
};

export default meta;
type Story = StoryObj<typeof LinkButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Link',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Link',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Link',
  },
};
