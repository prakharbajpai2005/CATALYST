const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { cacheWrapper, hashObject } = require('../utils/cache');
const { generateContent } = require('../utils/openrouter');

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

// Extract skills using Gemini with caching
async function extractSkillsWithAI(resumeText) {
  // Generate cache key from resume content hash
  const cacheKey = `skills:${hashObject(resumeText)}`;
  
  const { data: skills, fromCache } = await cacheWrapper(
    cacheKey,
    30 * 24 * 60 * 60, // Cache for 30 days
    async () => {
      const prompt = `Analyze this resume and extract ALL technical and soft skills. Return ONLY a JSON object with a "skills" array.

Resume:
${resumeText}

Return format:
{
  "skills": [
    {
      "name": "Skill Name",
      "category": "technical" | "soft" | "tools",
      "proficiency": 1-5,
      "evidence": "Brief context from resume"
    }
  ]
}`;

      const response = await generateContent(prompt);
      
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
  );

  return skills;
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
