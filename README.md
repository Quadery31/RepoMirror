# RepoMirror

RepoMirror is a full-stack developer tool that analyzes GitHub repositories to provide actionable feedback on code quality. It uses the GitHub API to scan public repositories and generates a "Developer Profile," which includes a quality score (0-100), an executive summary, and a personalized roadmap for improvement.

The goal of this project is to help developers and students identify missing best practices in their projects—such as lack of documentation, poor file structure, or missing test cases—and fix them to make their portfolios production-ready.



---

## Key Features

- **Repository Analysis:** Scans file structures, commit history, and documentation files.
- **Quality Scoring:** Algorithmic calculation of a repository's health score based on engineering standards.
- **Actionable Roadmap:** Generates a specific to-do list (e.g., "Add a .gitignore", "Improve README length").
- **Dark Mode Support:** Fully responsive UI with a toggle for light and dark themes.
- **History Tracking:** Saves recent analyses to a database for quick reference.

## Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- GitHub REST API

**Database:**
- MongoDB 

---

## Installation and Setup

Follow these steps to run the project locally on your machine.

### Prerequisites
Make sure you have Node.js and npm installed. You will also need a MongoDB Atlas connection string.

### 1. Clone the Repository

git clone [https://github.com/your-username/repo-mirror.git](https://github.com/your-username/repo-mirror.git)
cd repo-mirror

### 2. Setup the Backend
cd github-backend
npm install

### Create a file named .env in the github-backend folder and add the following variables: 
PORT=5000
MONGO_URI=your_mongodb_connection_string
GITHUB_TOKEN=your_github_personal_access_token
### start backend server
node index.js
### set up frontend
cd ../github-frontend
npm install
### Create a file named .env.local in the github-frontend folder:
VITE_API_URL=http://localhost:5000

npm run dev

The application should now be running at http://localhost:5173.
