import Image from "next/image";
import styles from "./page.module.css";

const logos = [
  { src: "/iq.svg", alt: "Бренд IQ" },
  { src: "/divinail.svg", alt: "Бренд Divinail" },
  { src: "/nr.svg", alt: "Бренд NR" },
  { src: "/vogue.svg", alt: "Бренд Vogue" },
  { src: "/klio.svg", alt: "Бренд Klio" },
  { src: "/geloff.svg", alt: "Бренд Geloff" },
];

export default function BrandsCarousel() {
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
          {[...logos, ...logos].map(({ src, alt }, idx) => (
            <div
              key={`${src}-${idx}`}
              className="min-w-[200px] sm:min-w-[240px] md:min-w-[300px] h-[120px] sm:h-[140px] md:h-[150px] flex items-center justify-center bg-white rounded shadow-sm px-4 shrink-0"
            >
              <Image
                src={src}
                alt={alt}
                width={100}
                height={60}
                className="object-contain h-[80px] sm:h-[100px] w-auto"
                priority={idx < 3} // первые 3 логотипа загрузить с приоритетом
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
