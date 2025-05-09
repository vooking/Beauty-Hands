"use client";

import Image from "next/image";
import styles from "@/app/page.module.css";

export default function MobileIntro() {
  return (
    <div className="block md:hidden bg-[#fbf7f6] text-center px-4 py-8 text-[#4b4845]">
      <h1 className={`text-[36px] font-semibold mb-4 ${styles.titleMain}`}>
        Beauty Hands
      </h1>
      <div className="bg-[#ffc5b8] h-[2px] mb-5"></div>

      <p className="text-[16px] leading-[24px] font-semibold mb-4">
        Добро пожаловать в Студию красоты «Бьюти Хендс» — место, где вы и ваша душа обретут идеальный вид!
      </p>
      <p className="text-[16px] leading-[24px] font-normal mb-4">
        Наши мастера позаботятся о вашей коже и ногтях с использованием современных инструментов, питательных кремов и ароматных масел, чтобы ваши руки выглядели ухоженными, а ногти — здоровыми и блестящими.
      </p>
      <p className="text-[16px] leading-[24px] font-normal mb-4">
        Мы предложим вам различные виды обработки ногтей — классический, аппаратный или комбинированный маникюр и педикюр.
      </p>
      <p className="text-[16px] leading-[24px] font-normal mb-4">
        Кроме того, у нас доступны шугаринг, кератиновое выпрямление, пилинг, эпиляция, парафинотерапия и другие процедуры.
      </p>

      <div className="bg-[#ffc5b8] h-[2px] mb-5"></div>

      <div className="px-2 text-[#ffc5b8] tracking-[0.3em]">
        <span>воплоти мечту</span>
      </div>

      <div className="flex justify-center my-6">
        <Image
          src="/Zhanna.svg"
          alt="Beauty Hands"
          width={300}
          height={450}
          className="w-[300px] h-auto object-contain"
        />
      </div>

      <div className="px-2 text-[#ffc5b8] tracking-[0.3em]">
        <span>тайна красоты</span>
      </div>
    </div>
  );
}
