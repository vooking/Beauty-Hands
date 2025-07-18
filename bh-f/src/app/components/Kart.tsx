import styles from "@/app/page.module.css";
import "@/app/globals.css";

const features = [
  {
    title: "Безопасность",
    description:
      "Натуральные и гипоаллергенные компоненты, прошедшие строгий контроль качества.",
  },
  {
    title: "Эффективность",
    description:
      "Препараты глубоко увлажняют и восстанавливают кожу, помогая добиться идеального результата.",
  },
  {
    title: "Израильское качество",
    description:
      "Продукты созданы по передовым технологиям с учетом требований дерматологов и косметологов.",
  },
  {
    title: "Уникальность",
    description:
      "Запатентованные формулы, разработанные специально для педикюра.",
  },
];

const FeatureList = () => (
  <ul className="space-y-4 text-base mb-6">
    {features.map(({ title, description }) => (
      <li key={title}>
        <span className="font-semibold text-[#FFC5B8]">{title}:</span> {description}
      </li>
    ))}
  </ul>
);

export default function Kart() {
  return (
    <section className="bg-white py-20 px-4 text-[#4b4845] md:hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 items-start">
        <div>
          <div className="flex items-center mb-2">
            <div className="w-[2px] h-10 bg-[#FFC5B8] mr-4" />
            <p className={`uppercase tracking-[0.5em] text-1xl text-[#FFC5B8] ${styles.titleMain}`}>
              Профессиональный уход
            </p>
          </div>
          <h2 className={`text-3xl mb-6 ${styles.titleMain}`}>KART</h2>
          <p className="mb-6 text-base leading-relaxed">
            Израильская компания <strong>KART</strong> разрабатывает косметические препараты для педикюра,
            сочетая натуральные ингредиенты и инновационные технологии для достижения безопасных и качественных результатов.
          </p>
        </div>

        <div>
          <img
            src="/kart-foot.svg"
            alt="Педикюр KART"
            className="rounded-lg shadow-md object-cover w-full mb-6"
          />
        </div>

        <div className="flex flex-col justify-start">
          <FeatureList />
          <img
            src="/kart-products.svg"
            alt="Продукция KART"
            className="rounded-lg shadow-md object-cover w-full mb-6"
          />
        </div>
      </div>
    </section>
  );
}
