"use client";

import { usePathname } from "next/navigation";
import { NotificationOverlay } from "@/components/NotificationOverlay";
import { NotificationProvider } from "@/contexts/NotificationContext";

const publicRoutePrefixes = [
  "/",
  "/products",
  "/privacy-policy",
  "/terms-and-conditions",
  "/cookie-policy",
  "/solutions",
  "/login",
];

function isPublicRoute(pathname: string) {
  if (pathname === "/") return true;
  return publicRoutePrefixes.some((prefix) => prefix !== "/" && (pathname === prefix || pathname.startsWith(`${prefix}/`)));
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <NotificationProvider>
      {children}
      <NotificationOverlay />
    </NotificationProvider>
  );
}

