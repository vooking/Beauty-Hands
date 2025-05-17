"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "../layout/Logo";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderMobile() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="lg:hidden flex justify-between items-center w-full px-4 py-3 z-20 relative">
        <Logo />
        <button
          className="absolute right-4 top-4 z-30"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-[#FBF7F6]/70 backdrop-blur-sm z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <motion.nav
              className="fixed top-0 left-0 right-0 bg-[#FBF7F6] z-20 p-6 rounded-b-2xl shadow-md flex flex-col items-center space-y-5 pt-24"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              {[
                { href: "/#services", label: "Услуги" },
                { href: "/portfolio", label: "Примеры работ" },
                { href: "/price", label: "Прайс-лист" },
                { href: "/stocks", label: "Акции" },
                { href: "/contacts", label: "Контакты" },
              ].map((link) => (
                <NavLink key={link.href} href={link.href} onClick={closeMenu}>
                  {link.label}
                </NavLink>
              ))}

              <a
                href="tel:+79213904787"
                className="text-[#4b4845] font-semibold"
              >
                📞 +7 (921) 390-47-87
              </a>

              <SocialIcons />
            </motion.nav>
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
      className="text-lg text-[#4b4845] hover:text-[#FFC5B8] transition"
    >
      {children}
    </Link>
  );
}

function SocialIcons() {
  const icons = [
    { href: "https://t.me/", label: "Telegram", icon: "/telegram.svg" },
    { href: "https://vk.com/", label: "VK", icon: "/vk.svg" },
    { href: "https://wa.me/", label: "WhatsApp", icon: "/whatsapp.svg" },
  ];
  return (
    <div className="flex gap-6 mt-2 justify-center">
      {icons.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <img src={icon} alt={label} className="w-6 h-6" />
        </a>
      ))}
    </div>
  );
}
