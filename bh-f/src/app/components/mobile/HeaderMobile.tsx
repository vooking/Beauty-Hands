"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "../layout/Logo";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderMobile() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden flex justify-between items-center w-full relative px-4 py-3 z-20">
        {/* Логотип по центру */}
        <Logo />

        {/* Бургер-кнопка */}
        <button
          className="text-[24px] absolute right-4 top-4 z-30"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Анимация меню */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Затемнённый фон */}
            <motion.div
              className="fixed inset-0 bg-[#FBF7F6]/70 backdrop-blur-sm z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Меню */}
            <motion.div
              className="fixed top-0 left-0 right-0 bg-[#FBF7F6] z-20 p-6 rounded-b-2xl shadow-md flex flex-col items-center space-y-5 pt-24"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <NavLink href="/#services" onClick={() => setMenuOpen(false)}>
                Услуги
              </NavLink>
              <NavLink href="/portfolio" onClick={() => setMenuOpen(false)}>
                Примеры работ
              </NavLink>
              <NavLink href="/price" onClick={() => setMenuOpen(false)}>
                Прайс-лист
              </NavLink>
              <NavLink href="/stocks" onClick={() => setMenuOpen(false)}>
                Акции
              </NavLink>
              <NavLink href="/contacts" onClick={() => setMenuOpen(false)}>
                Контакты
              </NavLink>

              <a
                href="tel:+79213904787"
                className="text-[#4b4845]"
              >
                📞 +7 (921) 390-47-87
              </a>

              {/* Соцсети */}
              <div className="flex gap-6 mt-2 justify-center">
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  <img src="/telegram.svg" alt="Telegram" className="w-6 h-6" />
                </a>
                <a
                  href="https://vk.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="VK"
                >
                  <img src="/vk.svg" alt="VK" className="w-6 h-6" />
                </a>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <img src="/whatsapp.svg" alt="WhatsApp" className="w-6 h-6" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-lg text-[#4b4845] transition"
    >
      {children}
    </Link>
  );
}