'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Pill,
  ShoppingCart,
  Store
} from 'lucide-react';

const Menu = () => {
  const pathname = usePathname();

  const items = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'User Management',
      href: '/dashboard/user',
      icon: Users,
    },
    {
      label: 'Medicine Management',
      href: '/dashboard/medicine',
      icon: Pill,
    },
    {
      label: 'Sales',
      href: '/dashboard/sale',
      icon: ShoppingCart,
    },
    {
      label: 'Suppliers',
      href: '/dashboard/supplier',
      icon: Store,
    },
  ];

  return (
    <div className="w-[280px] h-screen bg-white text-gray-700 flex flex-col justify-between shadow-xl border-r border-blue-100">

      {/* Top Section */}
      <div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-100">
          <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
            <Pill className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-semibold text-blue-900">
            Pharmacy<span className="text-blue-500">Monitor</span>
          </h1>
        </div>

        {/* Menu Items */}
        <div className="mt-6 space-y-2 px-4">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-blue-50 hover:text-blue-700 text-gray-700'
                  }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Menu;