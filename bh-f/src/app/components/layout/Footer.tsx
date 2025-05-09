"use client";

import "@/app/globals.css";
import FooterMobile from "../mobile/FooterMobile";
import FooterDesktop from "../desktop/FooterDesktop";

export default function Footer() {
  return (
    <>
    <FooterMobile /><FooterDesktop />
    </>
  );
}
