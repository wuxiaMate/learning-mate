// build.mjs가 만든 HTML을 Figma(html_to_figma) 업로드용 단일 HTML로 묶는다.
// - 헤드리스 Chrome으로 스크립트 실행 후 DOM을 덤프해 번호 마커 위치를 고정
// - <script> 제거, 썸네일 이미지는 base64로 인라인
// - Noto Sans KR 가변 폰트를 @font-face(base64)로 포함
// 사용법: node export-figma.mjs  → %TEMP%/learningmate-figma-export/{mobile,pc,board}.html (OUTDIR로 변경 가능)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const HTML = path.join(SRC, 'html');
const OUTDIR = process.env.OUTDIR || path.join(os.tmpdir(), 'learningmate-figma-export');
fs.mkdirSync(OUTDIR, { recursive: true });

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PROFILE = path.join(os.tmpdir(), 'learningmate-wireframe-chrome');
const FONT = process.env.FONT || 'C:/Windows/Fonts/NotoSansKR-VF.ttf';

const dump = (file, w, h) => execFileSync(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  `--user-data-dir=${PROFILE}`, `--window-size=${w},${h}`, '--virtual-time-budget=3000',
  '--allow-file-access-from-files', '--dump-dom', pathToFileURL(file).href,
], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const fontCss = `@font-face{font-family:'Noto Sans KR';src:url(data:font/ttf;base64,${fs.readFileSync(FONT).toString('base64')}) format('truetype');font-weight:100 900;font-style:normal}`;

let baseCss = null;
const extract = (file, w, h, name) => {
  let dom = dump(file, w, h);
  if (!baseCss) {
    baseCss = dom.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/\s*body\{width:\d+px;height:\d+px;overflow:hidden\}\s*$/, '');
  }
  const body = dom.match(/<body[^>]*>([\s\S]*)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/g, '');
  // 썸네일 file:// → data URI
  const inlined = body.replace(/src="(file:\/\/\/[^"]+)"/g, (_, u) => {
    const p = fileURLToPath(decodeURI(u));
    return `src="data:image/png;base64,${fs.readFileSync(p).toString('base64')}"`;
  });
  return inlined.replace('<div class="canvas"', `<div class="canvas" id="${name}" data-name="${name}"`);
};

const doc = (canvases) => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${fontCss}${baseCss}
body{margin:0;padding:0;background:#fff;display:flex;flex-direction:column;align-items:flex-start;gap:120px;width:max-content}
.canvas{flex:none}</style></head><body>${canvases.join('\n')}</body></html>`;

const files = fs.readdirSync(HTML);
const pick = (re) => files.filter((f) => re.test(f)).sort();

const mobile = pick(/^\d\d_.+\.html$/).filter((f) => !f.startsWith('00_'));
const pc = pick(/^PC\d\d_.+\.html$/);

const write = (name, list) => {
  const out = path.join(OUTDIR, name);
  fs.writeFileSync(out, doc(list));
  console.log('✓', name, (fs.statSync(out).size / 1024 / 1024).toFixed(1), 'MB');
};

write('mobile.html', mobile.map((f) => extract(path.join(HTML, f), 900, 1000, f.replace('.html', ''))));
write('pc.html', pc.map((f) => extract(path.join(HTML, f), 1400, 1130, f.replace('.html', ''))));
write('board.html', [extract(path.join(HTML, '00_전체흐름.html'), 1940, 1880, '00_전체흐름')]);
