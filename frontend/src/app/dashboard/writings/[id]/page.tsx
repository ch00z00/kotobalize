import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getWritingById } from '@/lib/api/writings';
import WritingDetailClient from './components/WritingDetailClient';
import { notFound } from 'next/navigation';

interface WritingDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WritingDetailPage({
  params,
}: WritingDetailPageProps) {
  const { id } = params;
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
