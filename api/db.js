import fs from "fs";
import path from "path";

const DB_PATH = "/tmp/spotify-tokens.json";

export function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    }
  } catch (e) {}
  return {};
}

export function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db), "utf8");
}

export function saveToken(state, data) {
  const db = loadDB();
  db[state] = data;
  saveDB(db);
}

export function getToken(state) {
  const db = loadDB();
  return db[state] || null;
}
