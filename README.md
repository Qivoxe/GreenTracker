<div align="center">

# 🌿 GreenTrack

### *Know your number. Reduce your impact.*

**A privacy-first, offline-ready carbon footprint tracker —**
**built entirely with HTML, CSS, and vanilla JavaScript. No backend. No cloud. No compromise.**

[![Made With](https://img.shields.io/badge/Made%20with-HTML%20%7C%20CSS%20%7C%20JS-6db87a?style=flat-square)](.)
[![No Backend](https://img.shields.io/badge/Backend-None-6db87a?style=flat-square)](.)
[![Privacy First](https://img.shields.io/badge/Data-100%25%20Local-6db87a?style=flat-square)](.)
[![Offline Ready](https://img.shields.io/badge/Offline-Ready-6db87a?style=flat-square)](.)

</div>

---

## 📌 Table of Contents

1. [The Problem](#-the-problem)
2. [The Solution](#-the-solution)
3. [Live Demo / How to Run](#-live-demo--how-to-run)
4. [Features](#-features)
5. [Extra Feature — Goal Tracker with Streak](#-extra-feature--goal-tracker--streak-counter)
6. [CO₂ Calculation Formula](#-co-calculation-formula)
7. [Tech Stack](#-tech-stack)
8. [Project Structure](#-project-structure)
9. [Page Breakdown](#-page-breakdown)
10. [Design System](#-design-system)
11. [Data Architecture](#-data-architecture)
12. [Carbon Benchmarks](#-carbon-benchmarks)
13. [Privacy & Security](#-privacy--security)
14. [Challenges & How We Solved Them](#-challenges--how-we-solved-them)
15. [Future Roadmap](#-future-roadmap)

---

## 🌍 The Problem

> **Most people have no idea how much CO₂ they produce each day.**

Climate change is driven by individual and collective carbon emissions — yet carbon awareness remains abstract and inaccessible. Existing tools are:

- **Complex** — require accounts, apps, subscriptions
- **Invasive** — harvest personal data and sell it
- **Disconnected** — don't translate daily behavior into numbers
- **Inaccessible** — require internet, smartphones, or technical knowledge

The result? People care about the planet but can't act because they don't know where to start.

**The average global citizen emits ~13 kg CO₂ per day.** The 1.5°C climate target demands we get to **4 kg or below.** That's a 70% reduction — and most people don't even know their current number.

---

## ✅ The Solution

**GreenTrack** is a lightweight, privacy-respecting, browser-based carbon tracker that helps users:

1. **Log** daily activities (travel, electricity, food) in under 30 seconds
2. **Calculate** their CO₂ equivalent using science-backed formulas
3. **Visualize** emissions over time with an animated trend graph
4. **Compete** on a local leaderboard ranked by lowest emissions
5. **Set goals** and track streaks toward a personal carbon target

No installation. No## 📸 Screenshots

| Dashboard | Activity Tracking |
|-----------|------------------|
| ![](images/screenshot1.png) | ![](images/screenshot2.png) |

| Emissions Graph | Leaderboard |
|-----------------|-------------|
| ![](images/screenshot3.png) | ![](images/screenshot4.png) | sign-up email. No internet after first load. Works on any device with a browser.

---

## 🚀 Live Demo / How to Run

### Option 1 — Open directly in browser (recommended)

```bash
# Just double-click OR drag into browser:
landing.html
```

### Option 2 — Local server (for best experience)

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# Then open:
http://localhost:8000/landing.html
```

### First-time flow

```
landing.html  →  login.html  →  index.html (dashboard)
     ↓               ↓               ↓
  Learn app     Create account    Log & track
```

**No dependencies to install. No build step. No API keys.**

---

## ✨ Features

### Core Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | 📊 **CO₂ Trend Graph** | Animated Chart.js line graph showing emissions over 7, 14, or 30 days with a dashed goal line overlay |
| 2 | ⚡ **Quick Log Sidebar** | Log travel, electricity, and meals with instant live CO₂ preview as you type — before saving |
| 3 | 📁 **Full History** | Every entry with date, input values, CO₂ breakdown per category, and color-coded severity badge |
| 4 | 📤 **CSV Export** | One-click download of all logged data as a structured `.csv` file — date, inputs, and totals |
| 5 | 🏆 **Leaderboard** | All local accounts ranked by lowest average daily CO₂, with medals 🥇🥈🥉 for top 3 |
| 6 | 🔐 **Client-side Auth** | Username + password login with register flow, form validation, and base64 storage |
| 7 | 📱 **Offline Ready** | Zero network calls after initial font load — pure localStorage, works without internet |
| 8 | 🌙 **Dark Mode First** | Designed exclusively for dark mode — no white flash, easy on eyes |

### UI/UX Highlights

| Feature | Detail |
|---------|--------|
| Staggered animations | Cards and rows animate in with sequenced `fadeUp` delays (0.05s increments) |
| Live CO₂ preview | Total updates color (green → yellow → red) as you type, before saving |
| Severity badges | Every entry labeled: Excellent / Good / Moderate / High |
| Goal progress bar | Animated fill bar showing today's CO₂ vs daily target with color transitions |
| Responsive layout | Two-column sidebar+main on desktop, fully stacked on mobile |
| Toast notifications | Non-blocking success/error messages with auto-dismiss after 3s |
| Formula reference | Always-visible in sidebar |
| Carbon benchmarks | Contextual comparison (India avg, global avg, 1.5°C target) built into Goals |

---

## 🎯 Extra Feature — Goal Tracker + Streak Counter

The **Goals** section adds a motivational layer on top of raw tracking:

### 🔵 Circular Ring Progress Indicator
An animated SVG ring showing today's CO₂ vs daily goal. Color changes dynamically:
- 🟢 **Green** — Under 60% of goal (excellent)
- 🟡 **Yellow** — 60–90% of goal (on track)
- 🔴 **Red** — Over 90% of goal (exceeding target)

### 🔥 Streak Counter
Calculates consecutive days you've stayed under goal — working backwards from today. Maintained in real-time, resets on the first missed day.

### 📅 Weekly Summary Panel
Shows at a glance: days goal hit, days over goal, and current streak.

### 🎯 Goal Presets
- Set any custom target in kg/day
- One-click **"Use 1.5°C target"** button sets goal to **4 kg/day**
- Context panel showing global benchmarks for self-comparison

---

## 🧮 CO₂ Calculation Formula

GreenTrack uses a simplified but scientifically grounded formula based on IPCC and Our World in Data emission factor datasets:

```
Total CO₂ (kg) = (Travel km × 0.12) + (Electricity units × 0.82) + (Meals × 2.5)
```

### Factor breakdown

| Category | Input | Factor | Basis |
|----------|-------|--------|-------|
| 🚗 Travel | km driven | × 0.12 kg CO₂/km | Average petrol car (IPCC AR6) |
| ⚡ Electricity | units (kWh) | × 0.82 kg CO₂/kWh | Global average grid intensity |
| 🍽 Food / Meals | meal count | × 2.50 kg CO₂/meal | Mixed diet average (Our World in Data) |

### Severity thresholds

| CO₂ Range | Level | Color |
|-----------|-------|-------|
| 0 – 4 kg | Excellent | 🟢 Green |
| 4 – 7 kg | Good | 🟡 Yellow |
| 7 – 10 kg | Moderate | 🟡 Yellow |
| 10+ kg | High | 🔴 Red |

---

## 🛠 Tech Stack

```
Frontend
├── HTML5               — Semantic structure, no divitis
├── CSS3                — Full custom design system, CSS variables, keyframe animations
└── JavaScript ES6+     — Modules, arrow functions, localStorage API, DOM manipulation

Visualization
├── Chart.js 4.4.1      — CDN-loaded line chart, fully custom dark theme config
└── SVG (inline)        — Goal ring, planet animation, decorative elements

Typography (Google Fonts CDN)
├── DM Serif Display    — Headings, large numbers, display text
├── Outfit              — Body text, UI labels, navigation
└── DM Mono             — Data values, formulas, code-style display

Storage
└── localStorage API    — All persistent data (users, logs, session)
```

**Why vanilla JS and no framework?**
- Zero build step — runs instantly from the file system
- Maximum compatibility across browsers and devices
- No `node_modules` bloat — entire project is under 100KB
- Demonstrates raw frontend mastery without scaffolding

---

## 📁 Project Structure

```
GreenTrack/
│
├── landing.html          ← Marketing page (hero, features, how-it-works, CTA)
├── login.html            ← Split-panel auth (sign in + register with live preview)
├── index.html            ← Main dashboard app (sidebar + 4 sections)
│
├── css/
│   └── style.css         ← Complete shared design system:
│                           tokens, typography, components (btn, card, badge,
│                           input, toast, nav), animations, responsive breakpoints
│
├── js/
│   ├── auth.js           ← Authentication module:
│   │                       login, register, guard, session management,
│   │                       tab switching, toast, logout
│   │
│   └── script.js         ← Dashboard module:
│                           data helpers, CO₂ formula, Chart.js init/update,
│                           log submission, history render, leaderboard,
│                           goals section, streak calc, CSV export
│
└── README.md             ← This file
```

---

## 📄 Page Breakdown

### `landing.html` — The Hook

Purpose: communicate value in under 5 seconds.

- **Hero** — Animated planet with CSS orbiting rings, floating stat cards, bold serif headline with italic green accent
- **Stats bar** — Global CO₂ facts grounding the problem in reality
- **8-feature grid** — 4×2 grid with per-card hover glow gradient
- **How it works** — 4-step horizontal timeline with decorative connecting line
- **CTA block** — Radial green glow, emotional copy ("Know your number"), direct link to login

### `login.html` — The Gateway

Split two-panel layout. Left: auth. Right: live UI preview.

- Tab component switching between Sign In / Create Account
- Full inline validation (username format, length, password strength, duplicate check)
- Visible error state with animated fade-in
- Right panel: preview card with animated fill bar showing sample data
- Enter-key form submission support

### `index.html` — The Core App

Sticky sidebar + main content with 4 client-side sections.

**Sidebar (always visible):**
- Quick Log form with `oninput` live preview (color-coded CO₂ total)
- Section navigation (mirrors top nav)
- Formula reference card (always accessible)

**Dashboard:**
- 4 stat cards: today's CO₂, 7-day average, total entries, best day
- Chart.js line graph with 7/14/30-day range selector and animated goal line
- Today's goal progress bar with dynamic color
- Category breakdown (travel / electricity / food) for today

**History:**
- Newest-first log with full breakdown per entry
- CSV export and clear-all controls

**Leaderboard:**
- Reads all users from `localStorage`, calculates average, sorts ascending
- Medal icons for top 3, "(you)" label for current user

**Goals:**
- Animated SVG ring progress indicator for today
- Streak counter (consecutive days under goal)
- Weekly hit/miss summary
- Goal editor with 1.5°C preset and benchmark context

---

## 🎨 Design System

### Color Palette

```css
/* Backgrounds — layered depth */
--bg:        #0d0f0e;   /* Page background */
--bg2:       #131714;   /* Card surfaces */
--bg3:       #1a1f1c;   /* Inputs, code blocks */
--border:    #252d28;   /* All borders */

/* Accent */
--green:     #6db87a;   /* Sage green — primary accent */
--green-dim: #3d6b47;   /* Muted green for secondary elements */
--green-glow:#6db87a33; /* 20% opacity for glow effects */

/* Text */
--cream:     #e8e4d9;   /* Primary text */
--cream-dim: #a09b8e;   /* Secondary text, labels */

/* Status */
--red:       #c97070;   /* High emissions, errors */
--yellow:    #c9b770;   /* Moderate emissions, warnings */
```

### Typography Scale

```
Font trio: DM Serif Display / Outfit / DM Mono

Display (DM Serif Display):
  Hero title     — clamp(3rem, 5vw, 5.5rem)
  Stat numbers   — 2.4rem – 3.5rem
  Section titles — 1.5rem – 2.8rem

Body (Outfit):
  Navigation     — 0.88rem / 500
  Labels         — 0.75rem uppercase / letter-spacing 0.08em
  Body text      — 0.95rem – 1.05rem / line-height 1.75

Mono (DM Mono):
  Data values    — 0.85rem – 0.9rem
  Formula text   — 0.72rem
  Timestamps     — 0.75rem
```

### Motion System

```
Entry:    fadeUp keyframe, 0.4–0.6s, staggered delay per element
Chart:    800ms easeInOutQuart on load + data change
Goal bar: 0.8s cubic-bezier(0.4,0,0.2,1) width transition
Ring:     1s stroke-dashoffset transition
Hover:    0.22s cubic-bezier(0.4,0,0.2,1) — all interactive elements
Toast:    fadeUp in, opacity+translateY out after 3s
Planet:   CSS rotate at 18s / 30s / 45s for ring 1/2/3
```

---

## 🗄 Data Architecture

All data lives in `localStorage` under structured namespaced keys.

### Key schema

```
gt_users                  → { [username]: UserObject }   — all accounts
gt_logs_{username}        → LogEntry[]                   — per-user logs
gt_current_user           → string                       — active session
```

### User object

```json
{
  "username": "eco_warrior",
  "password": "base64encodedstring",
  "displayName": "Eco Warrior",
  "createdAt": 1710000000000,
  "goal": 4.0
}
```

### Log entry object

```json
{
  "date": "2025-03-15",
  "travel": 12,
  "electricity": 3.5,
  "meals": 3,
  "total": 10.64,
  "loggedAt": 1710000000000
}
```

### Leaderboard aggregation

```js
// Pseudo-code — runs client-side on every leaderboard render
for each user in gt_users:
  logs = localStorage.get(`gt_logs_${username}`)
  avg = sum(logs.map(l => l.total)) / logs.length
  push({ username, displayName, avg, entryCount })

sort ascending by avg  // lowest emissions = rank 1
```

One log per date per user. Re-logging the same date is an upsert (overwrite).

---

## 🌍 Carbon Benchmarks

| Reference | kg CO₂ / day | Context |
|-----------|-------------|---------|
| 🎯 Paris 1.5°C target | **4 kg** | The global per-capita budget for <1.5°C warming |
| 🇮🇳 India average | ~2 kg | One of the world's lowest national averages |
| 🇧🇷 Brazil average | ~6 kg | Below global average due to renewable grid |
| 🇬🇧 UK average | ~11 kg | Post-industrial economy, high transport emissions |
| 🌍 Global average | ~13 kg | Averaged across 8 billion people |
| 🇺🇸 USA average | ~16 kg | Among the highest globally |
| 🇦🇺 Australia average | ~20 kg | Highest per-capita among large economies |

*Sources: Our World in Data, IPCC AR6, Global Carbon Project*

GreenTrack's default goal is **8.4 kg/day** — a realistic first milestone before working toward the 4 kg climate target.

---

## 🔒 Privacy & Security

| Concern | GreenTrack's Approach |
|---------|----------------------|
| Data location | 100% in browser `localStorage` — never sent anywhere |
| Analytics | None. Zero tracking scripts loaded. |
| Cookies | None. Session via `localStorage` string only. |
| Passwords | Base64-encoded (obfuscated). Not plaintext. |
| Network calls | Google Fonts + Chart.js CDN on first load only — no user data transmitted |
| Third-party access | Zero. Chart.js renders locally with your data; it sends nothing. |
| Complete wipe | Clear browser storage = all GreenTrack data gone |

> **Designed for shared and low-trust environments** — schools, community centers, public computers — where users cannot or should not create cloud accounts.

---

## 🧗 Challenges & How We Solved Them

### Challenge 1 — Multi-user leaderboard with no server
**Problem:** A leaderboard needs aggregate data across users, but there's no backend.  
**Solution:** Since all users on the same device share the same `localStorage` origin, `gt_users` acts as a user registry. Each user's logs are namespaced under `gt_logs_{username}`. The leaderboard reads all registered users and aggregates client-side — O(n) with n users on that device. Naturally scope-limited, which is appropriate for an offline tool.

### Challenge 2 — Reactive UI without a framework
**Problem:** Without React/Vue, there's no virtual DOM or reactive state system.  
**Solution:** All render functions (`renderDashboard`, `renderHistory`, `renderLeaderboard`, `renderGoals`) are pure: they read `localStorage`, build HTML strings, and set `innerHTML`. Each user action explicitly calls the relevant render function. This is predictable, debuggable, and fast — no diffing overhead.

### Challenge 3 — Premium feel with no UI library
**Problem:** Vanilla CSS tends toward generic.  
**Solution:** A full design token system in `:root`, three carefully chosen Google font faces, CSS animation-delay staggering for perceived richness, and Chart.js fully themed to match the palette (custom tooltip, grid lines, tick colors, fill gradient).

### Challenge 4 — Live preview without auto-saving
**Problem:** Users want to see CO₂ impact before committing an entry.  
**Solution:** `oninput` on each field calls `updateLogPreview()` which recalculates total and updates the preview display with color-coded severity feedback — all in memory, nothing touches `localStorage` until "Log Entry" is clicked.

### Challenge 5 — Date-safe log storage
**Problem:** What if a user logs twice on the same day?  
**Solution:** Log submission does an array `findIndex` by date. If a match exists, it's an overwrite (upsert). If not, it's a push. Users always see the latest values for any given date.

---

## 🗺 Future Roadmap

If GreenTrack were to evolve past a hackathon:

| Priority | Feature | Notes |
|----------|---------|-------|
| 🔴 High | **Transport modes** | Car vs bus vs train vs flight per km, different factors |
| 🔴 High | **Regional electricity factors** | India grid (~0.71) ≠ Norway grid (~0.02) |
| 🟡 Medium | **Cloud sync** | Optional Supabase backend for cross-device access |
| 🟡 Medium | **Weekly digest** | Summary of past 7 days with trend direction |
| 🟡 Medium | **AI-powered tips** | Personalized reduction suggestions via LLM API |
| 🟡 Medium | **PWA / installable** | `manifest.json` + service worker for home screen install |
| 🟢 Low | **Carbon offset links** | Direct links to Gold Standard / Verra verified projects |
| 🟢 Low | **Social share card** | Generate a shareable image of weekly emissions score |
| 🟢 Low | **Multi-language** | Hindi, Tamil, Marathi for India-first rollout |
| 🟢 Low | **Category expansion** | Shopping, flights, diet type (vegan vs omnivore) |

---

## 📜 License

MIT License — free to use, modify, redistribute, and build upon.

---

<div align="center">

**Made with 🌿 for a greener planet.**

*"You can't reduce what you don't measure."*

**GreenTrack — Simple. Private. Impactful.**

</div>
