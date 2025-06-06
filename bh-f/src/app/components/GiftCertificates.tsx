import Image from "next/image";
import styles from "@/app/page.module.css";
import "@/app/globals.css";

const giftItems = [
    {
      image: "/gift1.svg",
      title: "Широкий выбор услуг",
      desc: "Выберите любую услугу салона — от маникюра до полного преображения",
    },
    {
      image: "/gift2.svg",
      title: "Индивидуальный номинал",
      desc: "Сертификат можно настроить на любую услугу или пакет, в зависимости от пожеланий",
    },
    {
      image: "/gift3.svg",
      title: "Свободная сумма",
      desc: "Укажите желаемую сумму, и получатель сам решит, на что её потратить",
    },
    {
      image: "/gift4.svg",
      title: "Идеальный презент",
      desc: "Дарите удовольствие и красоту — подходящий подарок для каждого",
    },
  ];
  
  export default function GiftCertificates() {
    return (
      <section className="py-20 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <span className="h-px bg-[#FFC5B8] flex-1 max-w-[60px] sm:max-w-[100px]"></span>
            <h2
              className={`text-[#4b4845] text-[24px] sm:text-[36px] font-semibold mx-4 ${styles.titleMain}`}
            >
              Подарочные сертификаты
            </h2>
            <span className="h-px bg-[#FFC5B8] flex-1 max-w-[60px] sm:max-w-[100px]"></span>
          </div>
  
          <p className="text-gray-600 text-sm sm:text-base max-w-1xl mx-auto mb-12 px-2 sm:px-0">
            Подарите вашим близким возможность почувствовать себя особенными! Наши
            подарочные сертификаты — идеальный способ порадовать родных и друзей
            заботой и вниманием. Сертификат позволяет выбрать любую услугу из
            нашего ассортимента — от расслабляющих процедур до стильных
            обновлений образа. Сделайте подарок, который останется в памяти
            надолго и подарит истинное наслаждение от качественного ухода и
            профессионального сервиса.
          </p>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {giftItems.map((gift, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Image
                  src={gift.image}
                  alt={gift.title}
                  width={300}
                  height={300}
                  className="rounded mb-4 w-full sm:w-[220px] h-auto"
                />
                <h3 className="font-semibold text-[#FFC5B8] text-base mb-2">
                  {gift.title}
                </h3>
                <p className="text-sm text-gray-600 px-2">{gift.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
