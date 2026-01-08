'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

import MetricCard from '@/components/ui/metric-card';
import TimelineBar from '@/components/ui/timeline-bar';
import ReadinessAreaChart from '@/components/ui/readiness-area-chart';
import SkillsDistributionChart from '@/components/ui/skills-distribution-chart';

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
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<any>(null);

  useEffect(() => {
    const skills = localStorage.getItem('extracted_skills');
    if (skills) {
      setExtractedSkills(JSON.parse(skills));
    } else {
      router.push('/upload');
    }
  }, [router]);

  const handleAnalyze = async () => {
    if (!targetRole || !jobDescription) {
      alert('Please fill in all fields');
      return;
    }

    setAnalyzing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze/gap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSkills: extractedSkills,
          targetRole,
          jobDescription
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysis(data.analysis);
        localStorage.setItem('gap_analysis', JSON.stringify(data.analysis));
        localStorage.setItem('target_role', targetRole);
      } else {
        alert(data.error || 'Failed to analyze');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze');
    } finally {
      setAnalyzing(false);
    }
  };

  const getGapColor = (gap: number): 'green' | 'orange' | 'white' => {
    if (gap === 0) return 'green';
    if (gap <= 2) return 'orange';
    return 'white';
  };

  // Prepare data for charts
  const readinessData = analysis ? [
    { name: 'Week 1', score: 45 },
    { name: 'Week 2', score: 52 },
    { name: 'Week 3', score: 49 },
    { name: 'Week 4', score: 60 },
    { name: 'Week 5', score: 58 },
    { name: 'Week 6', score: 65 },
    { name: 'Current', score: analysis.hiringReadinessScore }
  ] : [];

  const gapDistributionData = analysis ? [
    { name: 'Gaps', value: analysis.skillGaps.length },
    { name: 'Matched', value: analysis.matchedSkills.length },
  ] : [];

  return (
    <div className="">

      <div className="p-8 flex flex-col items-center w-full">
        {/* Header */}
        <div className="mb-8 mt-15 flex flex-col items-center justify-center">
          <div className="text-sm text-white mb-2">STEP 2 OF 3</div>
          <h1 className="text-4xl font-bold text-white mb-2">Skill Gap Analysis</h1>
          <p className="text-white">Compare your skills with your target role</p>
        </div>

        {!analysis ? (
          <div className="max-w-2xl space-y-6">
            {/* Input Form */}
            <Card className="dashboard-card w-100 p-6 bg-zinc-800 space-y-4 border-none">
              <div>
                <label className="text-sm  mb-2 text-white  block">Target Role</label>
                <Input
                  placeholder="e.g., Full Stack Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="bg-black border-[#2a2a2a] !text-white"
                />
              </div>

              <div>
                <label className="text-sm  mb-2 text-white block">Job Description</label>
                <Textarea
                  placeholder="Paste the complete job description here..."
                  rows={12}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="bg-black border-[#2a2a2a] !text-white font-mono text-sm"
                />
              </div>

              <Button
                className="pill-button bg-yellow-400 !text-black hover:bg-[#6FEF00] w-full"
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Skill Gap'
                )}
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            {/* Rich Metrics Dashboard */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4">
              {/* Readiness Trend - Line Chart Style */}
              <div className="dashboard-card p-6 bg-gray-900 border-none">
                <h3 className="text-lg font-bold text-white mb-4">Readiness Trend</h3>
                <ReadinessAreaChart
                  data={readinessData}
                  color={analysis.hiringReadinessScore >= 70 ? '#7FFF00' : '#FF8C00'}
                />
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-white">{analysis.hiringReadinessScore}%</span>
                  <span className="text-xs text-gray-400 ml-2">+2.4% this week</span>
                </div>
              </div>

              {/* Skill Gaps - Dot Matrix Style */}
              <div className="dashboard-card p-6 bg-gray-900 border-none">
                <h3 className="text-lg font-bold text-white mb-4">Gap vs Match</h3>
                <SkillsDistributionChart
                  data={gapDistributionData}
                  colors={['#EF4444', '#22C55E']}
                />
              </div>

              {/* Matched Skills - Breakdown */}
              <div className="dashboard-card p-6 flex flex-col justify-between bg-gray-900 border-none">
                <div>
                  <span className="text-white text-sm font-medium">Matched Skills</span>
                  <div className="text-2xl font-bold text-white mt-1">{analysis.matchedSkills.length}</div>
                </div>
                <div className="space-y-6 mt-4">
                  <TimelineBar
                    percentage={80}
                    color="green"
                    label="Technical Skills"
                    showPercentage={true}
                    textColor="text-white"
                  />
                  <TimelineBar
                    percentage={60}
                    color="orange"
                    label="Soft Skills"
                    showPercentage={true}
                    textColor="text-white"
                  />
                </div>
              </div>
            </div>


            {/* Skill Gaps */}
            <div className="max-w-7xl mx-auto w-full px-4">
              <h3 className="text-xl font-bold text-white mb-4">Skill Gaps to Address</h3>
              <Card className="dashboard-card bg-gray-800 border-none p-6 space-y-4">
                {analysis.skillGaps.map((gap, idx) => {
                  const gapSize = gap.targetLevel - gap.currentLevel;
                  const percentage = (gap.currentLevel / gap.targetLevel) * 100;

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold !text-white">{gap.skill}</span>
                          <span className="text-xs !text-white ml-2">
                            {gap.currentLevel}/{gap.targetLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${gapSize === 0 ? 'bg-[#FACC15]/20 text-[#FACC15]' :
                            gapSize <= 2 ? 'bg-[#FF8C00]/20 text-[#FF8C00]' :
                              'bg-white/20 !text-black'
                            }`}>
                            {gapSize === 0 ? '✓ Met' : `↑ ${gapSize} levels`}
                          </span>
                          <span className="text-xs !text-white">{gap.estimatedHours}h</span>
                        </div>
                      </div>
                      <TimelineBar
                        percentage={percentage}
                        color={getGapColor(gapSize)}
                      />
                      <p className="text-xs !text-white">{gap.reason}</p>
                    </div>
                  );
                })}
              </Card>
            </div>

            {/* Strengths */}
            {analysis.matchedSkills.length > 0 && (
              <div className="max-w-7xl mx-auto w-full px-4">
                <h3 className="text-xl font-bold text-white mb-4">Your Strengths</h3>
                <div className="grid grid-cols-3 gap-4">
                  {analysis.matchedSkills.map((skill, idx) => (
                    <div key={idx} className="dashboard-card border-none bg-zinc-800 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold !text-white">{skill.skill}</span>
                        <span className="text-[#FACC15]">✓</span>
                      </div>
                      <div className="text-xs !text-white mt-1">
                        {skill.targetLevel} - {skill.status}/{skill.currentLevel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 max-w-4xl">
              <Button
                className="pill-button bg-white !text-black hover:bg-gray-200"
                onClick={() => setAnalysis(null)}
              >
                Analyze Different Role
              </Button>
              <Button
                className="pill-button bg-[#FACC15] !text-black hover:bg-[#6FEF00]"
                onClick={() => router.push('/roadmap')}
              >
                Generate Roadmap →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
