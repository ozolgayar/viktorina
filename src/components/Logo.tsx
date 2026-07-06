import Image from "next/image";

interface LogoProps {
  /** light = белый логотип на тёмном/градиентном фоне */
  light?: boolean;
  className?: string;
}

/**
 * Компактный логотип ГЕРОФАРМ для шапки.
 * SVG прозрачный, без фона; на градиенте — инверсия в белый.
 */
export function Logo({ light = true, className = "" }: LogoProps) {
  return (
    <div
      className={`logo-container ${light ? "logo-container--light" : ""} ${className}`}
    >
      <Image
        src="/logo/horizontal.svg"
        alt="ГЕРОФАРМ"
        width={140}
        height={32}
        className="h-auto w-full max-w-[110px] object-contain object-left sm:max-w-[140px]"
        priority
      />
    </div>
  );
}
