// api/login.js
function generateRandomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

export default function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  // Prefira colocar essa redirect URI em env; deixei fallback para o que você usou
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "https://spotify-server-ebon.vercel.app/api/callback";
  const scope = [
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "streaming",
    "user-read-email",
    "user-read-private"
  ].join(" ");

  if (!clientId) {
    return res.status(500).json({ error: "Missing SPOTIFY_CLIENT_ID in environment variables" });
  }

  // gera state e salva em cookie (padrão simples — ajuste conforme sua política de cookies)
  const state = generateRandomString(16);
  // cookie simples, HttpOnly, mesmo domínio. Ajuste secure/samesite conforme precisar.
  res.setHeader('Set-Cookie', `spotify_auth_state=${state}; HttpOnly; Path=/; Max-Age=600`);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state
  });

  const authorizeUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  // redireciona para a tela de autorização do Spotify
  res.writeHead(302, { Location: authorizeUrl });
  res.end();
}
