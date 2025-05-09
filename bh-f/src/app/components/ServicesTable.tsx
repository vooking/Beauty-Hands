"use client";

import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import styles from "@/app/page.module.css";

type Service = {
  id: number;
  category: string;
  name: string;
  prices: {
    master: string;
    topMaster?: string;
  };
};

const fixedCategories = [
  "Наращивание ногтей",
  "Маникюр",
  "Педикюр",
  "Брови и ресницы",
  "Лицо",
  "Массаж",
  "Препаратный педикюр KART",
  "Комплексы",
  "Пирсинг",
  "Депиляция",
];

export default function ServicesTable() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(
    fixedCategories[0]
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
        const data = await res.json();
        const normalizedData = data.map((service: any) => ({
          ...service,
          prices: normalizePrices(service.prices),
        }));
        setServices(normalizedData);
      } catch (err) {
        console.error("Ошибка загрузки услуг:", err);
      }
    };
    fetchServices();
  }, []);

  const normalizePrices = (prices: any) => {
    if (typeof prices === "object" && !Array.isArray(prices)) {
      return prices;
    }

    if (typeof prices === "string") {
      try {
        const parsed = JSON.parse(prices);
        // Если в данных осталась старая структура с default ценой
        if (parsed.default && !parsed.master) {
          return { master: parsed.default, topMaster: parsed.topMaster };
        }
        return parsed;
      } catch {
        return { master: prices };
      }
    }

    return { master: "-" };
  };

  const filteredServices = services.filter(
    (s) => s.category === activeCategory
  );
  const hasTopMasterPrices = filteredServices.some((s) => s.prices.topMaster);

  return (
    <section className="max-w-5xl mx-auto px-4 text-center text-[#4b4845] overflow-x-hidden">
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 md:mb-8 ${styles.titleMain}`}
      >
        Наши услуги
      </h2>

      {/* Категории */}
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        {fixedCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 relative text-sm transition-all duration-300 pb-1 px-2
              ${
                activeCategory === cat
                  ? "text-[#FFC5B8] font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#FFC5B8]"
                  : "text-gray-700 hover:text-[#FFC5B8] hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-[#FFC5B8]"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Таблица - Desktop */}
      <div className="hidden md:block overflow-x-hidden w-full">
        <table className="w-full table-fixed border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-gray-600">
              <th className="py-2 px-4 w-2/3">Услуга</th>
              <th className="py-2 px-4">Мастер</th>
              {hasTopMasterPrices && <th className="py-2 px-4">Топ-мастер</th>}
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service, idx) => (
                <tr
                  key={service.id}
                  className={idx % 2 !== 0 ? "bg-[#f9f5f4]" : ""}
                >
                  <td className="py-2 px-4">{service.name}</td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    {service.prices.master || "-"} ₽
                  </td>
                  {hasTopMasterPrices && (
                    <td className="py-2 px-4 whitespace-nowrap">
                      {service.prices.topMaster
                        ? `${service.prices.topMaster} ₽`
                        : ""}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2 + (hasTopMasterPrices ? 1 : 0)}
                  className="text-center py-6 text-gray-400"
                >
                  Услуги не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile версия */}
      <div className="md:hidden space-y-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#f9f5f4] rounded-xl p-4 shadow-sm text-left"
            >
              <div className="font-medium mb-2">{service.name}</div>
              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>Мастер:</span>
                <span>{service.prices.master || "-"} ₽</span>
              </div>
              {service.prices.topMaster && (
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Топ-мастер:</span>
                  <span>{service.prices.topMaster} ₽</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-6">
            Услуги не найдены
          </div>
        )}
      </div>
    </section>
  );
}
