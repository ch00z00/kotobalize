import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getWritingById } from '@/lib/api/writings.server';
import WritingDetailClient from '@/components/write/WritingDetailClient';

interface WritingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function WritingDetailPage({
  params,
}: WritingDetailPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
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
