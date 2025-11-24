const fs = require("fs");
const storePath = "/tmp/spotify-store.json";

function readStore() {
  try {
    if (fs.existsSync(storePath)) {
      return JSON.parse(fs.readFileSync(storePath, "utf8"));
    }
    return {};
  } catch (err) {
    return {};
  }
}

function writeStore(data) {
  try {
    fs.writeFileSync(storePath, JSON.stringify(data));
  } catch (err) {}
}

module.exports = {
  get(key) {
    const store = readStore();
    return store[key] || null;
  },
  set(key, value) {
    const store = readStore();
    store[key] = value;
    writeStore(store);
  }
};
