// LearningMate 1차 MVP 와이어프레임 생성기
// 사용법: node build.mjs  → ../*.png 생성 (HTML은 ./html, 썸네일은 ./thumbs)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(SRC, '../v0.1');
const HTML = path.join(SRC, 'html');
const THUMBS = path.join(SRC, 'thumbs');
fs.mkdirSync(HTML, { recursive: true });
fs.mkdirSync(THUMBS, { recursive: true });

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PROFILE = process.env.CHROME_PROFILE || path.join(os.tmpdir(), 'learningmate-wireframe-chrome');

/* ------------------------------------------------------------------ */
/* 공통 스타일: 파랑 계열 + 검정 + 흰색                                 */
/* ------------------------------------------------------------------ */
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
:root{--black:#0B0F19;--navy:#0A2A6B;--blue:#2563EB;--blue2:#6E9BF5;--sky:#DCE8FF;--tint:#F3F7FF;--line:#C8D7F0;--muted:#5A6A88;--white:#fff}
html,body{background:#fff}
body{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;color:var(--black);font-size:14px;-webkit-font-smoothing:antialiased}
b,strong{font-weight:700}
.canvas{position:relative;background:#fff;overflow:hidden}
.hdr{position:absolute;left:40px;right:40px;top:26px;display:flex;align-items:flex-end;justify-content:space-between;border-bottom:2px solid var(--black);padding-bottom:14px}
.hdr .no{font-size:12px;font-weight:800;letter-spacing:.14em;color:var(--blue)}
.hdr h1{font-size:25px;font-weight:800;letter-spacing:-.5px;margin-top:4px}
.hdr .feat{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:420px}
.hdr .feat span{border:1.5px solid var(--navy);color:var(--navy);font-weight:800;font-size:12px;padding:3px 9px;border-radius:999px}
.foot{position:absolute;left:40px;right:40px;bottom:16px;display:flex;justify-content:space-between;font-size:11px;color:var(--muted);letter-spacing:.02em}

/* phone */
.phone{position:absolute;width:390px;height:844px;border-radius:46px;overflow:hidden;background:#fff;box-shadow:0 0 0 3px var(--black),0 18px 40px -18px rgba(10,42,107,.35)}
.scr{position:relative;width:100%;height:100%;display:flex;flex-direction:column}
.sb{height:44px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 30px;font-size:14px}
.sb .sbr{display:flex;gap:4px;align-items:center}.sb .sbr i{display:block;width:16px;height:9px;border-radius:2px;background:var(--black)}.sb .sbr i:nth-child(2){width:12px}.sb .sbr i:nth-child(3){width:22px;border-radius:3px}
.appbar{height:52px;flex:none;display:flex;align-items:center;gap:10px;padding:0 20px}
.appbar h2{font-size:18px;font-weight:800;letter-spacing:-.3px;flex:1}
.appbar .back{font-size:28px;line-height:1;margin-top:-4px}
.ab-r{display:flex;align-items:center;gap:10px}
.body{flex:1;padding:0 20px;overflow:hidden;display:flex;flex-direction:column;gap:12px}
.tabbar{height:84px;flex:none;border-top:1.5px solid var(--line);display:flex;justify-content:space-around;align-items:flex-start;padding-top:10px;background:#fff}
.tab{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;color:var(--muted);width:60px}
.tab .ti{width:22px;height:22px;border:2px solid currentColor;border-radius:7px}
.tab.on{color:var(--blue);font-weight:800}.tab.on .ti{background:var(--blue)}
.tab.fab .ti{width:52px;height:52px;border-radius:50%;border:none;background:var(--blue);margin-top:-22px;box-shadow:0 0 0 5px #fff;display:grid;place-items:center;color:#fff;font-size:18px}
.tab.fab{color:var(--black);font-weight:700}

/* atoms */
.row{display:flex;align-items:center;gap:8px}.between{justify-content:space-between}.col{display:flex;flex-direction:column}
.card{border:1.5px solid var(--line);border-radius:14px;padding:14px;background:#fff}
.card.tint{background:var(--tint)}
.card.navy{background:var(--navy);border-color:var(--navy);color:#fff}
.card.black{background:var(--black);border-color:var(--black);color:#fff}
.lbl{font-size:12px;font-weight:800;color:var(--muted);letter-spacing:.02em}
.muted{color:var(--muted)}.blue{color:var(--blue)}.sm{font-size:12px}.xs{font-size:11px}
.btn{height:52px;border-radius:12px;background:var(--blue);color:#fff;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center;gap:6px}
.btn.o{background:#fff;color:var(--blue);box-shadow:inset 0 0 0 1.5px var(--blue)}
.btn.k{background:var(--black)}
.btn.g{background:#fff;color:var(--black);box-shadow:inset 0 0 0 1.5px var(--line)}
.btn.s{height:36px;font-size:13px;border-radius:9px;padding:0 12px}
.chip{display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 12px;border-radius:999px;box-shadow:inset 0 0 0 1.5px var(--line);font-size:13px;white-space:nowrap;background:#fff;color:var(--black)}
.chip.sm{height:24px;padding:0 9px;font-size:11.5px}
.chip.on{background:var(--blue);color:#fff;box-shadow:none;font-weight:700}
.chip.k{background:var(--black);color:#fff;box-shadow:none;font-weight:700}
.chip.n{background:var(--navy);color:#fff;box-shadow:none;font-weight:700}
.chip.s{background:var(--sky);box-shadow:none;color:var(--navy);font-weight:700}
.chip.dash{box-shadow:none;border:1.5px dashed var(--blue2);color:var(--blue)}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.input{height:46px;border-radius:10px;box-shadow:inset 0 0 0 1.5px var(--line);padding:0 14px;display:flex;align-items:center;justify-content:space-between;font-size:14px;color:var(--black)}
.input.hint{color:var(--muted)}
.toggle{width:44px;height:26px;border-radius:13px;background:var(--line);position:relative;flex:none}
.toggle::after{content:'';position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.toggle.on{background:var(--blue)}.toggle.on::after{left:21px}
.ph{position:relative;overflow:hidden;background:var(--tint);box-shadow:inset 0 0 0 1.5px var(--line);border-radius:10px;display:flex;align-items:center;justify-content:center}
.phx{position:absolute;left:0;top:0;width:100%;height:100%;z-index:0;pointer-events:none}
.hatch{position:relative;overflow:hidden;background:#EAF1FF}
.hatch>svg{position:absolute;left:0;top:0}
.ph>span{background:#fff;padding:2px 8px;border-radius:6px;font-size:11px;color:var(--muted);font-weight:700;position:relative;z-index:1}
.ph.dark{background:#141B2D;box-shadow:none}
.face{position:absolute;left:50%;top:50%;width:46%;aspect-ratio:3/4;transform:translate(-50%,-50%);border:2px dashed var(--blue);border-radius:50%;z-index:1;background:rgba(255,255,255,.55)}
.ph.dark .face{background:rgba(37,99,235,.15);border-color:var(--blue2)}
.sk{height:9px;border-radius:5px;background:var(--sky)}
.avatar{width:36px;height:36px;border-radius:50%;background:var(--sky);box-shadow:inset 0 0 0 1.5px var(--line);flex:none}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block;flex:none}
.d-f{background:var(--blue)}.d-p{background:var(--sky);box-shadow:inset 0 0 0 1.5px var(--blue2)}.d-a{background:var(--black)}.d-o{background:#fff;box-shadow:inset 0 0 0 1.5px var(--muted)}
.seg{display:flex;background:var(--tint);border-radius:11px;padding:3px;box-shadow:inset 0 0 0 1.5px var(--line)}
.seg>span{flex:1;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--muted);font-weight:600}
.seg>span.on{background:var(--navy);color:#fff;font-weight:800}
.segbar{display:flex;height:14px;border-radius:7px;overflow:hidden;gap:2px;background:#fff}
.segbar i{display:block}
.segbar .f{background:var(--blue)}.segbar .p{background:var(--sky)}.segbar .a{background:var(--black)}.segbar .u{position:relative;overflow:hidden;background:#EAF1FF;box-shadow:inset 0 0 0 1px var(--blue2)}
.legend{display:flex;gap:12px;flex-wrap:wrap;font-size:11.5px;color:var(--muted)}
.legend span{display:flex;align-items:center;gap:5px}
.legend i{width:14px;height:10px;border-radius:3px;display:block}
.slider{flex:1;height:6px;border-radius:3px;background:var(--sky);position:relative}
.slider i{position:absolute;left:0;top:0;bottom:0;background:var(--blue);border-radius:3px}
.slider i::after{content:'';position:absolute;right:-8px;top:-5px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px var(--blue)}
.pill{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 16px;border-radius:999px;font-weight:800;font-size:14px}
.pill i{width:9px;height:9px;border-radius:50%;background:currentColor;display:block}
.pill.focus{background:var(--sky);color:var(--blue)}
.pill.away{background:var(--black);color:#fff}
.pill.unk{background:#EAF1FF;color:var(--navy);border:1.5px dashed var(--blue2)}
.pill.man{background:#fff;color:var(--black);box-shadow:inset 0 0 0 1.5px var(--black)}
.ring{position:relative;border-radius:50%;display:grid;place-items:center}
.ring>svg,.donut>svg{position:absolute;left:0;top:0}
.ring .in{position:relative}
.ring .in{border-radius:50%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
.timer{font-weight:800;letter-spacing:-1.5px;font-variant-numeric:tabular-nums;color:var(--navy);line-height:1}
.timer.muted{color:#9AA8C4}
.rb{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;font-size:18px;font-weight:800}
.rb.out{box-shadow:inset 0 0 0 2px var(--navy);color:var(--navy)}
.rb.k{background:var(--black);color:#fff}
.rb.b{background:var(--blue);color:#fff}
.rec{width:9px;height:9px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 3px var(--sky);display:inline-block}
.divider{height:1.5px;background:var(--line)}
.dim{position:absolute;inset:0;background:rgba(11,15,25,.55);z-index:20}
.sheet{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:24px 24px 0 0;z-index:21;padding:10px 20px 30px;display:flex;flex-direction:column;gap:12px}
.handle{width:40px;height:5px;border-radius:3px;background:var(--line);margin:0 auto 4px}
.modal{position:absolute;left:24px;right:24px;z-index:21;background:#fff;border-radius:20px;padding:24px 20px 20px;display:flex;flex-direction:column;gap:12px;align-items:center;text-align:center}
.ico-c{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;font-size:24px;font-weight:800}
.bars{display:flex;align-items:flex-end;gap:10px;height:110px;padding:0 4px}
.bars>div{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end}
.bars>div>i{display:block;width:100%;border-radius:6px 6px 2px 2px;background:var(--blue2)}
.bars>div.now>i{background:var(--navy)}
.bars>div>small{font-size:11px;color:var(--muted)}
.donut{border-radius:50%;position:relative;flex:none}
.lock{display:inline-block;width:10px;height:9px;border-radius:2px;background:currentColor;position:relative;margin-top:3px}
.lock::before{content:'';position:absolute;left:2px;top:-6px;width:6px;height:7px;border:2px solid currentColor;border-bottom:none;border-radius:4px 4px 0 0;box-sizing:border-box}

/* annotations */
.hl{position:absolute;border:1.5px dashed var(--blue);border-radius:10px;z-index:60;pointer-events:none}
.ld{position:absolute;height:0;border-top:1.5px dashed var(--blue);z-index:59}
.phone-only .ld{display:none!important}
.m{position:absolute;width:24px;height:24px;border-radius:50%;background:var(--blue);color:#fff;font-size:12.5px;font-weight:800;display:grid;place-items:center;box-shadow:0 0 0 2.5px #fff;z-index:61}
.notes{position:absolute;display:flex;flex-direction:column;gap:14px}
.note{display:flex;gap:12px;align-items:flex-start}
.note .n{flex:none;width:24px;height:24px;border-radius:50%;background:var(--blue);color:#fff;font-size:12.5px;font-weight:800;display:grid;place-items:center;margin-top:1px}
.note h4{font-size:15px;font-weight:800;letter-spacing:-.2px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.note h4 em{font-style:normal;font-size:10.5px;font-weight:800;color:var(--navy);box-shadow:inset 0 0 0 1.2px var(--navy);border-radius:999px;padding:1px 7px}
.note p{font-size:13px;line-height:1.55;color:var(--muted);margin-top:3px}
.extra{border-top:1.5px solid var(--line);padding-top:14px;display:flex;flex-direction:column;gap:10px}
.extra .lbl{margin-bottom:2px}
.phone-only .hdr,.phone-only .notes,.phone-only .foot,.phone-only .hl,.phone-only .m{display:none!important}

/* PC */
.browser{position:absolute;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 0 0 2.5px var(--black),0 24px 50px -24px rgba(10,42,107,.35);display:flex;flex-direction:column}
.bchrome{height:42px;flex:none;background:var(--tint);border-bottom:1.5px solid var(--line);display:flex;align-items:center;gap:14px;padding:0 16px}
.bchrome .dots{display:flex;gap:7px}.bchrome .dots i{width:11px;height:11px;border-radius:50%;background:var(--line);display:block}
.bchrome .url{flex:1;max-width:520px;height:26px;border-radius:8px;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);font-size:12px;color:var(--muted);display:flex;align-items:center;padding:0 12px;gap:6px}
.app{flex:1;display:flex;min-height:0}
.side{width:220px;flex:none;background:var(--black);color:#fff;padding:22px 16px;display:flex;flex-direction:column;gap:6px}
.side .logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:17px;margin:0 6px 22px}
.side .logo i{width:28px;height:28px;border-radius:8px;background:var(--blue);display:block}
.side .it{height:42px;border-radius:10px;display:flex;align-items:center;gap:12px;padding:0 12px;font-size:14px;color:#AEB9D3}
.side .it i{width:18px;height:18px;border-radius:5px;border:2px solid currentColor;display:block}
.side .it.on{background:var(--navy);color:#fff;font-weight:700}
.side .it.on i{background:var(--blue2);border-color:var(--blue2)}
.side .it.dis{opacity:.45}
.side .sp{flex:1}
.main{flex:1;padding:26px 30px;display:flex;flex-direction:column;gap:18px;min-width:0;background:#fff}
.pcnotes{position:absolute;display:grid;grid-template-columns:repeat(4,1fr);gap:18px 28px}
`;

// Figma(html_to_figma) 호환: inset 그림자 → 실제 테두리, X 자리표시·빗금 → SVG
const COMPAT_JS = `
function lmCompat(){
  const NS='http://www.w3.org/2000/svg';
  const svg=(w,h,cls)=>{const s=document.createElementNS(NS,'svg');s.setAttribute('width',w);s.setAttribute('height',h);s.setAttribute('viewBox','0 0 '+w+' '+h);if(cls)s.setAttribute('class',cls);return s;};
  const line=(s,x1,y1,x2,y2,c,w)=>{const l=document.createElementNS(NS,'line');l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);l.setAttribute('stroke',c);l.setAttribute('stroke-width',w);s.appendChild(l);};
  document.querySelectorAll('.canvas *').forEach(el=>{
    const bs=getComputedStyle(el).boxShadow;if(!bs||bs==='none'||bs.indexOf('inset')<0)return;
    const parts=bs.split(/,(?![^(]*\\))/).map(s=>s.trim());const keep=[];let b=null;
    parts.forEach(p=>{const m=p.match(/^(rgba?\\([^)]*\\)|#[0-9a-f]+)\\s+0px\\s+0px\\s+0px\\s+([\\d.]+)px\\s+inset$/i);if(m)b={c:m[1],w:m[2]};else keep.push(p);});
    if(b){el.style.boxShadow=keep.length?keep.join(', '):'none';el.style.border=b.w+'px solid '+b.c;}
  });
  document.querySelectorAll('.ph').forEach(el=>{
    const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
    const s=svg(w,h,'phx');const c=el.classList.contains('dark')?'#2A3550':'#C8D7F0';
    line(s,0,0,w,h,c,1.5);line(s,w,0,0,h,c,1.5);el.insertBefore(s,el.firstChild);
  });
  document.querySelectorAll('.segbar .u,.hatch').forEach(el=>{
    const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
    const s=svg(w,h);for(let k=-h;k<w+h;k+=5)line(s,k,h,k+h,0,'#6E9BF5',1.4);el.appendChild(s);
  });
}`;

const MARK_JS = `${COMPAT_JS}
window.addEventListener('DOMContentLoaded',()=>{
  lmCompat();
  if(document.body.classList.contains('phone-only'))return;
  const cv=document.querySelector('.canvas');const cr=cv.getBoundingClientRect();
  const dev=document.querySelector('.phone,.browser');const dr=dev.getBoundingClientRect();
  const isPhone=dev.classList.contains('phone');const placed=[];
  document.querySelectorAll('[data-m]').forEach(el=>{
    if(!el.dataset.m)return;
    const r=el.getBoundingClientRect();
    const L=Math.max(r.left,dr.left+4),T=Math.max(r.top,dr.top+4),R=Math.min(r.right,dr.right-4),B=Math.min(r.bottom,dr.bottom-4);
    const hl=document.createElement('div');hl.className='hl';
    Object.assign(hl.style,{left:(L-cr.left-4)+'px',top:(T-cr.top-4)+'px',width:(R-L+8)+'px',height:(B-T+8)+'px'});
    cv.appendChild(hl);
    const m=document.createElement('div');m.className='m';m.textContent=el.dataset.m;
    let x=L-cr.left-14,y=T-cr.top-14;
    if(isPhone){
      x=dr.right-cr.left+12;y=T-cr.top-2;
      while(placed.some(py=>Math.abs(py-y)<28))y+=28;
      placed.push(y);
      const x1=R-cr.left+4;
      const ld=document.createElement('div');ld.className='ld';
      Object.assign(ld.style,{left:x1+'px',top:(y+12)+'px',width:(x-x1)+'px'});cv.appendChild(ld);
    }else{
      x=Math.max(x,dr.left-cr.left-10);y=Math.max(y,dr.top-cr.top-10);
    }
    Object.assign(m.style,{left:x+'px',top:y+'px'});cv.appendChild(m);
  });
});`;

const page = (inner, { w, h, phoneOnly = false }) => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${CSS} body{width:${w}px;height:${h}px;overflow:hidden}</style><script>${MARK_JS}</script></head><body class="${phoneOnly ? 'phone-only' : ''}"><div class="canvas" style="width:${w}px;height:${h}px">${inner}</div></body></html>`;

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
const mk = (n) => (n ? ` data-m="${n}"` : '');
const HEX = { blue: '#2563EB', sky: '#DCE8FF', line: '#C8D7F0', navy: '#0A2A6B', blue2: '#6E9BF5', black: '#0B0F19' };
const arc = (c, r, a0, a1) => {
  const p = (d) => [c + r * Math.cos((d - 90) * Math.PI / 180), c + r * Math.sin((d - 90) * Math.PI / 180)].map((v) => v.toFixed(2));
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};
const ringSvg = (size, t, pct, color, track) => {
  const c = size / 2, r = (size - t) / 2;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${track}" stroke-width="${t}"/><path d="${arc(c, r, 0, 360 * pct)}" fill="none" stroke="${color}" stroke-width="${t}"/></svg>`;
};
const donutSvg = (size, segs) => {
  const t = Math.round(size * 0.24), c = size / 2, r = (size - t) / 2;
  let a = 0;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${segs.map(([color, pct]) => { const a0 = a; a += 360 * pct; return `<path d="${arc(c, r, a0, a)}" fill="none" stroke="${color}" stroke-width="${t}"/>`; }).join('')}</svg>`;
};
const sb = () => `<div class="sb"><b>9:41</b><span class="sbr"><i></i><i></i><i></i></span></div>`;
const appbar = (title, { back = false, right = '', m = '' } = {}) =>
  `<div class="appbar">${back ? '<span class="back">‹</span>' : ''}<h2>${title}</h2><div class="ab-r"${mk(m)}>${right}</div></div>`;
const tabbar = (active, m = '') => {
  const items = [['home', '홈'], ['rec', '기록'], ['focus', '집중'], ['study', '스터디'], ['my', '마이']];
  return `<nav class="tabbar"${mk(m)}>${items
    .map(([k, l]) => (k === 'focus'
      ? `<div class="tab fab"><span class="ti">▶</span>${l}</div>`
      : `<div class="tab${active === k ? ' on' : ''}"><span class="ti"></span>${l}</div>`))
    .join('')}</nav>`;
};
const header = (no, title, feats) =>
  `<div class="hdr"><div><div class="no">LEARNINGMATE WIREFRAME · ${no}</div><h1>${title}</h1></div><div class="feat">${feats.map((f) => `<span>${f}</span>`).join('')}</div></div>`;
const notesHtml = (notes, extra = '') =>
  notes.map((n, i) => `<div class="note"><span class="n">${n.n ?? i + 1}</span><div><h4>${n.t}${n.f ? n.f.split(' ').map((x) => `<em>${x}</em>`).join('') : ''}</h4><p>${n.d}</p></div></div>`).join('') +
  (extra ? `<div class="extra">${extra}</div>` : '');
const foot = (right) => `<div class="foot"><span>LearningMate · 1차 MVP 와이어프레임 v0.1 · 2026.11.24</span><span>${right}</span></div>`;
const legend = () => `<div class="legend"><span><i style="background:var(--blue)"></i>집중</span><span><i style="background:var(--sky)"></i>일시정지</span><span><i style="background:var(--black)"></i>자리 이탈</span><span><i class="hatch" style="box-shadow:inset 0 0 0 1px var(--blue2)"></i>판정 불가</span></div>`;

/* ------------------------------------------------------------------ */
/* Mobile screens                                                      */
/* ------------------------------------------------------------------ */
const S = {};

S.login = () => `${sb()}
<div class="body" style="padding:0 28px;gap:14px">
  <div style="height:70px"></div>
  <div class="col" style="align-items:center;gap:12px"${mk(0)}>
    <div class="ph" style="width:84px;height:84px;border-radius:24px"><span>LOGO</span></div>
    <div style="font-size:26px;font-weight:800;letter-spacing:-.6px">LearningMate</div>
    <div class="muted">계획하고, 집중하고, 기록하세요</div>
  </div>
  <div style="height:26px"></div>
  <div class="col" style="gap:10px"${mk(1)}>
    <div class="input hint">이메일</div>
    <div class="input hint">비밀번호</div>
    <div class="btn" style="margin-top:4px">로그인</div>
    <div class="row between sm muted" style="padding:2px 4px"><span>회원가입</span><span>비밀번호 찾기</span></div>
  </div>
  <div class="row" style="gap:10px;margin-top:18px"><div class="divider" style="flex:1"></div><span class="xs muted" style="font-weight:700">개발 · 데모용</span><div class="divider" style="flex:1"></div></div>
  <div class="row" style="gap:10px"${mk(2)}>
    <div class="btn g s" style="flex:1;height:46px">테스트 계정 A</div>
    <div class="btn g s" style="flex:1;height:46px">테스트 계정 B</div>
  </div>
  <div style="flex:1"></div>
  <div class="card tint row" style="gap:12px;margin-bottom:34px"${mk(3)}>
    <span class="dot d-f" style="width:10px;height:10px"></span>
    <div class="col" style="gap:2px;flex:1"><b class="sm">진행 중인 세션이 있어요</b><span class="xs muted">알고리즘 · 00:42:10 — 로그인하면 이어서 측정</span></div>
  </div>
</div>`;

const homeBody = (m = true) => {
  const n = (x) => (m ? x : '');
  return `${sb()}
${appbar('11월 24일 화요일', { right: `<span class="chip sm s">P 1,240</span><span class="ti" style="width:22px;height:22px;border:2px solid var(--black);border-radius:7px;display:block"></span>` })}
<div class="body">
  <div class="card navy" style="padding:14px 16px"${mk(n(1))}>
    <div class="row between"><span class="xs" style="color:var(--sky);font-weight:700">시험 D-Day</span><span class="xs" style="color:var(--sky)">＋ 시험 추가</span></div>
    <div class="row" style="gap:12px;margin-top:6px;align-items:flex-end">
      <div style="font-size:34px;font-weight:800;letter-spacing:-1px;line-height:1">D-12</div>
      <div class="col" style="gap:2px"><b style="font-size:15px">정보처리기사 필기</b><span class="xs" style="color:var(--sky)">2026.12.06 (일)</span></div>
    </div>
    <div class="row" style="gap:5px;margin-top:10px"><span class="dot" style="background:#fff"></span><span class="dot" style="background:rgba(255,255,255,.35)"></span><span class="dot" style="background:rgba(255,255,255,.35)"></span></div>
  </div>
  <div class="row between" style="padding:0 2px"${mk(n(2))}>
    ${[['월', 23], ['화', 24], ['수', 25], ['목', 26], ['금', 27], ['토', 28], ['일', 29]].map(([d, dt], i) => `
      <div class="col" style="align-items:center;gap:4px;width:42px">
        <span class="xs muted">${d}</span>
        <span style="width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-weight:700;${i === 1 ? 'background:var(--blue);color:#fff' : ''}">${dt}</span>
        <span class="dot" style="width:5px;height:5px;background:${i < 4 ? 'var(--blue2)' : 'transparent'}"></span>
      </div>`).join('')}
  </div>
  <div class="row" style="gap:10px"${mk(n(3))}>
    <div class="card tint" style="flex:1;padding:12px 14px"><div class="xs muted" style="font-weight:700">오늘 순공</div><div class="timer" style="font-size:24px;margin-top:6px">2:14:30</div></div>
    <div class="card tint" style="flex:1;padding:12px 14px"><div class="row between"><span class="xs muted" style="font-weight:700">계획 달성</span><b class="sm blue">2/5</b></div><div class="slider" style="margin-top:14px;height:8px"><i style="width:40%"></i></div></div>
  </div>
  <div class="row between" style="margin-top:4px"><b style="font-size:16px">오늘의 계획</b><span class="sm blue" style="font-weight:800">＋ 계획 추가</span></div>
  ${[
    { t1: '07:30', t2: '08:10', s: '영어', g: '토익 RC 파트5 40문제', tag: '#토익', done: true, act: '실제 0:38:12' },
    { t1: '09:00', t2: '10:30', s: '알고리즘', g: '백준 DP 3문제', tag: '#코테 #복습', play: true, mk: 4 },
    { t1: '13:00', t2: '14:00', s: '데이터베이스', g: '정규화 개념 정리', tag: '#정처기', done: true, act: '실제 1:02:40', mk: 5 },
    { t1: '20:00', t2: '22:00', s: '정보처리기사', g: '기출 2회분 풀이', tag: '#정처기' },
  ].map((p) => `
  <div class="row" style="gap:12px;align-items:stretch"${mk(n(p.mk))}>
    <div class="col xs muted" style="width:36px;gap:2px;padding-top:4px;font-weight:700"><span>${p.t1}</span><span>${p.t2}</span></div>
    <div style="width:3px;border-radius:2px;background:${p.done ? 'var(--line)' : 'var(--blue)'}"></div>
    <div class="col" style="flex:1;gap:4px;${p.done ? 'opacity:.6' : ''}">
      <div class="row" style="gap:6px"><span class="chip sm ${p.done ? '' : 's'}">${p.s}</span><span class="xs muted">${p.tag}</span></div>
      <b style="font-size:14.5px;${p.done ? 'text-decoration:line-through' : ''}">${p.g}</b>
      ${p.act ? `<span class="xs blue" style="font-weight:700">${p.act}</span>` : ''}
    </div>
    ${p.done
      ? `<span style="width:34px;height:34px;border-radius:50%;background:var(--sky);color:var(--blue);display:grid;place-items:center;font-weight:800;align-self:center">✓</span>`
      : `<span style="width:34px;height:34px;border-radius:50%;${p.play ? 'background:var(--blue);color:#fff' : 'box-shadow:inset 0 0 0 1.5px var(--blue);color:var(--blue)'};display:grid;place-items:center;font-size:12px;align-self:center">▶</span>`}
  </div>`).join('')}
</div>
${tabbar('home', n(6))}`;
};
S.home = () => homeBody(true);

S.plan = () => `<div class="scr" style="position:absolute;inset:0">${homeBody(false)}</div>
<div class="dim"></div>
<div class="sheet">
  <div class="handle"></div>
  <div class="seg"${mk(1)}><span class="on">공부 계획</span><span>시험 D-Day</span></div>
  <div class="row" style="gap:10px"${mk(2)}>
    <div class="col" style="flex:1;gap:6px"><span class="lbl">날짜</span><div class="input">11.24 (화)<span class="muted">▾</span></div></div>
    <div class="col" style="flex:1.3;gap:6px"><span class="lbl">시간</span><div class="input">09:00 ~ 10:30</div></div>
  </div>
  <div class="col" style="gap:6px"${mk(3)}><span class="lbl">과목 <span class="blue">*</span></span>
    <div class="chips"><span class="chip on">알고리즘</span><span class="chip">영어</span><span class="chip">데이터베이스</span><span class="chip">정보처리기사</span><span class="chip dash">＋ 새 과목</span></div></div>
  <div class="col" style="gap:6px"${mk(4)}><span class="lbl">목표 (선택)</span><div class="input">백준 DP 3문제</div>
    <span class="lbl" style="margin-top:6px">태그 (선택)</span>
    <div class="chips"><span class="chip sm s">#코테 ✕</span><span class="chip sm s">#복습 ✕</span><span class="chip sm dash">＋ 태그</span></div></div>
  <div class="card tint row between" style="padding:10px 14px"><span class="sm">시험과 연결</span><span class="sm" style="font-weight:700">정보처리기사 필기 · D-12 ▾</span></div>
  <div class="row" style="gap:10px;margin-top:4px"${mk(5)}><div class="btn g" style="flex:1">취소</div><div class="btn" style="flex:2">저장</div></div>
</div>`;

S.setup = () => `${sb()}
${appbar('학습 시작', { back: true })}
<div class="body" style="gap:11px">
  <div class="card tint row between" style="padding:11px 14px"${mk(1)}>
    <div class="col" style="gap:2px"><span class="xs muted" style="font-weight:700">연결된 계획</span><b class="sm">09:00–10:30 · 백준 DP 3문제</b></div><span class="sm blue" style="font-weight:800">변경</span>
  </div>
  <div class="col" style="gap:7px"${mk(2)}>
    <span class="lbl">과목</span>
    <div class="chips"><span class="chip on">알고리즘</span><span class="chip">영어</span><span class="chip">데이터베이스</span><span class="chip dash">＋</span></div>
    <div class="row" style="gap:8px"><div class="input" style="flex:1;height:42px">백준 DP 3문제</div><span class="chip sm s">#코테</span><span class="chip sm s">#복습</span></div>
  </div>
  <div class="col" style="gap:7px"${mk(3)}>
    <span class="lbl">측정 방식</span>
    <div class="seg"><span class="on">AI 카메라 감지</span><span>수동</span></div>
  </div>
  <div class="ph" style="height:150px;border-radius:14px"${mk(4)}><div class="face" style="width:22%"></div><span style="position:absolute;bottom:10px;left:10px">카메라 미리보기</span></div>
  <div class="row xs muted" style="gap:6px;margin-top:-4px"><span class="lock" style="color:var(--blue)"></span>영상은 이 기기에서만 분석 · 프레임 저장·전송 없음</div>
  <div class="card" style="padding:4px 14px"${mk(5)}>
    <div class="row between" style="height:50px"><div class="col"><b class="sm">배경음</b><span class="xs muted">빗소리 · 볼륨 60</span></div><div class="row"><span class="chip sm">빗소리 ▾</span><span class="toggle on"></span></div></div>
    <div class="divider"></div>
    <div class="row between" style="height:50px"><div class="col"><b class="sm">타임랩스 녹화</b><span class="xs muted">10초 간격 캡처 · 이 기기에만 저장</span></div><span class="toggle"></span></div>
  </div>
</div>
<div style="padding:12px 20px 34px;flex:none"${mk(6)}><div class="btn" style="height:56px;font-size:17px">▶ 집중 시작</div></div>`;

const focusBody = (state, m = {}) => {
  const away = state === 'away';
  return `${sb()}
<div class="row between" style="padding:6px 20px 0;height:44px;flex:none">
  <span class="chip sm k"${mk(m.mode)}><span class="lock" style="color:#fff;transform:scale(.85)"></span> 집중 모드</span>
  <span style="font-size:20px;color:var(--muted)">✕</span>
</div>
${away ? `<div style="margin:8px 20px 0;flex:none;background:var(--black);color:#fff;border-radius:12px;padding:10px 14px"${mk(m.banner)}><b class="sm">자리를 비운 것 같아요</b><div class="xs" style="color:#AEB9D3;margin-top:2px">돌아오면 자동으로 이어서 측정해요 · 이탈 구간으로 기록 중</div></div>` : ''}
<div class="body" style="gap:10px;padding-top:10px">
  <div class="col" style="align-items:center;gap:8px">
    <div class="row" style="gap:8px"><span class="chip sm s">알고리즘</span><b style="font-size:16px">백준 DP 3문제</b></div>
    <span class="pill ${away ? 'away' : 'focus'}"${mk(m.pill)}><i></i>${away ? '자리 이탈 · 00:42' : '재실 · 집중 중'}</span>
  </div>
  <div class="col" style="align-items:center">
    <div class="ring" style="width:${away ? 220 : 236}px;height:${away ? 220 : 236}px"${mk(m.timer)}>${away ? ringSvg(220, 10, 0.94, HEX.line, HEX.sky) : ringSvg(236, 11, 0.94, HEX.blue, HEX.sky)}
      <div class="in" style="width:${away ? 200 : 214}px;height:${away ? 200 : 214}px">
        <span class="xs muted" style="font-weight:700">${away ? '집중 시간 측정 멈춤' : '순공 시간'}</span>
        <div class="timer${away ? ' muted' : ''}" style="font-size:46px">01:24:36</div>
        <span class="xs muted">목표 1:30:00</span>
      </div>
    </div>
  </div>
  <div class="card row" style="gap:12px;padding:10px 12px"${mk(m.cam)}>
    <div class="ph ${away ? '' : ''}" style="width:58px;height:70px;flex:none;border-radius:10px">${away ? '' : '<div class="face" style="width:60%"></div>'}</div>
    <div class="col" style="flex:1;gap:3px">
      <b class="sm">${away ? '얼굴 미검출 0:42' : 'AI 감지 켜짐'}</b>
      <span class="xs muted">${away ? '임계 0:30 초과 → 이탈 확정' : '얼굴 검출 정상 · 프레임 미전송'}</span>
      <span class="row xs" style="gap:6px;font-weight:700;color:var(--navy);align-self:flex-start"${mk(m.tl)}${m.tl ? ' data-mpos="r"' : ''}><span class="rec"></span>타임랩스 캡처 중 · 142컷</span>
    </div>
    <div class="col" style="align-items:center;gap:3px"><span class="toggle on"></span><span class="xs muted">카메라</span></div>
  </div>
  <div class="col" style="gap:5px"${mk(m.bar)}>
    <div class="segbar"><i class="f" style="flex:32"></i><i class="p" style="flex:12"></i><i class="f" style="flex:28"></i><i class="a" style="flex:${away ? 6 : 3}"></i><i class="f" style="flex:${away ? 0 : 24}"></i></div>
    <div class="row between xs muted"><span>09:02 시작</span><span>지금</span></div>
  </div>
  <div class="row" style="justify-content:center;gap:40px"${mk(m.ctrl)}>
    <div class="col" style="align-items:center;gap:5px"><span class="rb out">❚❚</span><span class="xs" style="font-weight:700">일시정지</span></div>
    <div class="col" style="align-items:center;gap:5px"><span class="rb k">■</span><span class="xs" style="font-weight:700">종료</span></div>
  </div>
  <div class="xs muted" style="text-align:center;font-weight:700;text-decoration:underline;text-underline-offset:3px">카메라 없이 수동 모드로 전환</div>
  <div class="card tint" style="padding:10px 14px;margin-top:auto;margin-bottom:28px"${mk(m.sound)}>
    <div class="row between"><b class="sm">배경음</b><span class="xs blue" style="font-weight:800">❚❚ 재생 중</span></div>
    <div class="chips" style="margin-top:8px"><span class="chip sm on">빗소리</span><span class="chip sm">카페</span><span class="chip sm">백색소음</span><span class="chip sm">모닥불</span></div>
    <div class="row" style="gap:12px;margin-top:10px"><span class="xs muted">볼륨</span><div class="slider"><i style="width:60%"></i></div><span class="xs muted">60</span></div>
  </div>
</div>`;
};
S.focus = () => focusBody('focus', { mode: 1, pill: 2, timer: 3, cam: 4, tl: 5, bar: 6, ctrl: 7, sound: 8 });
S.away = () => focusBody('away', { banner: 1, pill: 2, timer: 3, cam: 4, bar: 5 });

S.tabback = () => `<div class="scr" style="position:absolute;inset:0">${focusBody('focus')}</div>
<div class="dim"></div>
<div class="modal" style="top:230px"${mk(1)}>
  <span class="ico-c" style="background:var(--sky);color:var(--blue)">↩</span>
  <div style="font-size:19px;font-weight:800;letter-spacing:-.4px">다시 돌아오셨네요!</div>
  <div class="sm muted" style="line-height:1.6">다른 탭에 <b style="color:var(--black)">2분 18초</b> 머물렀어요.<br>타이머는 그대로 진행 중이에요.</div>
  <div class="card tint" style="width:100%;padding:10px 14px"${mk(2)}>
    <div class="row between sm"><span class="muted">현재 순공</span><b class="timer" style="font-size:16px;letter-spacing:0">01:26:54</b></div>
    <div class="row between sm" style="margin-top:6px"><span class="muted">이번 세션 탭 이탈</span><b>2회</b></div>
  </div>
  <div class="btn" style="width:100%"${mk(3)}>집중 이어가기</div>
  <span class="sm muted" style="font-weight:700">일시정지하기</span>
</div>`;

S.result = () => `${sb()}
${appbar('세션 완료', { right: '<span style="font-size:20px;color:var(--muted)">✕</span>' })}
<div class="body" style="gap:11px">
  <div class="row" style="gap:12px">
    <span class="ico-c" style="width:46px;height:46px;background:var(--blue);color:#fff;font-size:20px">✓</span>
    <div class="col" style="gap:2px"><b style="font-size:18px">수고했어요!</b><span class="sm muted">알고리즘 · 백준 DP 3문제 · 09:02–10:44</span></div>
  </div>
  <div class="card" style="padding:14px 16px"${mk(1)}>
    <div class="row between" style="align-items:flex-end"><span class="lbl">순공 시간</span><span class="xs muted">저장 완료 · 세션 #2481</span></div>
    <div class="timer" style="font-size:40px;margin-top:6px">1:24:36</div>
    <div class="row" style="margin-top:12px;gap:0">
      ${[['총 경과', '1:42:10'], ['일시정지', '0:12:04'], ['자리 이탈', '0:05:30']].map(([a, b], i) => `<div class="col" style="flex:1;gap:2px;${i ? 'border-left:1.5px solid var(--line);padding-left:12px' : ''}"><span class="xs muted">${a}</span><b class="sm">${b}</b></div>`).join('')}
    </div>
  </div>
  <div class="col" style="gap:7px"${mk(2)}>
    <div class="segbar" style="height:16px"><i class="f" style="flex:32"></i><i class="p" style="flex:12"></i><i class="f" style="flex:28"></i><i class="a" style="flex:3"></i><i class="f" style="flex:20"></i><i class="u" style="flex:2"></i><i class="a" style="flex:2"></i><i class="f" style="flex:4"></i></div>
    ${legend()}
  </div>
  <div class="card navy row between" style="padding:13px 16px"${mk(3)}>
    <div class="col" style="gap:2px"><b style="font-size:18px">＋80P 획득</b><span class="xs" style="color:var(--sky)">정상 종료 · 최소 집중 25분 충족</span></div>
    <div class="col" style="align-items:flex-end;gap:2px"><span class="xs" style="color:var(--sky)">보유</span><b>1,320P ›</b></div>
  </div>
  <div class="card row" style="gap:12px;padding:12px"${mk(4)}>
    <div class="ph" style="width:104px;height:74px;flex:none"><span>▶ 0:24</span></div>
    <div class="col" style="flex:1;gap:6px">
      <div class="col" style="gap:1px"><b class="sm">공부 타임랩스</b><span class="xs muted">142컷 · 이 기기 브라우저에 보관</span></div>
      <div class="row" style="gap:6px"><span class="chip sm on">▶ 재생</span><span class="chip sm">↓ 저장</span><span class="chip sm">삭제</span></div>
    </div>
  </div>
  <div class="card tint row between" style="padding:11px 14px"${mk(5)}>
    <div class="row" style="gap:10px"><span style="width:22px;height:22px;border-radius:6px;background:var(--blue);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:800">✓</span><div class="col"><b class="sm">계획 완료로 표시</b><span class="xs muted">09:00–10:30 백준 DP 3문제 ← 실제 1:24:36</span></div></div>
  </div>
  <div class="row" style="gap:10px;margin-top:auto;margin-bottom:30px"><div class="btn g" style="flex:1">홈으로</div><div class="btn" style="flex:1">기록 보기</div></div>
</div>`;

S.stats = () => `${sb()}
${appbar('기록')}
<div class="body" style="gap:11px">
  <div class="seg"${mk(1)}><span>일간</span><span class="on">주간</span></div>
  <div class="row between"><span style="font-size:20px;color:var(--muted)">‹</span><b>11월 4주 · 11.23 – 11.29</b><span style="font-size:20px;color:var(--muted)">›</span></div>
  <div class="row" style="gap:6px"${mk(2)}><span class="chip sm n">과목: 전체 ▾</span><span class="chip sm">태그 ▾</span><span class="chip sm">목표 ▾</span></div>
  <div class="card tint" style="padding:12px 14px"${mk(3)}>
    <div class="row between"><span class="lbl">이번 주 순공</span><span class="xs blue" style="font-weight:800">지난주보다 +1:12</span></div>
    <div class="row between" style="align-items:flex-end;margin-top:4px"><div class="timer" style="font-size:30px">18:42:10</div><span class="xs muted">일 평균 2:40 · 세션 12</span></div>
  </div>
  <div class="bars"${mk(4)}>
    ${[['월', 62], ['화', 88], ['수', 40], ['목', 70], ['금', 55], ['토', 96], ['일', 30]].map(([d, h], i) => `<div class="${i === 1 ? 'now' : ''}"><i style="height:${h}%"></i><small>${d}</small></div>`).join('')}
  </div>
  <div class="card row" style="gap:16px;padding:12px 14px"${mk(5)}>
    <div class="donut" style="width:84px;height:84px">${donutSvg(84, [[HEX.blue, 0.42], [HEX.navy, 0.28], [HEX.blue2, 0.18], [HEX.black, 0.12]])}</div>
    <div class="col" style="flex:1;gap:5px">
      ${[['var(--blue)', '알고리즘', '7:51', '42%'], ['var(--navy)', '영어', '5:14', '28%'], ['var(--blue2)', '데이터베이스', '3:22', '18%'], ['var(--black)', '정보처리기사', '2:15', '12%']].map(([c, s, t, p]) => `<div class="row xs" style="gap:7px"><span class="dot" style="background:${c}"></span><span style="flex:1">${s}</span><b>${t}</b><span class="muted" style="width:28px;text-align:right">${p}</span></div>`).join('')}
    </div>
  </div>
  <div class="row between"><b>세션 기록</b><span class="xs muted">최신순 ▾</span></div>
  ${[['11.24 (화) 09:02–10:44', '알고리즘 · 백준 DP 3문제', '1:24:36', [32, 12, 28, 3, 24]], ['11.24 (화) 07:31–08:12', '영어 · 토익 RC 파트5', '0:38:12', [20, 2, 18, 0, 0]]].map(([d, s, t, b], i) => `
  <div class="row" style="gap:12px"${mk(i === 0 ? 6 : '')}>
    <div class="col" style="flex:1;gap:4px"><span class="xs muted">${d}</span><b class="sm">${s}</b><div class="segbar" style="height:7px;width:180px"><i class="f" style="flex:${b[0]}"></i><i class="p" style="flex:${b[1]}"></i><i class="f" style="flex:${b[2]}"></i><i class="a" style="flex:${b[3]}"></i><i class="f" style="flex:${b[4]}"></i></div></div>
    <b class="timer" style="font-size:16px;letter-spacing:0">${t}</b><span class="muted">›</span>
  </div>`).join('<div class="divider"></div>')}
</div>
${tabbar('rec')}`;

S.detail = () => `${sb()}
${appbar('세션 상세', { back: true, right: '<span class="muted" style="font-size:18px">⋯</span>' })}
<div class="body" style="gap:12px">
  <div class="col" style="gap:6px"${mk(1)}>
    <span class="sm muted">11월 24일 (화) · 09:02 – 10:44</span>
    <b style="font-size:19px">백준 DP 3문제</b>
    <div class="chips"><span class="chip sm s">알고리즘</span><span class="chip sm">#코테</span><span class="chip sm">#복습</span><span class="chip sm k">AI 카메라 감지</span></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"${mk(2)}>
    ${[['순공', '1:24:36', 'var(--blue)'], ['일시정지', '0:12:04 · 1회', 'var(--sky)'], ['자리 이탈', '0:05:30 · 2회', 'var(--black)'], ['판정 불가', '0:01:40 · 1회', 'hatch']].map(([a, b, c]) => `<div class="card" style="padding:10px 12px"><div class="row xs muted" style="gap:6px;font-weight:700"><i class="${c === 'hatch' ? 'hatch' : ''}" style="width:12px;height:12px;border-radius:3px;${c === 'hatch' ? '' : `background:${c};`}display:block;box-shadow:inset 0 0 0 1px var(--blue2)"></i>${a}</div><b style="font-size:15px;display:block;margin-top:4px">${b}</b></div>`).join('')}
  </div>
  <div class="lbl" style="margin-top:2px">구간 타임라인</div>
  <div class="col" style="gap:0"${mk(3)}>
    ${[
      ['09:02', '집중 시작', '32:10', 'f', '수동 시작 · 계획에서 진입'],
      ['09:34', '일시정지', '12:04', 'p', '사용자 정지'],
      ['09:46', '집중 재개', '28:00', 'f', ''],
      ['10:14', '자리 이탈', '3:12', 'a', 'AI 감지 · 얼굴 미검출'],
      ['10:17', '집중', '20:16', 'f', '복귀 자동 재개'],
      ['10:37', '판정 불가', '1:40', 'u', '저조도 · 수동 전환 안내'],
      ['10:39', '자리 이탈 → 집중', '2:18 · 2:42', 'a', ''],
      ['10:44', '세션 종료', '', 'k', '종료 확정 · 보상 지급'],
    ].map(([t, a, d, c, s]) => `
    <div class="row" style="gap:10px;align-items:stretch;min-height:40px">
      <span class="xs muted" style="width:36px;padding-top:2px;font-weight:700">${t}</span>
      <div class="col" style="align-items:center;width:12px"><span class="${c === 'u' ? 'hatch' : ''}" style="width:12px;height:12px;border-radius:4px;flex:none;margin-top:3px;${c === 'f' ? 'background:var(--blue)' : c === 'p' ? 'background:var(--sky);box-shadow:inset 0 0 0 1.5px var(--blue2)' : c === 'a' ? 'background:var(--black)' : c === 'u' ? 'box-shadow:inset 0 0 0 1px var(--blue2)' : 'background:#fff;box-shadow:inset 0 0 0 2px var(--black)'}"></span>${c !== 'k' ? '<span style="flex:1;width:2px;background:var(--line)"></span>' : ''}</div>
      <div class="col" style="flex:1;gap:1px;padding-bottom:8px"><div class="row between"><b class="sm">${a}</b><span class="sm" style="font-weight:700">${d}</span></div>${s ? `<span class="xs muted">${s}</span>` : ''}</div>
    </div>`).join('')}
  </div>
  <div class="card tint col" style="gap:8px;padding:11px 14px;margin-bottom:30px"${mk(4)}>
    <div class="row between sm"><span class="muted">연결된 계획</span><b>09:00–10:30 백준 DP 3문제 ✓</b></div>
    <div class="row between sm"><span class="muted">세션 보상</span><b class="blue">＋80P 지급됨</b></div>
  </div>
</div>`;

S.studyJoin = () => `${sb()}
${appbar('스터디방')}
<div class="body" style="gap:14px">
  <div class="card" style="padding:16px"${mk(1)}>
    <b style="font-size:16px">초대 코드로 참여</b>
    <div class="xs muted" style="margin-top:3px">방장이 공유한 6자리 코드를 입력하세요</div>
    <div class="row" style="gap:8px;margin:14px 0">
      ${['A', '7', 'K', '2', '', ''].map((c, i) => `<div style="flex:1;height:52px;border-radius:10px;display:grid;place-items:center;font-size:22px;font-weight:800;${c ? 'box-shadow:inset 0 0 0 1.5px var(--navy)' : i === 4 ? 'box-shadow:inset 0 0 0 2px var(--blue)' : 'box-shadow:inset 0 0 0 1.5px var(--line)'}">${c}</div>`).join('')}
    </div>
    <div class="btn">입장하기</div>
  </div>
  <div class="btn o"${mk(2)}>＋ 새 스터디방 만들기</div>
  <div class="row between" style="margin-top:4px"><b style="font-size:16px">내 스터디방</b><span class="xs muted">2개</span></div>
  ${[
    { n: 'SSAFY 알고리즘 스터디', c: 'A7K2Q9', st: [['f', '민수'], ['f', '지현'], ['p', '도윤'], ['o', '서연']], sum: '4명 중 2명 집중 · 1명 휴식', m: 3 },
    { n: '정처기 막판 스퍼트', c: 'P3X8LM', st: [['f', '하늘'], ['o', '준호'], ['o', '유나']], sum: '3명 중 1명 집중' },
  ].map((r) => `
  <div class="card" style="padding:14px"${mk(r.m)}>
    <div class="row between"><b>${r.n}</b><span class="chip sm">코드 ${r.c}</span></div>
    <div class="row" style="gap:-6px;margin-top:12px">
      ${r.st.map(([s]) => `<span style="position:relative;margin-right:-8px"><span class="avatar" style="display:block;box-shadow:0 0 0 2px #fff,inset 0 0 0 1.5px var(--line)"></span><span class="dot d-${s}" style="position:absolute;right:0;bottom:0;width:11px;height:11px;box-shadow:0 0 0 2px #fff${s === 'p' ? ',inset 0 0 0 1.5px var(--blue2)' : s === 'o' ? ',inset 0 0 0 1.5px var(--muted)' : ''}"></span></span>`).join('')}
      <span class="sm muted" style="margin-left:18px;flex:1">${r.sum}</span><span class="chip sm on">입장</span>
    </div>
  </div>`).join('')}
  <div class="legend" style="margin-top:-2px"${mk(4)}><span><i style="background:var(--blue);border-radius:50%;width:9px;height:9px"></i>집중</span><span><i style="background:var(--sky);border-radius:50%;width:9px;height:9px;box-shadow:inset 0 0 0 1.5px var(--blue2)"></i>휴식</span><span><i style="background:var(--black);border-radius:50%;width:9px;height:9px"></i>종료</span><span><i style="background:#fff;border-radius:50%;width:9px;height:9px;box-shadow:inset 0 0 0 1.5px var(--muted)"></i>오프라인</span></div>
</div>
${tabbar('study')}`;

const tile = ({ name, st, time, cam, me, off }) => `
  <div style="position:relative;border-radius:14px;overflow:hidden;height:186px;${off ? 'opacity:.5;' : ''}${me ? 'box-shadow:0 0 0 2.5px var(--blue)' : ''}">
    ${cam ? `<div class="ph dark" style="position:absolute;inset:0;border-radius:0"><div class="face" style="width:42%"></div></div>` : `<div style="position:absolute;inset:0;background:var(--tint);display:grid;place-items:center;box-shadow:inset 0 0 0 1.5px var(--line);border-radius:14px"><span class="avatar" style="width:58px;height:58px"></span></div>`}
    <div style="position:absolute;left:8px;right:8px;bottom:8px;background:#fff;border-radius:9px;padding:6px 9px" class="col">
      <div class="row" style="gap:6px"><span class="dot d-${st}"></span><b class="xs" style="flex:1">${name}</b>${cam ? '<span class="xs muted">캠</span>' : ''}</div>
      <span class="xs muted" style="margin-top:1px">${time}</span>
    </div>
  </div>`;

S.studyRoom = () => `${sb()}
${appbar('SSAFY 알고리즘 스터디', { back: true, right: '<span class="chip sm">코드 A7K2Q9</span>' })}
<div class="body" style="gap:11px">
  <div class="row sm" style="gap:12px"${mk(1)}><span class="row" style="gap:5px"><span class="dot d-f"></span>집중 2</span><span class="row" style="gap:5px"><span class="dot d-p"></span>휴식 1</span><span class="row" style="gap:5px"><span class="dot d-o"></span>오프라인 1</span><span class="muted" style="margin-left:auto">실시간</span></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"${mk(2)}>
    ${tile({ name: '나', st: 'f', time: '집중 00:52:18', cam: true, me: true })}
    ${tile({ name: '민수', st: 'f', time: '집중 02:05:11', cam: true })}
    ${tile({ name: '지현', st: 'p', time: '휴식 중 · 05:12', cam: false })}
    ${tile({ name: '도윤', st: 'o', time: '오프라인 · 3분 전', cam: false, off: true })}
  </div>
  <div class="card row" style="gap:12px;padding:12px 14px"${mk(3)}>
    <div class="col" style="flex:1;gap:3px"><div class="row" style="gap:6px"><span class="chip sm s">알고리즘</span><span class="pill focus" style="height:24px;padding:0 9px;font-size:11.5px"><i style="width:7px;height:7px"></i>재실</span></div><div class="timer" style="font-size:28px">00:52:18</div></div>
    <span class="rb out" style="width:48px;height:48px;font-size:14px">❚❚</span><span class="rb k" style="width:48px;height:48px;font-size:14px">■</span>
  </div>
  <div class="card" style="padding:4px 14px"${mk(4)}>
    <div class="row between" style="height:48px"><div class="col"><b class="sm">내 카메라 공유</b><span class="xs muted">방 참여자에게만 영상 전송</span></div><span class="toggle on"></span></div>
    <div class="divider"></div>
    <div class="row between" style="height:48px"><div class="col"><b class="sm">AI 재실 감지</b><span class="xs muted">공유와 별개 · 기기 안에서만 분석</span></div><span class="toggle on"></span></div>
  </div>
  <div class="btn g" style="margin-bottom:30px;height:46px;font-size:14px"${mk(5)}>방 나가기</div>
</div>`;

S.my = () => `${sb()}
${appbar('마이', { right: '<span class="ti" style="width:22px;height:22px;border:2px solid var(--black);border-radius:50%;display:block"></span>' })}
<div class="body" style="gap:12px">
  <div class="row" style="gap:12px"><span class="avatar" style="width:48px;height:48px"></span><div class="col" style="gap:2px;flex:1"><b style="font-size:16px">테스트 계정 A</b><span class="xs muted">이번 주 순공 18:42:10 · 연속 6일</span></div><span class="muted">›</span></div>
  <div class="card navy" style="padding:14px 16px"${mk(1)}>
    <div class="row between"><span class="xs" style="color:var(--sky);font-weight:700">보유 포인트</span><span class="xs" style="color:var(--sky)">이번 주 ＋240P</span></div>
    <div style="font-size:30px;font-weight:800;margin-top:4px;letter-spacing:-.5px">1,320 P</div>
  </div>
  <div class="row between"${mk(2)}><b>수집</b><span class="xs muted">3 / 12 ›</span></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:-4px">
    ${['새싹', '첫 집중', '7일 연속', ''].map((l, i) => `<div class="col" style="align-items:center;gap:4px">${i < 3 ? `<div class="ph" style="width:100%;aspect-ratio:1;border-radius:12px"></div>` : `<div style="width:100%;aspect-ratio:1;border-radius:12px;border:1.5px dashed var(--line);display:grid;place-items:center;color:var(--line)"><span class="lock" style="color:var(--line)"></span></div>`}<span class="xs ${i < 3 ? '' : 'muted'}">${l || '잠김 +8'}</span></div>`).join('')}
  </div>
  <div class="row between" style="margin-top:2px"${mk(3)}><b>지급 내역</b><span class="xs muted">전체 ›</span></div>
  ${[['11.24 · 알고리즘 1:24:36', '＋80P', true], ['11.23 · 영어 0:18:20', '지급 안 됨 · 최소 25분 미달', false], ['11.23 · 데이터베이스 1:05:02', '＋60P', true]].map(([a, b, ok]) => `<div class="row between sm" style="margin-top:-2px"><span>${a}</span><b class="${ok ? 'blue' : 'muted'}" style="${ok ? '' : 'font-weight:500;font-size:12px'}">${b}</b></div>`).join('')}
  <div class="card" style="padding:2px 14px"${mk(4)}>
    ${['과목 · 태그 관리', '시험 D-Day 관리', '알림 · 시간대 설정'].map((t, i) => `${i ? '<div class="divider"></div>' : ''}<div class="row between" style="height:44px"><span class="sm">${t}</span><span class="muted">›</span></div>`).join('')}
  </div>
</div>
${tabbar('my')}`;

/* ------------------------------------------------------------------ */
/* PC screens (1280 × 780 browser)                                     */
/* ------------------------------------------------------------------ */
const side = (active, locked = false) => `<aside class="side">
  <div class="logo"><i></i>LearningMate</div>
  ${[['home', '홈 · 플래너'], ['rec', '기록 · 통계'], ['focus', '집중하기'], ['study', '스터디방'], ['my', '마이 · 보상']].map(([k, l]) => `<div class="it${active === k ? ' on' : ''}${locked && active !== k ? ' dis' : ''}"><i></i>${l}</div>`).join('')}
  <div class="sp"></div>
  ${locked ? '<div class="it" style="font-size:12px;color:#AEB9D3;height:auto;line-height:1.5;padding:10px 12px;background:#141B2D"><span class="lock" style="color:var(--blue2);flex:none"></span>집중 모드: 메뉴 이동 시 확인</div>' : '<div class="row" style="gap:10px;padding:0 6px"><span class="avatar" style="width:32px;height:32px;background:#1F2A44;box-shadow:none"></span><div class="col"><b class="sm">테스트 계정 A</b><span class="xs" style="color:#AEB9D3">1,320P</span></div></div>'}
</aside>`;

const pcHome = () => `${side('home')}
<div class="main">
  <div class="row between"><div class="col" style="gap:2px"><span class="sm muted">11월 24일 화요일</span><b style="font-size:24px;letter-spacing:-.5px">오늘도 계획대로 가볼까요?</b></div>
    <div class="row" style="gap:10px"${mk(6)}><span class="chip s">P 1,320</span><div class="btn" style="height:44px;padding:0 20px;font-size:15px">▶ 바로 집중 시작</div></div></div>
  <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:14px"${mk(1)}>
    <div class="card navy" style="padding:16px 18px"><span class="xs" style="color:var(--sky);font-weight:700">시험 D-Day</span><div class="row" style="gap:12px;align-items:flex-end;margin-top:8px"><b style="font-size:34px;line-height:1;letter-spacing:-1px">D-12</b><div class="col"><b>정보처리기사 필기</b><span class="xs" style="color:var(--sky)">2026.12.06 (일)</span></div></div></div>
    <div class="card" style="padding:16px 18px"><span class="xs muted" style="font-weight:700">다음 시험</span><div class="row" style="gap:10px;align-items:flex-end;margin-top:8px"><b style="font-size:28px;line-height:1;color:var(--navy)">D-40</b><span class="sm">토익 정기시험</span></div></div>
    <div class="card tint" style="padding:16px 18px"><span class="xs muted" style="font-weight:700">오늘 순공</span><div class="timer" style="font-size:30px;margin-top:8px">2:14:30</div></div>
    <div class="card tint" style="padding:16px 18px"><div class="row between"><span class="xs muted" style="font-weight:700">계획 달성</span><b class="blue">2 / 5</b></div><div class="slider" style="margin-top:22px;height:8px"><i style="width:40%"></i></div></div>
  </div>
  <div style="display:grid;grid-template-columns:1.45fr 1fr;gap:16px;flex:1;min-height:0">
    <div class="card" style="padding:18px 20px;display:flex;flex-direction:column;gap:12px"${mk(2)}>
      <div class="row between"><b style="font-size:17px">플래너</b><div class="row" style="gap:8px"><span class="chip sm">‹ 11월 4주 ›</span><span class="chip sm on">＋ 계획 추가</span></div></div>
      <div class="row between">${[['월', 23], ['화', 24], ['수', 25], ['목', 26], ['금', 27], ['토', 28], ['일', 29]].map(([d, dt], i) => `<div class="col" style="align-items:center;gap:4px;flex:1;padding:8px 0;border-radius:10px;${i === 1 ? 'background:var(--blue);color:#fff' : 'background:var(--tint)'}"><span class="xs" style="${i === 1 ? '' : 'color:var(--muted)'}">${d}</span><b>${dt}</b><span class="xs" style="${i === 1 ? 'color:var(--sky)' : 'color:var(--muted)'}">${['3/3', '2/5', '0/2', '0/3', '', '', ''][i] || '–'}</span></div>`).join('')}</div>
      ${[
        ['07:30–08:10', '영어', '토익 RC 파트5 40문제', '실제 0:38:12', true],
        ['09:00–10:30', '알고리즘', '백준 DP 3문제', '', false, true],
        ['13:00–14:00', '데이터베이스', '정규화 개념 정리', '실제 1:02:40', true],
        ['20:00–22:00', '정보처리기사', '기출 2회분 풀이', '', false],
      ].map(([t, s, g, a, done, now]) => `<div class="row" style="gap:14px;padding:10px 12px;border-radius:12px;${now ? 'background:var(--tint);box-shadow:inset 0 0 0 1.5px var(--blue2)' : 'box-shadow:inset 0 0 0 1.5px var(--line)'};${done ? 'opacity:.6' : ''}"><span class="sm muted" style="width:92px;font-weight:700">${t}</span><span class="chip sm ${done ? '' : 's'}">${s}</span><b class="sm" style="flex:1;${done ? 'text-decoration:line-through' : ''}">${g}</b>${a ? `<span class="xs blue" style="font-weight:800">${a}</span>` : ''}${done ? '<span class="blue" style="font-weight:800">✓</span>' : `<span class="chip sm ${now ? 'on' : ''}"${now ? mk(3) : ''}>▶ 시작</span>`}</div>`).join('')}
    </div>
    <div class="col" style="gap:16px;min-height:0">
      <div class="card" style="padding:16px 18px"${mk(4)}>
        <div class="row between"><b>이번 주 순공</b><span class="sm muted">18:42:10 · 기록 ›</span></div>
        <div class="bars" style="height:120px;margin-top:10px">${[['월', 62], ['화', 88], ['수', 40], ['목', 70], ['금', 55], ['토', 96], ['일', 30]].map(([d, h], i) => `<div class="${i === 1 ? 'now' : ''}"><i style="height:${h}%"></i><small>${d}</small></div>`).join('')}</div>
      </div>
      <div class="card" style="padding:16px 18px;flex:1"${mk(5)}>
        <div class="row between"><b>스터디방</b><span class="sm muted">전체 ›</span></div>
        ${[['SSAFY 알고리즘 스터디', '4명 중 2명 집중'], ['정처기 막판 스퍼트', '3명 중 1명 집중']].map(([n, s], i) => `<div class="row between" style="margin-top:12px;padding:10px 12px;border-radius:12px;box-shadow:inset 0 0 0 1.5px var(--line)"><div class="col"><b class="sm">${n}</b><span class="xs muted">${s}</span></div><span class="chip sm ${i ? '' : 'on'}">입장</span></div>`).join('')}
      </div>
    </div>
  </div>
</div>`;

const pcFocus = () => `${side('focus', true)}
<div class="main">
  <div class="row between">
    <div class="row" style="gap:10px"><span class="chip sm k"${mk(1)}><span class="lock" style="color:#fff;transform:scale(.85)"></span> 집중 모드</span><span class="chip sm s">알고리즘</span><b style="font-size:20px">백준 DP 3문제</b><span class="sm muted">· 계획 09:00–10:30</span></div>
    <div class="row" style="gap:8px"><div class="btn g s">수동 모드로 전환</div><div class="btn k s">■ 세션 종료</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 380px;gap:18px;flex:1;min-height:0">
    <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:22px"${mk(2)}>
      <span class="pill focus"><i></i>재실 · 집중 중</span>
      <div class="ring" style="width:300px;height:300px">${ringSvg(300, 13, 0.94, HEX.blue, HEX.sky)}<div class="in" style="width:274px;height:274px"><span class="sm muted" style="font-weight:700">순공 시간</span><div class="timer" style="font-size:62px">01:24:36</div><span class="sm muted">목표 1:30:00 · 오늘 3:38:12</span></div></div>
      <div class="row" style="gap:36px"><div class="col" style="align-items:center;gap:5px"><span class="rb out">❚❚</span><span class="xs" style="font-weight:700">일시정지</span></div><div class="col" style="align-items:center;gap:5px"><span class="rb k">■</span><span class="xs" style="font-weight:700">종료</span></div></div>
      <div class="col" style="gap:6px;width:100%"${mk(3)}>
        <div class="segbar" style="height:16px"><i class="f" style="flex:32"></i><i class="p" style="flex:12"></i><i class="f" style="flex:28"></i><i class="a" style="flex:3"></i><i class="f" style="flex:24"></i><i style="flex:6;background:var(--tint)"></i></div>
        <div class="row between">${legend()}<span class="xs muted">09:02 시작 → 목표 10:32</span></div>
      </div>
    </div>
    <div class="col" style="gap:14px;min-height:0">
      <div class="card" style="padding:14px"${mk(4)}>
        <div class="ph" style="height:178px;border-radius:12px"><div class="face" style="width:24%"></div><span style="position:absolute;top:10px;left:10px">내 카메라 · AI 감지</span></div>
        <div class="row between" style="margin-top:10px;height:36px"><div class="col"><b class="sm">AI 재실 감지</b><span class="xs muted">얼굴 검출 정상 · 프레임 미전송</span></div><span class="toggle on"></span></div>
        <div class="row between" style="height:36px"><div class="col"><b class="sm row" style="gap:6px"><span class="rec"></span>타임랩스</b><span class="xs muted">10초 간격 · 142컷 · 이 기기 보관</span></div><span class="toggle on"></span></div>
      </div>
      <div class="card tint" style="padding:14px"${mk(5)}>
        <div class="row between"><b class="sm">배경음</b><span class="xs blue" style="font-weight:800">❚❚ 재생 중</span></div>
        <div class="chips" style="margin-top:8px"><span class="chip sm on">빗소리</span><span class="chip sm">카페</span><span class="chip sm">백색소음</span><span class="chip sm">모닥불</span></div>
        <div class="row" style="gap:12px;margin-top:12px"><span class="xs muted">볼륨</span><div class="slider"><i style="width:60%"></i></div><span class="xs muted">60</span></div>
      </div>
      <div class="card" style="padding:14px;flex:1"${mk(6)}>
        <b class="sm">오늘 남은 계획</b>
        ${[['13:00', '데이터베이스 · 정규화 개념 정리'], ['20:00', '정보처리기사 · 기출 2회분']].map(([t, g]) => `<div class="row sm" style="gap:10px;margin-top:10px"><span class="muted" style="font-weight:700">${t}</span><span style="flex:1">${g}</span><span class="xs muted">대기</span></div>`).join('')}
      </div>
    </div>
  </div>
</div>`;

const pcTile = ({ name, st, time, cam, me, off, empty }) => empty
  ? `<div style="border-radius:14px;border:1.5px dashed var(--line);display:grid;place-items:center;color:var(--muted)" class="sm"><div class="col" style="align-items:center;gap:6px"><span style="font-size:22px;color:var(--blue2)">＋</span>초대 대기 중</div></div>`
  : `<div style="position:relative;border-radius:14px;overflow:hidden;${off ? 'opacity:.5;' : ''}${me ? 'box-shadow:0 0 0 3px var(--blue)' : ''}">
    ${cam ? `<div class="ph dark" style="position:absolute;inset:0;border-radius:0"><div class="face" style="width:26%"></div></div>` : `<div style="position:absolute;inset:0;background:var(--tint);display:grid;place-items:center;box-shadow:inset 0 0 0 1.5px var(--line);border-radius:14px"><span class="avatar" style="width:72px;height:72px"></span></div>`}
    <div style="position:absolute;left:10px;bottom:10px;background:#fff;border-radius:10px;padding:7px 11px" class="row"><span class="dot d-${st}"></span><b class="sm" style="margin-left:6px">${name}</b><span class="xs muted" style="margin-left:10px">${time}</span></div>
    ${cam ? '<span class="chip sm k" style="position:absolute;right:10px;top:10px">캠 공유</span>' : ''}
  </div>`;

const pcStudy = () => `${side('study')}
<div class="main">
  <div class="row between">
    <div class="row" style="gap:12px"><b style="font-size:22px">SSAFY 알고리즘 스터디</b><span class="chip sm"${mk(1)}>코드 A7K2Q9 · 복사</span></div>
    <div class="row" style="gap:14px"><span class="row sm" style="gap:5px"><span class="dot d-f"></span>집중 2</span><span class="row sm" style="gap:5px"><span class="dot d-p"></span>휴식 1</span><span class="row sm" style="gap:5px"><span class="dot d-o"></span>오프라인 1</span><div class="btn g s">방 나가기</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 340px;gap:18px;flex:1;min-height:0">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;gap:12px"${mk(2)}>
      ${pcTile({ name: '나', st: 'f', time: '집중 00:52:18', cam: true, me: true })}
      ${pcTile({ name: '민수', st: 'f', time: '집중 02:05:11', cam: true })}
      ${pcTile({ name: '지현', st: 'p', time: '휴식 중 · 05:12' })}
      ${pcTile({ name: '도윤', st: 'o', time: '오프라인 · 3분 전', off: true })}
      ${pcTile({ empty: true })}
      ${pcTile({ empty: true })}
    </div>
    <div class="col" style="gap:14px;min-height:0">
      <div class="card" style="padding:16px"${mk(3)}>
        <div class="row between"><span class="chip sm s">알고리즘</span><span class="pill focus" style="height:26px;padding:0 10px;font-size:12px"><i style="width:7px;height:7px"></i>재실</span></div>
        <div class="timer" style="font-size:42px;margin-top:12px">00:52:18</div>
        <div class="row" style="gap:8px;margin-top:14px"><div class="btn o s" style="flex:1">❚❚ 일시정지</div><div class="btn k s" style="flex:1">■ 종료</div></div>
      </div>
      <div class="card" style="padding:4px 16px"${mk(4)}>
        <div class="row between" style="height:52px"><div class="col"><b class="sm">내 카메라 공유</b><span class="xs muted">방 참여자에게만 · 끄면 즉시 중단</span></div><span class="toggle on"></span></div>
        <div class="divider"></div>
        <div class="row between" style="height:52px"><div class="col"><b class="sm">AI 재실 감지</b><span class="xs muted">공유와 별도로 제어</span></div><span class="toggle on"></span></div>
      </div>
      <div class="card" style="padding:16px;flex:1"${mk(5)}>
        <b class="sm">멤버 현황</b>
        ${[['f', '나', '집중 · 00:52'], ['f', '민수', '집중 · 02:05'], ['p', '지현', '휴식 · 05:12'], ['o', '도윤', '오프라인']].map(([s, n, t]) => `<div class="row sm" style="gap:10px;margin-top:11px"><span class="avatar" style="width:28px;height:28px"></span><b style="flex:1">${n}</b><span class="dot d-${s}"></span><span class="xs muted" style="width:80px">${t}</span></div>`).join('')}
      </div>
    </div>
  </div>
</div>`;

/* ------------------------------------------------------------------ */
/* Screen registry                                                     */
/* ------------------------------------------------------------------ */
const mobile = [
  {
    id: '01', file: '01_로그인', title: '로그인 · 세션 복구', feats: ['공통 기반', 'M01'], body: S.login,
    notes: [
      { t: '계정 진입', d: '이메일 로그인을 기본안으로 두고, 진입 방식(소셜·학번 등)은 팀에서 확정해요.', f: '공통' },
      { t: '테스트 계정 2개', d: '개발·데모용 빠른 로그인. 그룹 학습(캠스터디) 시연은 두 계정으로 진행해요.', f: '공통' },
      { t: '진행 중 세션 복구', d: '로그인·새로고침 후 종료되지 않은 세션이 있으면 안내하고 집중 화면으로 이어서 측정해요.', f: 'M01' },
    ],
  },
  {
    id: '02', file: '02_홈_플래너', title: '홈 · 오늘의 플래너', feats: ['M06', 'M07', 'M01'], body: S.home,
    notes: [
      { t: '시험 D-Day 카드', d: '등록한 시험을 좌우로 넘겨 봐요. 사용자 시간대 기준으로 전날 D-1, 당일 D-Day, 다음 날 D+1.', f: 'M07' },
      { t: '주간 날짜 스트립', d: '날짜를 눌러 날짜별 계획으로 이동. 점은 계획이 있는 날.', f: 'M06' },
      { t: '오늘 요약', d: '오늘 순공 합계와 계획 달성률을 한눈에.', f: 'M02 M06' },
      { t: '계획에서 바로 시작', d: '▶ 를 누르면 과목·목표가 채워진 학습 시작 화면으로 이동하고, 세션이 계획과 연결돼요.', f: 'M06 M01' },
      { t: '완료된 계획', d: '종료된 세션과 연결된 계획은 완료 처리되고 실제 집중 시간이 함께 표시돼요.', f: 'M06' },
      { t: '하단 탭', d: '홈 · 기록 · 집중 · 스터디 · 마이. 가운데 집중 버튼은 계획 없이 바로 시작.', f: '공통' },
    ],
  },
  {
    id: '03', file: '03_계획추가', title: '계획 추가 · 시험 등록 (바텀시트)', feats: ['M06', 'M03', 'M07'], body: S.plan,
    notes: [
      { t: '계획 / 시험 D-Day 탭', d: '같은 시트에서 공부 계획 또는 시험(이름·날짜) 등록으로 전환해요.', f: 'M06 M07' },
      { t: '날짜 · 시간', d: '계획 시각과 날짜를 저장. 사용자 시간대 기준으로 저장·표시.', f: 'M06' },
      { t: '과목 1개 (필수)', d: '사용자별 과목 목록에서 선택하거나 즉시 새 과목을 만들어요.', f: 'M03' },
      { t: '목표 · 태그 (선택)', d: '기록 화면에서 같은 값으로 필터링할 수 있게 저장해요.', f: 'M03' },
      { t: '저장', d: '저장하면 홈 목록에 반영. 카드에서 수정·삭제·완료 처리.', f: 'M06' },
    ],
  },
  {
    id: '04', file: '04_학습시작설정', title: '학습 시작 설정', feats: ['M01', 'M03', 'M05', 'M10', 'M11'], body: S.setup,
    notes: [
      { t: '연결된 계획', d: '플래너에서 진입하면 계획이 연결되고 과목·목표가 자동으로 채워져요.', f: 'M06' },
      { t: '과목 · 목표 · 태그', d: '세션에 과목 1개와 선택적 목표·태그를 붙여요.', f: 'M03' },
      { t: '측정 방식', d: 'AI 카메라 감지 / 수동 중 선택. AI 선택 시에만 카메라 권한을 요청해요.', f: 'M05' },
      { t: '카메라 미리보기', d: '얼굴 위치를 맞추는 가이드. 프레임은 브라우저 안에서만 처리하고 저장하지 않아요.', f: 'M05' },
      { t: '집중 보조 토글', d: '배경음과 타임랩스는 각각 따로 켜고 꺼요. 타임랩스는 켠 세션에만 생성.', f: 'M10 M11' },
      { t: '집중 시작', d: '세션 ID를 만들고 시작 이벤트를 저장한 뒤 집중 화면으로 이동해요.', f: 'M01' },
    ],
  },
  {
    id: '05', file: '05_집중세션', title: '집중 세션 (AI 감지 모드)', feats: ['M01', 'M05', 'M09', 'M10', 'M11'], body: S.focus,
    notes: [
      { t: '집중 모드', d: '하단 탭을 숨겨 서비스 내 이동을 줄여요. ✕ 나 다른 메뉴로 이동하면 확인을 받아요.', f: 'M09' },
      { t: '현재 판정 배지', d: '재실 · 자리 이탈 · 판정 불가 · 수동 상태를 실시간 표시.', f: 'M05' },
      { t: '순공 타이머', d: '재실·수동 집중 구간만 합산. 새로고침해도 진행 중 세션을 복구해요.', f: 'M01' },
      { t: '카메라 상태', d: '썸네일과 감지 상태, 카메라 켜기/끄기. 끄면 수동 모드로 이어가요.', f: 'M05' },
      { t: '타임랩스 캡처', d: '켠 세션에서만 일정 간격으로 캡처하고 컷 수를 보여줘요.', f: 'M11' },
      { t: '구간 미니 타임라인', d: '집중·일시정지·이탈·판정 불가를 색으로 구분해 지금까지의 흐름을 표시.', f: 'M02' },
      { t: '일시정지 · 종료', d: '시작/정지/재개/종료 이벤트를 저장하고, 종료 시 서버가 집중 시간을 확정해요.', f: 'M01' },
      { t: '배경음', d: '음원 선택·재생·볼륨. 바꾸면 이전 소리를 멈추고, 종료·이탈 시 재생을 멈춰요.', f: 'M10' },
    ],
    extra: `<span class="lbl">구간 색 규칙 (전 화면 공통)</span>${legend()}`,
  },
  {
    id: '06', file: '06_이탈_판정불가', title: '자리 이탈 · 판정 불가 피드백', feats: ['M05', 'M01'], body: S.away,
    notes: [
      { t: '이탈 안내 배너', d: '감지 임계시간(예: 30초)을 넘기면 이탈로 확정하고 이탈 구간을 한 번 기록해요.', f: 'M05' },
      { t: '이탈 배지 · 경과', d: '검정 배지로 상태 전환을 즉시 표시하고 이탈 경과 시간을 보여줘요.', f: 'M05' },
      { t: '집중 시간 멈춤', d: '이탈 구간은 순공에 합산하지 않아요. 복귀하면 자동으로 재개돼요.', f: 'M01' },
      { t: '감지 근거', d: '얼굴 미검출 시간과 임계값을 보여줘 오탐 여부를 사용자가 이해하도록.', f: 'M05' },
      { t: '이탈 구간 반영', d: '미니 타임라인에 검정 구간으로 추가돼요.', f: 'M02' },
    ],
    extra: `<span class="lbl">상태 배지</span>
      <div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill focus" style="height:30px;font-size:12px"><i></i>재실</span><span class="pill away" style="height:30px;font-size:12px"><i></i>자리 이탈</span><span class="pill unk" style="height:30px;font-size:12px"><i></i>판정 불가</span><span class="pill man" style="height:30px;font-size:12px"><i></i>수동</span></div>
      <span class="lbl" style="margin-top:4px">판정 불가 · 권한 거부 시트</span>
      <div class="card" style="padding:14px;box-shadow:0 8px 20px -12px rgba(10,42,107,.4)">
        <b class="sm">카메라로 판단하기 어려워요</b>
        <div class="xs muted" style="margin-top:3px;line-height:1.5">조명이 어둡거나 카메라가 가려졌어요. (권한 거부·연결 끊김도 같은 시트)</div>
        <div class="row" style="gap:8px;margin-top:10px"><div class="btn s" style="flex:1">수동 모드로 계속</div><div class="btn g s" style="flex:1">다시 시도</div></div>
      </div>`,
  },
  {
    id: '07', file: '07_탭복귀안내', title: '탭 이탈 후 복귀 안내', feats: ['M09', 'M01'], body: S.tabback,
    notes: [
      { t: '복귀 안내 모달', d: '다른 탭으로 갔다가 돌아오면 머문 시간과 함께 안내해요 (visibilitychange).', f: 'M09' },
      { t: '타이머 · 기록 유지', d: '진행 중인 타이머와 학습 기록은 그대로 유지돼요. 탭 이탈 이벤트만 선택적으로 저장.', f: 'M09 M01' },
      { t: '바로 이어가기', d: '한 번의 탭으로 집중 화면으로 복귀. 필요하면 일시정지 선택.', f: 'M09' },
    ],
    extra: `<span class="lbl">메뉴 이동 확인 다이얼로그</span>
      <div class="card" style="padding:16px;box-shadow:0 8px 20px -12px rgba(10,42,107,.4)">
        <b class="sm">집중 중이에요. 이동할까요?</b>
        <div class="xs muted" style="margin-top:3px;line-height:1.5">이동하면 세션이 일시정지돼요. 개인 앱 목록은 수집하지 않아요.</div>
        <div class="row" style="gap:8px;margin-top:10px"><div class="btn s" style="flex:1">계속 집중</div><div class="btn g s" style="flex:1">일시정지 후 이동</div></div>
      </div>`,
  },
  {
    id: '08', file: '08_세션종료', title: '세션 종료 · 결과', feats: ['M01', 'M02', 'M11', 'M12', 'M06'], body: S.result,
    notes: [
      { t: '확정된 순공 시간', d: '서버가 이벤트 순서·중복을 확인해 최종 시간을 확정. 저장 실패 시 같은 세션 ID로 재시도.', f: 'M01' },
      { t: '구간 요약', d: '집중·일시정지·이탈·판정 불가 구간을 한 줄로 보여줘요.', f: 'M02 M05' },
      { t: '세션 보상', d: '정상 종료 + 최소 집중 시간 충족 시 1회 지급. 미달이면 사유를 표시해요.', f: 'M12' },
      { t: '타임랩스', d: '켠 세션만 생성. 재생·다운로드·삭제, 영상은 이 브라우저에만 보관.', f: 'M11' },
      { t: '계획 연결', d: '계획에서 시작한 세션이면 계획 완료 처리와 실제 집중 시간을 함께 저장해요.', f: 'M06' },
    ],
  },
  {
    id: '09', file: '09_기록통계', title: '기록 · 통계', feats: ['M02', 'M03'], body: S.stats,
    notes: [
      { t: '일간 / 주간', d: '사용자 시간대 자정 기준으로 나눠 집계. 날짜가 바뀐 세션은 분할 반영.', f: 'M02' },
      { t: '과목 · 태그 · 목표 필터', d: '과목을 고르면 해당 과목 기록만 조회돼요.', f: 'M03' },
      { t: '기간 합계', d: '같은 조건의 세션 상세 합계와 항상 일치해야 해요.', f: 'M02' },
      { t: '요일별 막대', d: '오늘은 진한 남색으로 강조.', f: 'M02' },
      { t: '과목별 비율', d: '과목별 순공 시간과 비율.', f: 'M02 M03' },
      { t: '세션 목록', d: '구간 미니 바와 순공 시간. 눌러서 세션 상세로 이동.', f: 'M02' },
    ],
    extra: `<span class="lbl">빈 상태</span>
      <div class="card tint col" style="align-items:center;gap:8px;padding:16px">
        <div class="ph" style="width:64px;height:64px;border-radius:50%"></div>
        <b class="sm">아직 기록이 없어요</b>
        <div class="btn s" style="width:160px">첫 집중 시작하기</div>
      </div>`,
  },
  {
    id: '10', file: '10_세션상세', title: '세션 상세', feats: ['M02', 'M05', 'M12'], body: S.detail,
    notes: [
      { t: '세션 정보', d: '날짜·시각, 과목·목표·태그, 측정 방식을 표시.', f: 'M02 M03' },
      { t: '상태별 합계', d: '순공 / 일시정지 / 자리 이탈 / 판정 불가 시간과 횟수.', f: 'M02 M05' },
      { t: '구간 타임라인', d: '상태 이벤트를 시각·원인과 함께 순서대로. 본인 기록만 조회.', f: 'M02 M05' },
      { t: '계획 · 보상 연결', d: '연결된 계획과 보상 지급 결과(세션 ID 기준 1회).', f: 'M06 M12' },
    ],
  },
  {
    id: '11', file: '11_스터디방입장', title: '스터디방 · 입장', feats: ['M08'], body: S.studyJoin,
    notes: [
      { t: '초대 코드로 참여', d: '6자리 코드를 입력하면 서버가 방 멤버십을 확인하고 입장시켜요.', f: 'M08' },
      { t: '새 스터디방 만들기', d: '방 이름·최대 인원 설정 후 초대 코드를 공유(복사). 소규모 방 기준.', f: 'M08' },
      { t: '내 스터디방', d: '참여 중인 방과 실시간 집중 인원. 방 밖 계정은 접근할 수 없어요.', f: 'M08' },
      { t: '그룹 상태 규칙', d: '집중 · 휴식 · 종료 · 오프라인. 접속이 끊기면 일정 시간 뒤 오프라인.', f: 'M08' },
    ],
  },
  {
    id: '12', file: '12_스터디방_캠스터디', title: '스터디방 · 캠스터디', feats: ['M08', 'M01', 'M05'], body: S.studyRoom,
    notes: [
      { t: '방 현황', d: 'WebSocket으로 그룹원 상태 이벤트를 실시간 반영.', f: 'M08' },
      { t: '멤버 타일', d: '캠 공유에 동의한 사람만 영상(WebRTC). 영상이 실패해도 상태 타일은 유지.', f: 'M08' },
      { t: '내 타이머', d: '각자 타이머를 시작하고, 기록은 개인 세션으로 저장돼요.', f: 'M01' },
      { t: '공유 · 감지 분리', d: '그룹 카메라 공유와 개인 AI 감지는 별도 스위치로 제어.', f: 'M08 M05' },
      { t: '방 나가기', d: '나가거나 카메라를 끄면 영상 전송을 바로 종료. 나간 뒤에도 개인 기록 확인 가능.', f: 'M08' },
    ],
  },
  {
    id: '13', file: '13_마이_보상', title: '마이 · 보상과 수집', feats: ['M12', 'M03', 'M07'], body: S.my,
    notes: [
      { t: '보유 포인트', d: '세션 보상으로 쌓인 잔액과 이번 주 획득량.', f: 'M12' },
      { t: '수집', d: '포인트·조건으로 모으는 항목. 최초 수집 화면의 표시 범위는 팀 결정 항목.', f: 'M12' },
      { t: '지급 내역', d: '세션별 지급 결과. 조건 미달 세션은 사유와 함께 미지급으로 표시.', f: 'M12' },
      { t: '관리 메뉴', d: '과목·태그 관리, 시험 D-Day 관리, 시간대 설정.', f: 'M03 M07' },
    ],
  },
];

const pcs = [
  {
    id: 'PC01', file: 'PC01_홈대시보드', title: 'PC 웹 · 홈 대시보드', feats: ['M06', 'M07', 'M02', 'M08'], url: 'learningmate.app/home', body: pcHome,
    notes: [
      { t: 'D-Day · 오늘 요약', d: '시험 D-Day 2개, 오늘 순공, 계획 달성률을 상단 카드로.', f: 'M07 M02' },
      { t: '주간 플래너', d: '요일별 달성 현황과 선택한 날짜의 계획 목록.', f: 'M06' },
      { t: '계획에서 시작', d: '현재 시간대 계획을 강조하고 ▶ 시작으로 바로 연결.', f: 'M06 M01' },
      { t: '주간 순공', d: '요일별 막대. 누르면 기록·통계로 이동.', f: 'M02' },
      { t: '스터디방 바로가기', d: '참여 중인 방의 실시간 집중 인원과 입장 버튼.', f: 'M08' },
      { t: '바로 집중 시작', d: '계획 없이 시작하는 전역 CTA와 포인트 잔액.', f: 'M01 M12' },
    ],
  },
  {
    id: 'PC02', file: 'PC02_집중세션', title: 'PC 웹 · 집중 세션', feats: ['M01', 'M05', 'M09', 'M10', 'M11'], url: 'learningmate.app/focus/2481', body: pcFocus,
    notes: [
      { t: '집중 모드', d: '사이드 메뉴를 흐리게 처리하고, 이동 시 확인 다이얼로그.', f: 'M09' },
      { t: '타이머 · 판정', d: '큰 타이머와 판정 배지, 일시정지·종료 컨트롤.', f: 'M01 M05' },
      { t: '구간 타임라인', d: '시작부터 목표 시각까지의 구간 흐름과 색 범례.', f: 'M02' },
      { t: '카메라 패널', d: '미리보기, AI 감지와 타임랩스를 각각 토글.', f: 'M05 M11' },
      { t: '배경음', d: '음원·재생·볼륨. 전환 시 이전 음원 정지.', f: 'M10' },
      { t: '남은 계획', d: '오늘 이어서 할 계획 미리보기.', f: 'M06' },
    ],
  },
  {
    id: 'PC03', file: 'PC03_스터디방', title: 'PC 웹 · 스터디방 (캠스터디)', feats: ['M08', 'M01', 'M05'], url: 'learningmate.app/rooms/A7K2Q9', body: pcStudy,
    notes: [
      { t: '초대 코드', d: '코드 복사로 초대. 방 멤버만 접근 가능.', f: 'M08' },
      { t: '멤버 그리드', d: '동의한 영상만 표시, 미공유·실패 시 상태 타일. 빈 자리는 초대 대기.', f: 'M08' },
      { t: '내 타이머', d: '그룹 안에서도 개인 세션으로 측정·기록.', f: 'M01' },
      { t: '공유 · 감지 스위치', d: '카메라 공유와 AI 감지는 분리. 끄면 전송 즉시 종료.', f: 'M08 M05' },
      { t: '멤버 현황', d: '집중·휴식·종료·오프라인 상태와 경과 시간.', f: 'M08' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Page builders                                                       */
/* ------------------------------------------------------------------ */
const MW = 900, MH = 1000;
const mobilePage = (s, phoneOnly = false) => {
  if (phoneOnly) {
    return page(`<div class="phone" style="left:6px;top:6px"><div class="scr">${s.body()}</div></div>`, { w: 402, h: 856, phoneOnly: true });
  }
  return page(`${header(s.id, s.title, s.feats)}
    <div class="phone" style="left:40px;top:118px"><div class="scr">${s.body()}</div></div>
    <div class="notes" style="left:508px;top:122px;width:354px">${notesHtml(s.notes, s.extra)}</div>
    ${foot('Mobile Web · 390 × 844')}`, { w: MW, h: MH });
};

const PW = 1400, PH = 1130;
const pcPage = (s, thumb = false) => {
  const browser = `<div class="browser" style="left:${thumb ? 6 : 60}px;top:${thumb ? 6 : 118}px;width:1280px;height:780px">
      <div class="bchrome"><div class="dots"><i></i><i></i><i></i></div><div class="url"><span class="lock" style="color:var(--muted);transform:scale(.8)"></span>${s.url}</div></div>
      <div class="app">${s.body()}</div></div>`;
  if (thumb) return page(browser, { w: 1292, h: 792, phoneOnly: true });
  return page(`${header(s.id, s.title, s.feats)}${browser}
    <div class="pcnotes notes" style="left:60px;top:934px;width:1280px">${notesHtml(s.notes)}</div>
    ${foot('PC Web · 1280 × 780')}`, { w: PW, h: PH });
};

/* ------------------------------------------------------------------ */
/* Flow board                                                          */
/* ------------------------------------------------------------------ */
const boardPage = () => {
  const TW = 170, TH = Math.round(856 * TW / 402);
  const pos = {
    '01': [60, 250], '02': [330, 250], '04': [600, 250], '05': [870, 250], '08': [1140, 250], '09': [1410, 250], '10': [1680, 250],
    '03': [330, 810], '06': [760, 810], '07': [980, 810], '13': [1260, 810],
    '11': [600, 1370], '12': [870, 1370],
  };
  const short = { '01': '로그인 · 세션 복구', '03': '계획 추가 · 시험 등록', '05': '집중 세션 (AI 감지)', '06': '이탈 · 판정 불가', '07': '탭 복귀 안내', '12': '스터디방 · 캠스터디' };
  const byId = Object.fromEntries(mobile.map((s) => [s.id, s]));
  const thumbs = Object.entries(pos).map(([id, [x, y]]) => `
    <figure style="position:absolute;left:${x}px;top:${y}px;width:${TW}px">
      <img src="${pathToFileURL(path.join(THUMBS, `${id}.png`)).href}" style="width:${TW}px;height:${TH}px;display:block">
      <figcaption style="margin-top:10px;display:flex;gap:6px;align-items:baseline;white-space:nowrap"><b style="color:var(--blue);font-size:13px">${id}</b><b style="font-size:13.5px;letter-spacing:-.2px">${short[id] || byId[id].title}</b></figcaption>
      <div style="display:flex;gap:4px;margin-top:5px;width:240px;flex-wrap:wrap">${byId[id].feats.map((f) => `<span style="font-size:10px;font-weight:800;color:var(--navy);box-shadow:inset 0 0 0 1.2px var(--navy);border-radius:999px;padding:0 6px">${f}</span>`).join('')}</div>
    </figure>`).join('');
  const cx = (id) => pos[id][0] + TW / 2, cy = (id) => pos[id][1] + TH / 2;
  const R = (id) => pos[id][0] + TW, L = (id) => pos[id][0], T = (id) => pos[id][1], B = (id) => pos[id][1] + TH;
  const arrows = [];
  const label = (x, y, t, dark = false) => `<g><rect x="${x - t.length * 6.4 - 10}" y="${y - 13}" width="${t.length * 12.8 + 20}" height="26" rx="13" fill="${dark ? '#0A2A6B' : '#fff'}" stroke="#2563EB" stroke-width="1.5"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${dark ? '#fff' : '#0A2A6B'}">${t}</text></g>`;
  const h = (a, b, t) => { const y = cy(a); arrows.push(`<line x1="${R(a) + 8}" y1="${y}" x2="${L(b) - 10}" y2="${y}" class="ar"/>`); if (t) arrows.push(label((R(a) + L(b)) / 2, y - 40, t)); };
  const vDown = (a, b, x, t, both = false) => { arrows.push(`<line x1="${x}" y1="${B(a) + 84}" x2="${x}" y2="${T(b) - 12}" class="ar"${both ? ' marker-start="url(#ah2)"' : ''}/>`); if (t) arrows.push(label(x, (B(a) + 84 + T(b)) / 2, t)); };
  h('01', '02', '로그인'); h('02', '04', '계획 ▶ 시작'); h('04', '05', '집중 시작'); h('05', '08', '종료'); h('08', '09', '기록 보기'); h('09', '10', '세션 선택');
  const branch = (a, targets) => {
    const y0 = B(a) + 84, J = y0 + 18;
    const xs = targets.map(([id]) => cx(id));
    arrows.push(`<path d="M ${cx(a)} ${y0} L ${cx(a)} ${J}" class="ln"/>`);
    const minx = Math.min(cx(a), ...xs), maxx = Math.max(cx(a), ...xs);
    if (maxx > minx) arrows.push(`<path d="M ${minx} ${J} L ${maxx} ${J}" class="ln"/>`);
    targets.forEach(([id, t]) => {
      arrows.push(`<line x1="${cx(id)}" y1="${J}" x2="${cx(id)}" y2="${T(id) - 12}" class="ar"/>`);
      arrows.push(label(cx(id), (J + T(id)) / 2, t));
    });
  };
  vDown('02', '03', cx('03'), '＋ 계획 추가 ⇄ 저장', true);
  branch('05', [['06', '이탈 · 판정 불가 ⇄ 복귀'], ['07', '탭 이탈 ⇄ 복귀']]);
  branch('08', [['13', '포인트 내역']]);
  // group lane
  const gy = cy('11');
  arrows.push(`<rect x="160" y="${gy - 34}" width="300" height="68" rx="14" fill="#F3F7FF" stroke="#C8D7F0" stroke-width="1.5"/><text x="310" y="${gy - 6}" text-anchor="middle" font-size="14" font-weight="800" fill="#0B0F19">02 홈 · 하단 탭 '스터디'</text><text x="310" y="${gy + 16}" text-anchor="middle" font-size="12" fill="#5A6A88">PC는 사이드 메뉴 · 스터디방</text>`);
  arrows.push(`<line x1="468" y1="${gy}" x2="${L('11') - 10}" y2="${gy}" class="ar"/>`);
  h('11', '12', '초대 코드 입장');
  arrows.push(`<line x1="${R('12') + 8}" y1="${gy}" x2="${1400}" y2="${gy}" class="ar"/>`);
  arrows.push(label((R('12') + 1400) / 2, gy - 40, '방 나가기'));
  arrows.push(`<rect x="1410" y="${gy - 46}" width="440" height="92" rx="14" fill="#0A2A6B"/><text x="1432" y="${gy - 12}" font-size="15" font-weight="800" fill="#fff">09 기록 · 통계에서 개인 세션 확인</text><text x="1432" y="${gy + 14}" font-size="12.5" fill="#DCE8FF">그룹에서 측정한 시간도 개인 세션으로 저장 (M01 · M02)</text>`);
  const svg = `<svg width="1940" height="1880" style="position:absolute;left:0;top:0" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#2563EB"/></marker>
    <marker id="ah2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#2563EB"/></marker></defs>
    <style>.ar{stroke:#2563EB;stroke-width:2.5;marker-end:url(#ah);fill:none}.ln{stroke:#2563EB;stroke-width:2.5;fill:none}text{font-family:'Noto Sans KR','Malgun Gothic',sans-serif}</style>
    ${arrows.join('')}</svg>`;
  const lane = (y, h2, t, s) => `<div style="position:absolute;left:30px;right:30px;top:${y}px;height:${h2}px;border-radius:24px;border:1.5px solid var(--line);background:linear-gradient(#fff,#fff)"></div><div style="position:absolute;left:54px;top:${y + 18}px;display:flex;gap:10px;align-items:baseline"><b style="font-size:18px">${t}</b><span class="sm muted">${s}</span></div>`;
  return page(`
    <div class="hdr" style="left:30px;right:30px"><div><div class="no">LEARNINGMATE WIREFRAME · 00</div><h1>전체 사용자 흐름 · 화면 맵</h1></div>
      <div class="col" style="align-items:flex-end;gap:6px"><div class="row sm" style="gap:8px"><b>레퍼런스 (uibowl.io)</b><span class="chip sm n">열품타 · 통계·리포트(공부 현황)</span><span class="chip sm n">Focustown · 함께 공부 · 보상</span></div><span class="xs muted">색상: 파랑 계열 + 검정 + 흰색 · 모바일 웹 우선, PC 레이아웃은 PC01–PC03</span></div></div>
    ${lane(140, 1130, '개인 학습', '날짜별 계획 → 순공 타이머(카메라 감지 · 배경음 · 타임랩스) → 종료 후 기록 · 통계')}
    ${lane(1295, 545, '그룹 학습', '초대 코드로 스터디방 입장 → 각자 타이머 · 서로의 상태 · 선택적 캠 공유')}
    ${svg}${thumbs}
    <div class="foot" style="left:30px;right:30px"><span>LearningMate · 1차 MVP 와이어프레임 v0.1 · 2026.11.24</span><span>화살표 양방향 = 상태 변화 후 원래 화면으로 복귀</span></div>
  `, { w: 1940, h: 1880 });
};

/* ------------------------------------------------------------------ */
/* Render                                                              */
/* ------------------------------------------------------------------ */
const render = (htmlFile, pngFile, w, h) => {
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${PROFILE}`, '--force-device-scale-factor=2', `--window-size=${w},${h}`,
    '--virtual-time-budget=4000', '--allow-file-access-from-files', `--screenshot=${pngFile}`,
    pathToFileURL(htmlFile).href,
  ], { stdio: 'ignore' });
  console.log('✓', path.relative(OUT, pngFile));
};

const only = process.argv[2];
for (const s of mobile) {
  if (only && !s.id.startsWith(only) && only !== 'thumbs') continue;
  const f = path.join(HTML, `${s.file}.html`);
  fs.writeFileSync(f, mobilePage(s));
  if (only !== 'thumbs') render(f, path.join(OUT, `${s.file}.png`), MW, MH);
  const t = path.join(HTML, `thumb_${s.id}.html`);
  fs.writeFileSync(t, mobilePage(s, true));
  render(t, path.join(THUMBS, `${s.id}.png`), 402, 856);
}
for (const s of pcs) {
  if (only && !s.id.startsWith(only)) continue;
  const f = path.join(HTML, `${s.file}.html`);
  fs.writeFileSync(f, pcPage(s));
  render(f, path.join(OUT, `${s.file}.png`), PW, PH);
}
if (!only || only === '00' || only === 'thumbs') {
  const f = path.join(HTML, '00_전체흐름.html');
  fs.writeFileSync(f, boardPage());
  render(f, path.join(OUT, '00_전체흐름.png'), 1940, 1880);
}
