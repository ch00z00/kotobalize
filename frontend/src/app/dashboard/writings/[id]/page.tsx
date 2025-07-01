import ProtectedRoute from '@/components/ProtectedRoute';
import WritingDetailClient from './WritingDetailClient';

interface WritingDetailPageProps {
  params: {
    id: string;
  };
}

export default function WritingDetailPage({ params }: WritingDetailPageProps) {
  return (
    <ProtectedRoute>
      <WritingDetailClient writingId={params.id} />
    </ProtectedRoute>
  );
}
