# MoodUI Studio

> **Imagine. Build. Refine. Debug.**
> An AI-powered UI creation, visual customization, and debugging workspace for developers and designers.

MoodUI Studio is an interactive developer tool that transforms ideas into working, responsive, production-ready interfaces. It unifies multimodal generation (text, voice, image references, mood boards), direct direct-manipulation visual editing, automated diagnostics, surgical AI bug repairs with code diffs, and dual export (standalone HTML/CSS and runnable React + Vite project bundles).

---

## 🚀 Complete Workflow

```
Imagine ──► Design ──► Generate ──► Preview ──► Customize ──► Debug ──► Repair ──► Export
```

1. **Imagine & Prompt:** Describe your interface using natural language, speak via microphone (Web Speech API), attach reference screenshots, or assemble an inspiration mood board.
2. **Generate:** Google Gemma 4 synthesizes a validated, structured component schema (AST) that renders immediately.
3. **Preview:** Toggle between Desktop (1200px), Tablet (768px), and Mobile (375px) device viewports with zoom controls (50% to 150%).
4. **Customize Without AI:** Switch between 12 curated color palettes or customize theme tokens (primary, secondary, accent, surface, background, text, border, radius) with instant CSS variable reactivity. Click any element on the canvas to directly edit text, font sizes, alignments, padding, images, and button targets.
5. **Debug & Diagnose:** Run an automated 8-point diagnostic suite (mobile viewport overflow, WCAG contrast ratios, accessible button labels, image alt text, form validation, broken links) or describe bugs in natural language.
6. **Repair with Diffs:** Inspect AI-proposed surgical modifications with before/after diffs. Accept the fix with 1 click, reject it, or undo anytime.
7. **Export:** Download a self-contained standalone `index.html` file or a complete, runnable React + Vite project `.zip` bundle.

---

## 🛠️ Architecture & Stack

- **Frontend:** React 18, Vite 5, Vanilla CSS with custom reactive design tokens, Lucide icons, Google Fonts (`Plus Jakarta Sans`, `Inter`, `JetBrains Mono`).
- **Backend:** Node.js & Express API with modular routes:
  - `POST /api/design` — Structured UI generation from prompt & mood board.
  - `POST /api/refine` — Surgical AST refinements preserving existing layout.
  - `POST /api/diagnose` — Bug root cause analysis and explanation.
  - `POST /api/repair` — Validation and application of proposed patches.
  - `POST /api/test` — Automated 8-check diagnostic suite.
  - `GET /api/health` — Service health & AI configuration status.
- **AI Integration:** Google Gemma 4 (`gemma-2-9b-it`, `gemma-2-27b-it`, `gemini-2.5-flash`, `gemini-1.5-flash`) via Google AI API.
- **Local High-Fidelity Engine:** When no API credentials are configured, the studio runs seamlessly in offline local synthesis mode with full editing, testing, and export features enabled.

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ (tested on Node 26)
- npm 9+

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Lara1402/DTU-Hackathon.git
cd DTU-Hackathon

# Install root, server, and client dependencies in one command
npm run install:all
```

### 2. Environment Configuration (Optional for Gemma 4 Cloud AI)

Copy `.env.example` to `server/.env`:

```bash
cp .env.example server/.env
```

Set your Google AI API key:
```env
PORT=3001
GEMMA_API_KEY=your_google_ai_key_here
GEMMA_MODEL=gemma-2-9b-it
```

*Note: If `GEMMA_API_KEY` is not set, MoodUI Studio automatically activates the **Local High-Fidelity Synthesis Engine**, ensuring every feature remains functional without cloud credentials.*

### 3. Launch Development Server

```bash
npm run dev
```

This starts:
- **Backend API server:** `http://localhost:3001`
- **Frontend Vite studio:** `http://localhost:5173`

---

## 🎨 12 Curated Preset Color Palettes

Switching palettes updates the live canvas immediately without spending AI requests:

| Palette | Aesthetic | Key Colors |
| :--- | :--- | :--- |
| **Minimal Neutral** | Clean grayscale with stone accents | `#18181b`, `#fafafa` |
| **Light and Clean** | Crisp airy layout with sky blue highlights | `#0284c7`, `#f8fafc` |
| **Dark Professional** | Deep slate with vibrant electric blue | `#3b82f6`, `#0f172a` |
| **Midnight Blue** | Intense indigo night with cyan highlights | `#6366f1`, `#030712` |
| **Purple Gradient** | Dynamic neon violet and fuchsia | `#8b5cf6`, `#090514` |
| **Ocean Blue** | Deep sea navy paired with turquoise | `#0d9488`, `#041724` |
| **Forest Green** | Organic moss and emerald earth tones | `#10b981`, `#061a12` |
| **Warm Earthy** | Terracotta, ochre, and warm clay | `#ea580c`, `#1a120b` |
| **Pastel Dream** | Soft lavender, peach, and mint | `#a78bfa`, `#faf5ff` |
| **Vibrant & Playful** | High-energy coral and sunshine yellow | `#f43f5e`, `#0c0a09` |
| **Monochrome** | Pure brutalist black and stark white | `#ffffff`, `#000000` |
| **High Contrast** | WCAG AAA maximum visibility with yellow accents | `#facc15`, `#000000` |

---

## 🔍 Integrated AI Debugging & Repair

The integrated **Debug Tab** allows you to:
1. **Run 8 Runtime Checks:**
   - Mobile Viewport Overflow (fixed widths > 360px)
   - Accessible Button Labels (`aria-label`, non-empty text)
   - Image Alt Attributes (WCAG AA)
   - Contrast Ratios (WCAG AA 4.5:1 ratio calculation)
   - Broken / Placeholder Image detection
   - Form Inputs Validation & Labels
   - Navigation Link Destination Targets
   - Page Structure (Navbar, Footer, Hero/Features)
2. **AI Diagnosis:** Identifies the root cause, affected component ID, and severity rating.
3. **Diff Inspection:** Renders side-by-side Before/After diffs for proposed AST modifications.
4. **Apply, Reject, Undo:** Users have full control. Applying a fix updates the canvas and re-runs checks to confirm resolution.

---

## 📦 Export Capabilities

- **Standalone HTML + CSS:** Single clean file with all responsive styles, fonts, and Lucide icons embedded. No build step needed.
- **React + Vite Project (ZIP):** Complete application bundle with `package.json`, `index.html`, `src/App.jsx`, `src/index.css`, `vite.config.js`, and `README.md`.
- **One-Click Clipboard Copy:** Instant copying of HTML, React JSX, or JSON AST schema.

---

## 📄 License
MIT License. Built for the DTU Hackathon 2026.
