import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getThemes } from '@/lib/api/themes.server';
import ThemeBrowser from '@/components/themes/ThemeBrowser';

export default async function ThemesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // If no token is found, redirect to the login page.
  // This ensures the page is protected on the server.
  if (!token) {
    redirect('/login?callbackUrl=/themes');
  }

  // Fetch themes on the server using the token from the cookie.
  const themes = await getThemes(token);

  return (
    <div className="container min-h-[calc(100vh-168px)] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-12 lg:py-14">
      {/* Pass the server-fetched themes to the client component for interactive browsing */}
      <ThemeBrowser initialThemes={themes} />
    </div>
  );
}
