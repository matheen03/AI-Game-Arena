# AI GAME ARENA: Investor Edition
> **"Build a Game. Attract Investors. Become a Champion."**  
> Competition Platform for Grade 8 AI Game Projects (Sections 8A through 8L)  
> Designed for school classroom competitions and the **Shark Tank Investor Arcade (PTM Event)**.

---

## 🎯 Purpose & Key Workflows

This web application coordinates the entire Grade 8 competition across all 12 sections (8A – 8L):
1. **Teacher Setup**: Select section, open session, display high-contrast projector QR code.
2. **Project Registration**: Student pairs submit game metadata & Netlify deployment URL; instant live QR code is generated.
3. **Student Gameplay & Virtual Investing**: Each student receives 100 virtual AI Coins per class session, browses the gallery, plays peer games, and invests coins (with strict fair-play self-team investment prevention).
4. **Classroom Leaderboard Reveal**: Top 3 Gold 🥇, Silver 🥈, Bronze 🥉 podium with live celebration & confetti.
5. **School-Wide Consolidated Standings**: Consolidates results across all 12 sections using a fair normalized score (average coins per eligible investor) alongside raw coin metrics, filterable by section, with 1-click CSV export.
6. **Level 2: Shark Tank PTM Finals**: Allows visiting parents and guests to explore school-wide qualified finalists and invest with separate Level 2 VIP credits without modifying earlier classroom results.

---

## 🚀 Pre-Launch Checklist (Morning of Competition)

- [ ] **1. Teacher Access**:
  - Open the application on the classroom computer/projector.
  - The top **Teacher Hub** allows quick section switching (8A to 8L).
- [ ] **2. Display Classroom Projector QR**:
  - Click the **"Projector QR"** button in the Teacher Bar.
  - Project the full-screen QR code onto the smartboard so all students can scan it on their phones or tablets.
- [ ] **3. Check Session Status**:
  - Ensure status shows **"🟢 Live Investing"** (toggle with "Open Investing").
- [ ] **4. Game Verification**:
  - Student pairs can register their Netlify URLs using the "+ Add Game" button.
  - The teacher can click "Verify" on cards to mark them verified.
- [ ] **5. Run Virtual Investing (30–45 mins)**:
  - Students test peer games and distribute up to 100 AI Coins.
  - Budget calculations and self-team blocking ensure fair play.
- [ ] **6. Close & Reveal Podium**:
  - Click **"Close Investing"** to lock totals.
  - Click **"Reveal Leaderboard"** to trigger the animated gold, silver, and bronze podium celebration!
- [ ] **7. Select Finalists**:
  - Toggle **"★ Finalist"** on top projects to qualify them for Level 2 Shark Tank PTM.
- [ ] **8. Repeat for Next Section**:
  - Switch to 8B, 8C, etc. Results from all earlier sections remain safely stored in the shared database and will never be overwritten.
- [ ] **9. Consolidated Standings & Export**:
  - Switch to **"All 12 Sections"** tab.
  - Click **"Export All 12 Sections (CSV)"** for school records and certificates.

---

## 💾 Database Setup & Architecture (Supabase & Local Persistence)

The application features a hybrid data layer:
- **Instant Local & Device Persistence**: Works immediately out-of-the-box with `localStorage` persistence, ensuring zero data loss on refresh, tab reloads, or classroom transitions.
- **Supabase Cloud Sync (Optional/Production)**:
  - Supports live multi-device synchronization via Supabase PostgreSQL.
  - Schema file included in `/supabase_schema.sql`.

### Supabase Quick Setup (3 Steps):
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor**, open or paste `supabase_schema.sql`, and click **Run**.
3. In the application's **Teacher Settings (⚙️)**, paste your:
   - **Supabase URL**: `https://your-project.supabase.co`
   - **Supabase Anon Key**: `eyJhbGci...`
   - Click **Save Supabase Settings**.

---

## 🌐 Netlify Deployment

The project contains a pre-configured `netlify.toml` file:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

To deploy to Netlify:
1. Connect your repository to Netlify or run `npx netlify deploy --prod`.
2. Set Environment Variables (optional, if using Supabase):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy!

---

## 🧪 Unit Testing

Unit tests for pure rules (coin allocation, self-investment prevention, URL validation, normalized score calculation, leaderboard ranking, and CSV formatting) run natively with Node 22:
```bash
node --test src/utils/rules.test.ts
```
