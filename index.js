const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const Analysis = require('./models/Analysis');
const { calculateScoreAndRoadmap } = require('./utils/analyzer');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// Helper: Parse "user/repo" from URL
const parseGithubUrl = (url) => {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  return match ? { owner: match[1], repo: match[2] } : null;
};

// 2. API Endpoint: Analyze
app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;
  const match = parseGithubUrl(url);

  if (!match) return res.status(400).json({ error: "Invalid GitHub URL" });

  const { owner, repo } = match;
  
  // Optional: Add GitHub Token if you have one in .env
  const headers = process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {};

  try {
    console.log(`Fetching data for ${owner}/${repo}...`);
    
    // Fetch Repo Metadata
    const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    
    // Fetch File Structure
    const contentRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers });
    
    // Fetch Recent Commits
    const commitRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`, { headers });

    // AI Logic
    const analysisResult = calculateScoreAndRoadmap(repoRes.data, contentRes.data, commitRes.data);

    // Save to DB
    const newAnalysis = new Analysis({
      repoName: repoRes.data.full_name,
      repoUrl: url,
      ...analysisResult
    });
    await newAnalysis.save();

    res.json(analysisResult);

  } catch (error) {
    console.error("Error details:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch repository. It might be private or doesn't exist." });
  }
});

// 3. API Endpoint: History
app.get('/api/history', async (req, res) => {
  try {
    const history = await Analysis.find().sort({ createdAt: -1 }).limit(5);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));