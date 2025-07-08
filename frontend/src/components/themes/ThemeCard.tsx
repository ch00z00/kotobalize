import LinkButton from '@/components/atoms/LinkButton';
import { Theme } from '@/types/generated/models';
import Tag from '../atoms/Tag';

interface ThemeCardProps {
  theme: Theme;
}

export default function ThemeCard({ theme }: ThemeCardProps) {
  return (
    <div
      id={theme.id.toString()}
      className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="p-6">
        <Tag className="mb-2">{theme.category}</Tag>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          {theme.title}
        </h2>
        <p className="mb-4 text-gray-600">{theme.description}</p>
        <LinkButton href={`/themes/${theme.id.toString()}/write`}>
          このテーマで言語化する
        </LinkButton>
      </div>
    </div>
  );
}
