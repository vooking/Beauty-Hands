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

const Dashboard = () => {
  const [servicesCount, setServicesCount] = useState(0);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchServices = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setServicesCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Ошибка при получении услуг:", error);
      }
    };

    const fetchPortfolio = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/portfolio", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPortfolioCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Ошибка при получении портфолио:", error);
      }
    };

    const fetchFeedback = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/feedback", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFeedbacks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Ошибка при получении обратной связи:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
    fetchPortfolio();
    fetchFeedback();
  }, []);

  return (
    <>
      <AdminNavbar />
      <main className="text-[#4b4845] p-6 pt-10 md:ml-64">
        <h1 className="text-2xl font-semibold mb-6">
          Добро пожаловать в админ-панель
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-medium">Услуги</h2>
            <p className="text-3xl mt-2 font-bold">{servicesCount}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-medium">Фотографии</h2>
            <p className="text-3xl mt-2 font-bold">{portfolioCount}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-medium">Обратные связи</h2>
            <p className="text-3xl mt-2 font-bold">{feedbacks.length}</p>
          </div>
        </div>

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
      </main>
    </>
  );
};

export default withAuth(Dashboard);
