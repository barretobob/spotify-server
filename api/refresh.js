// api/refresh.js

export default async function handler(req, res) {
  const refreshToken = req.cookies?.spotify_refresh_token;

  if (!refreshToken) {
    return res.status(400).json({ error: "missing_refresh_token" });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "missing_env_variables" });
  }

  const tokenUrl = "https://accounts.spotify.com/api/token";

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro ao renovar token:", data);
      return res.status(400).json({ error: "invalid_refresh_token" });
    }

    const newAccessToken = data.access_token;

    // Atualiza cookie com novo access_token
    res.setHeader(
      "Set-Cookie",
      `spotify_access_token=${newAccessToken}; HttpOnly; Path=/; Max-Age=3600`
    );

    return res.status(200).json({
      access_token: newAccessToken,
      expires_in: data.expires_in || 3600,
    });

  } catch (err) {
    console.error("Erro no refresh.js:", err);
    return res.status(500).json({ error: "refresh_failed" });
  }
}
