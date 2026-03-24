// Vercel Serverless Function — proxies requests to Anthropic API
// Now optional: users can provide their own key via client-side direct calls
// This proxy is kept as a fallback but no server key is required

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // No server-side key configured — return 503 so client knows to use direct mode
  return res.status(503).json({ error: 'No server API key configured. Use your own key via the 🔑 button.' });
}
