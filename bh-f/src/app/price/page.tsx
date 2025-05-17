"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ServicesTable from "../components/ServicesTable";

export default function Price() {
  return (
    <>
      <Header />

      <main className="bg-white py-20 px-4 text-center text-[#4b4845] animate-fadeIn">
        <ServicesTable />
      </main>

      <Footer />
    </>
  );
}
