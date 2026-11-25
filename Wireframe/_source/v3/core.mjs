// LearningMate 와이어프레임 v0.3 — 공통 스타일·아이콘·헬퍼
// 색: 무협 팔레트 — 먹(Ink) · 한지(Paper) · 인주(Cinnabar) · 청록(Jade) · 금(Gold). Figma(html_to_figma) 호환을 위해 conic/inset/다중 그라디언트/SVG marker를 쓰지 않는다.

export const HEX = { black: '#1C1814', navy: '#23403A', blue: '#A8322A', blue2: '#C9A15B', sky: '#EFE2CB', tint: '#F8F2E7', line: '#DED0B8', muted: '#6B5E4E', white: '#FFFFFF' };

export const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
:root{--black:#1C1814;--ink:#2E2822;--navy:#23403A;--blue:#A8322A;--blue2:#C9A15B;--sky:#EFE2CB;--tint:#F8F2E7;--bg:#F2EBDD;--line:#DED0B8;--line2:#EBE2D2;--muted:#6B5E4E;--muted2:#A39580}
html,body{background:#fff}
body{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;color:var(--black);font-size:14px;-webkit-font-smoothing:antialiased}
b,strong{font-weight:700}
.canvas{position:relative;background:#fff;overflow:hidden}
.row{display:flex;align-items:center;gap:8px}.col{display:flex;flex-direction:column}.between{justify-content:space-between}.grow{flex:1}.wrap{flex-wrap:wrap}
.muted{color:var(--muted)}.muted2{color:var(--muted2)}.blue{color:var(--blue)}.navy{color:var(--navy)}.white{color:#fff}
.xs{font-size:11px}.sm{font-size:12px}.md{font-size:13px}.lg{font-size:16px}.xl{font-size:18px}
.w7{font-weight:700}.w8{font-weight:800}
.num{font-variant-numeric:tabular-nums}

/* page header (canvas) */
.hdr{position:absolute;left:40px;right:40px;top:26px;display:flex;align-items:flex-end;justify-content:space-between;border-bottom:2px solid var(--black);padding-bottom:14px}
.hdr .no{font-size:12px;font-weight:800;letter-spacing:.14em;color:var(--blue)}
.hdr h1{font-size:25px;font-weight:800;letter-spacing:-.5px;margin-top:4px}
.hdr .meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:760px}
.hdr .meta .route{font-size:12px;color:var(--muted);margin-right:8px;font-weight:700}
.hdr .meta span.f{border:1.5px solid var(--navy);color:var(--navy);font-weight:800;font-size:12px;padding:3px 9px;border-radius:999px}
.foot{position:absolute;left:40px;right:40px;bottom:18px;display:flex;justify-content:space-between;font-size:11px;color:var(--muted)}

/* notes */
.notes{position:absolute;display:flex;flex-direction:column;gap:15px}
.note{display:flex;gap:12px;align-items:flex-start}
.note .n{flex:none;width:24px;height:24px;border-radius:50%;background:var(--blue);color:#fff;font-size:12.5px;font-weight:800;display:grid;place-items:center;margin-top:1px}
.note h4{font-size:15px;font-weight:800;letter-spacing:-.2px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.note h4 em{font-style:normal;font-size:10.5px;font-weight:800;color:var(--navy);border:1.2px solid var(--navy);border-radius:999px;padding:0 7px;line-height:16px}
.note p{font-size:13px;line-height:1.55;color:var(--muted);margin-top:3px}
.extra{border-top:1.5px solid var(--line);padding-top:14px;display:flex;flex-direction:column;gap:10px}
.lbl{font-size:12px;font-weight:700;color:var(--muted)}

/* annotation markers — 요소 안에 붙여서 Figma에서도 함께 움직인다 */
.hl{position:absolute;left:-5px;top:-5px;right:-5px;bottom:-5px;border:1.5px dashed var(--blue);border-radius:12px;pointer-events:none;z-index:40}
.mk{position:absolute;left:-18px;top:-18px;width:24px;height:24px;border-radius:50%;background:var(--blue);color:#fff;font-size:12px;font-weight:800;display:grid;place-items:center;z-index:41;border:2.5px solid #fff;font-style:normal;line-height:1}
.clean .hl,.clean .mk{display:none!important}

/* browser (PC) */
.browser{position:absolute;width:1440px;height:944px;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 0 0 2px var(--black),0 30px 60px -30px rgba(40,30,20,.35);display:flex;flex-direction:column}
.bbar{height:44px;flex:none;background:#EFE7D9;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:14px;padding:0 16px}
.bdots{display:flex;gap:7px}.bdots i{width:12px;height:12px;border-radius:50%;background:#D6C8B0;display:block}
.burl{flex:1;max-width:620px;height:28px;border-radius:8px;background:#fff;border:1px solid var(--line);display:flex;align-items:center;gap:8px;padding:0 12px;font-size:12.5px;color:var(--muted)}
.burl b{color:var(--black);font-weight:500}
.app{flex:1;display:flex;min-height:0;position:relative}
.side{width:232px;flex:none;background:var(--black);color:#fff;display:flex;flex-direction:column;padding:20px 14px 14px}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:17px;padding:0 8px;margin-bottom:22px;letter-spacing:-.3px}
.logo i{width:30px;height:30px;border-radius:4px;background:var(--blue);display:grid;place-items:center;color:#F8F2E7;font-style:normal;font-size:16px;font-weight:900;font-family:'Noto Serif KR',serif;box-shadow:0 0 0 2px var(--blue),inset 0 0 0 1.5px #F8F2E7}
/* 무협 타이포: 제목·숫자는 명조(Noto Serif KR), 본문은 고딕 */
.serif,.hdr h1,.top h1,.ch h3,.panel h2,.timer,.kpi .k-v,.logo,.note h4{font-family:'Noto Serif KR','Batang',serif}
.seal{display:inline-grid;place-items:center;border-radius:4px;background:var(--blue);color:#F8F2E7;font-family:'Noto Serif KR',serif;font-weight:900;line-height:1}
.realm{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:4px;border:1.5px solid var(--blue);color:var(--blue);font-family:'Noto Serif KR',serif;font-weight:900;font-size:13px;white-space:nowrap}
.realm.fill{background:var(--blue);color:#F8F2E7}
.gauge{height:10px;border-radius:5px;background:var(--line2);position:relative;overflow:hidden}
.gauge i{position:absolute;left:0;top:0;bottom:0;background:var(--blue);border-radius:5px;display:block}
.gauge.gold i{background:var(--blue2)}
/* 폐관 수련 (몰입 화면) */
.scene{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden}
.scene>svg{position:absolute;left:0;top:0;width:100%;height:100%}
.glass{background:rgba(248,242,231,.72);border:1px solid rgba(255,255,255,.7);box-shadow:0 10px 30px -14px rgba(40,30,20,.45)}
.glass.dark{background:rgba(28,24,20,.55);border-color:rgba(255,255,255,.14);color:#F8F2E7}
.fab{width:48px;height:48px;border-radius:50%;display:grid;place-items:center}
.ink{color:var(--black)}
.nav{display:flex;flex-direction:column;gap:3px}
.nav .it{height:42px;border-radius:10px;display:flex;align-items:center;gap:12px;padding:0 12px;color:#BFB3A0;font-size:14px}
.nav .it.on{background:var(--navy);color:#fff;font-weight:700}
.nav .it.dis{opacity:.38}
.nav .it .cnt{margin-left:auto;font-size:11px;background:#2E2822;color:#BFB3A0;border-radius:999px;padding:1px 8px}
.nav .sec{font-size:11px;color:#857865;font-weight:700;padding:16px 12px 6px;letter-spacing:.06em}
.side .fill{flex:1}
.livecard{margin:10px 2px 12px;background:#26201A;border:1px solid #3A3128;border-radius:12px;padding:12px}
.me{display:flex;align-items:center;gap:10px;padding:12px 8px 2px;border-top:1px solid #2E2822}
.main{flex:1;display:flex;flex-direction:column;min-width:0;background:var(--bg);position:relative}
.top{height:68px;flex:none;background:#fff;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 32px;gap:16px}
.crumbs{font-size:12px;color:var(--muted);display:flex;gap:6px;align-items:center}
.top h1{font-size:21px;font-weight:800;letter-spacing:-.4px;margin-top:1px}
.content{flex:1;padding:22px 32px 24px;display:flex;flex-direction:column;gap:18px;min-height:0;overflow:hidden}
.iconbtn{width:38px;height:38px;border-radius:10px;border:1px solid var(--line);background:#fff;display:grid;place-items:center;position:relative}
.iconbtn .badge{position:absolute;right:7px;top:7px;width:7px;height:7px;border-radius:50%;background:var(--blue);border:1.5px solid #fff}

/* card */
.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px 20px;position:relative}
.card.tint{background:var(--tint)}
.card.navy{background:var(--navy);border-color:var(--navy);color:#fff}
.card.black{background:var(--black);border-color:var(--black);color:#fff}
.card.flat{padding:0}
.ch{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:10px}
.ch h3{font-size:15px;font-weight:800;letter-spacing:-.2px;display:flex;align-items:center;gap:8px}
.ch .sub{font-size:12px;color:var(--muted);font-weight:500}
.link{font-size:12.5px;color:var(--blue);font-weight:700;display:inline-flex;align-items:center;gap:2px}
.divider{height:1px;background:var(--line2)}
.vdiv{width:1px;align-self:stretch;background:var(--line2)}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:40px;padding:0 16px;border-radius:10px;font-weight:700;font-size:14px;background:var(--blue);color:#fff;white-space:nowrap;border:1px solid var(--blue)}
.btn.sm{height:32px;padding:0 12px;font-size:12.5px;border-radius:8px}
.btn.lg{height:48px;padding:0 22px;font-size:15px;border-radius:12px}
.btn.o{background:#fff;color:var(--blue);border-color:var(--blue)}
.btn.g{background:#fff;color:var(--black);border-color:var(--line)}
.btn.k{background:var(--black);border-color:var(--black)}
.btn.t{background:transparent;border-color:transparent;color:var(--blue);padding:0 6px}
.btn.dis{background:var(--line2);border-color:var(--line2);color:var(--muted2)}
.btn.full{width:100%}
.kbd{font-size:10.5px;font-weight:700;color:var(--muted);border:1px solid var(--line);border-radius:5px;padding:0 5px;line-height:16px;background:#fff}

/* chips & tags & badges */
.chip{display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 12px;border-radius:999px;border:1px solid var(--line);font-size:13px;white-space:nowrap;background:#fff;color:var(--black)}
.chip.sm{height:24px;padding:0 9px;font-size:11.5px}
.chip.on{background:var(--blue);color:#fff;border-color:var(--blue);font-weight:700}
.chip.k{background:var(--black);color:#fff;border-color:var(--black);font-weight:700}
.chip.n{background:var(--navy);color:#fff;border-color:var(--navy);font-weight:700}
.chip.s{background:var(--sky);border-color:var(--sky);color:var(--navy);font-weight:700}
.chip.dash{border:1px dashed var(--blue2);color:var(--blue)}
.subj{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border-radius:7px;font-size:12px;font-weight:700;white-space:nowrap}
.subj i{width:8px;height:8px;border-radius:2px;display:block}
.s-algo{background:#F6E2DA;color:var(--blue)}.s-algo i{background:var(--blue)}
.s-eng{background:#F6EEDD;color:var(--navy)}.s-eng i{background:var(--blue2)}
.s-db{background:#E1EBE7;color:var(--navy)}.s-db i{background:var(--navy)}
.s-exam{background:#ECE8E1;color:var(--black)}.s-exam i{background:var(--black)}
.tag{font-size:12px;color:var(--muted)}
.badge{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 8px;border-radius:6px;font-size:11.5px;font-weight:700;white-space:nowrap}
.b-done{background:var(--sky);color:var(--navy)}
.b-now{background:var(--blue);color:#fff}
.b-todo{background:#fff;color:var(--muted);border:1px solid var(--line)}
.b-k{background:var(--black);color:#fff}
.b-line{background:#fff;color:var(--navy);border:1px solid var(--navy)}

/* status pills */
.pill{display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 15px;border-radius:999px;font-weight:800;font-size:13.5px;white-space:nowrap}
.pill i{width:9px;height:9px;border-radius:50%;background:currentColor;display:block}
.pill.sm{height:26px;padding:0 10px;font-size:12px;gap:6px}.pill.sm i{width:7px;height:7px}
.st-focus{background:var(--sky);color:var(--blue)}
.st-away{background:var(--black);color:#fff}
.st-unk{background:#F4EBDB;color:var(--navy);border:1.5px dashed var(--blue2)}
.st-man{background:#fff;color:var(--black);border:1.5px solid var(--black)}
.st-pause{background:#fff;color:var(--navy);border:1.5px solid var(--navy)}
.st-rest{background:#F6EEDD;color:var(--muted)}
.st-off{background:#fff;color:var(--muted2);border:1.5px solid var(--line)}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block;flex:none}
.d-f{background:var(--blue)}.d-p{background:var(--sky);border:1.5px solid var(--blue2)}.d-a{background:var(--black)}.d-o{background:#fff;border:1.5px solid var(--muted2)}

/* form */
.field{display:flex;flex-direction:column;gap:6px}
.input{height:40px;border:1px solid var(--line);border-radius:10px;padding:0 12px;display:flex;align-items:center;gap:8px;background:#fff;font-size:14px;color:var(--black)}
.input.hint{color:var(--muted2)}
.input.focus{border:1.5px solid var(--blue);box-shadow:0 0 0 3px rgba(168,50,42,.14)}
.input.err{border:1.5px solid var(--black)}
.input.dis{background:var(--line2);color:var(--muted2)}
.input .chev{margin-left:auto;display:flex}
.help{font-size:12px;color:var(--muted);display:flex;align-items:center;gap:5px}
.help.err{color:var(--black);font-weight:700}
.check{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--line);background:#fff;display:grid;place-items:center;flex:none}
.check.on{background:var(--blue);border-color:var(--blue)}
.radio{width:18px;height:18px;border-radius:50%;border:1.5px solid var(--line);background:#fff;flex:none;display:grid;place-items:center}
.radio.on{border:5px solid var(--blue)}
.toggle{width:40px;height:24px;border-radius:12px;background:#D8CCB8;position:relative;flex:none}
.toggle::after{content:'';position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.toggle.on{background:var(--blue)}.toggle.on::after{left:19px}
.seg{display:flex;background:var(--tint);border-radius:10px;padding:3px;border:1px solid var(--line)}
.seg>span{height:30px;padding:0 14px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--muted);font-weight:600;flex:1;white-space:nowrap}
.seg>span.on{background:#fff;color:var(--black);font-weight:800;box-shadow:0 1px 3px rgba(40,30,20,.16)}
.seg.dark>span.on{background:var(--navy);color:#fff;box-shadow:none}
.slider{flex:1;height:6px;border-radius:3px;background:var(--sky);position:relative}
.slider i{position:absolute;left:0;top:0;bottom:0;background:var(--blue);border-radius:3px}
.slider i::after{content:'';position:absolute;right:-8px;top:-5px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px var(--blue)}
.bar{height:8px;border-radius:4px;background:var(--line2);position:relative;overflow:hidden}
.bar i{position:absolute;left:0;top:0;bottom:0;background:var(--blue);border-radius:4px}
.menu{position:absolute;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 16px 40px -12px rgba(40,30,20,.35);padding:6px;z-index:30}
.menu .mi{height:36px;border-radius:8px;display:flex;align-items:center;gap:10px;padding:0 10px;font-size:13.5px}
.menu .mi.on{background:var(--tint);font-weight:700}

/* table */
.tbl{display:flex;flex-direction:column}
.tr{display:flex;align-items:center;min-height:50px;border-bottom:1px solid var(--line2);gap:12px;padding:0 4px}
.tr.th{min-height:36px;background:var(--tint);border-bottom:1px solid var(--line);font-size:12px;color:var(--muted);font-weight:700;border-radius:8px 8px 0 0}
.tr.sel{background:#FAECE6}
.tr:last-child{border-bottom:none}

/* misc */
.ph{position:relative;overflow:hidden;background:var(--tint);border:1px solid var(--line);border-radius:10px;display:flex;align-items:center;justify-content:center}
.ph.dark{background:#26201A;border-color:#26201A}
.ph>span.lb{background:#fff;padding:2px 8px;border-radius:6px;font-size:11px;color:var(--muted);font-weight:700;position:relative;z-index:1}
.phx{position:absolute;left:0;top:0;width:100%;height:100%;z-index:0;pointer-events:none}
.face{position:absolute;left:50%;top:50%;width:22%;aspect-ratio:3/4;transform:translate(-50%,-50%);border:2px dashed var(--blue);border-radius:50%;z-index:1;background:rgba(255,255,255,.6)}
.ph.dark .face{background:rgba(168,50,42,.16);border-color:var(--blue2)}
.facebox{position:absolute;border:2px solid var(--blue);border-radius:8px;z-index:2}
.facebox span{position:absolute;left:-2px;top:-24px;background:var(--blue);color:#fff;font-size:11px;font-weight:800;padding:2px 7px;border-radius:6px 6px 6px 0;white-space:nowrap}
.hatch{position:relative;overflow:hidden;background:#F4EBDB}
.hatch>svg{position:absolute;left:0;top:0}
.segbar{display:flex;height:14px;border-radius:7px;overflow:hidden;gap:2px;background:#fff}
.segbar i{display:block;position:relative}
.segbar .f{background:var(--blue)}.segbar .p{background:var(--sky)}.segbar .a{background:var(--black)}.segbar .u{overflow:hidden;background:#F4EBDB;border:1px solid var(--blue2)}.segbar .e{background:var(--line2)}
.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:11.5px;color:var(--muted)}
.legend span{display:flex;align-items:center;gap:6px}
.legend i{width:14px;height:10px;border-radius:3px;display:block}
.avatar{width:32px;height:32px;border-radius:50%;background:var(--sky);border:1.5px solid #fff;flex:none;display:grid;place-items:center;color:var(--navy);font-size:12px;font-weight:800;position:relative}
.avatar.lg{width:44px;height:44px;font-size:15px}
.avatar.k{background:#2E2822;color:#fff}
.avatar .st{position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;border-radius:50%;border:2px solid #fff}
.stack{display:flex}.stack .avatar{margin-right:-8px}
.ring{position:relative;border-radius:50%;display:grid;place-items:center}
.ring>svg,.donut>svg{position:absolute;left:0;top:0}
.ring .in{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
.timer{font-weight:800;letter-spacing:-1.5px;font-variant-numeric:tabular-nums;color:var(--navy);line-height:1}
.timer.muted{color:#B0A28C}
.rb{border-radius:50%;display:grid;place-items:center}
.rb.out{border:2px solid var(--navy)}
.rb.k{background:var(--black)}
.rec{width:9px;height:9px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 3px var(--sky);display:inline-block;flex:none}
.kpi .k-l{font-size:12.5px;color:var(--muted);font-weight:700;display:flex;align-items:center;gap:6px}
.kpi .k-v{font-size:28px;font-weight:800;letter-spacing:-.8px;color:var(--navy);font-variant-numeric:tabular-nums;margin-top:8px;line-height:1.1}
.kpi .k-s{font-size:12px;color:var(--muted);margin-top:8px;display:flex;align-items:center;gap:6px}
.dim{position:absolute;left:0;top:0;right:0;bottom:0;background:rgba(28,24,20,.52);z-index:20}
.modal{position:absolute;z-index:21;background:#fff;border-radius:18px;box-shadow:0 30px 80px -20px rgba(0,0,0,.45);display:flex;flex-direction:column}
.toast{display:flex;align-items:center;gap:10px;background:var(--black);color:#fff;border-radius:12px;padding:12px 16px;font-size:13px;box-shadow:0 14px 30px -12px rgba(0,0,0,.45)}
.bars{display:flex;align-items:flex-end;gap:10px}
.bars>div{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end}
.bars small{font-size:11px;color:var(--muted)}
.stackbar{width:100%;display:flex;flex-direction:column-reverse;border-radius:6px 6px 2px 2px;overflow:hidden;gap:1px}
.stackbar i{display:block;width:100%}
.lock{display:inline-block;width:10px;height:9px;border-radius:2px;background:currentColor;position:relative;margin-top:3px}
.lock::before{content:'';position:absolute;left:2px;top:-6px;width:6px;height:7px;border:2px solid currentColor;border-bottom:none;border-radius:4px 4px 0 0;box-sizing:border-box}

/* mobile web */
.phone{position:absolute;width:390px;height:844px;border-radius:46px;overflow:hidden;background:#fff;box-shadow:0 0 0 3px var(--black),0 18px 40px -18px rgba(40,30,20,.35)}
.scr{position:relative;width:100%;height:100%;display:flex;flex-direction:column;background:var(--bg)}
.sb{height:44px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 30px;font-size:14px;background:#fff}
.sb .sbr{display:flex;gap:4px;align-items:center}.sb .sbr i{display:block;width:16px;height:9px;border-radius:2px;background:var(--black)}.sb .sbr i:nth-child(2){width:12px}.sb .sbr i:nth-child(3){width:22px;border-radius:3px}
.mbar{height:50px;flex:none;background:#fff;display:flex;align-items:center;gap:10px;padding:0 12px;border-bottom:1px solid var(--line2)}
.murl{flex:1;height:36px;border-radius:18px;background:#EFE7D9;display:flex;align-items:center;gap:8px;padding:0 14px;font-size:13px;color:var(--muted)}
.murl b{color:var(--black);font-weight:500}
.mtabs{width:22px;height:22px;border:2px solid var(--black);border-radius:6px;display:grid;place-items:center;font-size:11px;font-weight:800}
.mhdr{height:54px;flex:none;background:#fff;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:12px;padding:0 16px}
.mhdr .t{font-size:16px;font-weight:800;flex:1;letter-spacing:-.3px}
.mbody{flex:1;padding:14px 16px;display:flex;flex-direction:column;gap:12px;overflow:hidden;position:relative}
.mcta{flex:none;background:#fff;border-top:1px solid var(--line);padding:10px 16px 24px;display:flex;gap:8px}
.home-ind{flex:none;height:22px;background:#fff;display:grid;place-items:center}.home-ind i{width:134px;height:5px;border-radius:3px;background:var(--black);display:block}
.drawer{position:absolute;left:0;top:0;bottom:0;width:300px;background:var(--black);color:#fff;z-index:22;padding:20px 16px;display:flex;flex-direction:column}
.perm{position:absolute;left:10px;right:10px;z-index:23;background:#fff;border-radius:16px;box-shadow:0 20px 50px -10px rgba(0,0,0,.45);padding:16px}

/* guide boards */
.panel{background:#fff;border:1px solid var(--line);border-radius:18px;padding:22px 24px;position:relative}
.panel h2{font-size:18px;font-weight:800;letter-spacing:-.3px;margin-bottom:4px}
.panel .desc{font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.5}
.swatch{width:100%;height:56px;border-radius:10px;border:1px solid var(--line)}
.flowchip{display:inline-flex;align-items:center;height:34px;padding:0 14px;border-radius:10px;background:#fff;border:1px solid var(--line);font-size:13px;font-weight:700;white-space:nowrap}
.flowchip.on{background:var(--navy);border-color:var(--navy);color:#fff}
.flowchip.k{background:var(--black);border-color:var(--black);color:#fff}
.arw{color:var(--blue);font-weight:800;font-size:16px}
`;

/* ------------------------------------------------------------------ */
/* Icons (24 viewBox, stroke) — Figma에서 벡터로 변환된다               */
/* ------------------------------------------------------------------ */
const I = {
  home: (c) => `<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>`,
  calendar: () => `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>`,
  timer: () => `<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>`,
  chart: () => `<path d="M3 3v18h18"/><path d="M8 17v-5M13 17V8M18 17v-9"/>`,
  users: () => `<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.6c2.6.2 4.4 1.9 5 4.9"/>`,
  gift: () => `<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13"/><path d="M12 8C10 4 6.5 4.5 7.5 7c.5 1 2.5 1 4.5 1zM12 8c2-4 5.5-3.5 4.5-1-.5 1-2.5 1-4.5 1z"/>`,
  settings: () => `<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>`,
  bell: () => `<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>`,
  search: () => `<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>`,
  plus: () => `<path d="M12 5v14M5 12h14"/>`,
  play: (c) => `<path d="M7 4.5v15l12-7.5z" fill="${c}" stroke="none"/>`,
  pause: (c) => `<rect x="6" y="5" width="4" height="14" rx="1" fill="${c}" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="${c}" stroke="none"/>`,
  stop: (c) => `<rect x="6" y="6" width="12" height="12" rx="2" fill="${c}" stroke="none"/>`,
  camera: () => `<path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>`,
  video: () => `<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3"/>`,
  music: () => `<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>`,
  chevR: () => `<path d="M9 6l6 6-6 6"/>`,
  chevL: () => `<path d="M15 6l-6 6 6 6"/>`,
  chevD: () => `<path d="M6 9l6 6 6-6"/>`,
  check: () => `<path d="M5 12.5l4.5 4.5L19 7"/>`,
  x: () => `<path d="M6 6l12 12M18 6L6 18"/>`,
  lock: () => `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`,
  copy: () => `<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>`,
  more: (c) => `<circle cx="5" cy="12" r="1.6" fill="${c}" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="${c}" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="${c}" stroke="none"/>`,
  moreV: (c) => `<circle cx="12" cy="5" r="1.6" fill="${c}" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="${c}" stroke="none"/><circle cx="12" cy="19" r="1.6" fill="${c}" stroke="none"/>`,
  filter: () => `<path d="M3 5h18l-7 8v6l-4 2v-8z"/>`,
  download: () => `<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>`,
  trash: () => `<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>`,
  clock: () => `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  flag: () => `<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>`,
  tag: () => `<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>`,
  logout: () => `<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>`,
  refresh: () => `<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>`,
  alert: () => `<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>`,
  info: () => `<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>`,
  eye: () => `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  menu: () => `<path d="M4 6h16M4 12h16M4 18h16"/>`,
  target: (c) => `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="${c}" stroke="none"/>`,
  link: () => `<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>`,
  user: () => `<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>`,
  volume: () => `<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>`,
  wifi: () => `<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><path d="M12 19.5v.5"/>`,
  phone: () => `<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>`,
  monitor: () => `<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>`,
  tablet: () => `<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M11 18h2"/>`,
  trophy: () => `<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>`,
  edit: () => `<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>`,
  sun: () => `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  layers: () => `<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>`,
  arrowR: () => `<path d="M5 12h14M13 6l6 6-6 6"/>`,
  grid: () => `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
  list: () => `<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>`,
  power: () => `<path d="M12 3v8"/><path d="M6.4 6.4a8 8 0 1 0 11.2 0"/>`,
  shield: () => `<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>`,
  sparkle: () => `<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>`,
  keyboard: () => `<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.5M10 10h.5M14 10h.5M18 10h.5M7 14h10"/>`,
};
export const ic = (name, s = 18, c = HEX.black, sw = 2) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[name](c)}</svg>`;

/* ------------------------------------------------------------------ */
/* SVG charts                                                          */
/* ------------------------------------------------------------------ */
const arc = (c, r, a0, a1) => {
  const p = (d) => [c + r * Math.cos((d - 90) * Math.PI / 180), c + r * Math.sin((d - 90) * Math.PI / 180)].map((v) => v.toFixed(2));
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};
export const ringSvg = (size, t, pct, color = HEX.blue, track = HEX.sky) => {
  const c = size / 2, r = (size - t) / 2;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${track}" stroke-width="${t}"/>${pct > 0 ? `<path d="${arc(c, r, 0, 360 * Math.min(pct, 0.999))}" fill="none" stroke="${color}" stroke-width="${t}" stroke-linecap="round"/>` : ''}</svg>`;
};
export const donutSvg = (size, segs, thick = 0.24) => {
  const t = Math.round(size * thick), c = size / 2, r = (size - t) / 2;
  let a = 0;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${segs.map(([color, pct]) => { const a0 = a; a += 360 * pct; return `<path d="${arc(c, r, a0, a - 0.8)}" fill="none" stroke="${color}" stroke-width="${t}"/>`; }).join('')}</svg>`;
};

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */
export const mk = (n) => (n ? ` data-m="${n}"` : '');
export const SUBJ = { algo: ['s-algo', '알고리즘'], eng: ['s-eng', '영어'], db: ['s-db', '데이터베이스'], exam: ['s-exam', '정보처리기사'] };
export const subj = (k) => `<span class="subj ${SUBJ[k][0]}"><i></i>${SUBJ[k][1]}</span>`;
export const legend = () => `<div class="legend"><span><i style="background:var(--blue)"></i>집중</span><span><i style="background:var(--sky)"></i>일시정지</span><span><i style="background:var(--black)"></i>자리 이탈</span><span><i class="hatch" style="border:1px solid var(--blue2)"></i>판정 불가</span></div>`;
export const segbar = (segs, h = 14) => `<div class="segbar" style="height:${h}px;border-radius:${h / 2}px">${segs.map(([k, f]) => `<i class="${k}" style="flex:${f}"></i>`).join('')}</div>`;
export const avatar = (t, st, cls = '') => `<span class="avatar ${cls}">${t}${st ? `<span class="st ${st === 'f' ? 'd-f' : st === 'p' ? 'd-p' : st === 'a' ? 'd-a' : 'd-o'}"></span>` : ''}</span>`;
export const ph = (w, h, label = '', extra = '', cls = '') => `<div class="ph ${cls}" style="width:${w};height:${h}">${extra}${label ? `<span class="lb">${label}</span>` : ''}</div>`;
export const check = (on = true) => `<span class="check ${on ? 'on' : ''}">${on ? ic('check', 12, '#fff', 3) : ''}</span>`;
export const field = (label, inner, help = '') => `<div class="field"><span class="lbl">${label}</span>${inner}${help ? `<span class="help">${help}</span>` : ''}</div>`;
export const select = (v, cls = '') => `<div class="input ${cls}"><span>${v}</span><span class="chev">${ic('chevD', 16, HEX.muted)}</span></div>`;
export const table = (cols, rows, opt = {}) => `<div class="tbl">
  <div class="tr th">${cols.map((c) => `<span style="${c.w ? `width:${c.w};flex:none` : 'flex:1'};${c.r ? 'text-align:right' : ''}">${c.t}</span>`).join('')}</div>
  ${rows.map((r, i) => `<div class="tr ${opt.sel === i ? 'sel' : ''}">${r.map((v, j) => `<div style="${cols[j].w ? `width:${cols[j].w};flex:none` : 'flex:1;min-width:0'};${cols[j].r ? 'text-align:right;justify-content:flex-end' : ''};display:flex;align-items:center;gap:6px">${v}</div>`).join('')}</div>`).join('')}
</div>`;

/* ------------------------------------------------------------------ */
/* Compat + annotation JS                                              */
/* ------------------------------------------------------------------ */
export const PAGE_JS = `
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
    const s=svg(w,h,'phx');const c=el.classList.contains('dark')?'#3C3229':'#DCCDB3';
    line(s,0,0,w,h,c,1.5);line(s,w,0,0,h,c,1.5);el.insertBefore(s,el.firstChild);
  });
  document.querySelectorAll('.segbar .u,.hatch').forEach(el=>{
    const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
    const s=svg(w,h);for(let k=-h;k<w+h;k+=5)line(s,k,h,k+h,0,'#C9A15B',1.4);el.appendChild(s);
  });
}
function lmMarks(){
  document.querySelectorAll('[data-m]').forEach(el=>{
    if(!el.dataset.m)return;
    if(getComputedStyle(el).position==='static')el.style.position='relative';
    const hl=document.createElement('div');hl.className='hl';
    const m=document.createElement('i');m.className='mk';m.textContent=el.dataset.m;
    // 기기 프레임(브라우저·폰) 가장자리에서 잘리지 않도록 안쪽으로 보정
    const dev=el.closest('.phone,.browser')||el.closest('.canvas');
    const r=el.getBoundingClientRect(),d=dev.getBoundingClientRect();
    const x=Math.max(-18,(d.left+4)-r.left),y=Math.max(-18,(d.top+4)-r.top);
    m.style.left=x+'px';m.style.top=y+'px';
    el.appendChild(hl);el.appendChild(m);
  });
}
window.addEventListener('DOMContentLoaded',()=>{lmCompat();lmMarks();});`;

export const page = (inner, { w, h, clean = false }) => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${CSS} body{width:${w}px;height:${h}px;overflow:hidden}</style><script>${PAGE_JS}</script></head><body class="${clean ? 'clean' : ''}"><div class="canvas" style="width:${w}px;height:${h}px">${inner}</div></body></html>`;

export const header = (no, title, route, feats) =>
  `<div class="hdr"><div><div class="no">LEARNINGMATE WIREFRAME v0.3 · ${no}</div><h1>${title}</h1></div><div class="meta">${route ? `<span class="route">${route}</span>` : ''}${feats.map((f) => `<span class="f">${f}</span>`).join('')}</div></div>`;
export const notesHtml = (notes, extra = '') =>
  notes.map((n, i) => `<div class="note"><span class="n">${i + 1}</span><div><h4>${n.t}${n.f ? n.f.split(' ').map((x) => `<em>${x}</em>`).join('') : ''}</h4><p>${n.d}</p></div></div>`).join('') +
  (extra ? `<div class="extra">${extra}</div>` : '');
export const foot = (right) => `<div class="foot"><span>LearningMate · 1차 MVP 와이어프레임 v0.3 · PC 우선 반응형 웹 · 2026.11.25</span><span>${right}</span></div>`;
