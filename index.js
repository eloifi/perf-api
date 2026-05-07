import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const ROOT = "/results-root"; // volume Docker monté

// Vérifie que le dossier existe
function ensureRoot(res) {
  if (!fs.existsSync(ROOT)) {
    res.status(500).json({ error: "results-root not mounted" });
    return false;
  }
  return true;
}

// Liste des applications
app.get("/api/applications", (req, res) => {
  if (!ensureRoot(res)) return;

  const apps = fs
    .readdirSync(ROOT)
    .filter((f) => fs.statSync(path.join(ROOT, f)).isDirectory());

  res.json(apps);
});

// Liste des runs d’une application
app.get("/api/runs", (req, res) => {
  if (!ensureRoot(res)) return;

  const appName = req.query.app;
  if (!appName) {
    return res.status(400).json({ error: "Missing ?app= parameter" });
  }

  const dir = path.join(ROOT, appName, "runs");
  if (!fs.existsSync(dir)) {
    return res.status(404).json({ error: "Application not found" });
  }

  const runs = fs
    .readdirSync(dir)
    .filter((f) => fs.statSync(path.join(dir, f)).isDirectory());

  res.json(runs);
});

// Détails d’un run
app.get("/api/runs/:id", (req, res) => {
  if (!ensureRoot(res)) return;

  const appName = req.query.app;
  if (!appName) {
    return res.status(400).json({ error: "Missing ?app= parameter" });
  }

  const file = path.join(ROOT, appName, "runs", req.params.id, "summary.json");

  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: "Run not found" });
  }

  res.json(JSON.parse(fs.readFileSync(file, "utf8")));
});

app.listen(4000, () => console.log("API running on port 4000"));
