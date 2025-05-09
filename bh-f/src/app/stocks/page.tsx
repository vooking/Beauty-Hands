"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "@/app/page.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import GiftCertificates from "../components/GiftCertificates";

export default function Stocks() {
  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleDetails = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const promotions = [
    {
      image: "/promo1.svg",
      title: "Скидка 400 рублей на первое посещение!",
      preview: "Подробнее",
      description:
        "Для новых клиентов у нас есть особое предложение: получите скидку 400 рублей на любую услугу при первом визите.\n\nЧтобы воспользоваться предложением, просто напишите нам в социальной сети ВКонтакте, и администратор добавит вас в список участников акции.\n\nОтличный способ познакомиться с нашими мастерами и насладиться профессиональным уходом по еще более привлекательной цене!",
    },
    {
      image: "/promo2.svg",
      title: "Скидка 5% на пятую услугу",
      preview: "Подробнее",
      description:
        "Ценим лояльность наших клиентов!\n\nКаждый пятый визит в студию дает вам право на скидку 5% на одну выбранную услугу.\n\nНезависимо от типа процедуры — будь то стрижка, маникюр или уход за кожей — постоянные клиенты получают приятный бонус.",
    },
    {
      image: "/promo3.svg",
      title: "Скидка 20% на десятую услугу",
      preview: "Подробнее",
      description:
        "Продолжайте радовать себя и экономьте больше с каждым визитом!\n\nПри десятом посещении студии вы получаете скидку 20% на одну выбранную услугу.\n\nЭто наш способ поблагодарить вас за доверие и верность нашей студии!",
    },
    {
      image: "/promo4.svg",
      title: "Бонус 1000 рублей на День рождения",
      preview: "Подробнее",
      description:
        "Дарим нашим постоянным клиентам специальный подарок на День рождения!\n\nПолучите 1000 рублей, которые можно использовать для оплаты до 30% стоимости любой услуги.\n\nАкция действует в течение всего месяца, в который у вас День рождения, так что планируйте посещение и воспользуйтесь приятным бонусом.",
    },
  ];

  return (
    <>
      <Header />

      <section className="bg-white py-20 px-4 text-center text-[#4b4845] animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-[36px] font-semibold mb-10 ${styles.titleMain}`}>
            Акции
          </h2>

          <p className="text-gray-600 max-w-1xl mx-auto mb-8">
            Добро пожаловать в мир красоты и заботы по привлекательной цене! Мы
            рады предложить вам уникальные акции и скидки, которые сделают ваши
            любимые процедуры еще доступнее. Наслаждайтесь профессиональными
            услугами в уютной атмосфере, воспользуйтесь бонусами на процедуры
            или подарите себе день релакса.
          </p>

          <p className="text-gray-600 max-w-1xl mx-auto mb-12 mt-6">
            Обратите внимание: акции не суммируются, поэтому при посещении
            выберите наиболее выгодное предложение.
          </p>

          <div
            className={`${
              isMobile
                ? "flex flex-col space-y-8"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
            }`}
          >
            {promotions.map((promo, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm text-left"
              >
                <Image
                  src={promo.image}
                  alt={promo.title}
                  width={300}
                  height={300}
                  className="w-full h-auto rounded mb-4"
                />
                <h3 className="font-semibold text-md mb-2 text-[#4b4845]">
                  {promo.title}
                </h3>
                <button
                  onClick={() => toggleDetails(index)}
                  className="text-[#FFC5B8] hover:underline text-sm"
                >
                  {promo.preview}
                </button>
                {openIndex === index && (
                  <p className="text-sm text-gray-600 mt-4 whitespace-pre-line">
                    {promo.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Секция с сертификатами */}
          <GiftCertificates />

          {/* Контакты */}
          <div className="text-center mt-32">
            <p className={`text-[22px] font-semibold ${styles.titleMain}`}>
              Остались вопросы?
            </p>
            <p className={`text-[20px] mb-4 font-semibold ${styles.titleMain}`}>
              Просто свяжитесь с нами
            </p>

            <a
              href="tel:+79213904787"
              className="text-[#4b4845] hover:text-[#FFC5B8] transition-colors duration-300 block mb-6 text-lg"
            >
              📞 +7 (921) 390-47-87
            </a>

            <ul className="flex justify-center space-x-6 text-[16px] mt-4">
              {[
                {
                  href: "https://t.me/",
                  icon: "/telegram.svg",
                  label: "Telegram",
                },
                {
                  href: "https://vk.com/",
                  icon: "/vk.svg",
                  label: "ВКонтакте",
                },
                {
                  href: "https://wa.me/",
                  icon: "/whatsapp.svg",
                  label: "WhatsApp",
                },
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-[#FFC5B8] transition"
                  >
                    <img src={item.icon} alt={item.label} className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
