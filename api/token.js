import { getToken, saveToken } from "./db";

export default async function handler(req, res) {
  const state = req.query.state || "default";

  const saved = getToken(state);
  if (!saved || !saved.code) {
    return res.json({ ready: false });
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", saved.code);
    params.append("redirect_uri", process.env.REDIRECT_URI);
    params.append("client_id", process.env.SPOTIFY_CLIENT_ID);
    params.append("client_secret", process.env.SPOTIFY_CLIENT_SECRET);

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const tokenData = await tokenResponse.json();

    // 🔥 salva o token para persistência
    saveToken(state, {
      ...saved,
      token: tokenData
    });

    res.json({ ready: true, token: tokenData });
  } catch (err) {
    res.json({ error: err.message });
  }
}
