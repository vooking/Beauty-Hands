'use client';

import Link from 'next/link';
import styles from '@/app/page.module.css';

export default function Logo() {
  return (
    <div className="flex flex-col items-center">
      <Link
        href="/"
        className={`uppercase text-[24px] lg:text-[30px] font-normal tracking-wide ${styles.logo}`}
      >
        Beauty Hands
      </Link>
      <p className="text-[12px] lg:text-[14px] text-[#555] -mt-1">Студия красоты</p>
    </div>
  );
}
