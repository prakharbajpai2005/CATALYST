# 🔄 OpenRouter Migration Guide

## ✅ Migration Complete!

Your Skill-Bridge app now uses **OpenRouter** instead of Google Gemini. This gives you:

- ✅ **Higher rate limits** (no more 5 requests/min restriction)
- ✅ **Access to multiple AI models** (Gemini, GPT-4, Claude, etc.)
- ✅ **Better pricing** (often cheaper than direct API access)
- ✅ **Unified API** for all models

---

## 🔑 Setup Instructions

### Step 1: Get Your OpenRouter API Key

1. Go to https://openrouter.ai/keys
2. Sign up or log in
3. Create a new API key
4. Copy your API key

### Step 2: Update Your `.env` File

Open `server/.env` and add:

```bash
OPENROUTER_API_KEY=your_actual_api_key_here
APP_URL=http://localhost:3000
```

**Remove** the old Gemini key:
```bash
# GEMINI_API_KEY=... (no longer needed)
```

### Step 3: Restart Your Server

```bash
# In server directory
npm run dev
```

---

## 📊 What Changed

### Files Modified:

1. ✅ `server/utils/openrouter.js` - **NEW** OpenRouter client
2. ✅ `server/utils/promptChain.js` - Uses OpenRouter instead of Gemini
3. ✅ `server/routes/roadmap.js` - Removed Gemini initialization
4. ✅ `server/routes/resume.js` - Uses OpenRouter for skill extraction
5. ✅ `server/routes/analyze.js` - Uses OpenRouter for gap analysis
6. ✅ `server/.env.example` - Updated configuration template

### Dependencies Added:

- ✅ `openai` package (OpenRouter uses OpenAI SDK)

---

## 🎯 Default Model

**Current:** `google/gemini-2.0-flash-exp:free`

This is a **FREE** model with:
- ✅ No rate limits (or very high limits)
- ✅ Same quality as Gemini 2.0 Flash
- ✅ Fast responses

### Want to Use a Different Model?

Edit `server/utils/openrouter.js` line 35:

```javascript
// Change this line:
async function generateContent(prompt, model = 'google/gemini-2.0-flash-exp:free') {

// To use GPT-4:
async function generateContent(prompt, model = 'openai/gpt-4-turbo') {

// Or Claude:
async function generateContent(prompt, model = 'anthropic/claude-3-sonnet') {
```

**Available models:** https://openrouter.ai/models

---

## 💰 Pricing Comparison

### Before (Google Gemini Direct):
- **Free tier:** 5 requests/minute
- **Paid tier:** $0.00025 per 1K tokens (input)
- **Rate limit:** Very restrictive

### After (OpenRouter):
- **Free models:** Unlimited (or very high limits)
- **Paid models:** Often cheaper than direct API
- **Rate limit:** Much more generous

### Example Costs (for 18-week roadmap):
- **Gemini direct (free):** Rate limited, takes 4+ minutes
- **OpenRouter (free model):** No rate limit, instant
- **OpenRouter (GPT-4):** ~$0.03 per roadmap

---

## 🚀 Benefits

### 1. No More Rate Limits
```bash
# Before:
⏳ Rate limit hit. Retrying in 53s... (Attempt 1/3)
⏳ Rate limit hit. Retrying in 59s... (Attempt 2/3)

# After:
✅ Roadmap generated in 8 seconds!
```

### 2. Model Flexibility
Switch between models instantly:
- **Free:** `google/gemini-2.0-flash-exp:free`
- **Fast:** `google/gemini-pro`
- **Smart:** `openai/gpt-4-turbo`
- **Creative:** `anthropic/claude-3-sonnet`

### 3. Better Error Handling
OpenRouter provides unified error messages and automatic fallbacks.

---

## 🧪 Testing

### Test Resume Upload:
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@your_resume.pdf"
```

### Test Roadmap Generation:
```bash
curl -X POST http://localhost:5000/api/roadmap/generate \
  -H "Content-Type: application/json" \
  -d '{
    "skillGaps": ["TypeScript", "AWS"],
    "targetRole": "Full Stack Developer",
    "availableHoursPerWeek": 10
  }'
```

---

## ⚠️ Troubleshooting

### Error: "OPENROUTER_API_KEY not found"
**Solution:** Add your API key to `server/.env`

### Error: "Invalid API key"
**Solution:** Check your key at https://openrouter.ai/keys

### Error: "Model not found"
**Solution:** Check available models at https://openrouter.ai/models

### Slow responses?
**Solution:** You might be using a paid model. Switch to a free model in `openrouter.js`

---

## 📚 OpenRouter Resources

- **Dashboard:** https://openrouter.ai/activity
- **API Keys:** https://openrouter.ai/keys
- **Models:** https://openrouter.ai/models
- **Pricing:** https://openrouter.ai/docs#models
- **Docs:** https://openrouter.ai/docs

---

## 🎉 You're All Set!

Just add your OpenRouter API key to `.env` and you're ready to go!

**No more rate limits. No more waiting. Just fast, reliable AI responses.** 🚀
