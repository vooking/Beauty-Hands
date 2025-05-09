"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "@/app/page.module.css";
import PortfolioGallery from "../components/PortfolioGallery";

export default function Portfolio() {
    return (
        <>
          <Header />
    
          <section className="bg-white py-20 px-4 text-center text-[#4b4845] animate-fadeIn">
      <PortfolioGallery />
          </section>

<Footer />
</>
);
}