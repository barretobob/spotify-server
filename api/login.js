import { randomBytes } from "crypto";
import { serialize } from "cookie";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = "https://spotify-server-cyan.vercel.app/api/callback";
const scope = "user-read-playback-state user-read-currently-playing";

export default function handler(req, res) {
  // gerar state aleatório
  const state = randomBytes(16).toString("hex");

  console.log("Generated state:", state);

  // setar cookie de state
  res.setHeader("Set-Cookie", serialize("spotify_auth_state", state, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 300 // 5 minutos
  }));

  const params = new URLSearchParams({
    response_type: "code",
    client_id,
    scope,
    redirect_uri,
    state
  });

  // redirecionar para o Spotify
  res.writeHead(302, { Location: `https://accounts.spotify.com/authorize?${params.toString()}` });
  res.end();
}

