import { getThemes } from '@/lib/api/themes';
import LinkButton from '@/components/atoms/LinkButton';

export default async function ThemesPage() {
  const themes = await getThemes();

  return (
    <div className="container min-h-[calc(100vh-168px)] mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">テーマを選択</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* TODO: テーマが取得できなかった場合は、「テーマがありません」を表示する
         * テーマを手動追加するボタンを追加する
         * モーダルでテーマを追加する
         */}
        {themes.map((theme) => (
          <div
            key={theme.id}
            id={theme.id.toString()}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="p-6">
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {theme.category}
              </span>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {theme.title}
              </h2>
              <p className="mb-4 text-gray-600">{theme.description}</p>
              <LinkButton href={`/themes/${theme.id.toString()}/write`}>
                このテーマで言語化する
              </LinkButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
