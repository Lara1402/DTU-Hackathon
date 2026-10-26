# MoodUI Studio 🎨

> **Imagine. Build. Refine. Debug.**  
> An AI-powered UI generation, visual customization, and debugging workspace built for the DTU Hackathon 2026.

MoodUI Studio transforms natural language prompts into working, responsive, production-ready web interfaces. It combines AI design generation (via Google Gemini), direct visual editing, automated diagnostics, surgical AI bug repair, secure user authentication with per-user project isolation, and one-click export.

---

## 📸 Features at a Glance

| Feature | Description |
| :--- | :--- |
| 🤖 **AI Design Generation** | Describe any UI in plain English — Gemini generates a full structured component layout |
| ✏️ **Visual Editing** | Click any canvas element to edit text, styles, padding, images, and buttons directly |
| 🎨 **12 Color Palettes** | Instant theme switching with reactive CSS design tokens |
| 🖼️ **Mood Board** | Upload reference images to guide the AI's aesthetic direction |
| 🔍 **8-Point Diagnostics** | Automated WCAG, mobile overflow, alt text, and contrast checks |
| 🛠️ **AI Bug Repair** | Before/after diffs for every proposed fix — accept, reject, or undo |
| 🔐 **Authentication** | JWT-based login/signup with bcrypt password hashing and per-user project isolation |
| 📤 **Export** | Standalone HTML or full React + Vite `.zip` project bundle |
| 📱 **Viewport Preview** | Desktop / Tablet / Mobile breakpoints with zoom controls |
| ⏮️ **Undo / Redo** | Full history stack with keyboard shortcuts (`Cmd+Z` / `Cmd+Shift+Z`) |
| 🗂️ **Version Snapshots** | Save named milestones and restore to any previous version |

---

## 🚀 Workflow

```
Sign Up / Log In ──► Dashboard ──► Create Project ──► Describe UI ──► Generate ──► Customize ──► Debug & Repair ──► Export
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite 5**
- **Vanilla CSS** with custom CSS variable design tokens
- **Lucide React** icons
- **Google Fonts** — Plus Jakarta Sans, Inter, JetBrains Mono

### Backend
- **Node.js** + **Express 4**
- **bcryptjs** — password hashing (10 salt rounds)
- **jsonwebtoken** — signed JWT session tokens
- **dotenv** — environment configuration
- **JSON flat-file storage** — atomic read/write for users and projects

### AI
- **Google Gemini API** (`gemini-3.8-flash` default)
- **Local High-Fidelity Engine** — full offline fallback with 8-point AST rule synthesis (no API key required)

---

## 📡 API Routes

### Auth — `/api/auth`
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Authenticate and receive JWT |
| `GET` | `/me` | Restore session from token |
| `POST` | `/forgot-password` | Generate password reset token |
| `POST` | `/reset-password` | Set new password with reset token |

### Projects — `/api/projects` *(requires auth)*
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all projects for the logged-in user |
| `POST` | `/` | Create a new project |
| `GET` | `/:id` | Get a single project (ownership verified) |
| `PUT` | `/:id` | Update a project (ownership verified) |
| `DELETE` | `/:id` | Delete a project (ownership verified) |

### AI & Design — `/api`
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/design` | Generate UI components from prompt + palette + mood board |
| `POST` | `/refine` | Surgically update existing components via natural language |
| `POST` | `/diagnose` | Identify root cause of a reported UI issue |
| `POST` | `/repair` | Validate and apply a proposed AST patch |
| `POST` | `/test` | Run the 8-point automated diagnostic suite |
| `GET` | `/health` | Server health + AI configuration status |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ (tested on Node 26)
- npm 9+

### 1. Clone & Install

```bash
git clone https://github.com/Lara1402/DTU-Hackathon.git
cd DTU-Hackathon
npm run install:all
```

### 2. Configure Environment

```bash
cp .env.example server/.env
```

Edit `server/.env`:

```env
# Required
PORT=3001
JWT_SECRET=your_secure_random_secret_here

# Optional — Google AI API key (get one free at https://aistudio.google.com)
# Leave blank to use the Local High-Fidelity Engine (fully offline mode)
GEMINI_API_KEY=your_key_here
GEMMA_MODEL=gemini-3.8-flash
```

> ⚠️ **Never commit `server/.env` to git.** It is listed in `.gitignore` and excluded from all commits.

### 3. Run

```bash
npm run dev
```

| Service | URL |
| :--- | :--- |
| Frontend (Vite) | http://localhost:5173 |
| Backend (Express) | http://localhost:3001 |
| Health Check | http://localhost:3001/api/health |

---

## 🗂️ Project Structure

```
DTU-Hackathon/
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                # Root app — routing, auth guard, studio workspace
│   │   ├── index.css              # Global design system tokens & styles
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # JWT auth state provider
│   │   ├── state/
│   │   │   ├── useProjectStore.js # Project state, undo/redo, persistence
│   │   │   ├── palettes.js        # 12 curated color palette definitions
│   │   │   └── starterTemplates.js
│   │   └── components/
│   │       ├── Auth/              # LoginPage, SignupPage
│   │       ├── Dashboard/         # Project list dashboard
│   │       ├── Canvas/            # LiveCanvas, ComponentRenderer
│   │       ├── LeftPanel/         # Chat + MoodBoard input
│   │       ├── RightPanel/        # Design, Properties, Debug, Code tabs
│   │       ├── TopNav.jsx         # Top navigation bar
│   │       └── Modals/            # Export, Settings, Version, NewProject
│   └── vite.config.js
│
├── server/                        # Node.js + Express backend
│   ├── index.js                   # App entry point, middleware, route mounting
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js                # /api/auth — signup, login, me, reset
│   │   ├── projects.js            # /api/projects — CRUD with ownership checks
│   │   ├── design.js              # /api/design — AI UI generation
│   │   ├── refine.js              # /api/refine — AI refinement
│   │   ├── diagnose.js            # /api/diagnose — AI bug diagnosis
│   │   ├── repair.js              # /api/repair — patch application
│   │   └── test.js                # /api/test — automated diagnostics
│   ├── services/
│   │   ├── gemmaService.js        # Google AI + Local synthesis engine
│   │   ├── db.js                  # JSON flat-file storage (users + projects)
│   │   └── testRunner.js          # 8-point diagnostic suite
│   ├── schema/
│   │   ├── validator.js           # Component AST schema validation
│   │   └── defaultTemplates.js    # Starter component templates
│   ├── .env.example               # Environment variable template
│   └── package.json
│
├── package.json                   # Root: install:all, dev, build scripts
├── .env.example                   # Root env example
├── .gitignore                     # node_modules, .env, server/data excluded
└── README.md
```

---

## 🎨 Color Palettes

| Palette | Vibe | Primary |
| :--- | :--- | :--- |
| Minimal Neutral | Grayscale | `#18181b` |
| Light & Clean | Airy sky blue | `#0284c7` |
| Dark Professional | Electric blue on slate | `#3b82f6` |
| Midnight Blue | Indigo + cyan | `#6366f1` |
| Purple Gradient | Neon violet + fuchsia | `#8b5cf6` |
| Ocean Blue | Turquoise on navy | `#0d9488` |
| Forest Green | Emerald + moss | `#10b981` |
| Warm Earthy | Terracotta + clay | `#ea580c` |
| Pastel Dream | Lavender + mint | `#a78bfa` |
| Vibrant & Playful | Coral + yellow | `#f43f5e` |
| Monochrome | Pure brutalist B&W | `#ffffff` |
| High Contrast | WCAG AAA + yellow | `#facc15` |

---

## 🔍 Automated Diagnostics (8 Checks)

The Debug Tab runs these checks on every generated or updated design:

1. **Mobile Overflow** — Fixed widths > 360px breaking mobile layout
2. **Button Labels** — Missing `aria-label` or empty button text
3. **Image Alt Text** — Missing WCAG-compliant alt attributes
4. **Color Contrast** — Luminance ratio below WCAG AA 4.5:1 threshold
5. **Broken Images** — Placeholder or unresolved image URLs
6. **Form Validation** — Inputs missing labels or validation attributes
7. **Navigation Links** — Anchor hrefs pointing to `#` or undefined targets
8. **Page Structure** — Missing semantic regions (navbar, footer, main content)

---

## 📦 Export Options

| Format | Contents |
| :--- | :--- |
| **Standalone HTML** | Single self-contained file with all CSS, fonts, and icons inlined |
| **React + Vite ZIP** | Complete project: `package.json`, `vite.config.js`, `App.jsx`, `index.css`, `README.md` |
| **Clipboard** | Copy HTML, React JSX, or raw JSON component AST |

---

## 🔐 Security Notes

- Passwords are hashed with **bcrypt** (10 salt rounds) — plaintext is never stored
- JWT tokens are signed with `JWT_SECRET` from environment variables
- Projects are strictly isolated by `userId` — cross-user access returns `403 Forbidden`
- The `server/.env` file (containing API keys and JWT secret) is **gitignored** and never committed
- User data is stored in `server/data/` which is also **gitignored**

---

## 📄 License

MIT — Built with ❤️ for the **DTU Hackathon 2026**.
