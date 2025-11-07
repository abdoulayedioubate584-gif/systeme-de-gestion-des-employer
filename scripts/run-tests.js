const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error('TEST-FAIL:', msg);
  process.exitCode = 1;
}

function ok(msg) {
  console.log('TEST-OK:', msg);
}

try {
  const root = path.resolve(__dirname, '..');

  // 1) fixtures/employes-sample.json exists and is valid JSON with at least one entry
  const fixturesPath = path.join(root, 'fixtures', 'employes-sample.json');
  if (!fs.existsSync(fixturesPath)) {
    fail('fixtures/employes-sample.json not found');
  } else {
    const txt = fs.readFileSync(fixturesPath, 'utf8');
    const data = JSON.parse(txt);
    if (!Array.isArray(data) || data.length === 0) fail('fixtures/employes-sample.json must be a non-empty array');
    else ok('fixtures/employes-sample.json is valid');
  }

  // 2) index.html references fichier.js
  const indexPath = path.join(root, 'index.html');
  if (!fs.existsSync(indexPath)) fail('index.html not found');
  else {
    const indexTxt = fs.readFileSync(indexPath, 'utf8');
    if (!/fichier\.js/.test(indexTxt)) fail('index.html should include a script to fichier.js');
    else ok('index.html references fichier.js');
  }

  // 3) fichier.js contains class Employe and functions afficherListeEmployes
  const fichierPath = path.join(root, 'fichier.js');
  if (!fs.existsSync(fichierPath)) fail('fichier.js not found');
  else {
    const fTxt = fs.readFileSync(fichierPath, 'utf8');
    if (!/class\s+Employe/.test(fTxt)) fail('fichier.js should define class Employe');
    else ok('fichier.js defines class Employe');
    if (!/function\s+afficherListeEmployes\s*\(/.test(fTxt)) fail('fichier.js should define function afficherListeEmployes');
    else ok('fichier.js defines afficherListeEmployes');
  }

  // 4) package.json has test script
  const pkgPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgPath)) fail('package.json not found');
  else {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (!pkg.scripts || !pkg.scripts.test) fail('package.json must contain a test script');
    else ok('package.json contains test script');
  }

  if (process.exitCode && process.exitCode !== 0) {
    console.error('\nOne or more tests failed.');
    process.exit(1);
  } else {
    console.log('\nAll quick checks passed.');
    process.exit(0);
  }
} catch (err) {
  console.error('TEST-ERROR:', err && err.stack || err);
  process.exit(2);
}
