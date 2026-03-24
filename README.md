# The Rice Race — Vercel Deployment

## Quick Deploy

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Rice Race v1"
git remote add origin https://github.com/YOUR_USERNAME/rice-race.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework: **Vite** (auto-detected)
4. Click **Deploy**

That's it — the site works immediately in **fallback mode** (pre-baked responses, no API key needed).

### 3. Enable Live AI Demos (Optional)
To enable real-time AI responses:
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add: `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)
3. Redeploy

The `/api/claude` serverless function proxies requests to Anthropic so your key stays safe.

## Local Dev
```bash
npm install
npm run dev
```

For local live demos, create `.env` in root:
```
ANTHROPIC_API_KEY=sk-ant-...
```

## How It Works
- **With API key**: All 3 demos (Tito/Tita, Career, Governance) generate live AI responses
- **Without API key**: Fallback mode auto-activates — presets show pre-baked responses, custom input hidden
- The fallback is seamless — audience won't know the difference

## Stack
- Vite + React 18
- Recharts (data viz)
- Three.js (3D rice animation)
- Anthropic Claude API (live demos)
- Zero CSS frameworks — all inline + injected styles
