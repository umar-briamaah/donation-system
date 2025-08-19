import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SimpleAuthProvider } from "./contexts/SimpleAuthContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import ClientOnly from "./components/ui/ClientOnly";

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
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ClientOnly fallback={<div className="light">{children}</div>}>
          <ErrorBoundary>
            <SimpleAuthProvider>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </SimpleAuthProvider>
          </ErrorBoundary>
        </ClientOnly>
      </body>
    </html>
  );
}
