'use client';

import HeaderDesktop from "../desktop/HeaderDesktop";
import HeaderMobile from "../mobile/HeaderMobile";


export default function Header({ isTransparent = false }: { isTransparent?: boolean }) {
  return (
    <header
      className={`${
        isTransparent ? 'absolute bg-transparent' : 'relative bg-[#FBF7F6]'
      } top-0 left-0 w-full z-20 px-6 lg:px-[100px] py-5 text-[18px] text-gray-700`}
    >
      <div className="flex justify-between items-center">
        {/* Desktop */}
        <div className="hidden lg:flex justify-between items-center w-full">
          <HeaderDesktop />
        </div>

        {/* Mobile */}
        <div className="lg:hidden w-full">
          <HeaderMobile />
        </div>
      </div>
    </header>
  );
}
