import fetch from "node-fetch";
import { parse, serialize } from "cookie";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "https://spotify-server-git-main-bobbarretos-projects.vercel.app/api/callback";

export default async function handler(req, res) {
  const { code, state } = req.query;
  const cookies = parse(req.headers.cookie || "");
  const storedState = cookies.spotify_auth_state;

  console.log("Received state:", state);
  console.log("Stored state:", storedState);

  if (!state || state !== storedState) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("State mismatch");
    return;
  }

  // limpar cookie
  res.setHeader("Set-Cookie", serialize("spotify_auth_state", "", { maxAge: 0, path: "/" }));

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64")
    },
    body: new URLSearchParams({
      code,
      redirect_uri,
      grant_type: "authorization_code"
    })
  });

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    console.error("Token error:", text);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Failed to get token");
    return;
  }

  const data = await tokenResponse.json();

  console.log("Token data:", data);

  // retornar tokens (pode redirecionar para frontend se quiser)
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}
