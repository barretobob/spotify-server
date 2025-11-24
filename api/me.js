// api/me.js

export default async function handler(req, res) {
  const accessToken = req.cookies?.spotify_access_token;

  if (!accessToken) {
    return res.status(401).json({ error: "missing_access_token" });
  }

  try {
    const r = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await r.json();

    if (data.error) {
      return res.status(400).json({ error: "invalid_token" });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("Erro no /api/me:", err);
    return res.status(500).json({ error: "me_failed" });
  }
}
