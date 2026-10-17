# 🚀 Deployment Guide: GitHub & Netlify Ready

This application (**AI GAME ARENA: Investor Edition — Al-Rowad International Schools**) is fully configured for **GitHub version control** and **Netlify deployment**.

---

## 📁 Pre-Configured Deployment Assets

The repository already contains the following deployment configurations:
- `netlify.toml`: Specifies build command (`npm run build`), publish directory (`dist`), and SPA redirect rules.
- `public/_redirects` & `dist/_redirects`: Guarantees single-page application routing on Netlify so direct links like `/?role=student` and `/?role=parent` never return 404 errors.
- `public/school-logo.svg` & `dist/school-logo.svg`: The official Al-Rowad International Schools emblem.
- `.github/workflows/deploy.yml`: Automated GitHub Actions pipeline that installs dependencies, runs tests (`npm test`), and builds the production bundle.
- `dist/`: Pre-compiled, production-ready static output for instant drag-and-drop deployment.

---

## Option A: Deploy via GitHub & Netlify (Recommended)

This gives you automatic continuous deployments whenever you update your code.

### Step 1: Initialize Git and Push to GitHub
Open your terminal in the project directory and run:

```bash
# 1. Initialize local repository
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "Initial commit: AI Game Arena with Al-Rowad International Schools branding"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/ai-game-arena.git

# 6. Push to GitHub
git push -u origin main
```

### Step 2: Connect to Netlify
1. Log into your [Netlify Dashboard](https://app.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Choose **GitHub** and select your `ai-game-arena` repository.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. *(Optional)* If using Supabase for cloud sync across external devices, add your environment variables under **Site configuration > Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **"Deploy site"**. Your application will be live in ~30 seconds with a free `.netlify.app` domain!

---

## Option B: Instant Drag-and-Drop Deployment (No Git Required)

If you need the site live in 10 seconds without running git commands:

1. Locate the pre-compiled `dist` folder generated in this project.
2. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** in your web browser.
3. Drag and drop the `dist` folder into the upload box on Netlify.
4. Netlify will immediately publish your site with a live URL (e.g., `https://ai-game-arena-alrowad.netlify.app`)!

---

## 🔗 Classroom & Event Access Links

Once deployed on Netlify (e.g. at `https://your-app.netlify.app`), you can share these direct links:

- **Student Portal (Grade 8 Classroom)**:  
  `https://your-app.netlify.app/?role=student&section=8A`  
  *(Students can submit their Netlify project, play peers' games, and allocate 100 virtual AI Coins)*

- **Parent Portal (Shark Tank PTM Finals)**:  
  `https://your-app.netlify.app/?role=parent`  
  *(Parents test school-wide finalists and cast 500 VIP Shark Tank credits)*

- **Teacher Admin Hub**:  
  `https://your-app.netlify.app/?role=teacher`  
  *(Protected by teacher PIN: `teach88`)*
