import querystring from "querystring";

export default async function handler(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies.spotify_auth_state : null;

  if (!state || state !== storedState) {
    return res.redirect("/?" + querystring.stringify({ error: "state_mismatch" }));
  }

  // Clear the state cookie
  res.setHeader("Set-Cookie", "spotify_auth_state=; HttpOnly; Path=/; Max-Age=0");

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "https://spotify-server-ebon.vercel.app/api/callback";

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
      console.error("Error Spotify Token:", data);
      return res.redirect("/?" + querystring.stringify({ error: "invalid_token" }));
    }

    const { access_token, refresh_token } = data;

    // Store tokens in cookies or any other way you prefer
    res.setHeader("Set-Cookie", [
      `spotify_access_token=${access_token}; HttpOnly; Path=/; Max-Age=3600`,
      `spotify_refresh_token=${refresh_token}; HttpOnly; Path=/; Max-Age=604800`,
    ]);

    // Redirect to your success page or player
    return res.redirect("/success.html");

  } catch (err) {
    console.error("Error Callback:", err);
    return res.status(500).json({ error: "callback_failed" });
  }
}
