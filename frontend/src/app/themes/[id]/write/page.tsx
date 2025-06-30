import { getThemeById } from '@/lib/api/themes';
import { notFound } from 'next/navigation';
import Editor from '@/app/themes/[id]/write/Editor';

interface WritePageProps {
  params: {
    id: string;
  };
}

export default async function WritePage({ params }: WritePageProps) {
  const theme = await getThemeById(params.id);

  if (!theme) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
          {theme.category}
        </span>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{theme.title}</h1>
        <p className="text-gray-600">{theme.description}</p>
      </div>
      {/* The Editor component handles the client-side state and interactions */}
      <Editor themeId={theme.id} />
    </div>
  );
}
