"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import "@/app/globals.css";
import BrandsCarousel from "./components/BrandsCarousel";
import PortfolioGallery from "./components/PortfolioGallery";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import YclientsButton from "./components/YclientsButton";
import GiftCertificates from "./components/GiftCertificates";
import AboutUs from "./components/mobile/AboutUs";
import Kart from "./components/Kart";

export default function Home() {
  return (
    <>
      <section className="relative h-[100vh] w-full flex flex-col items-start justify-center px-6 sm:px-12 md:px-24 lg:px-32">
        {/* Фон */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/image.svg"
            alt="Фон"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Шапка */}
        <Header isTransparent />

        {/* Контент */}
        <div className="max-w-xl text-black z-10 mt-[-100px] sm:mt-[-120px] md:mt-[-150px] animate-fadeIn">
          <h2
            className={`text-left text-[#1e1e1e] font-bold leading-[0.9] mb-4 text-[42px] sm:text-[64px] md:text-[96px] tracking-tight ${styles.titleMain}`}
          >
            Доверь свою <br /> красоту нам
          </h2>
          <p className="mt-[44px] mb-[32px] text-[14px]">
            Скидка 20% новым клиентам на любую услугу при записи онлайн
          </p>
          <YclientsButton />
          <a
            href="https://w298112.yclients.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="border border-gray-600 text-gray-800 text-[20px] px-10 py-3 rounded-[10px] hover:bg-gray-100 transition">
              Записаться онлайн
            </button>
          </a>
        </div>
      </section>

      {/* Цветная полоса */}
      <div className="w-full h-[40px] bg-[#fff3f1]"></div>


      {/* Секция О НАС */}
      {/* Десктопная версия */}
      <div className="relative w-full h-screen overflow-hidden hidden md:block">
        <div className="w-full h-full bg-[#fbf7f6]"></div>
        <h1
          className={`absolute left-[146px] top-[137px] text-[#4b4845] text-[64px] font-semibold m-0 ${styles.titleMain}`}
        >
          Beauty Hands
        </h1>
        <div className="absolute left-[788px] top-[161px] w-[423px] text-[#4b4845]">
          <p className="text-[18px] leading-[27px] font-semibold mb-[30px]">
            Добро пожаловать в Студию красоты «Бьюти Хендс» — место, где вы и
            ваша душа обретут идеальный вид!
          </p>
          <p className="text-[18px] leading-[27px] font-normal">
            Наши мастера позаботятся о вашей коже и ногтях с использованием
            современных инструментов, питательных кремов и ароматных масел,
            чтобы ваши руки выглядели ухоженными, а ногти — здоровыми и
            блестящими.
            <br />
            <br />
            Мы предложим вам различные виды обработки ногтей — классический,
            аппаратный или комбинированный маникюр и педикюр, чтобы вы могли
            выбрать подходящий вариант для себя.
            <br />
            <br />
            Кроме того, у нас доступны шугаринг, кератиновое выпрямление,
            пилинг, эпиляция, парафинотерапия и другие процедуры для
            комплексного ухода.
            <br />
            <br />
            «Бьюти Хендс» — ваш надежный партнер в создании совершенного образа!
          </p>
        </div>
        <div className="absolute left-[292px] top-[246px] w-[400px] h-[600px]">
          <Image
            src="/Zhanna.svg"
            alt="Beauty Hands"
            width={400}
            height={600}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute text-[#ffc5b8] text-[24px] tracking-[0.49em] rotate-[-90deg] origin-top-left left-[237px] top-[596.76px]">
          воплоти мечту
        </div>
        <div className="absolute text-[#ffc5b8] text-[24px] tracking-[0.49em] rotate-[90deg] origin-top-left left-[1293.8px] top-[457.58px] w-[367.45px]">
          тайна красоты
        </div>
        <div className="absolute bg-[#ffc5b8] h-[2px] w-[144.39px] left-[564px] top-[188.32px]"></div>
      </div>

      {/* Мобильная версия */}
      <AboutUs />

      <div className="w-full h-[100px] bg-[#fbf7f6]"></div>

      {/* Секция МЫ - ЭТО */}
      <section className="py-20 bg-[#fff] text-[#4b4845]">
        <div className="flex items-center justify-center mb-14">
          <div className="w-[80px] h-[2px] bg-[#FFC5B8] mr-6"></div>
          <h2
            className={`text-[24px] sm:text-[28px] md:text-[36px] font-semibold ${styles.titleMain}`}
          >
            Мы — это
          </h2>
          <div className="w-[80px] h-[2px] bg-[#FFC5B8] ml-6"></div>
        </div>

        {/* Карточки */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 text-center">
          {/* Карточка 1 */}
          <div className="p-6 rounded-2xl border border-[#f3f3f3] shadow-sm hover:shadow-xl hover:bg-[#fff5f3] transition-all duration-300">
            <div className="mb-4 flex justify-center">
              <Image
                src="/sterility.svg"
                alt="Стерильность"
                width={60}
                height={60}
              />
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Стерильность и качество
            </h3>
            <p className="text-[12px] sm:text-[14px]">
              Мы строго соблюдаем все санитарные нормы и стандарты качества,
              чтобы вы могли быть уверены в безопасности и надежности наших
              услуг.
            </p>
          </div>

          {/* Карточка 2 */}
          <div className="p-6 rounded-2xl border border-[#f3f3f3] shadow-sm hover:shadow-xl hover:bg-[#fff5f3] transition-all duration-300">
            <div className="mb-4 flex justify-center">
              <Image src="/parking.svg" alt="Парковка" width={60} height={60} />
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Места для парковки
            </h3>
            <p className="text-[12px] sm:text-[14px]">
              Мы позаботились о том, чтобы рядом со студией были доступные
              парковочные места для вашего удобства.
            </p>
          </div>

          {/* Карточка 3 */}
          <div className="p-6 rounded-2xl border border-[#f3f3f3] shadow-sm hover:shadow-xl hover:bg-[#fff5f3] transition-all duration-300">
            <div className="mb-4 flex justify-center">
              <Image src="/design.svg" alt="Дизайн" width={60} height={60} />
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Дизайн любой сложности
            </h3>
            <p className="text-[12px] sm:text-[14px]">
              Мы предоставляем 7-дневную гарантию на все покрытия. Если за это
              время возникнут дефекты, мы бесплатно их устраним.
            </p>
          </div>

          {/* Карточка 4 */}
          <div className="p-6 rounded-2xl border border-[#f3f3f3] shadow-sm hover:shadow-xl hover:bg-[#fff5f3] transition-all duration-300">
            <div className="mb-4 flex justify-center">
              <Image
                src="/location.svg"
                alt="Местоположение"
                width={60}
                height={60}
              />
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Удобное местоположение студии
            </h3>
            <p className="text-[12px] sm:text-[14px]">
              Наша студия расположена в удобном месте, что позволяет легко и
              быстро добраться до нас.
            </p>
          </div>
        </div>
      </section>

      {/* Секция НАШИ УСЛУГИ */}
      <section id="services" className="py-30 bg-[#fffaf9] text-[#4b4845]">
        {/* Заголовок */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-[80px] h-[2px] bg-[#FFC5B8] mr-6"></div>
          <h2
            className={`text-[24px] sm:text-[28px] md:text-[36px] font-semibold ${styles.titleMain}`}
          >
            Наши услуги
          </h2>
          <div className="w-[80px] h-[2px] bg-[#FFC5B8] ml-6"></div>
        </div>
        <p className="text-center mb-12 text-[14px] sm:text-[16px]">
          Индивидуальный подход к каждому клиенту
        </p>

        {/* Сетка карточек */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6 px-4">
          {[
            { src: "/nail-service.svg", text: "Ногтевой сервис" },
            { src: "/hair.svg", text: "Волосы" },
            { src: "/brows.svg", text: "Брови и ресницы" },
            { src: "/massage.svg", text: "Массаж" },
            { src: "/face.svg", text: "Лицо" },
            { src: "/piercing.svg", text: "Пирсинг" },
            { src: "/kart-products.svg", text: "Препаратный педикюр KART" },
            { src: "/complex.svg", text: "Комплексы" },
            { src: "/depilation.svg", text: "Депиляция" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-lg shadow-md"
            >
              <a className="block">
                <img
                  src={item.src}
                  alt={item.text}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full bg-[#4b4845]/70 py-3 text-white text-center text-[12px] sm:text-[14px]">
                  {item.text}
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Кнопка */}
        <div className="flex justify-center mt-12">
          <Link
            href="/price"
            className="border border-gray-600 text-gray-800 text-[16px] sm:text-[20px] px-6 py-3 rounded-[10px] hover:bg-gray-100 transition"
          >
            Полный прайс-лист
          </Link>
        </div>
      </section>

      {/* Секция KART */}
      {/* Десктопная версия */}
      <section className="bg-white py-30 px-4 text-[#4b4845] md:block hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          {/* Левая часть */}
          <div>
            {/* Заголовки */}
            <div className="flex items-center mb-2">
              <div className="w-[2px] h-5 bg-[#FFC5B8] mr-4"></div>
              <p
                className={`uppercase tracking-[0.5em] text-1xl text-[#FFC5B8] ${styles.titleMain}`}
              >
                Профессиональный уход
              </p>
            </div>
            <h2 className={`text-3xl mb-10 ${styles.titleMain}`}>KART</h2>

            {/* Описание */}
            <p className="mb-6 text-base leading-relaxed">
              Израильская компания <strong>KART</strong> разрабатывает
              косметические препараты для педикюра, сочетая натуральные
              ингредиенты и инновационные технологии для достижения безопасных и
              качественных результатов.
            </p>

            {/* Фото под текстом */}
            <img
              src="/kart-foot.svg"
              alt="Педикюр KART"
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>

          {/* Правая часть */}
          <div className="flex flex-col justify-start mt-27">
            {/* Фото продуктов */}
            <img
              src="/kart-products.svg"
              alt="Продукция KART"
              className="rounded-lg shadow-md object-cover w-full mb-6"
            />

            {/* Список достоинств */}
            <ul className="space-y-4 text-base">
              <li>
                <span className="font-semibold text-[#FFC5B8]">
                  Безопасность:
                </span>{" "}
                Натуральные и гипоаллергенные компоненты, прошедшие строгий
                контроль качества.
              </li>
              <li>
                <span className="font-semibold text-[#FFC5B8]">
                  Эффективность:
                </span>{" "}
                Препараты глубоко увлажняют и восстанавливают кожу, помогая
                добиться идеального результата.
              </li>
              <li>
                <span className="font-semibold text-[#FFC5B8]">
                  Израильское качество:
                </span>{" "}
                Продукты созданы по передовым технологиям с учетом требований
                дерматологов и косметологов.
              </li>
              <li>
                <span className="font-semibold text-[#FFC5B8]">
                  Уникальность:
                </span>{" "}
                Запатентованные формулы, разработанные специально для педикюра.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Мобильная версия */}
      <Kart />

      {/* Цветная полоса */}
      <div className="w-full h-[40px] bg-[#fff3f1]"></div>

      {/* Секция с брендами */}
      <BrandsCarousel />

      {/* Секция с сертификатами */}
      <section className="bg-[#FBF7F6] ">
      <GiftCertificates />
      </section>

      {/* Секция с портфолио */}
      <section className="bg-white py-20 px-4 text-center text-[#4b4845]">
        <PortfolioGallery />
      </section>

      {/* Подвал */}
      <Footer />
    </>
  );
}
