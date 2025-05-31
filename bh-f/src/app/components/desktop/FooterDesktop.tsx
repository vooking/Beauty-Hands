import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import styles from "@/app/page.module.css";

export default function FooterDesktop() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const titleClass = `text-[20px] font-semibold mb-2 ${styles.titleMain}`;
  const linkHoverClass = "hover:text-[#FFC5B8] transition";
  const textSmClass = "text-sm";

  return (
    <footer className="hidden md:block bg-[#FBF7F6] text-[#4b4845] text-sm py-14 px-20">
      <div className="grid grid-cols-4 gap-10 max-w-screen-xl mx-auto">
        {/* Логотип и информация */}
        <div className="space-y-4">
          <h3 className={`text-lg md:text-xl font-light ${styles.logo}`}>BEAUTY HANDS</h3>
          <p className="text-xs mt-[-10px]">Студия красоты</p>
          <p className="text-xs mt-4">Политика конфиденциальности</p>
          <p className="text-xs">
            Все цены на сайте носят информационный характер и не являются публичной офертой.
          </p>
          <p className="text-xs mt-2">Все права защищены © 2014—2025</p>
          <div className="flex gap-4 mt-4">
            <SocialLink href="https://t.me/" alt="Telegram" icon="/telegram.svg" />
            <SocialLink href="https://vk.com/studianailsbh?from=groups" alt="VK" icon="/vk.svg" />
            <SocialLink href="https://api.whatsapp.com/send/?phone=79213904787&text&type=phone_number&app_absent=0" alt="WhatsApp" icon="/whatsapp.svg" />
          </div>
        </div>

        {/* Главная */}
        <div className="space-y-2">
          <h4 className={titleClass}>Меню</h4>
          <ul className="space-y-1">
            {[
              ["Главная", "/"],
              ["Услуги", "/#services"],
              ["Прайс-лист", "/price"],
              ["Портфолио работ", "/portfolio"],
              ["Акции", "/stocks"],
              ["Контакты", "/contacts"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className={linkHoverClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Услуги салона */}
        <div className="space-y-2">
          <h4 className={titleClass}>Услуги салона</h4>
          <ul className="space-y-1">
            {[
              "Ногтевой сервис",
              "Волосы",
              "Брови и ресницы",
              "Массаж",
              "Лицо",
              "Пирсинг",
              "Комплексы",
              "Депиляция",
            ].map((service) => (
              <li key={service}>
                <a className="transition">{service}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Контакты */}
        <div className="space-y-3">
          <h4 className={titleClass}>Контакты</h4>
          <a
            href="tel:+79000000000"
            className="font-semibold hover:text-[#e4ada1] transition"
          >
            +7 (921) 390-47-87
          </a>
          <p className={`${textSmClass} mt-2`}>
            Чкаловский просп., 7, Санкт-Петербург<br />
            (Секция 215, этаж 2)
          </p>
          <p className={textSmClass}>Часы работы: круглосуточно</p>
          <p className={`${textSmClass} mt-2`}>Пионерская, 31, Санкт-Петербург</p>
          <p className={textSmClass}>Часы работы: круглосуточно</p>
        </div>
      </div>

      {/* Кнопка Наверх */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#FFC5B8] hover:bg-[#e4ada1] text-white p-3 rounded-full shadow-lg transition"
          aria-label="Наверх"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </footer>
  );
}

function SocialLink({ href, alt, icon }: { href: string; alt: string; icon: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={alt}>
      <img src={icon} alt={alt} className="w-5 h-5" />
    </a>
  );
}