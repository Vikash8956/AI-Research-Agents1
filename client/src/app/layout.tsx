import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import PageLoader from "@/components/PageLoader";
import ThemeInitializer from "@/components/ThemeInitializer";

export const metadata: Metadata = {
  title: "ResearchAI — Intelligent Research Assistant",
  description: "AI-powered research assistant powered by IBM Granite. Search, summarize, and analyze research papers with next-generation AI.",
  keywords: ["research", "AI", "IBM Granite", "papers", "summarize", "academic"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {/* Applies persisted theme on hydration */}
        <ThemeInitializer />
        {/* Global page transition loader */}
        <PageLoader />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#0d0d1a", color: "#fff", border: "1px solid rgba(79,70,229,0.4)", borderRadius: "12px" },
            success: { iconTheme: { primary: "#00F5A0", secondary: "#0d0d1a" } },
            error: { iconTheme: { primary: "#ff4444", secondary: "#0d0d1a" } },
          }}
        />
      </body>
    </html>
  );
}
