import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getWritingById } from '@/lib/api/writings.server';
import WritingDetailClient from '@/components/write/WritingDetailClient';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

interface WritingDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WritingDetailPage({
  params,
}: WritingDetailPageProps) {
  const { id } = params;
  const cookieStore: ReadonlyRequestCookies = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect(`/login?callbackUrl=/dashboard/writings/${id}`);
  }

  const writing = await getWritingById(id, token);

  if (!writing) {
    notFound();
  }

  return (
    <div className="bg-gray-50">
      <WritingDetailClient initialWriting={writing} />
    </div>
  );
}
