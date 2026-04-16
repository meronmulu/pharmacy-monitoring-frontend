'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/index';
import * as UserService from '../service/userService'; 
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 
interface AuthContextType {
  user: User | null;
  loading: boolean; 
  login: (credentials: { email: string; password: string }) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  // On mount, restore user
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    setLoading(false); 
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await UserService.login(credentials);

      if (res?.token && res?.user) {
        // Ensure res.user matches the User type
        const user: User = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          password: res.user.password,
          role: res.user.role,
          // add any other User fields as needed
        };

        Cookies.set('token', res.token, { expires: 7 }); 
        Cookies.set('user-role', user.role, { expires: 7 });

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        return user; 
      }

      return null;
    } catch (error) {
      console.error("Login Error:", error);
      return null;
    }
  };

  const logout = () => {
    // 5. CLEAR COOKIES
    Cookies.remove('token');
    Cookies.remove('user-role');

    // Clear Storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setUser(null);
    router.push(`/`);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};