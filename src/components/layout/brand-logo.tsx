"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const src =
    mounted && resolvedTheme === "dark" ? "/logo-white.png" : "/logo.png";

  return (
    <Image
      alt="Nevent"
      className={
        className ??
        "h-20 w-auto object-contain sm:h-28 md:h-36 lg:h-44 xl:h-48"
      }
      height={200}
      priority
      src={src}
      width={200}
    />
  );
}
