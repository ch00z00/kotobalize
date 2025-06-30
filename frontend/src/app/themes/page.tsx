import Link from 'next/link';
import { Theme } from '@/types/generated/models/Theme';

async function getThemes(): Promise<Theme[]> {
  // このfetchはサーバーサイドで実行されるため、Dockerの内部ネットワークURLを使用できます。
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  try {
    const res = await fetch(`${apiUrl}/themes`, {
      // 開発中は常に最新のデータを取得するためにキャッシュを無効化します。
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch themes');
    }

    return res.json();
  } catch (error) {
    console.error('API call failed:', error);
    // エラーが発生した場合は空の配列を返し、ページがクラッシュするのを防ぎます。
    return [];
  }
}

export default async function ThemesPage() {
  const themes = await getThemes();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">テーマを選択</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <div
            key={theme.id}
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
                href={`/themes/${theme.id}/write`}
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
