'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Панель' },
  { href: '/admin/feedback', label: 'Обратная связь' },
  { href: '/admin/services', label: 'Услуги' },
  { href: '/admin/portfolio', label: 'Портфолио' },
];

const AdminNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow-md"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-md p-6 transition-transform z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-8">Админка</h2>

        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const baseClasses =
                'block px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition';
              const activeClasses = isActive
                ? 'bg-gray-100 font-semibold border-l-4 border-gray-500'
                : '';
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${baseClasses} ${activeClasses}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Кнопка выхода прижата вниз */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 text-red-600 hover:text-red-800 transition"
        >
          <LogOut className="w-5 h-5" />
          Выйти
        </button>
      </aside>
    </>
  );
};

export default AdminNavbar;
