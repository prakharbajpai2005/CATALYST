'use client';

import { useState, useEffect } from 'react';
import SkillTree from '@/components/dashboard/SkillTree';
import MissionTerminal from '@/components/dashboard/MissionTerminal';
import AIFeedback from '@/components/dashboard/AIFeedback';
import { api } from '@/lib/api';

// For demo purposes, we'll use a hardcoded user ID
// In production, this would come from authentication
const DEMO_USER_ID = '676ff8e8c4d5a1b2e3f4g5h6';

export default function DashboardPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const [userCreated, setUserCreated] = useState(false);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      // Try to get existing user
      const user = await api.getUser(DEMO_USER_ID);
      setUserLevel(user.level);
      setCurrentXP(user.currentXP);
      setUserCreated(true);
    } catch (error) {
      // User doesn't exist, create demo user
      try {
        await api.createUser('demo_user', 'demo@skillbridge.com');
        setUserCreated(true);
      } catch (createError) {
        console.error('Failed to create user:', createError);
      }
    }
  };

  const handleXPGain = async (xpGained: number) => {
    try {
      const data = await api.updateXP(DEMO_USER_ID, xpGained);
      setUserLevel(data.level);
      setCurrentXP(data.currentXP);
      
      if (data.leveledUp) {
        // Show level up animation/notification
        console.log('🎉 Level Up!', data.level);
      }
    } catch (error) {
      console.error('Failed to update XP:', error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-purple-500/20 bg-black/50 backdrop-blur-sm flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl">
            SB
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Skill-Bridge
            </h1>
            <p className="text-xs text-gray-400">Learn by Doing</p>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="h-[calc(100vh-4rem)] grid grid-cols-12 gap-4 p-4">
        {/* Left Sidebar - Skill Tree */}
        <div className="col-span-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border-2 border-purple-500/20 overflow-hidden">
          {userCreated && (
            <SkillTree 
              userId={DEMO_USER_ID} 
              onSkillSelect={setSelectedSkill}
            />
          )}
        </div>

        {/* Center Panel - Mission Terminal */}
        <div className="col-span-6 overflow-hidden">
          {userCreated && (
            <MissionTerminal
              userId={DEMO_USER_ID}
              skillId={selectedSkill}
              onScoreUpdate={setCurrentScore}
              onXPGain={handleXPGain}
            />
          )}
        </div>

        {/* Right Panel - AI Feedback */}
        <div className="col-span-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border-2 border-green-500/20 overflow-hidden">
          <AIFeedback
            currentScore={currentScore}
            level={userLevel}
            currentXP={currentXP}
            xpToNextLevel={100}
          />
        </div>
      </div>
    </div>
  );
}
