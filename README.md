# Skill-Bridge: Autonomous Career Architect

> **"LinkedIn tells you who you are. Skill-Bridge tells you who you need to become."**

An AI-powered career transformation platform that analyzes your resume, compares it against your dream job, and creates a personalized learning roadmap to bridge the gap.

---

## 🚀 Features

### ✅ Phase 1: AI Skill Auditor (IMPLEMENTED)
- **Resume Upload**: Drag-and-drop PDF/DOCX support
- **AI Extraction**: Gemini-powered skill extraction
- **Skill Heatmap**: Visual categorization (Technical, Tools, Soft Skills)
- **Proficiency Levels**: 1-5 rating with evidence from resume

### 🚧 Coming Next
- **Phase 2**: Gap Analysis (compare resume vs job description)
- **Phase 3**: Dynamic Roadmap Generation
- **Phase 4**: On-Demand Micro-Tutorials
- **Phase 5**: Hiring Readiness Score

---

## 📋 Prerequisites

1. **Node.js** 18+ installed
2. **MongoDB** running (local or Atlas)
3. **Gemini API Key** (free tier available)

### Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

---

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
# Navigate to project
cd CATALYST

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skill-bridge
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Frontend** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start the Servers

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
```

### 4. Open the App
Navigate to: **http://localhost:3000**

---

## 🎯 How to Use

### Step 1: Upload Resume
1. Open http://localhost:3000
2. Drag and drop your resume (PDF or DOCX)
3. Click "Analyze Resume"
4. Wait for AI to extract skills (~10-15 seconds)

### Step 2: View Extracted Skills
- See skills categorized by type
- Check proficiency levels (Beginner → Expert)
- Review evidence quotes from your resume

### Step 3: Next Steps (Coming Soon)
- Paste a job description
- Get gap analysis
- Generate personalized roadmap

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini 1.5 Flash
- **File Processing**:
  - `multer` - File uploads
  - `pdf-parse` - PDF extraction
  - `mammoth` - DOCX extraction

---

## 📁 Project Structure

```
CATALYST/
├── client/                 # Next.js frontend
│   ├── app/
│   │   ├── upload/        # Resume upload page
│   │   ├── analyze/       # Gap analysis (coming soon)
│   │   ├── roadmap/       # Learning path (coming soon)
│   │   └── dashboard/     # Old simulation (deprecated)
│   ├── components/
│   └── lib/
└── server/                # Express backend
    ├── models/
    │   ├── User.js
    │   ├── SkillTree.js
    │   └── Simulation.js
    ├── routes/
    │   ├── resume.js      # ✅ NEW: Resume upload & extraction
    │   ├── user.js
    │   └── ...
    └── index.js
```

---

## 🔑 API Endpoints

### Resume Upload
```http
POST /api/resume/upload
Content-Type: multipart/form-data

Body: { resume: File }

Response: {
  success: true,
  skills: {
    technical: [...],
    soft: [...],
    tools: [...]
  },
  totalSkills: 15
}
```

---

## 🐛 Troubleshooting

### "Failed to parse AI response"
- **Cause**: Gemini API key not set or invalid
- **Fix**: Check `server/.env` has correct `GEMINI_API_KEY`

### "MongoDB connection error"
- **Cause**: MongoDB not running
- **Fix**: Start MongoDB locally or use MongoDB Atlas connection string

### "Port 3000 already in use"
- **Cause**: Another Next.js instance running
- **Fix**: Kill the process or use a different port

---

## 🎨 Design Philosophy

- **Premium B2B SaaS** aesthetic
- **Dark mode** with indigo/purple gradients
- **Glassmorphism** effects
- **Smooth animations** for engagement
- **Mobile-responsive** (coming soon)

---

## 📊 Current Status

| Feature | Status |
|---------|--------|
| Resume Upload | ✅ Done |
| Skill Extraction | ✅ Done |
| Skill Categorization | ✅ Done |
| Gap Analysis | 🚧 In Progress |
| Roadmap Generation | ⏳ Planned |
| Micro-Tutorials | ⏳ Planned |
| Hiring Readiness Score | ⏳ Planned |

---

## 🚀 Next Development Steps

1. **Phase 2**: Job Description input and gap analysis
2. **Phase 3**: Gemini-powered roadmap generation
3. **Phase 4**: On-demand tutorial system
4. **Phase 5**: Progress tracking and readiness score

---

## 📝 Notes

- **Gemini API**: Free tier has rate limits (60 requests/minute)
- **File Size**: Max 5MB for resume uploads
- **Supported Formats**: PDF and DOCX only
- **Processing Time**: ~10-15 seconds per resume

---

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

---

## 📄 License

MIT

---

**Built with ❤️ for the hackathon** 🏆
