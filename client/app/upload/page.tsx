'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/Layout/DashboardSidebar';
import MetricCard from '@/components/ui/metric-card';
import DotMatrix from '@/components/ui/dot-matrix';
import MiniTrendChart from '@/components/ui/mini-trend-chart';

interface Skill {
  name: string;
  category: string;
  proficiency: number;
  evidence: string;
}

interface SkillCategories {
  technical: Skill[];
  soft: Skill[];
  tools: Skill[];
}

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState<SkillCategories | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF or DOCX file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSkills(data.skills);
        localStorage.setItem('extracted_skills', JSON.stringify(data.skills));
      } else {
        alert(data.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const totalSkills = skills ? 
    skills.technical.length + skills.soft.length + skills.tools.length : 0;

  return (
    <div className="min-h-screen bg-black">
      <DashboardSidebar />
      
      <div className="ml-20 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-sm text-gray-400 mb-2">STEP 1 OF 3</div>
          <h1 className="text-4xl font-bold text-white mb-2">Upload Your Resume</h1>
          <p className="text-gray-400">Let AI analyze your skills</p>
        </div>

        {/* Upload Section */}
        {!skills ? (
          <div className="max-w-2xl">
            <Card className="dashboard-card p-8">
              <div
                className={`
                  border-2 border-dashed rounded-2xl p-12 text-center transition-all
                  ${isDragging 
                    ? 'border-[#7FFF00] bg-[#7FFF00]/10' 
                    : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {file ? file.name : 'Drag and drop your resume here'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : 'or click to browse'}
                </p>
                <p className="text-xs text-gray-500 mb-6">Supports PDF and DOCX</p>
                
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileInput}
                />
                
                <label htmlFor="file-upload">
                  <Button
                    className="pill-button bg-white text-black hover:bg-gray-200"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </label>
              </div>

              {file && (
                <div className="mt-6 flex justify-end">
                  <Button
                    className="pill-button bg-[#7FFF00] text-black hover:bg-[#6FEF00]"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload & Analyze
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Rich Metrics Dashboard */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
              {/* Total Skills Trend */}
              <div className="dashboard-card p-6">
                <MiniTrendChart 
                  data={[12, 15, 18, 20, 22, totalSkills]} 
                  label="Total Skills Extracted"
                  value={totalSkills.toString()}
                  trend="+2 new"
                  color="white"
                  height={80}
                />
              </div>

              {/* Technical Skills Density */}
              <div className="dashboard-card p-6">
                <DotMatrix 
                  rows={4} 
                  cols={8} 
                  activeCount={skills.technical.length * 2}
                  label="Technical Proficiency"
                  value={skills.technical.length.toString()}
                  color="green"
                />
              </div>

              {/* Soft Skills Density */}
              <div className="dashboard-card p-6">
                <DotMatrix 
                  rows={4} 
                  cols={8} 
                  activeCount={skills.soft.length * 2}
                  label="Soft Skills Balance"
                  value={skills.soft.length.toString()}
                  color="orange"
                />
              </div>
            </div>


            {/* Skills Grid */}
            <div className="max-w-6xl space-y-6">
              {/* Technical Skills */}
              {skills.technical.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Technical Skills</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.technical.map((skill, idx) => (
                      <div key={idx} className="dashboard-card p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold text-white">{skill.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#7FFF00]/20 text-[#7FFF00]">
                            {skill.proficiency}/5
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-2">
                          {skill.evidence}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {skills.soft.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Soft Skills</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.soft.map((skill, idx) => (
                      <div key={idx} className="dashboard-card p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold text-white">{skill.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#FF8C00]/20 text-[#FF8C00]">
                            {skill.proficiency}/5
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-2">
                          {skill.evidence}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools */}
              {skills.tools.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Tools & Technologies</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.tools.map((skill, idx) => (
                      <div key={idx} className="dashboard-card p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold text-white">{skill.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                            {skill.proficiency}/5
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-2">
                          {skill.evidence}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 max-w-4xl">
              <Button
                className="pill-button bg-white text-black hover:bg-gray-200"
                onClick={() => {
                  setFile(null);
                  setSkills(null);
                }}
              >
                Upload Different Resume
              </Button>
              <Button
                className="pill-button bg-[#7FFF00] text-black hover:bg-[#6FEF00]"
                onClick={() => router.push('/analyze')}
              >
                Next: Analyze Gap →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
