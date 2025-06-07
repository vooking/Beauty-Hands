"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "@/app/page.module.css";
import { motion, AnimatePresence } from "framer-motion";

type Service = {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
  prices: {
    master: string;
    topMaster?: string;
  };
};

type Category = {
  id: number;
  name: string;
};

const ServicesTable: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [errorServices, setErrorServices] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    
    return () => {
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  const normalizePrices = useCallback((prices: any) => {
    if (typeof prices === "object" && !Array.isArray(prices)) return prices;
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
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?type=service`);
      if (!res.ok) throw new Error("Ошибка загрузки категорий");
      const data = await res.json();
      setCategories(data);
      if (data.length > 0) setActiveCategory(data[0].name);
    } catch (err: any) {
      setErrorCategories(err.message || "Ошибка загрузки категорий");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    setLoadingServices(true);
    setErrorServices(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
      if (!res.ok) throw new Error("Ошибка загрузки услуг");
      const data = await res.json();
      setServices(
        data.map((service: any) => ({
          ...service,
          prices: normalizePrices(service.prices),
        }))
      );
    } catch (err: any) {
      setErrorServices(err.message || "Ошибка загрузки услуг");
    } finally {
      setLoadingServices(false);
    }
  }, [normalizePrices]);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, [fetchCategories, fetchServices]);

  const filteredServices = useMemo(
    () => services.filter((s) => s.category.name === activeCategory),
    [services, activeCategory]
  );

  const hasTopMasterPrices = useMemo(
    () => filteredServices.some((s) => s.prices.topMaster),
    [filteredServices]
  );

  const SkeletonLoader = () => (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0.8 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
      className="bg-gray-200 rounded h-6 w-full"
    />
  );

  return (
    <section className="max-w-5xl mx-auto px-4 text-[#4b4845]">
      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 md:mb-8 ${styles.titleMain}`}>
        Наши услуги
      </h2>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {loadingCategories ? (
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : errorCategories ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500"
          >
            {errorCategories}
          </motion.div>
        ) : (
          categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`text-sm pb-1 px-3 relative transition-all ${
                activeCategory === cat.name
                  ? "text-[#FFC5B8] font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#FFC5B8]"
                  : "text-gray-700 hover:text-[#FFC5B8] hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-[#FFC5B8]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.name}
            </motion.button>
          ))
        )}
      </div>

      <div className="hidden md:block">
        {loadingServices ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 py-6"
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <SkeletonLoader />
                <SkeletonLoader />
                {hasTopMasterPrices && <SkeletonLoader />}
              </div>
            ))}
          </motion.div>
        ) : errorServices ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 py-6"
          >
            {errorServices}
          </motion.div>
        ) : filteredServices.length > 0 ? (
          <motion.table 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full table-fixed border-separate border-spacing-y-2 text-left"
          >
            <thead>
              <tr className="text-sm text-gray-600">
                <th className="py-3 px-4 w-2/3 border-b border-gray-200">Услуга</th>
                <th className="py-3 px-4 border-b border-gray-200">Мастер</th>
                {hasTopMasterPrices && (
                  <th className="py-3 px-4 border-b border-gray-200">Топ-мастер</th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredServices.map((service, index) => (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={index % 2 !== 0 ? "bg-[#f9f5f4]" : ""}
                  >
                    <td className="py-3 px-4">{service.name}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{service.prices.master || "-"} ₽</td>
                    {hasTopMasterPrices && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        {service.prices.topMaster ? `${service.prices.topMaster} ₽` : "-"}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-gray-400"
          >
            Услуг пока нет
          </motion.div>
        )}
      </div>

      <div className="md:hidden space-y-4">
        {loadingServices ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 py-6"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0.8 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="flex justify-between items-center p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  {hasTopMasterPrices && (
                    <div className="flex justify-between items-center p-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : errorServices ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 py-6"
          >
            {errorServices}
          </motion.div>
        ) : filteredServices.length > 0 ? (
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
              >
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
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-6"
          >
            Услуги не найдены
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ServicesTable;