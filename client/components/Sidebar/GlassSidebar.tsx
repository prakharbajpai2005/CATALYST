'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

interface GlassSidebarProps {
  user: User;
  readinessScore: number;
}

export default function GlassSidebar({ user, readinessScore }: GlassSidebarProps) {
  const navigationItems = [
    { icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { icon: '📄', label: 'Resume', href: '/upload' },
    { icon: '🎯', label: 'Gap Analysis', href: '/analyze' },
    { icon: '🗺️', label: 'Roadmap', href: '/roadmap' },
    { icon: '🎮', label: 'Simulations', href: '/dashboard' },
  ];

  return (
    <motion.aside
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="
        fixed left-0 top-0 h-screen w-80 z-50
        
        /* Glassmorphism */
        bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10
        backdrop-blur-xl backdrop-saturate-150
        
        /* Border with glow */
        border-r border-white/10
        shadow-[0_0_50px_rgba(99,102,241,0.15)]
        
        overflow-y-auto
      "
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-gray-950">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-bold text-xl">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">
              {user.name}
            </h3>
            <p className="text-sm text-black">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Readiness Score Card */}
      <div className="p-6">
        <div className="
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br from-indigo-500/20 to-cyan-500/20
          border border-white/10
          p-6
        ">
          {/* Animated background glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              absolute -top-10 -right-10 w-40 h-40
              bg-indigo-500/30 rounded-full blur-3xl
            "
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-300">
                Hiring Readiness
              </span>
              <Badge className="
                bg-gradient-to-r from-indigo-500 to-cyan-500
                text-white border-0
              ">
                {readinessScore >= 80 ? 'Ready' : 'In Progress'}
              </Badge>
            </div>
            
            {/* Large score display */}
            <div className="mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
              >
                {readinessScore}%
              </motion.div>
            </div>
            
            {/* Progress bar */}
            <div className="relative">
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${readinessScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                />
              </div>
            </div>
            
            <p className="text-xs text-black mt-2">
              {100 - readinessScore}% to target role
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-1">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              whileHover={{ x: 4 }}
              className="
                flex items-center gap-3 px-4 py-3 rounded-xl
                text-gray-300 hover:text-white
                hover:bg-white/5
                transition-colors
                group
                cursor-pointer
              "
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* Footer - Skill Stats */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-gray-950/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-400">12</div>
            <div className="text-xs text-black">Skills</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">8</div>
            <div className="text-xs text-black">Gaps</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">5</div>
            <div className="text-xs text-black">Level</div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
