import Link from 'next/link';
import { getThemes } from '@/lib/api/themes';

export default async function ThemesPage() {
  const themes = await getThemes();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">テーマを選択</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <div
            key={theme.id}
            id={theme.id.toString()}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="p-6">
              <span className="mb-2 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                {theme.category}
              </span>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {theme.title}
              </h2>
              <p className="mb-4 text-gray-600">{theme.description}</p>
              <Link
                href={`/themes/${theme.id.toString()}/write`}
                className="inline-block rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-600"
              >
                このテーマで言語化する
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
