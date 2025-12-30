'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Zap, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardSidebar from '@/components/Layout/DashboardSidebar';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="ml-20">
        {/* Header */}
        <header className="fixed top-0 right-0 left-20 z-40 bg-black">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-bold text-white tracking-widest ${orbitron.className}`}>
                CATALYST
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-white bg-zinc-700 px-4 py-2 rounded-full">
                Sign In
              </button>
              <Button
                className="text-white bg-zinc-700 px-4 py-3 rounded-full  hover:bg-yellow-600"
                onClick={() => router.push('/upload')}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16 flex flex-col items-center">

              <h1 className={`text-6xl md:text-8xl font-black mb-6 text-white tracking-wide ${orbitron.className}`}>
                <span className="text-[#7FFF00]">Stop Watching.</span>
                <br />
                <span className="text-white">Start Doing.</span>
              </h1>
              <p className={`text-2xl text-gray-400 max-w-3xl mx-auto mb-8 font-light ${orbitron.className}`}>
                Video is for Entertainment. <span className="text-white font-semibold">CATALYST is for Mastery.</span>
              </p>
              <Button
                size="lg"
                className="flex items-center justify-center gap-2 px-8 py-6 mt-5 text-xl font-semibold text-white transition-all duration-300 rounded-full bg-zinc-700 hover:bg-yellow-600 hover:shadow-lg active:scale-95 mx-auto"
                onClick={() => router.push('/upload')}
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>


          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-400">
                Get from resume to roadmap in 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 ">
              {[
                {
                  step: '01',
                  title: 'Upload Resume',
                  description: 'Upload your resume and let AI extract your skills in seconds',
                  icon: '📄',
                },
                {
                  step: '02',
                  title: 'Analyze Gap',
                  description: 'Compare your skills with job requirements and get a readiness score',
                  icon: '📊',
                },
                {
                  step: '03',
                  title: 'Follow Roadmap',
                  description: 'Get a personalized 6-week learning plan with curated resources',
                  icon: '🗺️',
                }
              ].map((item, idx) => (
                <div key={idx} className="dashboard-card border-none p-8 hover:bg-[#1a1a1a] bg-black transition-all">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <div className="text-sm font-semibold text-[#7FFF00] mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: '50+', label: 'Skills Analyzed', color: '#7FFF00' },
                { value: '95%', label: 'Accuracy Rate', color: '#FF8C00' },
                { value: '6', label: 'Week Programs', color: '#FFFFFF' },
                { value: '1000+', label: 'Jobs Matched', color: '#7FFF00' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-5xl font-bold mb-2" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}


        {/* Footer */}
        <footer className="py-6 px-6 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto text-center text-gray-400">
            <p>© 2024 Skill-Bridge. All rights reserved. @saurabh24thakur</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
