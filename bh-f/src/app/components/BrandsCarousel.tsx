import Image from "next/image";
import styles from "./page.module.css";

export default function BrandsCarousel() {
  const logos = [
    "/iq.svg",
    "/divinail.svg",
    "/nr.svg",
    "/vogue.svg",
    "/klio.svg",
    "/geloff.svg",
  ];

  return (
    <section className="bg-[#FBF7F6] py-12 text-[#4b4845] px-4">
      <h2
        className="text-center text-2xl sm:text-3xl md:text-[36px] font-semibold mb-10 leading-snug"
        style={{ fontFamily: "Cormorant Garamond, serif" }}
      >
        Проверенные и
        <br />
        сертифицированные бренды
      </h2>

      <div className={`${styles.scrollWrapper} overflow-x-auto`}>
        <div className={`${styles.scrollContent} flex gap-4`}>
          {[...logos, ...logos].map((logo, idx) => (
            <div
              key={idx}
              className="min-w-[200px] sm:min-w-[240px] md:min-w-[300px] h-[120px] sm:h-[140px] md:h-[150px] flex items-center justify-center bg-white rounded shadow-sm px-4 shrink-0"
            >
              <Image
                src={logo}
                alt={`Бренд ${idx}`}
                width={100}
                height={60}
                className="object-contain h-[80px] sm:h-[100px] w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
