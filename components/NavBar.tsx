'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  LogOut,
  Menu as MenuIcon,
  LayoutDashboard,
  Users,
  Pill,
  ShoppingCart,
  Store,
  User as UserIcon,
  Bell
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { User, Notification } from "@/types";
import { getUserById } from "@/service/userService";
import { getNotifications, markNotificationRead } from "@/service/notificationService";

export default function NavBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [fullUser, setFullUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch full user info
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
  }, [user]);

  // Fetch unread notifications for ADMIN
  // Fetch notifications for admin
  useEffect(() => {
    if (user?.role !== "ADMIN") return;

    const fetchNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };

    fetchNotifications();
  }, [user]);

  // Mark notification as read
  const handleMarkRead = async (id: number) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'User Management', href: '/dashboard/user', icon: Users },
    { label: 'Medicine Management', href: '/dashboard/medicine', icon: Pill },
    { label: 'Sales', href: '/dashboard/sale', icon: ShoppingCart },
    { label: 'Suppliers', href: '/dashboard/supplier', icon: Store },
  ];

  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {(user?.role === "CASHIER" || user?.role === "PHARMACIST") && (
          <h1 className="text-xl font-semibold text-gray-800">
            Pharmacy
            <span className="text-emerald-400">Monitor</span>
          </h1>
        )}

        {/* Admin Mobile Menu */}
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
                          ${isActive
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "hover:bg-gray-100"
                          }`}
                      >
                        <Icon size={18} />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 px-2 py-2 rounded text-red-500 hover:bg-gray-100"
                >
                  <LogOut size={18} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* 🔔 ADMIN ONLY NOTIFICATIONS */}
        {user?.role === "ADMIN" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative cursor-pointer">
                <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {notifications.length}
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 bg-white p-3 max-h-96 overflow-y-auto">
              <h4 className="font-semibold mb-2">Low Stock Notifications</h4>

              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No new notifications ✅</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="flex justify-between items-center mb-2 border-b pb-1">
                    <p className="text-sm">{n.message}</p>
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-xs text-emerald-500 hover:underline"
                    >
                      Mark Read
                    </button>
                  </div>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* PROFILE */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-medium text-sm cursor-pointer hover:ring-2 hover:ring-emerald-600 transition">
              {fullUser?.name
                ? fullUser.name[0].toUpperCase()
                : <UserIcon className="w-4 h-4" />}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 bg-white">
            <div className="px-4 py-2 border-b">
              <p className="text-gray-800 font-medium">{fullUser?.name || "Loading..."}</p>
              <p className="text-gray-500 text-sm">{fullUser?.role?.toLowerCase()}</p>
            </div>

            {user?.role === "CASHIER" && (
              <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-50">
                <Link href="/casher/sale" className="w-full">Sales</Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:bg-gray-50"
            >
              <LogOut size={16} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}