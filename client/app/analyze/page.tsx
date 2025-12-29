'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Target, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SkillGap {
  skill: string;
  category: string;
  importance: number;
  currentLevel: number;
  targetLevel: number;
  estimatedHours: number;
  reason: string;
}

interface MatchedSkill {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  status: string;
}

interface Analysis {
  requiredSkills: any[];
  skillGaps: SkillGap[];
  matchedSkills: MatchedSkill[];
  hiringReadinessScore: number;
  summary: string;
}

export default function AnalyzePage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState('');
  const [currentSkills, setCurrentSkills] = useState<any>(null);

  useEffect(() => {
    // Load extracted skills from localStorage
    const skills = localStorage.getItem('extracted_skills');
    if (!skills) {
      router.push('/upload');
      return;
    }
    setCurrentSkills(JSON.parse(skills));
  }, []);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/analyze/gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSkills,
          jobDescription,
          targetRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data.analysis);
      
      // Store for roadmap generation
      localStorage.setItem('gap_analysis', JSON.stringify(data.analysis));
      localStorage.setItem('target_role', targetRole);

    } catch (err: any) {
      setError(err.message || 'Failed to analyze gap');
    } finally {
      setAnalyzing(false);
    }
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (importance >= 5) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (!currentSkills) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Skill Gap Analysis
          </h1>
          <p className="text-gray-400">Compare your skills against your dream job</p>
        </div>

        {/* Input Section */}
        {!analysis && (
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-2 border-indigo-500/30">
              <CardHeader>
                <CardTitle>Step 2: Enter Job Details</CardTitle>
                <CardDescription>Paste the job description you're targeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Target Role (Optional)</label>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    className="bg-gray-800 border-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Job Description *</label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="bg-gray-800 border-indigo-500/30 min-h-[300px]"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || !jobDescription.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 mr-2" />
                      Analyze Skill Gap
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Hiring Readiness Score */}
            <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-2 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-2xl">Hiring Readiness Score</CardTitle>
                <CardDescription>{analysis.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">Current Readiness</span>
                      <span className={`text-2xl font-bold ${getReadinessColor(analysis.hiringReadinessScore)}`}>
                        {analysis.hiringReadinessScore}%
                      </span>
                    </div>
                    <Progress value={analysis.hiringReadinessScore} className="h-4">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all rounded-full"
                        style={{ width: `${analysis.hiringReadinessScore}%` }}
                      />
                    </Progress>
                  </div>
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getReadinessColor(analysis.hiringReadinessScore)}`}>
                      {analysis.hiringReadinessScore >= 80 ? '🎯' : analysis.hiringReadinessScore >= 60 ? '📈' : '🚀'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matched Skills */}
            {analysis.matchedSkills && analysis.matchedSkills.length > 0 && (
              <Card className="bg-gray-900/50 border-2 border-green-500/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <CardTitle className="text-green-400">Matched Skills ({analysis.matchedSkills.length})</CardTitle>
                  </div>
                  <CardDescription>Skills you already have that match the job requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {analysis.matchedSkills.map((skill, idx) => (
                      <div key={idx} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="font-semibold text-green-400">{skill.skill}</div>
                        <div className="text-xs text-gray-400 mt-1">Level {skill.currentLevel}/5</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skill Gaps */}
            {analysis.skillGaps && analysis.skillGaps.length > 0 && (
              <Card className="bg-gray-900/50 border-2 border-red-500/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <CardTitle className="text-red-400">Skill Gaps ({analysis.skillGaps.length})</CardTitle>
                  </div>
                  <CardDescription>Skills you need to develop for this role</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.skillGaps
                    .sort((a, b) => b.importance - a.importance)
                    .map((gap, idx) => (
                      <div key={idx} className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{gap.skill}</h3>
                              <Badge variant="outline" className={getImportanceColor(gap.importance)}>
                                Priority: {gap.importance}/10
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">{gap.reason}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-700">
                          <div>
                            <div className="text-xs text-gray-500">Current Level</div>
                            <div className="text-lg font-semibold">{gap.currentLevel}/5</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Target Level</div>
                            <div className="text-lg font-semibold text-indigo-400">{gap.targetLevel}/5</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Est. Time
                            </div>
                            <div className="text-lg font-semibold text-purple-400">{gap.estimatedHours}h</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* Next Step */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setAnalysis(null);
                  setJobDescription('');
                  setTargetRole('');
                }}
                variant="outline"
                className="flex-1 border-gray-700"
              >
                Analyze Different Role
              </Button>
              <Button
                onClick={() => router.push('/roadmap')}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-6 text-lg"
              >
                Generate Learning Roadmap →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
