import React from "react";
import Footer from "@/components/common/layout/Footer";
import Header from "@/components/common/layout/Header";
import ScrollToTopButton from "@/components/common/layout/ScrollToTopButton";
import CookieConsent from "@/components/common/layout/CookieConsent";

interface LayoutProps {
  children: React.ReactNode;
  hasHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hasHeader = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {hasHeader && <Header />}
      <main className="flex-1">{children}</main>
      {hasHeader && <Footer />}
      <ScrollToTopButton />
      <CookieConsent />
    </div>
  );
};

export default Layout;