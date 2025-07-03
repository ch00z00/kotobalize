import ProtectedRoute from '@/components/common/ProtectedRoute';
import DashboardClient from '../../components/dashboard/DashboardClient';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardClient />
    </ProtectedRoute>
  );
}
