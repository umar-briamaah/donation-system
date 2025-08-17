import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import ClientOnly from "./components/ui/ClientOnly";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Give Hope - Online Donation Management System",
  description: "Make a difference with secure online donations. Support various causes and track your impact with Give Hope.",
  keywords: "donations, charity, nonprofit, giving, hope, causes, fundraising",
  authors: [{ name: "Give Hope Team" }],
  openGraph: {
    title: "Give Hope - Online Donation Management System",
    description: "Make a difference with secure online donations. Support various causes and track your impact with Give Hope.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            <ClientOnly fallback={<div className="light">{children}</div>}>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </ClientOnly>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
