import React, { useEffect, useState, useCallback, useMemo } from "react";
import "@/app/globals.css";
import styles from "@/app/page.module.css";

type Service = {
  id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
  prices: {
    master: string;
    topMaster?: string;
  };
};

const CategoryButton = React.memo(
  ({
    category,
    isActive,
    onClick,
  }: {
    category: { id: number; name: string };
    isActive: boolean;
    onClick: (name: string) => void;
  }) => (
    <button
      onClick={() => onClick(category.name)}
      className={`shrink-0 relative text-sm transition-all duration-300 pb-1 px-2
      ${
        isActive
          ? "text-[#FFC5B8] font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#FFC5B8]"
          : "text-gray-700 hover:text-[#FFC5B8] hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-[#FFC5B8]"
      }
    `}
    >
      {category.name}
    </button>
  )
);

CategoryButton.displayName = "CategoryButton";

const ServiceRowDesktop = ({
  service,
  hasTopMasterPrices,
  index,
}: {
  service: Service;
  hasTopMasterPrices: boolean;
  index: number;
}) => (
  <tr className={index % 2 !== 0 ? "bg-[#f9f5f4]" : ""}>
    <td className="py-3 px-4">{service.name}</td>
    <td className="py-3 px-4 whitespace-nowrap">
      {service.prices.master || "-"} ₽
    </td>
    {hasTopMasterPrices && (
      <td className="py-3 px-4 whitespace-nowrap">
        {service.prices.topMaster ? `${service.prices.topMaster} ₽` : "-"}
      </td>
    )}
  </tr>
);

const ServiceCardMobile = ({
  service,
  hasTopMasterPrices,
}: {
  service: Service;
  hasTopMasterPrices: boolean;
}) => (
  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
    <div className="p-4 border-b border-gray-100">
      <h3 className="font-medium text-[#4b4845]">{service.name}</h3>
    </div>

    <div className="divide-y divide-gray-100">
      <div className="flex justify-between items-center p-4">
        <span className="text-sm text-gray-600">Мастер</span>
        <span className="font-medium">{service.prices.master || "-"} ₽</span>
      </div>

      {hasTopMasterPrices && (
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-gray-600">Топ-мастер</span>
          <span className="font-medium">
            {service.prices.topMaster ? `${service.prices.topMaster} ₽` : "-"}
          </span>
        </div>
      )}
    </div>
  </div>
);

const EmptyState = ({ isMobile }: { isMobile: boolean }) => (
  <div
    className={
      isMobile
        ? "text-center text-gray-400 py-6"
        : "text-center py-6 text-gray-400"
    }
  >
    Услуги не найдены
  </div>
);

export default function ServicesTable() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [activeCategory, setActiveCategory] = useState<string>("");

  const normalizePrices = useCallback((prices: any) => {
    if (typeof prices === "object" && !Array.isArray(prices)) {
      return prices;
    }

    if (typeof prices === "string") {
      try {
        const parsed = JSON.parse(prices);
        if (parsed.default && !parsed.master) {
          return { master: parsed.default, topMaster: parsed.topMaster };
        }
        return parsed;
      } catch {
        return { master: prices };
      }
    }

    return { master: "-" };
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories?type=service`
      );
      const data = await res.json();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0].name);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const fetchServices = useCallback(async () => {
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
  }, [normalizePrices]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = useMemo(
    () => services.filter((s) => s.category.name === activeCategory),
    [services, activeCategory]
  );

  const hasTopMasterPrices = useMemo(
    () => filteredServices.some((s) => s.prices.topMaster),
    [filteredServices]
  );

  const handleCategoryChange = useCallback((name: string) => {
    setActiveCategory(name);
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-4 text-center text-[#4b4845] overflow-x-hidden">
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 md:mb-8 ${styles.titleMain}`}
      >
        Наши услуги
      </h2>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {categories.map((cat) => (
          <CategoryButton
            key={cat.id}
            category={cat}
            isActive={activeCategory === cat.name}
            onClick={handleCategoryChange}
          />
        ))}
      </div>

      <div className="hidden md:block overflow-x-hidden w-full">
        <table className="w-full table-fixed border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-gray-600">
              <th className="py-3 px-4 w-2/3 border-b border-gray-200">
                Услуга
              </th>
              <th className="py-3 px-4 border-b border-gray-200">Мастер</th>
              {hasTopMasterPrices && (
                <th className="py-3 px-4 border-b border-gray-200">
                  Топ-мастер
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service, idx) => (
                <ServiceRowDesktop
                  key={service.id}
                  service={service}
                  hasTopMasterPrices={hasTopMasterPrices}
                  index={idx}
                />
              ))
            ) : (
              <tr>
                <td colSpan={hasTopMasterPrices ? 3 : 2}>
                  <EmptyState isMobile={false} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCardMobile
              key={service.id}
              service={service}
              hasTopMasterPrices={hasTopMasterPrices}
            />
          ))
        ) : (
          <EmptyState isMobile={true} />
        )}
      </div>
    </section>
  );
}
