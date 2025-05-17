"use client";

import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ContactForm from "../components/ContactForm";
import styles from "@/app/page.module.css";
import "@/app/globals.css";

type Contact = {
  title: string;
  address: string;
  section: string;
  hours: string;
  mapLink: string;
  mapSrc: string;
};

const contacts: Contact[] = [
  {
    title: "Чкаловская",
    address: "Чкаловский просп., 7, Санкт-Петербург",
    section: "Секция 215, этаж 2",
    hours: "круглосуточно",
    mapLink: "https://yandex.ru/maps/org/byuti_khends/1306142301/",
    mapSrc:
      "https://yandex.ru/map-widget/v1/org/byuti_khends/1306142301/?ll=30.289581%2C59.959435&z=15",
  },
  {
    title: "Пионерская",
    address: "Пионерская, 31, Санкт-Петербург",
    section: "",
    hours: "круглосуточно",
    mapLink: "https://yandex.ru/maps/org/byutiful/22256535367/",
    mapSrc:
      "https://yandex.ru/map-widget/v1/?indoorLevel=1&ll=30.291440%2C59.958821&mode=search&oid=22256535367&ol=biz&z=16.93",
  },
];

export default function Contacts() {
  return (
    <>
      <Header />

      <section className="bg-white py-20 px-4 text-[#4b4845] animate-fadeIn">
        <h2 className={`text-[36px] font-semibold text-center mb-20 ${styles.titleMain}`}>
          Контакты
        </h2>

        <div className="max-w-5xl mx-auto space-y-32">
          {contacts.map(({ title, address, section, hours, mapLink, mapSrc }, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-10 items-start md:items-center">
              {/* Инфо */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="font-semibold text-lg">📍 {address}</p>
                  {section && <p>{section}</p>}
                  <p className="mt-2">🕘 Часы работы: {hours}</p>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm inline-block"
                  >
                    Открыть на карте →
                  </a>
                </div>
              </div>

              {/* Карта */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  className="border-0"
                  title={`Карта - ${title}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Контакты и форма */}
        <div className="text-center mt-32">
          <p className={`text-[22px] font-semibold ${styles.titleMain}`}>
            Остались вопросы?
          </p>
          <p className={`text-[20px] mb-4 font-semibold ${styles.titleMain}`}>
            Просто свяжитесь с нами
          </p>

          <a
            href="tel:+79213904787"
            className="text-[#4b4845] hover:text-[#ff7f50] transition-colors duration-300 block mb-6 text-lg"
          >
            📞 +7 (921) 390-47-87
          </a>

          <ul className="flex justify-center space-x-6 text-[16px] mt-4 mb-10">
            <li>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex items-center space-x-2 hover:text-[#FFC5B8] transition"
              >
                <img src="/telegram.svg" alt="Telegram" className="w-5 h-5" />
                <span>Telegram</span>
              </a>
            </li>
            <li>
              <a
                href="https://vk.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VK"
                className="flex items-center space-x-2 hover:text-[#FFC5B8] transition"
              >
                <img src="/vk.svg" alt="VK" className="w-5 h-5" />
                <span>ВКонтакте</span>
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex items-center space-x-2 hover:text-[#FFC5B8] transition"
              >
                <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            </li>
          </ul>

          <p className={`text-[20px] mb-4 font-semibold ${styles.titleMain}`}>
            Или заполните форму, которую мы обязательно рассмотрим
          </p>

          <ContactForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
