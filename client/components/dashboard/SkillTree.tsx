'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle, Circle } from 'lucide-react';
import { api } from '@/lib/api';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  prerequisites: string[];
  isUnlocked: boolean;
  position: { x: number; y: number };
}

interface SkillTreeProps {
  userId: string;
  onSkillSelect: (skillId: string) => void;
}

export default function SkillTree({ userId, onSkillSelect }: SkillTreeProps) {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkillTree();
  }, [userId]);

  const loadSkillTree = async () => {
    try {
      const data = await api.getSkillTree(userId);
      setSkills(data.skills || []);
    } catch (error) {
      console.error('Failed to load skill tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Skill Tree
        </h2>
        <p className="text-sm text-gray-400 mt-1">Choose your path to mastery</p>
      </div>

      <div className="space-y-3">
        {skills.map((skill) => (
          <Card
            key={skill.id}
            className={`
              border-2 transition-all duration-300 cursor-pointer
              ${skill.isUnlocked 
                ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/50 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20' 
                : 'bg-gray-900/50 border-gray-700 opacity-60'
              }
            `}
            onClick={() => skill.isUnlocked && onSkillSelect(skill.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {skill.isUnlocked ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-500" />
                    )}
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{skill.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="outline" className={getDifficultyColor(skill.difficulty)}>
                    {skill.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                    {skill.xpReward} XP
                  </Badge>
                </div>
                {!skill.isUnlocked && skill.prerequisites.length > 0 && (
                  <span className="text-xs text-gray-500">
                    🔒 Prerequisites required
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
