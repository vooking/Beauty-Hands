'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '@/app/components/AdminNavbar';
import withAuth from '@/app/components/withAuth';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setPortfolio(data))
            .catch(() => alert('Ошибка загрузки портфолио'));
    }, []);

    return (
        <>
            <AdminNavbar />
            <main className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Портфолио</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {portfolio.map((item, index) => (
                        <div key={index} className="border p-4 rounded-md">
                            <img
                                src={item.image_url}
                                alt={`Фото ${index + 1}`}
                                className="w-full h-48 object-cover rounded mb-2"
                            />
                            <p><strong>Категория:</strong> {item.category}</p>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default withAuth(Portfolio);
