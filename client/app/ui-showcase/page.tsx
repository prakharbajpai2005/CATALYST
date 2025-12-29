'use client';

import GlassSidebar from '@/components/Sidebar/GlassSidebar';
import SocraticTutor from '@/components/SocraticTutor/TutorChat';
import SkillGapHeatmap from '@/components/SkillHeatmap/SkillGapHeatmap';
import AnimatedRoadmap from '@/components/Roadmap/AnimatedRoadmap';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function UIShowcasePage() {
  const demoUser = {
    name: 'John Doe',
    email: 'john@skillbridge.com',
    avatar: '',
    initials: 'JD',
  };

  const demoSkills = [
    { name: 'React', currentLevel: 4, targetLevel: 5, category: 'technical' as const },
    { name: 'TypeScript', currentLevel: 2, targetLevel: 5, category: 'technical' as const },
    { name: 'Node.js', currentLevel: 3, targetLevel: 4, category: 'technical' as const },
    { name: 'GraphQL', currentLevel: 1, targetLevel: 4, category: 'technical' as const },
    { name: 'Docker', currentLevel: 2, targetLevel: 4, category: 'tools' as const },
    { name: 'AWS', currentLevel: 1, targetLevel: 5, category: 'tools' as const },
    { name: 'Leadership', currentLevel: 2, targetLevel: 4, category: 'soft' as const },
    { name: 'Communication', currentLevel: 3, targetLevel: 5, category: 'soft' as const },
    { name: 'Next.js', currentLevel: 3, targetLevel: 5, category: 'technical' as const },
    { name: 'PostgreSQL', currentLevel: 2, targetLevel: 4, category: 'technical' as const },
    { name: 'Redis', currentLevel: 1, targetLevel: 3, category: 'tools' as const },
    { name: 'CI/CD', currentLevel: 2, targetLevel: 4, category: 'tools' as const },
  ];

  const [roadmapWeeks, setRoadmapWeeks] = useState([
    {
      week: 1,
      title: 'TypeScript Fundamentals',
      skill: 'TypeScript',
      topics: ['Type System', 'Interfaces', 'Generics', 'Advanced Types'],
      estimatedHours: 10,
      resources: [
        { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', type: 'documentation', duration: '3h' },
        { title: 'TypeScript Deep Dive', url: 'https://basarat.gitbook.io/typescript/', type: 'article', duration: '4h' },
        { title: 'TypeScript Course', url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs', type: 'video', duration: '3h' },
      ],
      practiceProject: 'Build a type-safe REST API with Express and TypeScript',
      milestones: ['Understand type system', 'Create first typed project'],
      completed: false,
    },
    {
      week: 2,
      title: 'AWS Essentials',
      skill: 'AWS',
      topics: ['EC2', 'S3', 'Lambda', 'RDS', 'IAM'],
      estimatedHours: 10,
      resources: [
        { title: 'AWS Free Tier Guide', url: 'https://aws.amazon.com/free/', type: 'documentation', duration: '2h' },
        { title: 'AWS Certified Cloud Practitioner', url: 'https://www.youtube.com/watch?v=3hLmDS179YE', type: 'video', duration: '4h' },
      ],
      practiceProject: 'Deploy a Node.js app to AWS EC2 with S3 storage',
      milestones: ['Set up AWS account', 'Deploy first application'],
      completed: false,
    },
    {
      week: 3,
      title: 'GraphQL Basics',
      skill: 'GraphQL',
      topics: ['Schema Design', 'Queries', 'Mutations', 'Resolvers'],
      estimatedHours: 10,
      resources: [
        { title: 'GraphQL Official Docs', url: 'https://graphql.org/learn/', type: 'documentation', duration: '3h' },
        { title: 'GraphQL with Apollo', url: 'https://www.apollographql.com/docs/', type: 'documentation', duration: '4h' },
      ],
      practiceProject: 'Build a GraphQL API for a blog platform',
      milestones: ['Understand schema design', 'Create first GraphQL API'],
      completed: false,
    },
  ]);

  const handleWeekComplete = (weekNumber: number) => {
    setRoadmapWeeks(weeks =>
      weeks.map(w => w.week === weekNumber ? { ...w, completed: true } : w)
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Glassmorphic Sidebar */}
      <GlassSidebar user={demoUser} readinessScore={72} />

      {/* Main Content */}
      <main className="ml-80 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Premium SaaS UI Showcase
          </h1>
          <p className="text-gray-400 mb-8">
            Glassmorphism • Dark Mode • Neon Accents • Smooth Animations
          </p>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="glass-card">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="heatmap">Skill Heatmap</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Skill Gap Cards */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Your Skills
                  </h3>
                  <div className="space-y-3">
                    {demoSkills.filter(s => s.currentLevel >= 3).map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-gray-300">{skill.name}</span>
                        <Badge className="bg-gradient-to-r from-indigo-500 to-cyan-500 border-0">
                          Level {skill.currentLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass-card p-6 border-neon">
                  <h3 className="text-xl font-semibold text-neon-missing mb-4 animate-glow">
                    Missing Skills
                  </h3>
                  <div className="space-y-3">
                    {demoSkills.filter(s => s.targetLevel - s.currentLevel >= 3).map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-gray-300">{skill.name}</span>
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 border-0">
                          Gap: {skill.targetLevel - skill.currentLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: '📊', title: 'Glassmorphic Sidebar', desc: 'Frosted glass effect with backdrop blur' },
                  { icon: '🎨', title: 'Neon Accents', desc: 'Pink/Purple gradients for critical gaps' },
                  { icon: '✨', title: 'Smooth Animations', desc: 'Framer Motion powers all interactions' },
                  { icon: '🗺️', title: 'Animated Roadmap', desc: 'Slide-in effects with expandable weeks' },
                  { icon: '🔥', title: 'Skill Heatmap', desc: 'Canvas-based visualization with gradients' },
                  { icon: '💬', title: 'Socratic Tutor', desc: 'Unobtrusive AI chat assistant' },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="
                      glass-card p-6
                      hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]
                      transition-all duration-300
                    ">
                      <div className="text-4xl mb-3">{feature.icon}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {feature.desc}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Implementation Status */}
              <Card className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  ✅ All Components Implemented
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'Glassmorphic Sidebar',
                    'Socratic Tutor Chat',
                    'Dark Mode with Neon Accents',
                    'Framer Motion Animations',
                    'Skill Gap Heatmap',
                    'Animated Roadmap',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="heatmap">
              <SkillGapHeatmap skills={demoSkills} />
            </TabsContent>

            <TabsContent value="roadmap">
              <AnimatedRoadmap weeks={roadmapWeeks} onWeekComplete={handleWeekComplete} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Socratic Tutor */}
      <SocraticTutor />
    </div>
  );
}
