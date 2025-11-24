export default function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  // Monta automaticamente o URL de callback baseado no domínio atual no Vercel
  const redirectUri = `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}/api/callback`;

  const scope = [
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "streaming",
    "user-read-email",
    "user-read-private"
  ].join(" ");

  if (!clientId) {
    return res.status(400).json({ error: "Missing Spotify Client ID!" });
  }

  // Gerar state (CSRF)
  const state = generateRandomString(16);
  res.setHeader("Set-Cookie", `spotify_auth_state=${state}; HttpOnly; Path=/; Max-Age=600`);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state
  });

  return res.redirect(`https://accounts.spotify.com/authorize?${params}`);
}

function generateRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
