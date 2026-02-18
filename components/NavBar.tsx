'use client'

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext";
import { getUserById } from "@/service/userService";
import { Pill, CircleUserRound, LogOut } from "lucide-react"
import { useEffect, useState } from "react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [fullUser, setFullUser] = useState<any>(null);

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

  return (
    <header className="w-full h-16 fixed bg-white border-b flex items-center px-6 shadow-sm">

      {/* LEFT */}
      {(user?.role === "CASHIER" || user?.role === "PHARMACIST") && (
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Pill className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-semibold">
            Pharmacy<span className="text-emerald-400">Monitor</span>
          </h1>
        </div>
      )}

      {/* RIGHT: */}
      <div className={`flex items-center gap-4 ml-auto  ${user?.role === "ADMIN" && "pr-60" }`}>
        <Button variant="outline" size="sm" className="flex gap-2 border-none text-red-500" onClick={logout}>
          <LogOut size={16} />
          Logout
        </Button>

        <div className="flex items-center gap-2">
          <CircleUserRound size={32} className="cursor-pointer text-gray-600" />
          <div className="flex flex-col">
            <p className="text-green-400 text-base">{fullUser?.name || "Loading..."}</p>
            <p className="text-sm">{fullUser?.role.toLowerCase()}</p>
          </div>
        </div>
      </div>

    </header>
  )
}
