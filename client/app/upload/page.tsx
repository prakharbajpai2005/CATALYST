'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

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
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSkills(data.skills);
      
      // Store skills in localStorage for next steps
      localStorage.setItem('extracted_skills', JSON.stringify(data.skills));
      localStorage.setItem('total_skills', data.totalSkills.toString());

    } catch (err: any) {
      setError(err.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const getProficiencyLabel = (level: number) => {
    const labels = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level - 1] || 'Unknown';
  };

  const getProficiencyColor = (level: number) => {
    if (level >= 4) return 'text-green-400';
    if (level >= 3) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Upload Your Resume
          </h1>
          <p className="text-gray-400">Let AI analyze your skills and experience</p>
        </div>

        {/* Upload Card */}
        {!skills && (
          <Card className="bg-gray-900/50 border-2 border-indigo-500/30">
            <CardHeader>
              <CardTitle>Step 1: Upload Resume</CardTitle>
              <CardDescription>PDF or DOCX format, max 5MB</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Drag and Drop Zone */}
              <div
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center transition-all
                  ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 hover:border-indigo-500/50'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
                <p className="text-lg font-semibold mb-2">
                  {file ? file.name : 'Drag and drop your resume here'}
                </p>
                <p className="text-sm text-gray-400 mb-4">or</p>
                <label className="cursor-pointer">
                  <span className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg inline-block">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileInput}
                  />
                </label>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {file && !error && (
                <div className="mt-4 flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Skills Display */}
        {skills && (
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-2 border-green-500/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <CardTitle>Skills Extracted Successfully!</CardTitle>
                </div>
                <CardDescription>
                  Found {skills.technical.length + skills.soft.length + skills.tools.length} skills across 3 categories
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Technical Skills */}
            {skills.technical.length > 0 && (
              <Card className="bg-gray-900/50 border-2 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400">💻 Technical Skills ({skills.technical.length})</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.technical.map((skill, idx) => (
                    <div key={idx} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{skill.name}</span>
                        <span className={`text-sm ${getProficiencyColor(skill.proficiency)}`}>
                          {getProficiencyLabel(skill.proficiency)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 italic">"{skill.evidence}"</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tools */}
            {skills.tools.length > 0 && (
              <Card className="bg-gray-900/50 border-2 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">🛠️ Tools & Technologies ({skills.tools.length})</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.tools.map((skill, idx) => (
                    <div key={idx} className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{skill.name}</span>
                        <span className={`text-sm ${getProficiencyColor(skill.proficiency)}`}>
                          {getProficiencyLabel(skill.proficiency)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 italic">"{skill.evidence}"</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Soft Skills */}
            {skills.soft.length > 0 && (
              <Card className="bg-gray-900/50 border-2 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400">🤝 Soft Skills ({skills.soft.length})</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.soft.map((skill, idx) => (
                    <div key={idx} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{skill.name}</span>
                        <span className={`text-sm ${getProficiencyColor(skill.proficiency)}`}>
                          {getProficiencyLabel(skill.proficiency)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 italic">"{skill.evidence}"</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Next Step Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => router.push('/analyze')}
                className="bg-indigo-600 hover:bg-indigo-700 px-8 py-6 text-lg"
              >
                Next: Analyze Skill Gap →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
