// /api/token.js
const { store } = require('./_store');

module.exports = async (req, res) => {
  const sess = req.query.state || 'default';
  const saved = store[sess];

  if (!saved || !saved.code) {
    res.json({ ready: false });
    return;
  }

  const code = saved.code;

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.REDIRECT_URI);
    params.append("client_id", process.env.SPOTIFY_CLIENT_ID);
    params.append("client_secret", process.env.SPOTIFY_CLIENT_SECRET);

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const json = await tokenRes.json();
    store[sess].token = json;

    res.json({ ready: true, token: json });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};