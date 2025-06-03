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
  ({ item, onDelete, selected, onSelect }: { 
    item: FeedbackItem; 
    onDelete: (id: number) => void;
    selected: boolean;
    onSelect: (id: number, isSelected: boolean) => void;
  }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => setExpanded(prev => !prev);

    return (
      <li className={`bg-white border-l-4 border-[#4b4845] p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 flex items-start gap-2">
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => onSelect(item.id, e.target.checked)}
                className="h-4 w-4 mt-1 sm:mt-2"
              />
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#4b4845] text-white rounded-full flex items-center justify-center font-bold text-xs">
                {item.name[0]?.toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <div className="font-medium text-gray-800 truncate text-sm sm:text-base">{item.name}</div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(item.created_at).toLocaleString('ru-RU')}
                </div>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 break-words">
                <span className="font-semibold">Тел:</span> {item.phone}
              </p>
              <p className="text-gray-700 text-xs sm:text-sm mt-1 whitespace-pre-wrap break-words">
                <span className="font-semibold">Сообщение:</span>{' '}
                {expanded || item.message.length <= (window.innerWidth < 640 ? 30 : 50)
                  ? item.message
                  : `${item.message.substring(0, window.innerWidth < 640 ? 30 : 50)}...`}
              </p>
              {item.message.length > (window.innerWidth < 640 ? 30 : 50) && (
                <button
                  onClick={toggleExpand}
                  className="mt-1 text-xs sm:text-sm text-blue-600 hover:underline"
                >
                  {expanded ? 'Скрыть' : 'Показать полностью'}
                </button>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 flex justify-end gap-2">
            <button
              onClick={() => onDelete(item.id)}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-medium transition"
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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Проверка мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Автоматическое скрытие уведомления
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchFeedback = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: 'Токен не найден', type: 'error' });
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
      setNotification({ message: 'Ошибка загрузки данных', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id: number) => {
    const isConfirmed = window.confirm('Вы уверены, что хотите удалить это сообщение?');
    if (!isConfirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: 'Токен не найден', type: 'error' });
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedback(prev => prev.filter(item => item.id !== id));
      setNotification({ message: 'Сообщение успешно удалено', type: 'success' });
    } catch {
      setNotification({ message: 'Ошибка при удалении', type: 'error' });
    }
  };

  const deleteSelected = async () => {
    if (selectedItems.length === 0) {
      setNotification({ message: 'Выберите сообщения для удаления', type: 'error' });
      return;
    }

    const isConfirmed = window.confirm(`Вы уверены, что хотите удалить ${selectedItems.length} сообщений?`);
    if (!isConfirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: 'Токен не найден', type: 'error' });
      return;
    }

    try {
      await Promise.all(
        selectedItems.map(id =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      setFeedback(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      setNotification({ 
        message: `Успешно удалено ${selectedItems.length} сообщений`, 
        type: 'success' 
      });
    } catch {
      setNotification({ message: 'Ошибка при массовом удалении', type: 'error' });
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === feedback.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(feedback.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <>
      <AdminNavbar />
      
      {/* Уведомление */}
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg animate-notification text-sm ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`} style={{ 
          maxWidth: 'calc(100% - 2rem)',
          width: 'auto'
        }}>
          {notification.message}
        </div>
      )}

      <main className="text-[#4b4845] p-4 sm:p-6 md:ml-64 max-w-screen-xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Обратная связь</h1>

        {/* Кнопка массового удаления */}
        {feedback.length > 0 && (
          <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.length === feedback.length && feedback.length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4"
              />
              <span className="text-sm sm:text-base">Выбрать все ({feedback.length})</span>
            </div>
            {selectedItems.length > 0 && (
              <button
                onClick={deleteSelected}
                className="bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-red-700 disabled:bg-red-400 text-sm sm:text-base whitespace-nowrap"
              >
                Удалить выбранные ({selectedItems.length})
              </button>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm sm:text-base">Загрузка...</p>
        ) : feedback.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base">Сообщений пока нет</p>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {feedback.map(item => (
              <FeedbackListItem 
                key={item.id} 
                item={item} 
                onDelete={deleteFeedback}
                selected={selectedItems.includes(item.id)}
                onSelect={toggleSelectItem}
              />
            ))}
          </ul>
        )}
      </main>
    </>
  );
};

export default withAuth(Feedback);