# WINTER ARC — 90-Day Discipline Gym Tracker (PWA)

> **"The winter does not care about your feelings. Show up or step aside."**

A mobile-first, offline-first Progressive Web App built for the relentless 90-day fitness challenge: **October 1 to December 29**. Trained every single day from 6:00 AM to 7:00 AM. One hour. No excuses. No missed days.

---

## 🌐 Live GitHub Pages & PWA
- **Live App**: [https://manjunath8495839565-commits.github.io/winter-arc-tracker/](https://manjunath8495839565-commits.github.io/winter-arc-tracker/)
- **Repository**: [https://github.com/manjunath8495839565-commits/winter-arc-tracker](https://github.com/manjunath8495839565-commits/winter-arc-tracker)

---

## ⚡ Design System: "Cold Iron"
- **Background**: `#0A0C10` (deep frozen black-blue)
- **Surface**: `#12151C` with 1px border `#1E232E`
- **Primary Text**: `#F2F4F8` (ice white)
- **Secondary Text**: `#8A93A6` (cold steel gray)
- **The Fire (Accent - max 5%)**:
  - Ember orange `#FF5C1A` (streak flame, current day, primary CTA)
  - Ember glow `rgba(255, 92, 26, 0.12)`
- **Ice Blue**: `#7DD3FC` (rest timer, upcoming days, past completions, weight sparkline)
- **Danger Red**: `#EF4444` (streak-reset screen & missed days `#7F1D1D`)
- **Success Green**: `#4ADE80` (workout-complete moment)
- **Typography**: `Archivo Black` (massive hero numbers, aggressive titles) & `Inter` (UI & body)

---

## 🔥 Key Features

1. **Streak Keeper (Strict Accountability)**:
   - Tracks consecutive days from Day 1 to Day 90.
   - Animated CSS flickering ember flame SVG.
   - Circular progress ring around the hero day count.
   - **STRICT RULE**: Miss even one day and the streak resets to zero (unless protected by the Warrior Save grace card).
   - 90-day GitHub-style heatmap grid (10 rows × 9 columns).

2. **Built-in 12-Week Progressive Workout Plan**:
   - Monday: Push Day (Chest, Shoulders, Triceps)
   - Tuesday: Pull Day (Back & Biceps)
   - Wednesday: Legs (Quads, Hams, Glutes, Calves)
   - Thursday: Core + Cardio (HIIT + Abs)
   - Friday: Full Body Strength (Compound synergy)
   - Saturday: Active Recovery & Mobility (Protects the streak)
   - Sunday: Endurance Engine (35 min run/ruck + core)
   - **Weeks 4, 8, 12 = DELOAD / TEST WEEK**: Max push-ups, longest plank, fastest 5K.
   - Auto-scales difficulty by ~10% weekly based on Arc Day (`Math.ceil(arcDay / 7)`).

3. **Glanceable One-Handed Gym Mode**:
   - Full dead-black distraction-free view.
   - Giant current exercise title and ice-blue numbers (`SET 1/4`, `12 REPS`).
   - Depleting circular rest timer (tap anywhere to start/pause).
   - 45-minute completion lock with countdown (plus "Finish Early (Weak Move)").
   - 200ms ember vignette flash and "DAY XX — DONE. THE ARC GROWS." banner.

4. **Brutal Audio Synthesis (Web Audio API)**:
   - 100% offline, zero network dependencies.
   - Sub-bass war drop + anvil strike on "LOCK IN — 6:00 AM".
   - Fire crackle / combustion ignition on streak increment.
   - Distant storm thunder on streak reset.
   - Rest timer countdown tick & completion gong.

5. **Stoic Quotes Engine**:
   - 90 unique warrior & stoic quotes (Marcus Aurelius, David Goggins, Jocko Willink, Seneca, Epictetus).
   - One quote per day, editable line-by-line in `src/data/quotes.js`.
   - "Shuffle Quote" button for immediate motivation.

6. **War Stats & Beat-Your-Best Board**:
   - 2x2 grid: Hours Trained, Workouts Done, Longest Streak, Current Streak.
   - Pure SVG ice-blue sparkline for body weight trend.
   - Sunday body tracker: weight kg, waist size cm, local progress photo.
   - Beat-Your-Best board: max push-ups, longest plank, fastest 5K.

7. **Warrior Save & Settings**:
   - Configurable rest timer (30s, 45s, 60s, 90s, 120s).
   - Single "Warrior Save" grace card protecting streak on one missed day.
   - "Save My Arc" JSON export & import.
   - Double-confirm reset dialog.
   - War Room simulator: slider to test any day from Day 1 to Day 90 instantly.

8. **Progressive Web App (PWA)**:
   - Installable on iOS (Safari Add to Home Screen) and Android / Chrome / Desktop.
   - Offline-first cache via Service Worker (`sw.js`).
   - In-app install button in top bar and settings.

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/manjunath8495839565-commits/winter-arc-tracker.git
cd winter-arc-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
