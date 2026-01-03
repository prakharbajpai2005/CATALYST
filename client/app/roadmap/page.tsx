'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ExternalLink, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

import MetricCard from '@/components/ui/metric-card';
import TimelineBar from '@/components/ui/timeline-bar';
import ReadinessAreaChart from '@/components/ui/readiness-area-chart';
import SkillsDistributionChart from '@/components/ui/skills-distribution-chart';

interface Resource {
  title: string;
  url: string;
  type: string;
  duration: string;
}

interface WeekPlan {
  week: number;
  title: string;
  skill?: string;
  skills?: string[];
  topics?: string[];
  estimatedHours: number;
  resources: Resource[];
  practiceProject: string;
  milestones: string[];
  completed?: boolean;
}

interface Roadmap {
  totalWeeks: number;
  totalHours: number;
  weeklyPlan: WeekPlan[];
  milestones: any[];
}

export default function RoadmapPage() {
  const router = useRouter();
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState('');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

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

      const response = await fetch(`${API_BASE_URL}/roadmap/generate`, {
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

  const completedWeeks = roadmap?.weeklyPlan.filter(w => w.completed).length || 0;
  const progressPercentage = roadmap ? (completedWeeks / roadmap.totalWeeks) * 100 : 0;

  // Prepare data for charts
  const completionData = [
    { name: 'Start', score: 0 },
    { name: 'Week 1', score: 10 },
    { name: 'Week 2', score: 25 },
    { name: 'Week 3', score: 40 },
    { name: 'Week 4', score: 55 },
    { name: 'Current', score: progressPercentage }
  ];

  const weeksDistributionData = roadmap ? [
    { name: 'Completed', value: completedWeeks },
    { name: 'Remaining', value: roadmap.totalWeeks - completedWeeks }
  ] : [];

  const hoursData = [
    { name: 'Week 1', score: 5 },
    { name: 'Week 2', score: 8 },
    { name: 'Week 3', score: 12 },
    { name: 'Week 4', score: 15 },
    { name: 'Week 5', score: 10 },
    { name: 'Target', score: hoursPerWeek }
  ];

  return (
    <div className="">

      <div className="p-8 flex flex-col items-center w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center justify-center w-full pt-20">
          <div className="text-sm !text-black mb-2">STEP 3 OF 3</div>
          <h1 className="text-4xl font-bold !text-black mb-2">Learning Roadmap</h1>
          <p className="!text-black">Your personalized week-by-week plan</p>
        </div>

        {!roadmap ? (
          <div className="max-w-2xl">
            <Card className="dashboard-card p-8 space-y-6">
              <div>
                <label className="text-sm !text-black mb-4 block">
                  Available Hours Per Week
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="5"
                    max="40"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="bg-black border-[#2a2a2a] text-white text-3xl text-center w-32"
                  />
                  <span className="!text-black">hours/week</span>
                </div>
              </div>

              <Button
                className="pill-button bg-yellow-300 !text-black hover:bg-[#6FEF00] w-full py-6 text-lg"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Roadmap...
                  </>
                ) : (
                  'Generate Personalized Roadmap'
                )}
              </Button>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Rich Metrics Dashboard */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
              {/* Progress Trend */}
              <div className="dashboard-card p-6 bg-gray-900 border-none">
                <h3 className="text-lg font-bold text-white mb-4">Completion Trend</h3>
                <ReadinessAreaChart
                  data={completionData}
                  color="#7FFF00"
                />
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</span>
                  <span className="text-xs text-gray-400 ml-2">{progressPercentage > 0 ? "+On Track" : "Start Now"}</span>
                </div>
              </div>

              {/* Weeks Remaining Density */}
              <div className="dashboard-card p-6 bg-gray-900 border-none">
                <h3 className="text-lg font-bold text-white mb-4">Weeks Progress</h3>
                <SkillsDistributionChart data={weeksDistributionData} />
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-white">{roadmap.totalWeeks - completedWeeks}</span>
                  <span className="text-xs text-gray-400 ml-2">Weeks Remaining</span>
                </div>
              </div>

              {/* Hours Balance */}
              <div className="dashboard-card p-6 bg-gray-900 border-none">
                <h3 className="text-lg font-bold text-white mb-4">Weekly Hours</h3>
                <ReadinessAreaChart
                  data={hoursData}
                  color="#FFFFFF"
                />
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-white">{hoursPerWeek}h</span>
                  <span className="text-xs text-gray-400 ml-2">Target</span>
                </div>
              </div>
            </div>


            {/* Timeline View */}
            <div className="max-w-6xl">
              <h3 className="text-xl font-bold !text-black mb-4">Timeline</h3>
              <Card className="dashboard-card p-6 space-y-4">
                {roadmap.weeklyPlan.map((week, idx) => {
                  const percentage = week.completed ? 100 : idx === 0 ? 50 : 0;
                  const color = week.completed ? 'green' : idx === 0 ? 'orange' : 'white';

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleWeekCompletion(idx)}
                            className="transition-all"
                          >
                            {week.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-[#FACC15]" />
                            ) : (
                              <Circle className="w-6 h-6 !text-black" />
                            )}
                          </button>
                          <span className="font-semibold !text-black">
                            Week {week.week}: {week.title}
                          </span>
                        </div>
                        <button
                          onClick={() => setExpandedWeek(expandedWeek === idx ? null : idx)}
                          className="!text-black hover:!text-black transition-colors"
                        >
                          {expandedWeek === idx ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <TimelineBar
                        percentage={percentage}
                        color={color}
                        showPercentage={week.completed}
                      />

                      {/* Expanded Details */}
                      {expandedWeek === idx && (
                        <div className="mt-4 pl-9 space-y-4">
                          {/* Resources */}
                          <div>
                            <h4 className="text-sm font-semibold !text-black mb-2">
                              📚 Learning Resources
                            </h4>
                            <div className="space-y-2">
                              {week.resources.map((resource, rIdx) => (
                                <a
                                  key={rIdx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-black rounded-lg border border-[#2a2a2a] hover:border-[#7FFF00] transition-all group"
                                >
                                  <div>
                                    <div className="text-sm font-medium !text-black group-hover:text-[#FACC15]">
                                      {resource.title}
                                    </div>
                                    <div className="text-xs !text-black">
                                      {resource.type} • {resource.duration}
                                    </div>
                                  </div>
                                  <ExternalLink className="w-4 h-4 !text-black group-hover:text-[#FACC15]" />
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Practice Project */}
                          <div>
                            <h4 className="text-sm font-semibold !text-black mb-2">
                              🛠️ Practice Project
                            </h4>
                            <div className="p-3 bg-[#FF8C00]/10 border border-[#FF8C00]/30 rounded-lg text-sm !text-black">
                              {week.practiceProject}
                            </div>
                          </div>

                          {/* Milestones */}
                          {week.milestones && week.milestones.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold !text-black mb-2">
                                🎯 Milestones
                              </h4>
                              <ul className="space-y-1">
                                {week.milestones.map((milestone: string, mIdx: number) => (
                                  <li key={mIdx} className="text-sm !text-black flex items-center gap-2">
                                    <span className="text-[#FACC15]">✓</span>
                                    {milestone}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-4 max-w-4xl">
              <Button
                className="pill-button bg-white !text-black hover:bg-gray-200"
                onClick={() => {
                  setRoadmap(null);
                  setExpandedWeek(null);
                }}
              >
                Generate New Roadmap
              </Button>
              <Button
                className="pill-button bg-black !text-black border border-[#2a2a2a] hover:bg-[#1a1a1a]"
                onClick={() => router.push('/upload')}
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
