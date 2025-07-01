'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // このコンポーネントがクライアント側でマウントされたことを確認します。
    // これにより、ZustandストアがlocalStorageから状態を復元するのを待つことができます。
    setIsClient(true);
  }, []);

  useEffect(() => {
    // クライアント側で、かつ未ログインの場合にリダイレクトを実行します。
    if (isClient && !isLoggedIn()) {
      router.push('/login');
    }
  }, [isClient, isLoggedIn, router]);

  // ログイン済み、またはクライアント側でのチェックが完了するまでは子要素を表示します。
  // 未ログインの場合はリダイレクトが実行されるため、一瞬何も表示されないか、ローディング画面が表示されます。
  return isClient && isLoggedIn() ? <>{children}</> : null;
}
