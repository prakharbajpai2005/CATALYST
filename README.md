# Skill-Bridge

An AI-driven Interactive Simulation Platform where users "learn by doing" through realistic workplace scenarios.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **AI**: Mock LLM evaluation (ready for real LLM integration)

## 📁 Project Structure

```
CATALYST/
├── client/          # Next.js frontend
│   ├── app/         # App router pages
│   ├── components/  # React components
│   └── lib/         # Utilities and API client
└── server/          # Express backend
    ├── models/      # Mongoose models
    └── routes/      # API routes
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or connection string ready

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies (already done):
```bash
npm install
```

3. Configure environment variables:
Edit `server/.env` and update MongoDB URI if needed:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skill-bridge
```

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🎮 Features

### Phase 1: Simulation Engine
- Hardcoded demo missions for Project Management and Python
- Mock AI evaluation with realistic feedback
- Score calculation based on correctness, approach, and communication

### Phase 2: Data Schema
- **Users**: Track levels, XP, and skill completion
- **Skill Tree**: RPG-style progression with prerequisites
- **Simulations**: Complete mission history with responses and feedback

### Phase 3: Mission Dashboard
- **Left Panel**: Gamified skill tree with unlock system
- **Center Panel**: Interactive mission terminal
- **Right Panel**: Live AI feedback and XP progress

### Phase 4: Skill Passport
- Shareable proof of competence
- Statistics: missions completed, average score, skills mastered
- Skill breakdown with performance metrics
- Recent achievements timeline

## 🎯 Demo Flow

1. Open `http://localhost:3000` (redirects to `/dashboard`)
2. Select a skill from the Skill Tree (Project Management or Python)
3. Read the mission brief and resources
4. Submit your response in the terminal
5. Receive AI feedback and score
6. Complete the mission to earn XP and level up
7. View your Skill Passport at `/passport/676ff8e8c4d5a1b2e3f4g5h6`

## 🔐 Security

- Environment variables for sensitive data (`.env` files)
- `.gitignore` configured for both client and server
- CORS enabled for local development

## 📊 API Endpoints

### User
- `POST /api/user/create` - Create new user
- `GET /api/user/:userId` - Get user details
- `POST /api/user/update-xp` - Update user XP and level

### Skill Tree
- `GET /api/skill-tree/:userId` - Get user's skill tree
- `POST /api/skill-tree/unlock` - Unlock a skill

### Simulation
- `POST /api/simulation/start` - Start new simulation
- `POST /api/simulation/respond` - Submit response and get feedback
- `POST /api/simulation/complete` - Complete simulation
- `GET /api/simulation/history/:userId` - Get simulation history

### Passport
- `GET /api/passport/:userId` - Generate skill passport

## 🎨 Design Highlights

- **Premium B2B SaaS aesthetic** with gradient backgrounds
- **Dark theme** with purple/pink accent colors
- **Glassmorphism** effects and smooth animations
- **Responsive** 3-column dashboard layout
- **Real-time feedback** with animated progress bars

## 🚀 Deployment Notes

### Frontend (Vercel/Netlify)
- Build command: `npm run build`
- Output directory: `.next`
- Environment variable: `NEXT_PUBLIC_API_URL`

### Backend (Render/Railway/Heroku)
- Start command: `npm start`
- Environment variables: `PORT`, `MONGODB_URI`

## 📝 Future Enhancements

- Real LLM integration (OpenAI, Anthropic, or Gemini)
- User authentication and authorization
- PDF export for Skill Passport
- Social sharing features
- More skills and missions
- Leaderboards and achievements
- Video/audio response support

## 🤝 Contributing

This is a hackathon prototype. Feel free to extend and improve!

## 📄 License

MIT
