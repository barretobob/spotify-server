import querystring from "querystring";

export default async function handler(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies?.spotify_auth_state || null;

  // Verificação CSRF
  if (!state || state !== storedState) {
    return res.redirect("/?" + querystring.stringify({ error: "state_mismatch" }));
  }

  // Limpar cookie de estado
  res.setHeader("Set-Cookie", "spotify_auth_state=; HttpOnly; Path=/; Max-Age=0");

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  // Redirecionamento dinâmico
  const redirectUri = `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}/api/callback`;

  const tokenUrl = "https://accounts.spotify.com/api/token";
  const body = new URLSearchParams({
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

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
      console.error("Erro Spotify Token:", data);
      return res.redirect("/?" + querystring.stringify({ error: "invalid_token" }));
    }

    const { access_token, refresh_token } = data;

    // Salvar tokens
    res.setHeader("Set-Cookie", [
      `spotify_access_token=${access_token}; HttpOnly; Path=/; Max-Age=3600`,
      `spotify_refresh_token=${refresh_token}; HttpOnly; Path=/; Max-Age=604800`,
    ]);

    // Fechar a aba automaticamente
    return res.send(`
      <script>
        window.close();
      </script>
      <p>Você pode fechar esta aba.</p>
    `);

  } catch (err) {
    console.error("Erro Callback:", err);
    return res.status(500).json({ error: "callback_failed" });
  }
}
