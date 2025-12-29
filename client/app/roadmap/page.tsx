'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Calendar, Clock, ExternalLink, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Resource {
  title: string;
  url: string;
  type: string;
  duration: string;
}

interface WeekPlan {
  week: number;
  title: string;
  skill?: string; // Backend returns singular skill
  skills?: string[]; // Legacy support for array
  topics?: string[];
  estimatedHours: number;
  resources: Resource[];
  practiceProject: string;
  milestones: string[];
  completed?: boolean;
  isPlaceholder?: boolean; // For progressive loading
}

interface Roadmap {
  totalWeeks: number;
  totalHours: number;
  weeklyPlan: WeekPlan[];
  milestones: any[];
}

export default function RoadmapPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  const handleGenerate = async () => {
    const gapAnalysis = localStorage.getItem('gap_analysis');
    const targetRole = localStorage.getItem('target_role');

    if (!gapAnalysis) {
      router.push('/analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const analysis = JSON.parse(gapAnalysis);
      
      const response = await fetch('http://localhost:5000/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillGaps: analysis.skillGaps,
          targetRole,
          availableHoursPerWeek: hoursPerWeek
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roadmap');
      }

      setRoadmap(data.roadmap);
      localStorage.setItem('roadmap', JSON.stringify(data.roadmap));

    } catch (err: any) {
      setError(err.message || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const toggleWeekCompletion = (weekIndex: number) => {
    if (!roadmap) return;
    
    const updated = { ...roadmap };
    updated.weeklyPlan[weekIndex].completed = !updated.weeklyPlan[weekIndex].completed;
    setRoadmap(updated);
    localStorage.setItem('roadmap', JSON.stringify(updated));
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'documentation': return '📚';
      case 'article': return '📝';
      case 'course': return '🎓';
      default: return '🔗';
    }
  };

  const completedWeeks = roadmap?.weeklyPlan.filter(w => w.completed).length || 0;
  const progressPercentage = roadmap ? (completedWeeks / roadmap.totalWeeks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Your Learning Roadmap
          </h1>
          <p className="text-gray-400">Personalized week-by-week plan to reach your goal</p>
        </div>

        {/* Configuration */}
        {!roadmap && (
          <Card className="bg-gray-900/50 border-2 border-indigo-500/30 mb-8">
            <CardHeader>
              <CardTitle>Step 3: Generate Your Roadmap</CardTitle>
              <CardDescription>Tell us how much time you can dedicate per week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Available Hours Per Week</label>
                <Input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || 10)}
                  min={1}
                  max={40}
                  className="bg-gray-800 border-indigo-500/30"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 10-15 hours for steady progress</p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {loadingMessage || 'Generating Your Roadmap...'}
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Generate Personalized Roadmap
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Roadmap Display */}
        {roadmap && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-2 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-400">{roadmap.totalWeeks}</div>
                    <div className="text-sm text-gray-400">Total Weeks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{roadmap.totalHours}h</div>
                    <div className="text-sm text-gray-400">Total Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{completedWeeks}/{roadmap.totalWeeks}</div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Weekly Timeline */}
            <div className="space-y-4">
              {roadmap.weeklyPlan.map((week, idx) => (
                <Card 
                  key={idx} 
                  className={`
                    bg-gray-900/50 border-2 transition-all
                    ${week.isPlaceholder ? 'border-blue-500/20 opacity-60 animate-pulse' : 
                      week.completed ? 'border-green-500/30 opacity-75' : 'border-gray-700'}
                  `}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {week.isPlaceholder ? (
                            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                          ) : (
                            <Button
                              onClick={() => toggleWeekCompletion(idx)}
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto"
                            >
                              {week.completed ? (
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                              ) : (
                                <Circle className="w-6 h-6 text-gray-600" />
                              )}
                            </Button>
                          )}
                          <div>
                            <Badge variant="outline" className={`
                              ${week.isPlaceholder 
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                                : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50'}
                            `}>
                              Week {week.week}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className={week.completed ? 'line-through text-gray-500' : ''}>
                          {week.title}
                        </CardTitle>
                        {!week.isPlaceholder && (
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {week.estimatedHours} hours
                            </span>
                            <span>Skills: {Array.isArray(week.skills) ? week.skills.join(', ') : (week as any).skill || 'N/A'}</span>
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {!week.isPlaceholder && (
                    <CardContent className="space-y-4">
                      {/* Resources */}
                      <div>
                        <h4 className="font-semibold mb-2">📚 Learning Resources</h4>
                        <div className="space-y-2">
                          {week.resources.map((resource, rIdx) => (
                            <a
                              key={rIdx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                                <div>
                                  <div className="font-medium">{resource.title}</div>
                                  <div className="text-xs text-gray-500">{resource.type} • {resource.duration}</div>
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-500" />
                            </a>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-gray-700" />

                      {/* Practice Project */}
                      <div>
                        <h4 className="font-semibold mb-2">🛠️ Practice Project</h4>
                        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                          {week.practiceProject}
                        </div>
                      </div>

                      {/* Milestones */}
                      {week.milestones && week.milestones.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">🎯 Milestones</h4>
                          <ul className="space-y-1">
                            {week.milestones.map((milestone: string, mIdx: number) => (
                              <li key={mIdx} className="text-sm text-gray-400 flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                {milestone}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setRoadmap(null);
                  localStorage.removeItem('roadmap');
                }}
                variant="outline"
                className="flex-1 border-gray-700"
              >
                Generate New Roadmap
              </Button>
              <Button
                onClick={() => router.push('/upload')}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Start Over with New Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
