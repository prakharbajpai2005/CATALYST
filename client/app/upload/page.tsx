'use client';

import { useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import MetricCard from '@/components/ui/metric-card';
import SkillsDonutChart from '@/components/ui/skills-donut-chart';
import SkillsDistributionChart from '@/components/ui/skills-distribution-chart';
import SkillsVerticalLollipopChart from '@/components/ui/skills-vertical-lollipop-chart';

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
      console.log('Uploading to:', `${API_BASE_URL}/resume/upload`);
      const response = await fetch(`${API_BASE_URL}/resume/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setSkills(data.skills);
        localStorage.setItem('extracted_skills', JSON.stringify(data.skills));
      } else {
        alert(data.error || `Upload failed: ${response.status}`);
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

  // Prepare data for charts
  const donutData = skills?.soft.map(s => ({
    name: s.name,
    proficiency: s.proficiency,
  })) || [];

  const distributionData = skills ? [
    { name: 'Technical', value: skills.technical.length },
    { name: 'Soft', value: skills.soft.length },
    { name: 'Tools', value: skills.tools.length },
  ] : [];

  const barData = skills?.technical.slice(0, 7).map(s => ({
    name: s.name,
    proficiency: s.proficiency
  })) || [];

  return (
    <div className="">

      <div className="p-8 flex flex-col items-center justify-center mt-23">
        {/* Header */}
        <div className="mb-8">
          <div className="text-sm text-white mb-2">STEP 1 OF 3</div>
          <h1 className="text-4xl font-bold text-white mb-2">Upload Your Resume</h1>
          <p className="text-white">Let AI analyze your skills</p>
        </div>

        {/* Upload Section */}
        {!skills ? (
          <div className="max-w-2xl">
            <Card className="dashboard-card bg-gray-800 border-none p-8 w-150">
              <div
                className={`
                  border-2 border-dashed rounded-2xl p-12 text-center transition-all
                  ${isDragging
                    ? 'border-[#7FFF00] bg-[#FACC15]/10'
                    : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 !text-black" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {file ? file.name : 'Drag and drop your resume here'}
                </h3>
                <p className="!text-white mb-4">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : 'or click to browse'}
                </p>
                <p className="text-xs text-white mb-6">Supports PDF and DOCX</p>

                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileInput}
                />

                <label htmlFor="file-upload">
                  <Button
                    className="pill-button bg-yellow-300 border-none !text-black hover:bg-gray-200"
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
                    className="pill-button bg-[#FACC15] !text-black hover:bg-[#6FEF00]"
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
          <div className="space-y-6 w-full max-w-6xl">
            {/* Rich Metrics Dashboard */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Skills Distribution */}
              <div className="dashboard-card p-6 border-none bg-gray-800">
                <h3 className="text-lg font-bold !text-white mb-4">Skills Distribution</h3>
                <SkillsDistributionChart data={distributionData} />
                <div className="text-center mt-2">
                  <span className="text-3xl font-bold !text-white">{totalSkills}</span>
                  <span className="text-sm text-white ml-2">Total Skills</span>
                </div>
              </div>

              {/* Technical Proficiency */}
              <div className="dashboard-card p-6 border-none bg-gray-800">
                <h3 className="text-lg font-bold !text-white mb-4">Top Technical Skills</h3>
                <SkillsVerticalLollipopChart data={barData} color="#FACC15" />
              </div>

              {/* Soft Skills Balance */}
              <div className="dashboard-card p-6 border-none bg-gray-800">
                <h3 className="text-lg font-bold !text-white mb-4">Soft Skills Balance</h3>
                <SkillsDonutChart data={donutData} />
              </div>
            </div>


            {/* Skills Grid */}
            <div className="space-y-6">
              {/* Technical Skills */}
              {skills.technical.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Technical Skills</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.technical.map((skill, idx) => (
                      <div key={idx} className="dashboard-card bg-gray-800 p-4 border-none">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold !text-white">{skill.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#FACC15]/20 text-[#FACC15]">
                            {skill.proficiency}/5
                          </span>
                        </div>
                        <div className="text-xs !text-white line-clamp-2">
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
                  <h3 className="text-xl font-bold !text-white mb-4">Soft Skills</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.soft.map((skill, idx) => (
                      <div key={idx} className="dashboard-card bg-gray-800 p-4 border-none">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold !text-white">{skill.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#FF8C00]/20 text-[#FF8C00]">
                            {skill.proficiency}/5
                          </span>
                        </div>
                        <div className="text-xs !text-white line-clamp-2">
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
                  <h3 className="text-xl font-bold !text-white mb-4">Tools & Technologies</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.tools.map((skill, idx) => (
                      <div key={idx} className="dashboard-card bg-gray-800 p-4 border-none">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold !text-white">{skill.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#FF8C00]/20 text-[#FF8C00]">
                            {skill.proficiency}/5
                          </span>
                        </div>
                        <div className="text-xs !text-white line-clamp-2">
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
                className="pill-button bg-white !text-black hover:bg-gray-200"
                onClick={() => {
                  setFile(null);
                  setSkills(null);
                }}
              >
                Upload Different Resume
              </Button>
              <Button
                className="pill-button bg-[#FACC15] !text-black hover:bg-[#6FEF00]"
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
