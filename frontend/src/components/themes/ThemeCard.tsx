import LinkButton from '@/components/atoms/LinkButton';
import { Theme } from '@/types/generated/api';
import Tag from '../atoms/Tag';
import { Pencil, Star, Trash2 } from 'lucide-react';

interface ThemeCardProps {
  theme: Theme;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFavorite: () => void;
}

export default function ThemeCard({
  theme,
  onEdit,
  onDelete,
  onToggleFavorite,
}: ThemeCardProps) {
  const isMyTheme = !!onEdit && !!onDelete;

  return (
    <div
      id={theme.id.toString()}
      className="relative flex flex-col overflow-hidden rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="absolute top-4 right-4 flex items-center space-x-3">
        <button
          onClick={onToggleFavorite}
          className="text-yellow-400 transition-colors hover:text-yellow-500 hover:cursor-pointer"
          aria-label={theme.isFavorited ? 'お気に入り解除' : 'お気に入り登録'}
        >
          <Star
            className={`h-5 w-5 transition-all ${
              theme.isFavorited ? 'fill-yellow-400' : 'fill-none'
            }`}
          />
        </button>
        {isMyTheme && (
          <>
            <button
              onClick={onEdit}
              className="text-gray-400 transition-colors hover:text-gray-600 hover:cursor-pointer"
              aria-label="編集"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="text-gray-400 transition-colors hover:text-red-500 hover:cursor-pointer"
              aria-label="削除"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      <Tag className="mb-2 self-start">{theme.category}</Tag>
      <h2 className="mb-2 flex-grow text-xl font-semibold text-gray-900 line-clamp-2">
        {theme.title}
      </h2>
      <p className="mb-4 text-gray-600 line-clamp-3">{theme.description}</p>
      <LinkButton
        href={`/themes/${theme.id.toString()}/write`}
        className="mt-auto"
      >
        このテーマで言語化する
      </LinkButton>
    </div>
  );
}
