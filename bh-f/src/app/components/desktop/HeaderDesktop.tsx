import Link from 'next/link';
import Logo from '../layout/Logo';

export default function HeaderDesktop() {
  return (
    <>
      <nav className="hidden lg:flex space-x-[30px]">
        {["/#services", "/portfolio", "/price"].map((href, i) => (
          <NavLink key={i} href={href}>
            {["Услуги", "Примеры работ", "Прайс-лист"][i]}
          </NavLink>
        ))}
      </nav>

      <Logo />

      <div className="hidden lg:flex space-x-[30px] items-center">
        <NavLink href="/stocks">Акции</NavLink>
        <NavLink href="/contacts">Контакты</NavLink>
        <a
          href="tel:+79213904787"
          className="text-[#4b4845] hover:text-[#FFC5B8] transition"
        >
          📞 +7 (921) 390-47-87
        </a>
      </div>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative transition duration-300 hover:text-[#FFC5B8]
        before:absolute before:bottom-0 before:left-0 before:h-[2px] before:bg-[#FFC5B8]
        before:w-0 hover:before:w-full before:transition-all before:duration-300"
    >
      {children}
    </Link>
  );
}
