# 🚀 TalentMatch AI — Candidate Shortlisting System

A full-stack web app that matches and ranks job candidates using skill analysis and Claude AI.
FrontEnd -Link : https://job-shortlisting-app-1.onrender.com
BackEnd -Link : https://job-shortlisting-app.onrender.com

**Tech Stack:** React · Node.js · Express · MongoDB · Claude AI API

---

## 📁 Project Structure

```
candidate-shortlisting/
├── backend/
│   ├── models/
│   │   └── Candidate.js        ← MongoDB schema
│   ├── routes/
│   │   ├── candidates.js       ← Add/Get/Delete candidates
│   │   ├── match.js            ← Basic skill matching
│   │   └── ai.js               ← Claude AI matching
│   ├── server.js               ← Express server entry point
│   ├── package.json
│   └── .env                    ← API keys (keep private!)
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── AddCandidate.js
        │   ├── CandidateList.js
        │   └── Shortlist.js
        ├── App.js
        ├── App.css
        └── index.js
```

---

## ⚙️ SETUP INSTRUCTIONS (Step by Step)

### STEP 1: Install Software

1. **Node.js** → https://nodejs.org → Download LTS → Install (keep all defaults)
2. **MongoDB** → https://www.mongodb.com/try/download/community → Windows MSI → Install Complete
3. **VS Code** → https://code.visualstudio.com (if not already installed)

Verify Node.js works — open VS Code terminal and type:
```
node --version
npm --version
```

---

### STEP 2: Get Your Claude API Key

1. Go to https://console.anthropic.com
2. Sign up / Log in
3. Click **"API Keys"** in the left menu
4. Click **"Create Key"** → Copy the key (starts with `sk-ant-...`)

---

### STEP 3: Set Up Backend

Open VS Code Terminal and run:

```bash
cd candidate-shortlisting/backend
npm install
```

Then open the `.env` file and replace:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```
with your actual Claude API key.

---

### STEP 4: Set Up Frontend

Open a **new terminal tab** in VS Code and run:

```bash
cd candidate-shortlisting/frontend
npx create-react-app . --template cra-template
```

When it asks "Need to install... OK to proceed? (y)" → type **y** and press Enter.

After it finishes, **replace** the generated files with the ones provided:
- `src/App.js` → replace with provided file
- `src/App.css` → replace with provided file
- `src/index.js` → replace with provided file
- Create folder `src/components/` and add all 3 component files

---

### STEP 5: Run the Project

You need **two terminals open at the same time**:

**Terminal 1 — Backend:**
```bash
cd candidate-shortlisting/backend
npm start
```
You should see: `✅ MongoDB Connected` and `✅ Server running on http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd candidate-shortlisting/frontend
npm start
```
Browser will open automatically at `http://localhost:3000`

---

## 🎮 How to Use the App

1. **Add Candidates** → Click "Add Candidate", fill in name, email, experience, skills
2. **View All Candidates** → Click "All Candidates" to see everyone in the database
3. **Basic Shortlist** → Click "Shortlist" → enter required skills → "Find Matches"
4. **AI Shortlist** → Same page → toggle to "AI Match" → "AI Shortlist" (uses Claude AI)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/candidates | Add a candidate |
| GET | /api/candidates | Get all candidates |
| DELETE | /api/candidates/:id | Delete a candidate |
| POST | /api/match | Basic skill matching |
| POST | /api/ai/shortlist | AI-powered shortlisting |

---

## 🧪 Test with Sample Data

Add these candidates to test:

| Name | Email | Skills | Experience |
|------|-------|--------|------------|
| Rahul Sharma | rahul@test.com | React, Node.js, MongoDB | 2 |
| Priya Singh | priya@test.com | React, Node.js, AWS, TypeScript | 3 |
| Ankit Kumar | ankit@test.com | HTML, CSS, JavaScript | 1 |
| Neha Gupta | neha@test.com | Python, Django, MongoDB | 4 |

Then shortlist with: Required Skills: `React, Node.js` | Min Experience: `1`

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm not found` | Reinstall Node.js from nodejs.org |
| `MongoDB connection error` | Make sure MongoDB service is running (search "Services" in Windows) |
| `AI not working` | Check your ANTHROPIC_API_KEY in the .env file |
| `CORS error in browser` | Make sure backend is running on port 5000 |
| Frontend blank page | Check browser console (F12) for errors |
