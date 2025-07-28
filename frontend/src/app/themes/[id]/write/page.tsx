import { getThemeById } from '@/lib/api/themes.server';
import { notFound, redirect } from 'next/navigation';
import Editor from '@/components/edit/Editor';
import { cookies } from 'next/headers';
import Tag from '@/components/atoms/Tag';

interface WritePageProps {
  params: Promise<{ id: string }>;
}

export default async function WritePage({ params }: WritePageProps) {
  const { id } = await params;
  console.log('=== WritePage Debug ===');
  console.log('Theme ID:', id);
  console.log('INTERNAL_API_BASE_URL:', process.env.INTERNAL_API_BASE_URL);

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  console.log('Token present:', !!token);
  console.log('Token length:', token?.length);

  if (!token) {
    console.log('No token, redirecting to login');
    // Redirect to login page if not authenticated, preserving the intended destination
    const callbackUrl = encodeURIComponent(`/themes/${id}/write`);
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  console.log('Fetching theme with ID:', id);
  // Fetch the theme data on the server
  const theme = await getThemeById(id, token);
  console.log('Theme fetched:', !!theme);
  console.log('Theme data:', theme);

  if (!theme) {
    console.log('Theme not found, calling notFound()');
    notFound();
  }

  console.log('Rendering page with theme:', theme.title);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <Tag className="mb-2">{theme.category}</Tag>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{theme.title}</h1>
        <p className="text-gray-600">{theme.description}</p>
      </div>
      {/* The Editor component handles the client-side state and interactions */}
      <Editor
        themeId={theme.id}
        timeLimitInSeconds={theme.timeLimitInSeconds}
      />
    </div>
  );
}
