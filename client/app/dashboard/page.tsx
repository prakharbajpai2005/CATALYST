'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BookOpen, Trophy, Zap, Clock, Target } from 'lucide-react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const userInitial = (session.user?.name?.[0] || session.user?.email?.[0])?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-black text-white p-8 pl-28 pt-24">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${orbitron.className}`}>
            Welcome back, <span className="text-yellow-500">{session.user?.name}</span>
          </h1>
          <p className="text-gray-400">Here's an overview of your progress and activity.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Current Level</p>
          <p className={`text-3xl font-bold text-yellow-500 ${orbitron.className}`}>Novice</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          title="Skills Analyzed"
          value="0"
          icon={<Activity className="w-5 h-5 text-blue-400" />}
          trend="+0% this week"
        />
        <StatsCard
          title="Roadmaps Created"
          value="0"
          icon={<MapIcon className="w-5 h-5 text-purple-400" />}
          trend="Start your first one!"
        />
        <StatsCard
          title="Learning Streak"
          value="0 Days"
          icon={<Zap className="w-5 h-5 text-yellow-400" />}
          trend="Keep it up!"
        />
        <StatsCard
          title="Total XP"
          value="0"
          icon={<Trophy className="w-5 h-5 text-green-400" />}
          trend="Next level: 100 XP"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity & Profile */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-yellow-500" />
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-black shadow-lg">
                {userInitial}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-white">{session.user?.name}</h3>
                <p className="text-gray-400">{session.user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-gray-300 border border-zinc-700">Free Plan</span>
                  <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-gray-300 border border-zinc-700">Member since 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                  <div className="p-2 rounded-full bg-zinc-800 text-gray-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Account Created</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
                {/* Placeholder for more activity */}
                <div className="text-center py-4 text-gray-500 text-sm">
                  No other recent activity to show.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Actions or Next Steps */}
        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={() => router.push('/upload')}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/30 hover:border-yellow-500 transition-all group text-left"
              >
                <h4 className="font-semibold text-yellow-500 group-hover:text-yellow-400 mb-1">Upload Resume</h4>
                <p className="text-sm text-gray-400">Analyze your skills and find gaps.</p>
              </button>

              <button
                onClick={() => router.push('/roadmap')}
                className="w-full p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-all group text-left"
              >
                <h4 className="font-semibold text-white group-hover:text-gray-200 mb-1">View Roadmap</h4>
                <p className="text-sm text-gray-400">Track your learning journey.</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            {icon}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          <p className="text-xs text-gray-500">{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  )
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
