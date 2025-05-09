"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import styles from "@/app/page.module.css";
import "@/app/globals.css";

export default function FooterMobile() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#FBF7F6] text-[#4b4845] text-sm py-14 px-6 md:hidden">
      <div className="grid gap-10 max-w-screen-xl mx-auto">
        {/* Главная */}
        <div className="space-y-2 pt-6">
          <h4 className={`text-[20px] font-semibold mb-2 ${styles.titleMain}`}>
            Главная
          </h4>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:text-[#FFC5B8] transition">
                О нас
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-[#FFC5B8] transition">
                Услуги
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-[#FFC5B8] transition">
                Прайс-лист
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-[#FFC5B8] transition">
                Партнеры
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-[#FFC5B8] transition">
                Акции
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-[#FFC5B8] transition">
                Портфолио работ
              </Link>
            </li>
          </ul>
        </div>

        {/* Услуги салона */}
        <div className="space-y-2 border-t pt-6">
          <h4 className={`text-[20px] font-semibold mb-2 ${styles.titleMain}`}>
            Услуги салона
          </h4>
          <ul className="space-y-1">
            <li><a className="transition">Ногтевой сервис</a></li>
            <li><a className="transition">Педикюр</a></li>
            <li><a className="transition">Брови и ресницы</a></li>
            <li><a className="transition">Массаж</a></li>
            <li><a className="transition">Лицо</a></li>
            <li><a className="transition">Пирсинг</a></li>
            <li><a className="transition">Для мужчин</a></li>
            <li><a className="transition">Волосы</a></li>
          </ul>
        </div>

        {/* Контакты */}
        <div className="space-y-3 border-t pt-6">
          <h4 className={`text-[20px] font-semibold mb-2 ${styles.titleMain}`}>
            Контакты
          </h4>
          <a
            href="tel:+79000000000"
            className="text-[#4b4845] font-semibold hover:text-[#e4ada1] transition-colors duration-300"
          >
            +7 (921) 390-47-87
          </a>
          <p className="text-sm mt-2">
            Чкаловский просп., 7, Санкт-Петербург
            <br />
            (Секция 215, этаж 2)
          </p>
          <p className="text-sm">Часы работы: 9:00–22:00</p>
          <p className="text-sm mt-2">Пионерская, 31, Санкт-Петербург</p>
          <p className="text-sm">Часы работы: круглосуточно</p>
        </div>

        {/* BEAUTY HANDS */}
        <div className="space-y-4 border-t pt-6">
          <h3 className={`text-lg font-light ${styles.logo}`}>
            BEAUTY HANDS
          </h3>
          <p className="text-xs mt-[-10px]">Студия красоты</p>
          <p className="text-xs mt-4">Политика конфиденциальности</p>
          <p className="text-xs">
            Все цены на сайте носят информационный характер и не являются
            публичной офертой.
          </p>
          <p className="text-xs mt-2">Все права защищены © 2014—2025</p>
          <div className="flex gap-4 mt-4 justify-center">
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <img src="/telegram.svg" alt="Telegram" className="w-5 h-5" />
            </a>
            <a href="https://vk.com/" target="_blank" rel="noopener noreferrer" aria-label="VK">
              <img src="/vk.svg" alt="VK" className="w-5 h-5" />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Кнопка "Наверх" */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#FFC5B8] hover:bg-[#e4ada1] text-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="Наверх"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </footer>
  );
}
