import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Github, CheckCircle2, AlertTriangle, BookOpen, Activity, ArrowRight, GitBranch, Moon, Sun, Terminal } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  
  // Theme State (Default to dark mode because it looks cooler)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(darkMode));
    fetchHistory();
  }, [darkMode, result]);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/history');
      setHistory(data);
    } catch (err) {
      console.error("Could not fetch history");
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    if (!url.includes('github.com')) {
      setError("Please enter a valid GitHub URL");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/analyze', { url });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreStyles = (score) => {
    if (score >= 80) return {
        text: "text-green-600 dark:text-green-400",
        border: "border-green-500",
        bg: "bg-green-50 dark:bg-green-900/20",
        label: "Gold Standard"
    };
    if (score >= 50) return {
        text: "text-yellow-600 dark:text-yellow-400",
        border: "border-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        label: "Silver Standard"
    };
    return {
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500",
        bg: "bg-red-50 dark:bg-red-900/20",
        label: "Needs Improvement"
    };
  };

  const scoreStyles = result ? getScoreStyles(result.score) : null;

  return (
    // Top-level div handles the dark class toggle
    <div className={darkMode ? "dark" : ""}>
      
      {/* Main Container */}
      <div className="min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-github-dark dark:text-gray-100 font-sans p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Navbar / Header */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div className="flex items-center gap-3">
              <Github className="w-10 h-10 text-gray-800 dark:text-white" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">RepoMirror</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Deep Code Profiler</p>
              </div>
            </div>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-github-border text-gray-700 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </header>

          {/* Input Section */}
          <div className="bg-white dark:bg-github-card p-8 rounded-xl shadow-sm border border-gray-200 dark:border-github-border mb-10 transition-colors">
            <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4 relative">
              <div className="flex-1 relative">
                  <Terminal className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="https://github.com/username/repository"
                    className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0d1117] focus:ring-2 focus:ring-github-green focus:border-transparent outline-none transition-all dark:text-white"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-github-green hover:bg-github-greenHover text-white px-8 py-3.5 rounded-lg font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Activity className="animate-spin w-5 h-5"/> : <span className="flex items-center gap-2">Scan Repo <ArrowRight className="w-4 h-4"/></span>}
              </button>
            </form>
            {error && (
              <div className="flex items-center gap-2 mt-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                   <AlertTriangle className="w-5 h-5" /> <p className="font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Results Grid */}
          {result && scoreStyles && (
            <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up mb-16">
              
              {/* Score Card */}
              <div className="md:col-span-1 bg-white dark:bg-github-card p-8 rounded-xl border border-gray-200 dark:border-github-border flex flex-col items-center justify-center text-center shadow-sm">
                <h2 className="text-gray-500 dark:text-gray-400 font-semibold mb-4 uppercase text-sm tracking-wider">Quality Score</h2>
                <div className={`w-36 h-36 rounded-full border-[8px] flex flex-col items-center justify-center ${scoreStyles.border} ${scoreStyles.bg}`}>
                  <span className={`text-5xl font-black ${scoreStyles.text}`}>{result.score}</span>
                </div>
                <span className={`mt-6 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${scoreStyles.border} ${scoreStyles.bg} ${scoreStyles.text}`}>
                  {scoreStyles.label}
                </span>
              </div>

              {/* Summary & Roadmap */}
              <div className="md:col-span-2 flex flex-col gap-6">
                  {/* Summary */}
                  <div className="bg-white dark:bg-github-card p-6 rounded-xl border border-gray-200 dark:border-github-border shadow-sm">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                      <BookOpen className="w-5 h-5 text-blue-500" /> Review Summary
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {result.summary}
                    </p>
                  </div>

                  {/* Roadmap */}
                  <div className="bg-white dark:bg-github-card p-6 rounded-xl border border-gray-200 dark:border-github-border shadow-sm flex-1">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                      <GitBranch className="w-5 h-5 text-purple-500" /> Improvement Roadmap
                    </h3>
                    <ul className="space-y-3">
                      {result.roadmap.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-100 dark:border-github-border">
                          <CheckCircle2 className="w-5 h-5 text-github-green flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
              </div>
            </div>
          )}

          {/* History Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Recent Scans</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {history.length === 0 && <p className="text-gray-400 dark:text-gray-600 col-span-2">No history available.</p>}
              {history.map((h) => (
                <div key={h._id} className="bg-white dark:bg-github-card p-4 rounded-lg border border-gray-200 dark:border-github-border hover:border-github-green dark:hover:border-github-green transition-colors flex justify-between items-center group cursor-pointer">
                  <div className="overflow-hidden">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-github-green transition-colors">
                      {h.repoName || h.repoUrl.replace('https://github.com/', '')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(h.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`font-mono font-bold ${h.score >= 80 ? 'text-green-600 dark:text-green-400' : h.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                    {h.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;