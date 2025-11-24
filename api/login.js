import { randomBytes } from 'crypto';
import cookie from 'cookie';

export default function handler(req, res) {
  const state = randomBytes(16).toString('hex'); // gera state aleatório
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = 'https://spotify-server-git-main-bobbarretos-projects.vercel.app/api/callback';
  const scope = 'user-read-playback-state user-modify-playback-state';

  // salva state em cookie temporário
  res.setHeader('Set-Cookie', cookie.serialize('spotify_auth_state', state, {
    httpOnly: true,
    secure: true,
    maxAge: 300, // 5 minutos
    path: '/'
  }));

  // monta URL de autorização do Spotify
  const query = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state
  });

  res.redirect(`https://accounts.spotify.com/authorize?${query.toString()}`);
}
