import cookie from 'cookie';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const storedState = cookies['spotify_auth_state'];
  const { code, state } = req.query;

  if (!state || state !== storedState) {
    return res.redirect('/?error=state_mismatch');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'https://spotify-server-git-main-bobbarretos-projects.vercel.app/api/callback'
  });

  const authHeader = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    const data = await response.json();

    if (data.error) {
      return res.redirect(`/?error=${data.error}`);
    }

    // você pode guardar access_token e refresh_token como quiser
    // aqui apenas redirecionamos para a home com access_token
    res.redirect(`/?access_token=${data.access_token}&refresh_token=${data.refresh_token}`);
  } catch (err) {
    res.redirect(`/?error=server_error`);
  }
}
