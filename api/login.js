// Spotify Login Function
function authenticateSpotify() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
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
    return alert("Missing Spotify Client ID!");
  }

  const state = generateRandomString(16);
  res.setHeader('Set-Cookie', `spotify_auth_state=${state}; HttpOnly; Path=/; Max-Age=600`);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state
  });

  const authorizeUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  
  // Open Spotify login in a new window (external browser window)
  window.open(authorizeUrl, '_blank', 'width=600,height=600');
}
