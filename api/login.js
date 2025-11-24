export default function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = "https://spotify-server-ebon.vercel.app/api/callback";

  // 🔥 state único para cada login
  const state = Math.random().toString(36).substring(2);

  const scope = [
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "streaming",
    "user-read-email",
    "user-read-private"
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state
  });

  res.redirect("https://accounts.spotify.com/authorize?" + params.toString());
}
