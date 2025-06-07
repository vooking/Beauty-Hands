import { memo } from "react";
import Image from "next/image";

interface FeatureCardProps {
  src: string;
  title: string;
  description: string;
}

const FeatureCard = memo(({ src, title, description }: FeatureCardProps) => (
  <div className="p-6 rounded-2xl border border-[#f3f3f3] shadow-sm hover:shadow-xl hover:bg-[#fff5f3] transition-all duration-300">
    <div className="mb-4 flex justify-center">
      <Image src={src} alt={title} width={60} height={60} />
    </div>
    <h3 className="font-semibold mb-2 text-sm sm:text-base">{title}</h3>
    <p className="text-[12px] sm:text-[14px]">{description}</p>
  </div>
));

FeatureCard.displayName = "FeatureCard";
export default FeatureCard;