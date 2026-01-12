'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Home,
  Upload,
  BarChart3,
  Map,
  LayoutDashboard,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Analyze', href: '/analyze', icon: BarChart3 },
  { name: 'Roadmap', href: '/roadmap', icon: Map },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const userInitial = (session?.user?.name?.[0] || session?.user?.email?.[0])?.toUpperCase() || 'S';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-20 bg-black   z-50 flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FFF00] to-[#FF8C00] flex items-center justify-center shadow-lg">
          <span className="text-black font-bold text-2xl">{userInitial}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`
                w-14 h-14 rounded-full flex items-center justify-center transition-all relative group
                ${active
                  ? 'bg-white text-black shadow-lg '
                  : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
                }
              `}
              title={item.name}
            >
              <Icon className="w-6 h-6" />

              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-[#2a2a2a]">
                {item.name}
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto">
        <button className="w-14 h-14 rounded-full bg-[#1a1a1a] border-2 border-[#2a2a2a] flex items-center justify-center hover:border-[#7FFF00] transition-all shadow-lg">
          <User className="w-6 h-6 text-black" />
        </button>
      </div>
    </div>
  );
}
