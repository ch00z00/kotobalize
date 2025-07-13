import LinkButton from '@/components/atoms/LinkButton';
import { Theme } from '@/types/generated/api';
import Tag from '../atoms/Tag';
import { Pencil, Trash2 } from 'lucide-react';

interface ThemeCardProps {
  theme: Theme;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ThemeCard({ theme, onEdit, onDelete }: ThemeCardProps) {
  const isMyTheme = !!onEdit && !!onDelete;

  return (
    <div
      id={theme.id.toString()}
      className="relative overflow-hidden rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      {isMyTheme && (
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="編集"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 transition-colors hover:text-red-500"
            aria-label="削除"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )}
      <Tag className="mb-2">{theme.category}</Tag>
      <h2 className="mb-2 pr-16 text-xl font-semibold text-gray-900 flex-grow">
        {theme.title}
      </h2>
      <p className="mb-4 text-gray-600">{theme.description}</p>
      <LinkButton
        href={`/themes/${theme.id.toString()}/write`}
        className="mt-auto"
      >
        このテーマで言語化する
      </LinkButton>
    </div>
  );
}
