'use client';

import { useState } from 'react';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import '../globals.css';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import { Menu } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showHeader = pathname === '/dashboard';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added state for sidebar visibility

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative"> {/* Added relative */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} /> {/* Passed props to Sidebar */}

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden w-full"> {/* Added w-full */}
        {showHeader && <Header onMenuClick={() => setIsSidebarOpen(true)} />} {/* Passed onMenuClick to Header */}
        {!showHeader && ( // New header for non-dashboard pages on mobile
          <header className="lg:hidden flex items-center p-4 bg-white border-b">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-4 font-bold text-blue-900">Finverse</span>
          </header>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main> {/* Adjusted padding */}
      </div>
    </div>
  );
}