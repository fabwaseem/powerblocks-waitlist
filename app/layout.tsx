import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/context/query-provider";
import { AuthProvider } from "@/context/auth-provider";
import { Toaster } from "react-hot-toast";

const aeonik = localFont({
  src: [
    {
      path: "./fonts/Aeonik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Aeonik-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Aeonik-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-aeonik",
});

export const metadata: Metadata = {
  title: "PowerBlocks - From the Streets to the Jet",
  description:
    "Play games, win prizes, and climb the leaderboard with PowerBlocks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${aeonik.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "#1f2937",
                    color: "#f9fafb",
                    border: "1px solid #374151",
                  },
                  success: {
                    iconTheme: {
                      primary: "#10b981",
                      secondary: "#f9fafb",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#f9fafb",
                    },
                  },
                }}
              />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
