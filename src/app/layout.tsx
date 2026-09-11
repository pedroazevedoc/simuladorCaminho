import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/providers/theme-provider";
import { BackgroundContainer } from "@/components/layouts/backgroundContainer";
import { AppCursor } from "@/components/layouts/appCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simulador - Caminho",
  description: "Simulador para encontrar o menor caminho entre dois pontos em um mapa utilizando o algoritmo de Dijkstra.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundContainer>
            {children}
          </BackgroundContainer>
        </ThemeProvider>
        <AppCursor />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
