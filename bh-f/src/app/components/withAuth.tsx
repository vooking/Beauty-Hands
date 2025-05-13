import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ComponentType } from 'react';
import { JSX } from 'react/jsx-runtime';

export default function withAuth<P extends JSX.IntrinsicAttributes>(WrappedComponent: ComponentType<P>) {
    return (props: P) => {
        const [authenticated, setAuthenticated] = useState(false);
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/admin');
            } else {
                setAuthenticated(true);
            }
        }, []);

        if (!authenticated) return <p className="p-6">Загрузка...</p>;

        return <WrappedComponent {...props} />;
    };
}
