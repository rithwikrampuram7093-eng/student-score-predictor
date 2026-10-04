# 🎓 Student Score Prediction System

An interactive, regression-based mathematical modeling web application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. Designed for applied statistics, data science education, and academic performance evaluation.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Installation
```bash
# Clone the repository
git clone <your-github-repo-url>
cd student-score-prediction-system

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser.

### 4. Build for Production
```bash
npm run build
```
This outputs an optimized production build to the `/dist` directory.

---

## 🌐 Deploying to Vercel

This project is fully configured for seamless, zero-config deployment on [Vercel](https://vercel.com).

### Option A: Via GitHub (Recommended)
1. Push your repository to GitHub (see the [Git Setup Guide](#-git-setup-guide) below).
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** → **"Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect the settings from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**. Your application will be live in seconds!

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🔑 Environment Variables (`.env`)

### **Are any environment variables required?**
**No mandatory environment variables are needed!**
The entire analytical regression engine (Ordinary Least Squares, Normal Equations matrix decomposition, ANOVA metrics, and statistical distributions) executes locally in the browser with TypeScript. Student data and prediction history are persisted in browser `localStorage`.

### Optional Variables
If you wish to configure optional settings, create a `.env` file in the root directory:
```env
# Optional client variables (must start with VITE_)
VITE_APP_TITLE="Student Score Prediction System"
```
*(Refer to `.env.example` for reference.)*

---

## 🐙 Git Setup & Push Guide

To push this codebase to a new GitHub repository:

```bash
# 1. Initialize git (if not already initialized)
git init -b main

# 2. Add all files
git add .

# 3. Commit files
git commit -m "feat: initial commit of Student Score Prediction System"

# 4. Link your remote GitHub repository
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 5. Push to GitHub
git push -u origin main
```

---

## 📁 Project Structure

```text
├── index.html                   # HTML entry point with metadata & web fonts
├── metadata.json                # Project identity & capability descriptor
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vercel.json                  # Vercel deployment & SPA routing rewrites configuration
├── vite.config.ts               # Vite bundler configuration with Tailwind CSS v4
├── .env.example                 # Example environment variables documentation
├── .gitignore                   # Ignore node_modules, build artifacts, env files
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Primary application router and global state
│   ├── index.css                # Global styles with Tailwind CSS
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces for students, models, metrics
│   ├── services/
│   │   ├── mathRegression.ts    # Mathematical regression engine (OLS, Matrix math, R², RMSE)
│   │   └── storageService.ts    # LocalStorage persistence & synthetic data manager
│   ├── data/
│   │   └── syntheticStudents.ts # Calibrated baseline dataset of student records
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx       # Navigation header with responsive menu & counters
│   │   └── charts/
│   │       ├── ActualVsPredictedPlot.tsx       # Diagnostic scatter plot
│   │       ├── CategoryDistributionChart.tsx   # Grade tier distribution
│   │       ├── ModelMetricsBarChart.tsx        # Comparative bar chart for R² / RMSE
│   │       ├── ScatterPlotWithFitCurve.tsx      # SVG regression line visualizer
│   │       └── ScoreDistributionHistogram.tsx  # Score histogram with normal curve
│   └── pages/
│       ├── HomePage.tsx               # Dashboard with key stats and quick actions
│       ├── PredictScorePage.tsx       # Interactive score predictor with parameter sliders
│       ├── RegressionMethodsPage.tsx  # Detailed formulas, step-by-step mathematical proofs
│       ├── DataAnalysisPage.tsx       # Correlation matrix, descriptive stats, and distributions
│       ├── ModelComparisonPage.tsx    # Head-to-head comparison of Simple vs Multiple regression
│       ├── StudentsPage.tsx           # Full CRUD student dataset management
│       ├── PredictionHistoryPage.tsx  # History of evaluated predictions with export
│       └── AboutProjectPage.tsx       # Research overview, mathematical references, methodology
```

---

## 🧮 Mathematical Highlights

1. **Simple Linear Regression (SLR)**:
   $$\hat{Y} = \beta_0 + \beta_1 X$$
   Closed-form solution for slope ($\beta_1$) and intercept ($\beta_0$) via sample covariance and variance.

2. **Multiple Linear Regression (MLR)**:
   $$\mathbf{Y} = \mathbf{X}\boldsymbol{\beta} + \boldsymbol{\varepsilon}$$
   Closed-form analytical solution via Normal Equations:
   $$\boldsymbol{\beta} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{Y}$$
   Includes Gaussian elimination with partial pivoting and ridge regularizer to prevent matrix singularity.

3. **Goodness of Fit & Diagnostics**:
   - $R^2$ (Coefficient of Determination)
   - Adjusted $R^2$ (Penalizes extra predictor terms)
   - Root Mean Squared Error ($\text{RMSE}$)
   - Mean Absolute Error ($\text{MAE}$)
   - Mean Squared Error ($\text{MSE}$)

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Hosting**: [Vercel](https://vercel.com/)
