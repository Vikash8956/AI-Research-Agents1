"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/**
 * Wraps /auth pages — redirects to /dashboard if already logged in.
 */
export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (user || token || storedToken) {
      router.replace("/dashboard");
    }
  }, [user, token, router]);

  return <>{children}</>;
}
