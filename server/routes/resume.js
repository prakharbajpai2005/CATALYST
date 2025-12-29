const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Extract text from PDF
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parse error:', error);
    throw new Error('Failed to parse PDF file: ' + error.message);
  }
}

// Extract text from DOCX
async function extractTextFromDOCX(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// Extract skills using Gemini
async function extractSkillsWithAI(resumeText) {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash'
  });

  const prompt = `You are a resume skill extractor. Analyze this resume and extract skills.

Resume Text:
${resumeText}

Extract and categorize skills into:
1. Technical Skills (programming languages, frameworks, databases, cloud platforms)
2. Soft Skills (leadership, communication, problem-solving, teamwork)
3. Tools & Technologies (Git, Docker, Kubernetes, CI/CD tools, etc.)

For each skill, provide:
- name: The skill name
- category: One of "technical", "soft", or "tools"
- proficiency: Estimated level from 1-5 based on context (1=beginner, 5=expert)
- evidence: Brief quote or context from resume showing this skill

Return ONLY valid JSON in this exact format:
{
  "skills": [
    {
      "name": "Python",
      "category": "technical",
      "proficiency": 4,
      "evidence": "3 years of Python development"
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  // Clean up the response to extract JSON
  let jsonText = response.trim();
  
  // Remove markdown code blocks if present
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```\n?/g, '');
  }
  
  try {
    const parsed = JSON.parse(jsonText);
    return parsed.skills || [];
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    console.error('Response was:', jsonText);
    throw new Error('Failed to parse AI response');
  }
}

// Upload and analyze resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  console.log('📤 Resume upload request received');
  
  try {
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📄 File received:', req.file.originalname, req.file.mimetype);

    // Extract text based on file type
    let resumeText;
    if (req.file.mimetype === 'application/pdf') {
      console.log('🔍 Extracting text from PDF...');
      resumeText = await extractTextFromPDF(req.file.buffer);
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('🔍 Extracting text from DOCX...');
      resumeText = await extractTextFromDOCX(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    console.log('✅ Text extracted, length:', resumeText.length);
    console.log('🤖 Calling Gemini for skill extraction...');

    // Extract skills using AI
    const skills = await extractSkillsWithAI(resumeText);

    console.log('✅ Skills extracted:', skills.length);

    // Categorize skills
    const categorized = {
      technical: skills.filter(s => s.category === 'technical'),
      soft: skills.filter(s => s.category === 'soft'),
      tools: skills.filter(s => s.category === 'tools')
    };

    console.log('📊 Categorized:', {
      technical: categorized.technical.length,
      soft: categorized.soft.length,
      tools: categorized.tools.length
    });

    res.json({
      success: true,
      resumeText: resumeText.substring(0, 500) + '...', // Preview
      skills: categorized,
      totalSkills: skills.length
    });

  } catch (error) {
    console.error('❌ Resume upload error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process resume',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get skill statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    // TODO: Fetch from database
    res.json({
      totalSkills: 0,
      byCategory: {
        technical: 0,
        soft: 0,
        tools: 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
