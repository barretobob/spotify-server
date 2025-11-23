// /api/callback.js
const { store } = require('./_store');

module.exports = async (req, res) => {
  const code = req.query.code || null;
  const sess = req.query.state || 'default';

  if (!code) {
    res.status(400).send('Missing code parameter');
    return;
  }

  store[sess] = { code, created: Date.now() };

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`
    <html><body style="font-family:Arial;display:flex;align-items:center;justify-content:center;height:100vh;">
      <div style="text-align:center">
        <h2>Autorização recebida!</h2>
        <p>Você pode fechar esta aba e voltar ao After Effects.</p>
      </div>
    </body></html>
  `);
};