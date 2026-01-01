'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Target } from 'lucide-react';

interface AIFeedbackProps {
  currentScore: number;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
}

export default function AIFeedback({ currentScore, level, currentXP, xpToNextLevel }: AIFeedbackProps) {
  const xpPercentage = (currentXP / xpToNextLevel) * 100;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Live Feedback
        </h2>
        <p className="text-sm text-black mt-1">Track your progress in real-time</p>
      </div>

      {/* Level Card */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-purple-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <CardTitle className="text-lg">Level {level}</CardTitle>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
              Learner
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-black">XP Progress</span>
              <span className="font-semibold text-purple-400">{currentXP} / {xpToNextLevel}</span>
            </div>
            <Progress value={xpPercentage} className="h-3 bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                style={{ width: `${xpPercentage}%` }}
              />
            </Progress>
            <p className="text-xs text-black text-center mt-2">
              {xpToNextLevel - currentXP} XP to Level {level + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Score Card */}
      <Card className="bg-gradient-to-br from-green-900/50 to-teal-900/50 border-2 border-green-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            <CardTitle className="text-lg">Current Score</CardTitle>
          </div>
          <CardDescription>Mission performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              {currentScore}
            </div>
            <div className="text-black text-sm mt-1">out of 100</div>
            <div className="mt-4">
              <Progress value={currentScore} className="h-2 bg-gray-800">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500 rounded-full"
                  style={{ width: `${currentScore}%` }}
                />
              </Progress>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-lg">Performance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-black">Correctness</span>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              {currentScore > 70 ? 'Excellent' : currentScore > 40 ? 'Good' : 'Needs Work'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-black">Approach</span>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              {currentScore > 70 ? 'Best Practice' : currentScore > 40 ? 'Acceptable' : 'Review'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-black">Communication</span>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
              {currentScore > 70 ? 'Clear' : currentScore > 40 ? 'Moderate' : 'Unclear'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-2 border-orange-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">💡 Pro Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-black">
            {currentScore < 50
              ? "Take your time to analyze the resources provided. Quality over speed!"
              : currentScore < 80
                ? "Great progress! Try to explain your reasoning more clearly."
                : "Outstanding work! You're mastering this skill. Ready for the next challenge?"
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
