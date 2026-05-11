"use client";

import { ThemeProvider } from "next-themes";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      enableSystem={false}
    >
      {children}
    </ThemeProvider>
  );
}
