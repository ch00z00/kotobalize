import { getThemeById } from '@/lib/api/themes.server';
import { notFound, redirect } from 'next/navigation';
import Editor from '@/components/edit/Editor';
import { cookies } from 'next/headers';
import Tag from '@/components/atoms/Tag';

interface WritePageProps {
  params: {
    id: string;
  };
}

export default async function WritePage({ params }: WritePageProps) {
  const { id } = params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    // Redirect to login page if not authenticated, preserving the intended destination
    const callbackUrl = encodeURIComponent(`/themes/${id}/write`);
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  // Fetch the theme data on the server
  const theme = await getThemeById(id, token);

  if (!theme) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <Tag className="mb-2">{theme.category}</Tag>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{theme.title}</h1>
        <p className="text-gray-600">{theme.description}</p>
      </div>
      {/* The Editor component handles the client-side state and interactions */}
      <Editor themeId={theme.id} />
    </div>
  );
}
