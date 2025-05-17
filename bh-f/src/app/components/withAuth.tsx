import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ComponentType } from 'react';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
    const router = useRouter();

    useEffect(() => {
      // Проверка на клиентской стороне
      if (typeof window === 'undefined') return;

      const verifyAuth = async () => {
        try {
          const token = localStorage.getItem('token');
          
          if (!token) {
            setAuthStatus('unauthenticated');
            router.push('/admin');
            return;
          }

          setAuthStatus('authenticated');
        } catch (error) {
          console.error('Auth verification error:', error);
          setAuthStatus('unauthenticated');
          router.push('/admin');
        }
      };

      verifyAuth();
    }, [router]);

    if (authStatus === 'loading') {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="p-6 text-lg">Проверка авторизации...</p>
        </div>
      );
    }

    if (authStatus === 'unauthenticated') {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="p-6 text-lg">Перенаправление на страницу входа...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}