"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideOnAdmin = pathname.startsWith("/admin");
  const isHomePage = pathname === "/";

  const hideHeader = hideOnAdmin || isHomePage;
  const hideFooter = hideOnAdmin;

  return (
    <>
      {!hideHeader && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
