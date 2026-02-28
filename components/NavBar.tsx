'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  CircleUserRound,
  LogOut,
  Menu as MenuIcon,
  LayoutDashboard,
  Users,
  Pill,
  ShoppingCart,
  Store,
  User as UserIcon // rename the icon to avoid conflict
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { User } from "@/types";
import { get } from "http";
import { getUserById } from "@/service/userService";

export default function NavBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [fullUser, setFullUser] = useState<User | null>(null); // single user

  useEffect(() => {
    if (!user?.id) return;
    const fetchUser = async () => {
      try {
        const data = await getUserById(user.id);
        setFullUser(data);
      } catch (error) {
        console.error("Fetch user error:", error);
      }
    };
    fetchUser();
  },
    [user]);

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'User Management', href: '/dashboard/user', icon: Users },
    { label: 'Medicine Management', href: '/dashboard/medicine', icon: Pill },
    { label: 'Sales', href: '/dashboard/sale', icon: ShoppingCart },
    { label: 'Suppliers', href: '/dashboard/supplier', icon: Store },
  ];

  return (
    <header className="w-full h-16 fixed bg-white border-b flex items-center px-4 md:px-6 shadow-sm z-50">

      {/* Logo for CASHIER/PHARMACIST */}
      {(user?.role === "CASHIER" || user?.role === "PHARMACIST") && (
        <h1 className="text-xl font-semibold text-gray-800">
          Pharmacy<span className="text-emerald-400">Monitor</span>
        </h1>
      )}

      <div className="flex items-center gap-4">

        {/* ADMIN Mobile menu */}
        {user?.role === "ADMIN" && (
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition">
                  <MenuIcon size={24} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 bg-white">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <DropdownMenuItem asChild key={item.label}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 px-2 py-2 rounded transition
                          ${isActive ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-gray-100"}`}
                      >
                        <Icon size={18} /> {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}

                {/* Profile */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
                  >
                    <UserIcon size={18} /> Profile
                  </Link>
                </DropdownMenuItem>

                {/* Logout */}
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 px-2 py-2 rounded text-red-500 hover:bg-gray-100"
                >
                  <LogOut size={18} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* User avatar (always visible) */}
        <div className={`user?.role === "ADMIN" ? "hidden ml-60" : ""}`}>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CircleUserRound
              size={32}
              className="cursor-pointer text-gray-600 hover:text-gray-800 transition"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 bg-white">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-gray-800 font-medium">{fullUser?.name || "Loading..."}</p>
              <p className="text-gray-500 text-sm">{fullUser?.role.toLowerCase()}</p>
            </div>

            <DropdownMenuItem
              className="text-red-500 hover:bg-gray-50 flex items-center gap-2"
              onClick={logout}
            >
              <LogOut size={16} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        </div>
        
      </div>
    </header>
  );
}