import ProtectedRoute from '@/components/common/ProtectedRoute';
import WritingDetailClient from '../../../../components/write/WritingDetailClient';

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
