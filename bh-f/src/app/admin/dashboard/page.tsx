"use client";

import AdminNavbar from "@/app/components/AdminNavbar";
import withAuth from "@/app/components/withAuth";
import { useEffect, useState } from "react";

interface Feedback {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  type: string;
}

const Dashboard = () => {
  const [servicesCount, setServicesCount] = useState(0);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStats = async () => {
      try {
        // Загружаем количество услуг
        const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const servicesData = await servicesRes.json();
        setServicesCount(Array.isArray(servicesData) ? servicesData.length : 0);

        // Загружаем количество работ в портфолио
        const portfolioRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const portfolioData = await portfolioRes.json();
        setPortfolioCount(Array.isArray(portfolioData) ? portfolioData.length : 0);

        // Загружаем категории
        const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const categoriesData = await categoriesRes.json();
        setCategoriesCount(Array.isArray(categoriesData) ? categoriesData.length : 0);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        // Загружаем обратную связь
        const feedbackRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const feedbackData = await feedbackRes.json();
        setFeedbacks(Array.isArray(feedbackData) ? feedbackData : []);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <AdminNavbar />
      <main className="text-[#4b4845] p-6 pt-10 md:ml-64">
        <h1 className="text-2xl font-semibold mb-6">
          Добро пожаловать в админ-панель
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-medium">Услуги</h2>
            <p className="text-3xl mt-2 font-bold">{servicesCount}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-medium">Фотографии</h2>
            <p className="text-3xl mt-2 font-bold">{portfolioCount}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-medium">Категории</h2>
            <p className="text-3xl mt-2 font-bold">{categoriesCount}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-medium">Обратные связи</h2>
            <p className="text-3xl mt-2 font-bold">{feedbacks.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Последняя обратная связь
            </h2>

            {isLoading ? (
              <p className="text-sm text-gray-500">Загрузка...</p>
            ) : feedbacks.length > 0 ? (
              <ul className="space-y-4">
                {feedbacks.slice(0, 5).map((feedback) => (
                  <li
                    key={feedback.id}
                    className="flex flex-col sm:flex-row items-start gap-4 bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#4b4845] hover:shadow-md transition w-full"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-[#4b4845] text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {feedback.name[0]?.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 max-w-full overflow-hidden">
                      <div className="font-medium text-gray-800">
                        {feedback.name}
                      </div>
                      <p className="text-gray-600 text-sm mt-1 break-words whitespace-pre-wrap">
                        {feedback.message}
                      </p>
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(feedback.created_at).toLocaleString("ru-RU")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Нет новой обратной связи</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Распределение по категориям
            </h2>
            {isLoading ? (
              <p className="text-sm text-gray-500">Загрузка...</p>
            ) : categories.length > 0 ? (
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <ul className="space-y-3">
                  {categories.slice(0, 5).map((category) => (
                    <li key={category.id} className="flex justify-between items-center">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-500">
                        {category.type === 'both' && 'Услуги и портфолио'}
                        {category.type === 'service' && 'Только услуги'}
                        {category.type === 'portfolio' && 'Только портфолио'}
                      </span>
                    </li>
                  ))}
                </ul>
                {categories.length > 5 && (
                  <p className="text-sm text-gray-500 mt-2">
                    +{categories.length - 5} других категорий
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Нет категорий</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default withAuth(Dashboard);