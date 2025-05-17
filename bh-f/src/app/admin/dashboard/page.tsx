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

const DashboardCard = ({ title, count }: { title: string; count: number }) => (
  <div className="bg-white p-4 shadow rounded">
    <h2 className="text-lg font-medium">{title}</h2>
    <p className="text-3xl mt-2 font-bold">{count}</p>
  </div>
);

const FeedbackItem = ({ feedback }: { feedback: Feedback }) => (
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
      <div className="font-medium text-gray-800">{feedback.name}</div>
      <p className="text-gray-600 text-sm mt-1 break-words whitespace-pre-wrap">
        {feedback.message}
      </p>
      <div className="text-xs text-gray-400 mt-2">
        {new Date(feedback.created_at).toLocaleString("ru-RU")}
      </div>
    </div>
  </li>
);

const CategoryItem = ({ category }: { category: Category }) => (
  <li className="flex justify-between items-center">
    <span className="font-medium">{category.name}</span>
    <span className="text-sm text-gray-500">
      {category.type === "both" && "Услуги и портфолио"}
      {category.type === "service" && "Только услуги"}
      {category.type === "portfolio" && "Только портфолио"}
    </span>
  </li>
);

const Dashboard = () => {
  const [servicesCount, setServicesCount] = useState(0);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const [
          servicesRes,
          portfolioRes,
          categoriesRes,
          feedbackRes,
        ] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [servicesData, portfolioData, categoriesData, feedbackData] =
          await Promise.all([
            servicesRes.json(),
            portfolioRes.json(),
            categoriesRes.json(),
            feedbackRes.json(),
          ]);

        setServicesCount(Array.isArray(servicesData) ? servicesData.length : 0);
        setPortfolioCount(
          Array.isArray(portfolioData) ? portfolioData.length : 0
        );
        setCategoriesCount(
          Array.isArray(categoriesData) ? categoriesData.length : 0
        );
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
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
          <DashboardCard title="Услуги" count={servicesCount} />
          <DashboardCard title="Фотографии" count={portfolioCount} />
          <DashboardCard title="Категории" count={categoriesCount} />
          <DashboardCard title="Обратные связи" count={feedbacks.length} />
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
                  <FeedbackItem key={feedback.id} feedback={feedback} />
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
                    <CategoryItem key={category.id} category={category} />
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
