'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trophy, Award, Target, Clock, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PassportData {
  user: {
    username: string;
    email: string;
    level: number;
    totalXP: number;
  };
  statistics: {
    totalMissionsCompleted: number;
    averageScore: number;
    skillsMastered: number;
    totalTimeInvested: string;
  };
  skills: Array<{
    skillId: string;
    completedMissions: number;
    averageScore: number;
    bestScore: number;
  }>;
  recentAchievements: Array<{
    skillId: string;
    missionTitle: string;
    score: number;
    completedAt: string;
  }>;
  generatedAt: string;
}

export default function PassportPage({ params }: { params: { userId: string } }) {
  const [passport, setPassport] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPassport();
  }, []);

  const loadPassport = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/passport/${params.userId}`);
      const data = await res.json();
      setPassport(data);
    } catch (error) {
      console.error('Failed to load passport:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillName = (skillId: string) => {
    const names: Record<string, string> = {
      'project-management': 'Project Management',
      'python': 'Python',
      'data-analysis': 'Data Analysis',
      'advanced-pm': 'Advanced PM'
    };
    return names[skillId] || skillId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Passport Not Found</CardTitle>
            <CardDescription>Unable to load skill passport data.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Skill Passport
          </h1>
          <p className="text-gray-400">Proof of Competence, Not Just Completion</p>
        </div>

        {/* User Info Card */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-purple-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{passport.user.username}</CardTitle>
                <CardDescription className="text-gray-300">{passport.user.email}</CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold">Level {passport.user.level}</span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                  {passport.user.totalXP} Total XP
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-2 border-green-500/30">
            <CardContent className="pt-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-400">{passport.statistics.totalMissionsCompleted}</div>
              <div className="text-xs text-gray-400 mt-1">Missions Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-2 border-blue-500/30">
            <CardContent className="pt-6 text-center">
              <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-400">{passport.statistics.averageScore}</div>
              <div className="text-xs text-gray-400 mt-1">Average Score</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-2 border-yellow-500/30">
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-yellow-400">{passport.statistics.skillsMastered}</div>
              <div className="text-xs text-gray-400 mt-1">Skills Mastered</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-2 border-purple-500/30">
            <CardContent className="pt-6 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-400">{passport.statistics.totalTimeInvested.split(' ')[0]}</div>
              <div className="text-xs text-gray-400 mt-1">Minutes Invested</div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Breakdown */}
        <Card className="bg-gray-900/50 border-2 border-purple-500/30">
          <CardHeader>
            <CardTitle>Skills Breakdown</CardTitle>
            <CardDescription>Performance across different domains</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {passport.skills.map((skill) => (
              <div key={skill.skillId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{getSkillName(skill.skillId)}</h3>
                    <p className="text-sm text-gray-400">{skill.completedMissions} missions completed</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{skill.averageScore}</div>
                    <div className="text-xs text-gray-400">Avg Score</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${skill.averageScore}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="bg-gray-900/50 border-2 border-green-500/30">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Latest completed missions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {passport.recentAchievements.map((achievement, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <h4 className="font-semibold">{achievement.missionTitle}</h4>
                  <p className="text-sm text-gray-400">{getSkillName(achievement.skillId)}</p>
                </div>
                <div className="text-right">
                  <Badge className={`
                    ${achievement.score >= 80 ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}
                    ${achievement.score >= 60 && achievement.score < 80 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : ''}
                    ${achievement.score < 60 ? 'bg-red-500/20 text-red-400 border-red-500/50' : ''}
                  `}>
                    {achievement.score}/100
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(achievement.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
            <Share2 className="w-4 h-4 mr-2" />
            Share Passport
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          Generated on {new Date(passport.generatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
