'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ExternalLink, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/Layout/DashboardSidebar';
import MetricCard from '@/components/ui/metric-card';
import TimelineBar from '@/components/ui/timeline-bar';
import DotMatrix from '@/components/ui/dot-matrix';
import MiniTrendChart from '@/components/ui/mini-trend-chart';

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

  const completedWeeks = roadmap?.weeklyPlan.filter(w => w.completed).length || 0;
  const progressPercentage = roadmap ? (completedWeeks / roadmap.totalWeeks) * 100 : 0;

  return (
    <div className="min-h-screen bg-black">
      <DashboardSidebar />
      
      <div className="ml-20 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-sm text-gray-400 mb-2">STEP 3 OF 3</div>
          <h1 className="text-4xl font-bold text-white mb-2">Learning Roadmap</h1>
          <p className="text-gray-400">Your personalized week-by-week plan</p>
        </div>

        {!roadmap ? (
          <div className="max-w-2xl">
            <Card className="dashboard-card p-8 space-y-6">
              <div>
                <label className="text-sm text-gray-400 mb-4 block">
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
                  <span className="text-gray-400">hours/week</span>
                </div>
              </div>

              <Button
                className="pill-button bg-[#7FFF00] text-black hover:bg-[#6FEF00] w-full py-6 text-lg"
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
              <div className="dashboard-card p-6">
                <MiniTrendChart 
                  data={[0, 10, 25, 40, 55, progressPercentage]} 
                  label="Completion Trend"
                  value={`${Math.round(progressPercentage)}%`}
                  trend={progressPercentage > 0 ? "+On Track" : "Start Now"}
                  color="green"
                  height={80}
                />
              </div>

              {/* Weeks Remaining Density */}
              <div className="dashboard-card p-6">
                <DotMatrix 
                  rows={4} 
                  cols={6} 
                  activeCount={(roadmap.totalWeeks - completedWeeks) * 4}
                  label="Weeks Remaining"
                  value={`${roadmap.totalWeeks - completedWeeks} Weeks`}
                  color="orange"
                />
              </div>

              {/* Hours Balance */}
              <div className="dashboard-card p-6">
                <MiniTrendChart 
                  data={[5, 8, 12, 15, 10, hoursPerWeek]} 
                  label="Weekly Hours"
                  value={`${hoursPerWeek}h`}
                  trend="Target"
                  color="white"
                  height={80}
                />
              </div>
            </div>


            {/* Timeline View */}
            <div className="max-w-6xl">
              <h3 className="text-xl font-bold text-white mb-4">Timeline</h3>
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
                              <CheckCircle2 className="w-6 h-6 text-[#7FFF00]" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-600" />
                            )}
                          </button>
                          <span className="font-semibold text-white">
                            Week {week.week}: {week.title}
                          </span>
                        </div>
                        <button
                          onClick={() => setExpandedWeek(expandedWeek === idx ? null : idx)}
                          className="text-gray-400 hover:text-white transition-colors"
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
                            <h4 className="text-sm font-semibold text-white mb-2">
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
                                    <div className="text-sm font-medium text-white group-hover:text-[#7FFF00]">
                                      {resource.title}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {resource.type} • {resource.duration}
                                    </div>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#7FFF00]" />
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Practice Project */}
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2">
                              🛠️ Practice Project
                            </h4>
                            <div className="p-3 bg-[#FF8C00]/10 border border-[#FF8C00]/30 rounded-lg text-sm text-gray-300">
                              {week.practiceProject}
                            </div>
                          </div>

                          {/* Milestones */}
                          {week.milestones && week.milestones.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-2">
                                🎯 Milestones
                              </h4>
                              <ul className="space-y-1">
                                {week.milestones.map((milestone: string, mIdx: number) => (
                                  <li key={mIdx} className="text-sm text-gray-400 flex items-center gap-2">
                                    <span className="text-[#7FFF00]">✓</span>
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
                className="pill-button bg-white text-black hover:bg-gray-200"
                onClick={() => {
                  setRoadmap(null);
                  setExpandedWeek(null);
                }}
              >
                Generate New Roadmap
              </Button>
              <Button
                className="pill-button bg-black text-white border border-[#2a2a2a] hover:bg-[#1a1a1a]"
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
