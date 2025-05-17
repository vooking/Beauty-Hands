import { memo } from "react";
import Image from "next/image";

interface ServiceCardProps {
  src: string;
  text: string;
}

const ServiceCard = memo(({ src, text }: ServiceCardProps) => (
  <div className="relative group overflow-hidden rounded-lg shadow-md">
    <a className="block">
      <Image
        src={src}
        alt={text}
        width={300}
        height={192}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 w-full bg-[#4b4845]/70 py-3 text-white text-center text-[12px] sm:text-[14px]">
        {text}
      </div>
    </a>
  </div>
));

ServiceCard.displayName = "ServiceCard";
export default ServiceCard;