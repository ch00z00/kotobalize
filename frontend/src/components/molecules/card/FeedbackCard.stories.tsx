import type { Meta, StoryObj } from '@storybook/nextjs';
import FeedbackCard from './FeedbackCard';

const meta: Meta<typeof FeedbackCard> = {
  title: 'Molecules/Card/FeedbackCard',
  component: FeedbackCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    // childrenはコントロールが難しいため、ここでは非表示にします
    children: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FeedbackCard>;

export const Default: Story = {
  args: {
    title: '論理の明快さ',
    children: (
      <p>
        説明は非常に明確で、要点を的確に捉えています。専門用語の使い方も適切です。
      </p>
    ),
  },
};

export const WithList: Story = {
  args: {
    title: '改善点',
    children: (
      <ul>
        <li>もう少し具体的な例を挙げると、より分かりやすくなります。</li>
        <li>
          結論を先に述べる構成を意識すると、さらに伝わりやすくなるでしょう。
        </li>
      </ul>
    ),
  },
};
