const calculateScoreAndRoadmap = (repoData, fileStructure, commitActivity) => {
  let score = 100;
  let roadmap = [];
  let summaryParts = [];

  // 1. Check for README
  // Note: GitHub API sometimes returns files with inconsistent casing
  const hasReadme = fileStructure.some(f => f.name && f.name.toLowerCase().includes('readme'));
  
  if (!hasReadme) {
    score -= 20;
    roadmap.push("Create a README.md file to explain your project.");
    summaryParts.push("lacks documentation");
  } else {
    // If README is tiny
    const readmeFile = fileStructure.find(f => f.name.toLowerCase().includes('readme'));
    if (readmeFile && readmeFile.size < 300) {
      score -= 5;
      roadmap.push("Expand your README with setup instructions and features.");
    }
  }

  // 2. Check for .gitignore
  const hasGitIgnore = fileStructure.some(f => f.name === '.gitignore');
  if (!hasGitIgnore) {
    score -= 10;
    roadmap.push("Add a .gitignore file to exclude node_modules and env files.");
  }

  // 3. Check for Tests
  const hasTests = fileStructure.some(f => 
    f.name.toLowerCase().includes('test') || 
    f.name.toLowerCase().includes('spec')
  );
  if (!hasTests) {
    score -= 15;
    roadmap.push("Implement Unit Tests (e.g., using Jest or Mocha).");
    summaryParts.push("has no visible tests");
  }

  // 4. Check for Dependency File
  const hasPackageJson = fileStructure.some(f => f.name === 'package.json');
  const hasRequirementsTxt = fileStructure.some(f => f.name === 'requirements.txt');
  
  if (!hasPackageJson && !hasRequirementsTxt) {
    score -= 10;
    roadmap.push("Include dependency definitions (package.json or requirements.txt).");
  }

  // 5. Check Commit Activity (if available)
  if (Array.isArray(commitActivity) && commitActivity.length < 5) {
    score -= 10;
    roadmap.push("Commit more frequently. The history is very sparse.");
    summaryParts.push("shows low development activity");
  }

  // 6. Check Description
  if (!repoData.description) {
    score -= 5;
    roadmap.push("Add a repository description/about section on GitHub.");
  }

  // Generate Summary Text
  let summary = "";
  if (score > 80) {
    summary = "Excellent work! Your repository demonstrates strong engineering practices.";
  } else if (score > 50) {
    summary = "Good start, but there is significant room for improvement in documentation and structure.";
  } else {
    summary = "The project needs immediate attention regarding structure and documentation to be production-ready.";
  }

  if (summaryParts.length > 0) {
    summary += ` Specifically, it ${summaryParts.join(' and ')}.`;
  }

  // Ensure score doesn't go below 0
  if (score < 0) score = 0;

  return { score, summary, roadmap };
};

module.exports = { calculateScoreAndRoadmap };