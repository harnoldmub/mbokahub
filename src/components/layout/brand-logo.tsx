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
        "h-10 w-auto object-contain sm:h-12 md:h-14 lg:h-16"
      }
      height={160}
      priority
      src={src}
      width={160}
    />
  );
}
