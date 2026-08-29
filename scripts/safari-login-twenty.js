// Login de Twenty en Safari via AppleScript (do JavaScript) y luego
// navegar a las vistas para screenshots.
// Requiere: Safari > Develop > Allow JavaScript from Apple Events (activado).
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Leer .env.local sin imprimir secretos
const envPath = path.join('/Users/victorgallo/Projects/omona', '.env.local');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const EMAIL = env.DEMO_EMAIL || 'demo@omona.tech';
const BASE = 'https://crm.omona.tech';

function safariJS(js) {
  const escaped = js.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const script = `tell application "Safari" to do JavaScript "${escaped}" in front document`;
  try {
    return execSync(`osascript -e '${script}'`, { encoding: 'utf8' }).trim();
  } catch (e) {
    return `ERR: ${e.message.slice(0, 200)}`;
  }
}

async function main() {
  console.log('URL actual:', execSync(`osascript -e 'tell application "Safari" to get URL of front document'`, { encoding: 'utf8' }).trim());

  // 1. Estado del formulario
  console.log('form:', safariJS(`(function(){ var i=document.querySelector('input[type=email]'); return i ? 'form-ok' : 'no-form'; })()`));

  // 2. Llenar email
  console.log('fill:', safariJS(`(function(){ var i=document.querySelector('input[type=email]'); if(!i) return 'no-input'; var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(i,'${EMAIL}'); i.dispatchEvent(new Event('input',{bubbles:true})); return 'filled'; })()`));

  // 3. Submit
  console.log('submit:', safariJS(`(function(){ var b=document.querySelector('button[type=submit],button:not([type])'); if(!b) return 'no-btn'; b.click(); return 'clicked'; })()`));

  // 4. Esperar y reportar URL
  await new Promise(r => setTimeout(r, 5000));
  console.log('URL tras submit:', execSync(`osascript -e 'tell application "Safari" to get URL of front document'`, { encoding: 'utf8' }).trim());
}

main();
