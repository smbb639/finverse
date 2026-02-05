'use client';

import { Inter } from 'next/font/google';
import '../globals.css';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}