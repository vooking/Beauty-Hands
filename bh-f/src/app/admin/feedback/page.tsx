'use client';

import AdminNavbar from '@/app/components/AdminNavbar';
import withAuth from '@/app/components/withAuth';
import { useEffect, useState, memo } from 'react';

interface FeedbackItem {
  id: number;
  name: string;
  phone: string;
  message: string;
  created_at: string;
}

const FeedbackListItem = memo(
  ({ item, onDelete }: { item: FeedbackItem; onDelete: (id: number) => void }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => setExpanded(prev => !prev);

    return (
      <li className="bg-white border-l-4 border-[#4b4845] p-4 rounded-lg shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 bg-[#4b4845] text-white rounded-full flex items-center justify-center font-bold text-xs">
                {item.name[0]?.toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <div className="font-medium text-gray-800 truncate">{item.name}</div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(item.created_at).toLocaleString('ru-RU')}
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1 break-words">
                <span className="font-semibold">Тел:</span> {item.phone}
              </p>
              <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap break-words">
                <span className="font-semibold">Сообщение:</span>{' '}
                {expanded || item.message.length <= 50
                  ? item.message
                  : `${item.message.substring(0, 50)}...`}
              </p>
              {item.message.length > 50 && (
                <button
                  onClick={toggleExpand}
                  className="mt-1 text-sm text-blue-600 hover:underline"
                >
                  {expanded ? 'Скрыть' : 'Показать полностью'}
                </button>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => onDelete(item.id)}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition"
            >
              Удалить
            </button>
          </div>
        </div>
      </li>
    );
  }
);
FeedbackListItem.displayName = 'FeedbackListItem';

const Feedback = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Токен не найден');
      setLoading(false);
      return;
    }

    try {
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
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
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
      <main className="text-[#4b4845] p-6 md:ml-64 max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Обратная связь</h1>

        {loading ? (
          <p className="text-gray-500">Загрузка...</p>
        ) : feedback.length === 0 ? (
          <p className="text-gray-500">Сообщений пока нет</p>
        ) : (
          <ul className="space-y-3">
            {feedback.map(item => (
              <FeedbackListItem key={item.id} item={item} onDelete={deleteFeedback} />
            ))}
          </ul>
        )}
      </main>
    </>
  );
};

export default withAuth(Feedback);
