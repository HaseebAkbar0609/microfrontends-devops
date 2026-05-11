import { SubHeroProps } from "./SubHero.types";
import Link from "next/link";

const SubHero: React.FC<SubHeroProps> = ({
  image,
  title,
  subtitle,
  className,
  ctaText,
  ctaLink = "#",
}) => {
  return (
    <div
      className={`relative ${image} bg-cover bg-no-repeat bg-center font-bold text-center px-4 py-6 md:py-12 lg:py-18 ${className ?? ""}`}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="container mx-auto text-white relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl font-medium">{subtitle}</p>
        )}
        {ctaText && (
          <Link
            href={ctaLink}
            className="inline-block mt-6 bg-[#FF7A00] hover:bg-[#E96A00] text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default SubHero;
