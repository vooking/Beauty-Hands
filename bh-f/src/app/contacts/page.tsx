"use client";

import React, { useState } from "react";
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
  metro: string;
  walkTime: string;
  features: string[];
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
    metro: "Чкаловская",
    walkTime: "3 минуты от метро",
    features: [
      "Круглосуточная запись",
      "Удобная парковка",
      "Детская зона ожидания",
      "Wi-Fi для клиентов",
      "Велопарковка",
      "Оплата картой или наличными",
    ],
  },
  {
    title: "Пионерская",
    address: "Пионерская, 31, Санкт-Петербург",
    section: "Секция 104, этаж 1",
    hours: "круглосуточно",
    mapLink: "https://yandex.ru/maps/org/byutiful/22256535367/",
    mapSrc:
      "https://yandex.ru/map-widget/v1/?indoorLevel=1&ll=30.291440%2C59.958821&mode=search&oid=22256535367&ol=biz&z=16.93",
    metro: "Чкаловская",
    walkTime: "5 минут от метро",
    features: [
      "Круглосуточная запись",
      "Удобная парковка",
      "Детская зона ожидания",
      "Wi-Fi для клиентов",
      "Велопарковка",
      "Оплата картой",
    ],
  },
];

export default function Contacts() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <section className="bg-white py-8 md:py-16 px-4 text-[#4b4845] animate-fadeIn">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-6 md:mb-12 ${styles.titleMain}`}>
            Контакты
          </h2>

          <div className="flex mb-4 md:mb-8 border-b border-gray-200 overflow-x-auto md:overflow-visible">
            {contacts.map((contact, index) => (
              <button
                key={index}
                className={`px-4 md:px-6 py-2 md:py-3 font-medium text-base md:text-lg whitespace-nowrap transition-colors ${
                  activeTab === index
                    ? "text-[#4b4845] border-b-2 border-[#4b4845]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => setActiveTab(index)}
              >
                {contact.title}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[600px] mb-12 md:mb-20 bg-[#f8f8f8] rounded-2xl shadow-sm">
            <div className="w-full md:w-1/2 p-6 md:p-8">
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-bold">— {contacts[activeTab].title}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start md:items-center gap-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5 md:mt-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{contacts[activeTab].address}</span>
                  </div>
                  
                  {contacts[activeTab].section && (
                    <p className="text-sm text-gray-600 ml-7 md:pl-7 -mt-2 md:mt-0">{contacts[activeTab].section}</p>
                  )}
                  
                  <div className="flex items-start md:items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5 md:mt-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Часы работы: {contacts[activeTab].hours.includes("круглосуточно")
                        ? "24 часа"
                        : contacts[activeTab].hours}</span>
                  </div>
                  
                  <div className="flex items-start md:items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5 md:mt-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Метро: {contacts[activeTab].metro} ({contacts[activeTab].walkTime})</span>
                  </div>
                  
                  <a
                    href={contacts[activeTab].mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-blue-600 hover:underline text-sm ml-7 md:pl-7"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Открыть на карте
                  </a>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-base md:text-lg mb-2 md:mb-3">Особенности:</h4>
                  <ul className="space-y-2">
                    {contacts[activeTab].features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 h-64 md:h-full">
              <iframe
                src={contacts[activeTab].mapSrc}
                width="100%"
                height="100%"
                allowFullScreen
                className="border-0 rounded-b-2xl md:rounded-none"
                title={`Карта - ${contacts[activeTab].title}`}
              />
            </div>
          </div>

          <div className="text-center mt-12 md:mt-32">
            <p className={`text-lg md:text-[22px] font-semibold ${styles.titleMain}`}>
              Остались вопросы?
            </p>
            <p className={`text-base md:text-[20px] mb-4 font-semibold ${styles.titleMain}`}>
              Просто свяжитесь с нами
            </p>

            <a
              href="tel:+79213904787"
              className="text-[#4b4845] hover:text-[#ff7f50] transition-colors duration-300 block mb-4 md:mb-6 text-lg"
            >
              📞 +7 (921) 390-47-87
            </a>

            <ul className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-[16px] mt-4 mb-6 md:mb-10">
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
                  href="https://vk.com/studianailsbh?from=groups"
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
                  href="https://api.whatsapp.com/send/?phone=79213904787&text&type=phone_number&app_absent=0"
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

            <p className={`text-base md:text-[20px] mb-4 font-semibold ${styles.titleMain}`}>
              Или заполните форму, которую мы обязательно рассмотрим
            </p>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}