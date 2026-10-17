<p align="center">
  <img src="public/miru-logo.svg" alt="Miru Logo" width="120" height="120" />
</p>

<h1 align="center">Miru (見る)</h1>

<p align="center">
  <strong>Watch your favourite anime anywhere, anytime. Fast, modern, and ad-free.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## 🌟 Highlights & Features

- 🚫 **Ad-Free Experience**: No popups, redirects, or intrusive ads.
- ⚡ **Standalone & Hybrid Architecture**:
  - Connects directly to **AniList GraphQL** out of the box for discovery, trending titles, anime details, relations, search, and release schedules.
  - Optional compatibility with external scrapers/APIs via `NEXT_PUBLIC_API_URL`.
- 🎬 **Multi-Provider Video Player**:
  - High-performance HLS streaming with **ArtPlayer**, ambient glow (ambilight), auto-skip intros/outros, and subtitle control.
  - Built-in multi-server fallback engine (Megaplay, VidLink, Autoembed) so playback never fails.
  - Internal Next.js proxy route (`/api/proxy`) to rewrite and stream m3u8 playlists without CORS roadblocks.
- 📱 **PWA Ready**: Installable as a Progressive Web App on mobile (iOS/Android) and desktop.
- 🔖 **Watch Tracking**: Local browser continue-watching history support with optional PocketBase cloud account synchronization.

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`, `pnpm`, or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/miru-web.git
   cd miru-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment** (Optional):
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *By default, Miru operates in standalone mode using AniList GraphQL and internal Next.js proxies. No external backend required.*

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

You can run Miru with Docker Compose:

```bash
docker compose up -d
```

Or build and run the container directly:

```bash
docker build -t miru-web .
docker run -p 3000:3000 miru-web
```

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Optional external API for custom anime scrapers | `""` (Uses direct AniList GraphQL) |
| `NEXT_PUBLIC_PROXY_URL` | HLS video proxy URL | `/api/proxy` (Internal Next.js route) |
| `NEXT_PUBLIC_POCKETBASE_URL` | Optional PocketBase URL for cloud user accounts | `http://localhost:8090` |
| `NEXT_PUBLIC_GA_ID` | Optional Google Analytics measurement ID | `""` |

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
