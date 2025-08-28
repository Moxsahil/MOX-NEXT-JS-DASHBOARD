import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MOX School Management Dashboard",
  description: "Modern Next.js School Management System with stunning UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`dark ${inter.variable} ${poppins.variable}`}
        suppressHydrationWarning
      >
        <body className={inter.className}>
          {children}
          <ToastContainer
            position="bottom-right"
            theme="dark"
            toastClassName="backdrop-blur-xl bg-dark-secondary/95 border border-dark-border-primary shadow-2xl"
            progressClassName="bg-gradient-to-r from-brand-primary to-brand-secondary"
            closeButtonStyle={{
              color: "#3b82f6",
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
