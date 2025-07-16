import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import Modal from './Modal';
import Button from '../atoms/Button';

const meta: Meta<typeof Modal> = {
  title: 'Common/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    // Centered layout to better view the modal
    layout: 'centered',
  },
  argTypes: {
    // Controlled by the story's state
    isOpen: { table: { disable: true } },
    onClose: { action: 'onClose' },
    children: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const InteractiveModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-[400px] rounded-lg bg-white p-6 shadow-xl">
          <h3 className="text-lg font-bold">Modal Title</h3>
          <p className="mt-2 text-sm text-gray-600">
            This is the content of the modal. You can close it by clicking the
            backdrop, the close button, or pressing the Esc key.
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveModal />,
};
