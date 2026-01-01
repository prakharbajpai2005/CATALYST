'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Terminal as TerminalIcon, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  type: 'system' | 'user' | 'ai';
  content: string;
  timestamp: Date;
  feedback?: {
    score: number;
    correctness: string;
    fluency: string;
    suggestions: string;
  };
}

interface MissionTerminalProps {
  userId: string;
  skillId: string | null;
  onScoreUpdate: (score: number) => void;
  onXPGain: (xp: number) => void;
}

export default function MissionTerminal({ userId, skillId, onScoreUpdate, onXPGain }: MissionTerminalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [missionActive, setMissionActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skillId && !missionActive) {
      startMission();
    }
  }, [skillId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const startMission = async () => {
    if (!skillId) return;

    setLoading(true);
    setMessages([]);

    try {
      const data = await api.startSimulation(userId, skillId);
      setSimulationId(data.simulationId);
      setMissionActive(true);

      // Display mission details
      setMessages([
        {
          type: 'system',
          content: `🎯 Mission: ${data.mission.title}`,
          timestamp: new Date()
        },
        {
          type: 'system',
          content: data.mission.description,
          timestamp: new Date()
        },
        {
          type: 'system',
          content: `📋 Task: ${data.mission.task}`,
          timestamp: new Date()
        },
        {
          type: 'system',
          content: `📦 Resources:\n${JSON.stringify(data.mission.resources, null, 2)}`,
          timestamp: new Date()
        },
        {
          type: 'ai',
          content: 'Ready when you are! Submit your response below.',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      setMessages([{
        type: 'system',
        content: '❌ Failed to start mission. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !simulationId || loading) return;

    const userMessage: Message = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const data = await api.submitResponse(simulationId, input);

      const aiMessage: Message = {
        type: 'ai',
        content: `📊 Evaluation Complete!\n\n✅ Correctness: ${data.feedback.correctness}\n\n💬 Fluency: ${data.feedback.fluency}\n\n💡 Suggestions: ${data.feedback.suggestions}`,
        timestamp: new Date(),
        feedback: data.feedback
      };

      setMessages(prev => [...prev, aiMessage]);
      onScoreUpdate(data.currentScore);

    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'system',
        content: '❌ Failed to get feedback. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!simulationId) return;

    setLoading(true);
    try {
      const data = await api.completeSimulation(simulationId);

      setMessages(prev => [...prev, {
        type: 'system',
        content: `🎉 Mission Complete!\n\nFinal Score: ${data.finalScore}/100\nXP Earned: ${data.xpEarned}`,
        timestamp: new Date()
      }]);

      onXPGain(data.xpEarned);
      setMissionActive(false);
    } catch (error) {
      console.error('Failed to complete mission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30">
      <CardHeader className="pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-purple-400" />
          <CardTitle className="text-xl">Mission Terminal</CardTitle>
        </div>
        <CardDescription>Complete tasks and receive real-time AI feedback</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && !loading && (
              <div className="text-center text-black py-12">
                <TerminalIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Select a skill from the Skill Tree to start a mission</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`
                  p-3 rounded-lg
                  ${msg.type === 'system' ? 'bg-blue-500/10 border border-blue-500/30 text-blue-300' : ''}
                  ${msg.type === 'user' ? 'bg-purple-500/10 border border-purple-500/30 ml-8' : ''}
                  ${msg.type === 'ai' ? 'bg-green-500/10 border border-green-500/30 mr-8' : ''}
                `}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold opacity-70">
                    {msg.type === 'system' ? '🖥️ SYSTEM' : msg.type === 'user' ? '👤 YOU' : '🤖 AI'}
                  </span>
                  <span className="text-xs opacity-50">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <pre className="mt-2 text-sm whitespace-pre-wrap font-mono">{msg.content}</pre>
                {msg.feedback && (
                  <div className="mt-2 pt-2 border-t border-green-500/20">
                    <div className="text-lg font-bold text-green-400">
                      Score: {msg.feedback.score}/100
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-black">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-purple-500/20" />

        <div className="p-4 bg-gray-900/50">
          {missionActive ? (
            <>
              <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response..."
                  disabled={loading}
                  className="flex-1 bg-gray-800 border-purple-500/30 focus:border-purple-500"
                />
                <Button type="submit" disabled={loading || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <Button
                onClick={handleComplete}
                disabled={loading || messages.length < 2}
                variant="outline"
                className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                Complete Mission
              </Button>
            </>
          ) : (
            <div className="text-center text-black">
              {skillId ? 'Loading mission...' : 'Waiting for skill selection...'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
