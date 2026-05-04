const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const ROOT = path.join(__dirname, 'results-root'); // racine où tu montes tes dossiers results

app.get('/perf/applications', (req, res) => {
  fs.readdir(ROOT, (err, files) => {
    if (err) return res.status(500).send(err.message);
    res.json(files); // chaque dossier = une application
  });
});

app.get('/perf/:app/runs', (req, res) => {
  const appDir = path.join(ROOT, req.params.app);
  fs.readdir(appDir, (err, files) => {
    if (err) return res.status(500).send(err.message);
    res.json(files); // chaque dossier = une exécution
  });
});

app.get('/perf/:app/runs/:runId/summary', (req, res) => {
  const file = path.join(ROOT, req.params.app, req.params.runId, 'summary.txt');
  res.sendFile(file);
});

app.get('/perf/:app/runs/:runId/alerts', (req, res) => {
  const file = path.join(ROOT, req.params.app, req.params.runId, 'alerts.txt');
  res.sendFile(file);
});

app.get('/perf/:app/runs/:runId/diff', (req, res) => {
  const file = path.join(ROOT, req.params.app, req.params.runId, 'diff.html');
  res.sendFile(file);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Perf API listening on ${port}`));
