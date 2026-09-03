// One-off generator: injects the shared STATES_LGAS dataset into the CAC form
// template so web (vtu-web/public) and Android (assets) share ONE file.
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const templateFile = path.join(root, 'scripts', 'cac-form.template.html');
const statesFile = path.join(root, 'scripts', 'nigeria-states.json');
const outFile = path.join(root, 'public', 'cac-form.html');

const states = JSON.parse(fs.readFileSync(statesFile, 'utf8'));
const template = fs.readFileSync(templateFile, 'utf8');
const out = template.replace('/*__STATES_LGAS_DATA__*/', 'var STATES_LGAS = ' + JSON.stringify(states) + ';');
fs.writeFileSync(outFile, out, 'utf8');
console.log('wrote', outFile, (fs.statSync(outFile).size / 1024).toFixed(1) + 'KB');
