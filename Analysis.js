const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  repoName: String,
  repoUrl: String,
  score: Number,
  summary: String,
  roadmap: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);