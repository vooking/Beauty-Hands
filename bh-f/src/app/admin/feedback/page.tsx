'use client';

import AdminNavbar from '@/app/components/AdminNavbar';
import withAuth from '@/app/components/withAuth';
import { useEffect, useState } from 'react';

const Feedback = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFeedback(data);
    } catch {
      alert('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedback(prev => prev.filter(item => item.id !== id));
    } catch {
      alert('Ошибка при удалении');
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <>
      <AdminNavbar />
      <main className="text-[#4b4845] p-4 pt-10 md:ml-64 max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Обратная связь</h1>

        {loading ? (
          <p className="text-gray-500">Загрузка...</p>
        ) : feedback.length === 0 ? (
          <p className="text-gray-500">Сообщений пока нет</p>
        ) : (
          <ul className="space-y-4">
            {feedback.map(item => (
              <li
                key={item.id}
                className="bg-white border-l-4 border-[#4b4845] p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-[#4b4845] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.name[0]?.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 break-words">
                      {item.name}
                    </div>
                    <p className="text-gray-600 text-sm mt-1 break-words">
                      <span className="font-semibold">Телефон:</span> {item.phone}
                    </p>
                    <p className="text-gray-700 text-sm mt-2 break-words whitespace-pre-wrap">
                      <span className="font-semibold">Сообщение:</span> {item.message}
                    </p>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(item.created_at).toLocaleString('ru-RU')}
                    </div>

                    <button
                      onClick={() => deleteFeedback(item.id)}
                      className="mt-4 inline-block bg-red-100 text-red-600 hover:bg-red-200 px-4 py-1.5 rounded-md text-sm font-medium transition"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
};

export default withAuth(Feedback);
