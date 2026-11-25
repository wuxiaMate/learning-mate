// LearningMate 와이어프레임 v0.3 빌더 — PC 우선 반응형 웹
// node build.mjs            → ../../v0.3/*.png
// node build.mjs PC06       → 해당 id로 시작하는 화면만
// node build.mjs --figma    → Figma(html_to_figma) 업로드용 HTML 묶음(%TEMP%/learningmate-figma-v3)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { page, header, notesHtml, foot } from './core.mjs';
import { PC, browser } from './pc.mjs';
import { MOBILE } from './mobile.mjs';
import { GUIDES } from './guides.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(SRC, '../../v0.3');
const HTML = path.join(SRC, 'html');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(HTML, { recursive: true });
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PROFILE = path.join(os.tmpdir(), 'learningmate-wireframe-chrome');

const PW = 1960, PH = 1110, MW = 900, MH = 1000;

const pcPage = (s) => page(`${header(s.id, s.title, s.route, s.feats)}
  ${browser(s.url, s.body())}
  <div class="notes" style="left:1516px;top:122px;width:404px">${notesHtml(s.notes, s.extra)}</div>
  ${foot('PC Web · 1440 × 900')}`, { w: PW, h: PH });

const mobilePage = (s) => page(`${header(s.id, s.title, s.route, s.feats)}
  <div class="phone" style="left:40px;top:118px"><div class="scr">${s.body()}</div></div>
  <div class="notes" style="left:478px;top:122px;width:382px">${notesHtml(s.notes, s.extra)}</div>
  ${foot('Mobile Web · 390 × 844')}`, { w: MW, h: MH });

const guidePage = (s) => page(`${header(s.id, s.title, '', s.feats)}${s.body()}${foot('Guide')}`, { w: s.w, h: s.h });

const ALL = [
  ...GUIDES.filter((g) => g.id.startsWith('G')).map((s) => ({ ...s, group: 'guide', html: () => guidePage(s), w: s.w, h: s.h })),
  ...[...PC, GUIDES.find((g) => g.id === 'PC07')].sort((a, b) => a.id.localeCompare(b.id)).map((s) => ({ ...s, group: 'pc', html: () => (s.url ? pcPage(s) : guidePage(s)), w: s.url ? PW : s.w, h: s.url ? PH : s.h })),
  ...MOBILE.map((s) => ({ ...s, group: 'mobile', html: () => mobilePage(s), w: MW, h: MH })),
];

const chrome = (args) => execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${PROFILE}`, '--allow-file-access-from-files', '--virtual-time-budget=4000', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });

const args = process.argv.slice(2);
const figma = args.includes('--figma');
const only = args.find((a) => !a.startsWith('--'));
const list = ALL.filter((s) => !only || s.id.startsWith(only));

for (const s of list) {
  const f = path.join(HTML, `${s.file}.html`);
  fs.writeFileSync(f, s.html());
  if (!figma) {
    chrome(['--force-device-scale-factor=2', `--window-size=${s.w},${s.h}`, `--screenshot=${path.join(OUT, `${s.file}.png`)}`, pathToFileURL(f).href]);
    console.log('✓', s.file);
  }
}

if (figma) {
  const FONT = process.env.FONT || 'C:/Windows/Fonts/NotoSansKR-VF.ttf';
  const dir = process.env.OUTDIR || path.join(os.tmpdir(), 'learningmate-figma-v3');
  fs.mkdirSync(dir, { recursive: true });
  const fontCss = `@font-face{font-family:'Noto Sans KR';src:url(data:font/ttf;base64,${fs.readFileSync(FONT).toString('base64')}) format('truetype');font-weight:100 900;font-style:normal}`;
  let css = null;
  const bundles = {};
  for (const s of list) {
    const dom = chrome([`--window-size=${s.w},${s.h}`, '--dump-dom', pathToFileURL(path.join(HTML, `${s.file}.html`)).href]);
    if (!css) css = dom.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/\s*body\{width:\d+px;height:\d+px;overflow:hidden\}\s*$/, '');
    const body = dom.match(/<body[^>]*>([\s\S]*)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/g, '')
      .replace('<div class="canvas"', `<div class="canvas" id="${s.id}" data-name="${s.file}"`);
    (bundles[s.group] ||= []).push(body);
  }
  for (const [g, parts] of Object.entries(bundles)) {
    const out = path.join(dir, `${g}.html`);
    fs.writeFileSync(out, `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${fontCss}${css}
body{margin:0;background:#fff;display:flex;flex-direction:column;align-items:flex-start;gap:120px;width:max-content}.canvas{flex:none}</style></head><body>${parts.join('\n')}</body></html>`);
    console.log('✓ bundle', out, (fs.statSync(out).size / 1048576).toFixed(1) + 'MB', parts.length + ' frames');
  }
}
