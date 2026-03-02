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
      icon: Store ,
    },
  ];

  return (
    <div className="w-96 h-screen bg-[#0B1B2B] text-gray-300 flex flex-col justify-between pr-10 ">

      {/*  Top Section */}
      <div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Pill className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-semibold text-white">
            Pharmacy<span className="text-emerald-400">Monitor</span>
          </h1>
        </div>

        {/* Menu Items */}
        <div className="mt-4 space-y-2 px-4">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'hover:bg-white/5 hover:text-white'
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
