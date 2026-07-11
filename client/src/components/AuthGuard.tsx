"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/**
 * Wraps dashboard pages — redirects to /auth/login if not authenticated.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Give zustand/persist a tick to rehydrate from localStorage
    const t = setTimeout(() => {
      const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!user && !token && !storedToken) {
        router.replace("/auth/login");
      }
    }, 50);
    return () => clearTimeout(t);
  }, [user, token, router]);

  // If not yet hydrated or no user, show nothing (loader handles the visual)
  if (!user && !token) return null;

  return <>{children}</>;
}
