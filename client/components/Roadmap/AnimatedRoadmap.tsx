'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Week {
  week: number;
  title: string;
  skill: string;
  topics: string[];
  estimatedHours: number;
  resources: Array<{ title: string; url: string; type: string; duration?: string }>;
  practiceProject: string;
  milestones: string[];
  completed: boolean;
}

interface AnimatedRoadmapProps {
  weeks: Week[];
  onWeekComplete?: (weekNumber: number) => void;
}

export default function AnimatedRoadmap({ weeks, onWeekComplete }: AnimatedRoadmapProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return '🎥';
      case 'documentation': return '📚';
      case 'article': return '📝';
      case 'course': return '🎓';
      default: return '🔗';
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {weeks.map((week, index) => (
          <motion.div
            key={week.week}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: 'easeOut',
            }}
          >
            <Card className={`
              relative overflow-hidden
              border-2 transition-all duration-300
              ${week.completed
                ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30'
                : 'glass-card hover:border-indigo-500/50'
              }
            `}>
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-cyan-500/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />

              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Week number badge */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`
                        flex items-center justify-center
                        w-12 h-12 rounded-xl font-bold text-lg
                        ${week.completed
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                          : 'bg-gradient-to-br from-indigo-500 to-cyan-500'
                        }
                        shadow-lg
                      `}
                    >
                      {week.completed ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        week.week
                      )}
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-1">
                        {week.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                          {week.skill}
                        </Badge>
                        <Badge variant="outline" className="text-black border-white/20">
                          {week.estimatedHours}h
                        </Badge>
                        {week.topics.slice(0, 2).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-black border-white/10">
                            {topic}
                          </Badge>
                        ))}
                        {week.topics.length > 2 && (
                          <Badge variant="outline" className="text-black border-white/10">
                            +{week.topics.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                    className="text-black hover:text-black"
                  >
                    {expandedWeek === week.week ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedWeek === week.week && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-white/10 space-y-4">
                        {/* Topics */}
                        <div>
                          <h4 className="text-sm font-semibold text-black mb-2">Topics to Cover</h4>
                          <div className="flex flex-wrap gap-2">
                            {week.topics.map((topic, idx) => (
                              <motion.div
                                key={topic}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                <Badge variant="outline" className="text-black border-white/20">
                                  {topic}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div>
                          <h4 className="text-sm font-semibold text-black mb-2">Learning Resources</h4>
                          <div className="space-y-2">
                            {week.resources.map((resource, idx) => (
                              <motion.a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ x: 4 }}
                                className="
                                  flex items-center gap-3 p-3 rounded-lg
                                  bg-white/5 hover:bg-white/10
                                  border border-white/10 hover:border-indigo-500/50
                                  transition-all group
                                "
                              >
                                <span className="text-2xl">
                                  {getResourceIcon(resource.type)}
                                </span>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-black group-hover:text-indigo-300 transition-colors">
                                    {resource.title}
                                  </div>
                                  <div className="text-xs text-black">
                                    {resource.type} {resource.duration && `• ${resource.duration}`}
                                  </div>
                                </div>
                                <span className="text-black group-hover:text-indigo-400 transition-colors">
                                  →
                                </span>
                              </motion.a>
                            ))}
                          </div>
                        </div>

                        {/* Milestones */}
                        {week.milestones.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-black mb-2">Milestones</h4>
                            <div className="space-y-2">
                              {week.milestones.map((milestone, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="flex items-center gap-2 text-sm text-black"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                  {milestone}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Practice Project */}
                        <div className="
                          p-4 rounded-lg
                          bg-gradient-to-br from-purple-500/10 to-pink-500/10
                          border border-purple-500/30
                        ">
                          <h4 className="text-sm font-semibold text-purple-300 mb-2">
                            🎯 Practice Project
                          </h4>
                          <p className="text-sm text-black">
                            {week.practiceProject}
                          </p>
                        </div>

                        {/* Mark Complete Button */}
                        {!week.completed && (
                          <Button
                            onClick={() => onWeekComplete?.(week.week)}
                            className="
                              w-full bg-gradient-to-r from-indigo-500 to-cyan-500
                              hover:from-indigo-600 hover:to-cyan-600
                              text-black font-semibold
                            "
                          >
                            Mark Week {week.week} Complete
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress indicator line */}
              {week.completed && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="h-1 bg-gradient-to-r from-green-500 to-emerald-500"
                />
              )}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
