import { saveToken } from "./db";

export default async function handler(req, res) {
  const code = req.query.code;
  const state = req.query.state || "default";

  if (!code) {
    return res.status(400).send("Missing code");
  }

  // 🔥 agora salva no /tmp em vez da memória
  saveToken(state, { code, created: Date.now(), ready: true });

  res.setHeader("Content-Type", "text/html");
  res.end(`
    <html><body style="font-family:sans-serif;text-align:center;margin-top:40px">
      <h2>Autorização recebida!</h2>
      <p>Você pode fechar esta aba e voltar ao After Effects.</p>
    </body></html>
  `);
}
