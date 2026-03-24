import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Tooltip, ReferenceLine, CartesianGrid } from "recharts";

// ─── CSS ─────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

:root {
  --forest:     #0D1A0D;
  --darkgreen:  #142A14;
  --green:      #1E4D1E;
  --accent:     #2A6B2A;
  --gold:       #C9921A;
  --goldl:      #E8B84B;
  --goldd:      #A07820;
  --cream:      #F2EDD8;
  --creamd:     #D4CFBA;
  --red:        #B91C1C;
  --redl:       #F87171;
  --white:      #FFFFFF;
  --muted:      #9CA3AF;
  --charcoal:   #111411;
}
* { box-sizing:border-box; margin:0; padding:0; scroll-behavior:smooth; }
body { background:var(--forest); color:var(--cream); font-family:'Barlow',sans-serif; overflow-x:hidden; }

.rr-display { font-family:'Barlow Condensed',sans-serif; font-weight:900; text-transform:uppercase; line-height:0.9; letter-spacing:-0.01em; }
.rr-mono    { font-family:'Space Mono',monospace; }
.rr-label   { font-family:'Space Mono',monospace; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--goldl); }

.noise::after {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:9999;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:0.022;
}

.nav { position:fixed; top:0; left:0; right:0; z-index:200; display:flex; justify-content:space-between; align-items:center; padding:1.2rem 2.5rem; background:linear-gradient(to bottom,rgba(13,26,13,0.97),transparent); backdrop-filter:blur(4px); }
.nav-logo { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:1.1rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--goldl); }
.nav-logo span { color:var(--creamd); font-weight:400; }
.nav-links { display:flex; gap:2rem; }
.nav-links a { font-family:'Space Mono',monospace; font-size:0.75rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--creamd); text-decoration:none; transition:color 0.2s; }
.nav-links a:hover, .nav-links a.active { color:var(--goldl); }

.sec { padding:7rem 2.5rem; position:relative; }
.sec-sm { padding:4.5rem 2.5rem; position:relative; }
.max { max-width:72rem; margin:0 auto; }
.divider { height:1px; background:linear-gradient(to right,transparent,rgba(201,146,26,0.25),transparent); }

.act-break { min-height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:4rem 2.5rem; text-align:center; position:relative; }

.rv { opacity:0; transform:translateY(2.5rem); transition:opacity 0.75s ease, transform 0.75s ease; }
.rv.in { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:0.12s; }
.rv-d2 { transition-delay:0.25s; }
.rv-d3 { transition-delay:0.4s; }
.rv-d4 { transition-delay:0.55s; }

.hero { min-height:100vh; display:flex; flex-direction:column; justify-content:flex-end; padding:0 2.5rem 5rem; background:radial-gradient(ellipse 80% 55% at 65% 25%,rgba(42,107,42,0.15) 0%,transparent 70%), var(--forest); overflow:hidden; position:relative; }
.hero-ghost { position:absolute; top:-3rem; left:-1rem; font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:clamp(14rem,28vw,26rem); text-transform:uppercase; line-height:0.85; color:transparent; -webkit-text-stroke:1px rgba(201,146,26,0.055); pointer-events:none; user-select:none; white-space:nowrap; }
.hero-h1 { font-size:clamp(5.5rem,14vw,13rem); animation:fadeUp 0.9s 0.5s both; }
.hero-h1 em { color:var(--goldl); font-style:normal; display:block; }
.hero-sub { max-width:44rem; margin-top:1.6rem; font-size:1.15rem; color:var(--creamd); line-height:1.75; animation:fadeUp 0.9s 0.75s both; }
.hero-ctas { display:flex; align-items:center; gap:2rem; margin-top:2.5rem; animation:fadeUp 0.9s 1s both; }
.hero-kicker { animation:fadeUp 0.8s 0.3s both; margin-bottom:0.8rem; }
.hero-sidestats { position:absolute; top:50%; right:2.5rem; transform:translateY(-50%); display:flex; flex-direction:column; gap:2rem; animation:fadeIn 1s 1.3s both; }
.hero-sidestat-num { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:2.8rem; line-height:1; text-align:right; }
.hero-sidestat-lbl { font-family:'Space Mono',monospace; font-size:0.75rem; color:var(--creamd); max-width:11rem; text-align:right; line-height:1.4; letter-spacing:0.04em; }
.scroll-hint { position:absolute; bottom:1.8rem; right:2.5rem; writing-mode:vertical-rl; font-family:'Space Mono',monospace; font-size:0.75rem; letter-spacing:0.2em; color:var(--goldd); animation:fadeIn 1s 1.8s both; }
.scroll-hint::after { content:''; display:block; width:1px; height:2.8rem; background:var(--goldd); margin:0.6rem auto 0; }

.btn-p { display:inline-flex; align-items:center; gap:0.5rem; background:var(--gold); color:var(--forest); font-family:'Space Mono',monospace; font-size:0.8rem; letter-spacing:0.1em; text-transform:uppercase; font-weight:700; padding:0.85rem 1.9rem; text-decoration:none; transition:background 0.2s,transform 0.15s; cursor:pointer; border:none; }
.btn-p:hover { background:var(--goldl); transform:translateY(-2px); }
.btn-g { display:inline-flex; align-items:center; gap:0.4rem; color:var(--creamd); font-family:'Space Mono',monospace; font-size:0.8rem; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border-bottom:1px solid rgba(201,146,26,0.3); padding-bottom:2px; transition:color 0.2s,border-color 0.2s; cursor:pointer; background:none; border-left:none; border-top:none; border-right:none; }
.btn-g:hover { color:var(--goldl); border-bottom-color:var(--goldl); }

.statcard { background:rgba(255,255,255,0.025); border:1px solid rgba(201,146,26,0.1); padding:1.75rem; position:relative; overflow:hidden; transition:border-color 0.3s; }
.statcard:hover { border-color:rgba(201,146,26,0.35); }
.statcard::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--gold); }
.statcard-num { font-family:'Barlow Condensed',sans-serif; font-size:3.5rem; font-weight:900; color:var(--goldl); line-height:1; }
.statcard-desc { margin-top:0.4rem; font-size:1rem; color:var(--creamd); line-height:1.5; }
.statcard-src { margin-top:0.55rem; font-family:'Space Mono',monospace; font-size:0.75rem; color:var(--goldd); letter-spacing:0.04em; }

.formula-bg { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:18rem; color:transparent; -webkit-text-stroke:1px rgba(201,146,26,0.03); pointer-events:none; white-space:nowrap; letter-spacing:0.08em; z-index:0; }
.formula-banner { display:flex; align-items:center; justify-content:center; gap:0; background:var(--darkgreen); border:1px solid rgba(201,146,26,0.2); border-left:4px solid var(--gold); padding:1.4rem 3rem; }
.formula-step { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:clamp(1.3rem,2.2vw,1.85rem); text-transform:uppercase; color:var(--goldl); letter-spacing:0.04em; padding:0 1.4rem; }
.formula-arrow { color:rgba(201,146,26,0.35); font-size:1.4rem; flex-shrink:0; }

.xy-card { background:rgba(0,0,0,0.3); border:1px solid rgba(201,146,26,0.15); padding:1.5rem; transition:border-color 0.3s; }
.xy-card:hover { border-color:rgba(201,146,26,0.4); }
.xy-bad { border-left:3px solid var(--red); }
.xy-good { border-left:3px solid var(--goldl); }
.xy-tag { font-family:'Space Mono',monospace; font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.5rem; }

.dcard { background:#080D08; padding:2rem 1.75rem; position:relative; border-top:3px solid var(--red); transition:background 0.3s; }
.dcard:hover { background:#0D120D; }
.dcard-stat { font-family:'Barlow Condensed',sans-serif; font-size:4rem; font-weight:900; color:var(--redl); line-height:1; margin-bottom:0.5rem; }
.dcard-body { font-size:1rem; color:var(--creamd); line-height:1.55; }
.dcard-src { margin-top:0.75rem; font-family:'Space Mono',monospace; font-size:0.75rem; color:var(--goldd); letter-spacing:0.04em; }

.quote-mark { font-family:'Barlow Condensed',sans-serif; font-size:7rem; color:var(--gold); line-height:0.5; opacity:0.5; display:block; margin-bottom:1.5rem; }
.quote-text { font-size:clamp(1.7rem,3vw,2.6rem); font-weight:300; color:var(--cream); line-height:1.4; }
.quote-text strong { color:var(--goldl); font-weight:600; }
.quote-attr { font-family:'Space Mono',monospace; font-size:0.8rem; color:var(--creamd); letter-spacing:0.1em; margin-top:1.5rem; }

.course-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:1.75rem; transition:border-color 0.3s, transform 0.3s; }
.course-card:hover { border-color:rgba(201,146,26,0.35); transform:translateY(-3px); }
.course-card-provider { font-family:'Space Mono',monospace; font-size:0.75rem; color:var(--goldl); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.5rem; }
.course-card-name { font-size:1.15rem; font-weight:600; color:var(--cream); margin-bottom:0.4rem; line-height:1.3; }
.course-card-desc { font-size:1rem; color:var(--creamd); line-height:1.55; margin-bottom:0.75rem; }
.course-card-link { font-family:'Space Mono',monospace; font-size:0.8rem; color:var(--goldl); text-decoration:none; border-bottom:1px solid rgba(201,146,26,0.3); padding-bottom:1px; transition:color 0.2s; }
.course-card-link:hover { color:var(--cream); }

.cite-btn { display:inline-flex; align-items:center; justify-content:center; width:1.35rem; height:1.35rem; border-radius:50%; background:rgba(201,146,26,0.12); border:1px solid rgba(201,146,26,0.25); color:var(--goldd); cursor:pointer; margin-left:0.5rem; transition:background 0.2s, color 0.2s; flex-shrink:0; font-family:'Space Mono',monospace; font-size:0.7rem; font-weight:700; text-decoration:none; }
.cite-btn:hover { background:rgba(201,146,26,0.25); color:var(--goldl); }

/* toast */
.cite-toast { position:fixed; bottom:1.5rem; right:1.5rem; z-index:99999; animation:toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both; cursor:pointer; max-width:380px; width:calc(100vw - 3rem); }
.cite-toast-inner { background:#1a2a1a; border:1px solid rgba(201,146,26,0.35); border-left:3px solid var(--gold); padding:1rem 1.25rem; box-shadow:0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.1); backdrop-filter:blur(8px); }
.cite-toast-label { font-family:'Space Mono',monospace; font-size:0.72rem; color:var(--goldl); letter-spacing:0.05em; font-weight:700; line-height:1.3; }
.cite-toast-close { background:none; border:none; color:var(--muted); cursor:pointer; font-size:1.2rem; line-height:1; padding:0; transition:color 0.2s; flex-shrink:0; }
.cite-toast-close:hover { color:var(--cream); }
.cite-toast-body { font-size:0.85rem; color:var(--creamd); line-height:1.5; margin-top:0.4rem; }
.cite-toast-link { display:inline-block; margin-top:0.5rem; font-family:'Space Mono',monospace; font-size:0.75rem; color:var(--goldd); text-decoration:underline; transition:color 0.2s; }
.cite-toast-link:hover { color:var(--goldl); }
@keyframes toastIn { from { opacity:0; transform:translateY(1rem) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
@keyframes fadeSlideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }

.tw-outer { display:inline-block; position:relative; vertical-align:baseline; border-bottom:2px solid var(--gold); padding:0 0.2em; min-width:4.8em; }
.tw-text { color:var(--goldl); font-style:normal; white-space:nowrap; }
.tw-cursor { display:inline-block; width:2px; height:0.8em; background:var(--goldl); margin-left:1px; vertical-align:middle; border-radius:1px; animation:tw-blink 0.9s step-end infinite; }
@keyframes tw-blink { 0%,100%{opacity:1} 50%{opacity:0} }

.od-outer { display:inline-flex; align-items:flex-end; line-height:1; }
.od-window { display:inline-block; height:1em; overflow:hidden; vertical-align:bottom; line-height:1; }
.od-col { display:flex; flex-direction:column; transition:transform 1.4s cubic-bezier(0.16,1,0.3,1); }
.od-row { height:1em; display:flex; align-items:center; justify-content:center; }
.od-static { display:inline-block; vertical-align:bottom; }

.curr-outer { display:inline-flex; align-items:center; gap:0.35em; position:relative; cursor:default; }
.curr-val-wrap { position:relative; height:1em; overflow:hidden; display:inline-block; vertical-align:bottom; }
.curr-val-inner { display:flex; flex-direction:column; transition:transform 0.55s cubic-bezier(0.16,1,0.3,1); }
.curr-val-item { height:1em; line-height:1em; white-space:nowrap; }
.curr-badge { font-family:'Space Mono',monospace; font-size:0.42em; letter-spacing:0.06em; color:var(--gold); background:rgba(201,146,26,0.12); border:1px solid rgba(201,146,26,0.25); padding:0.15em 0.4em; border-radius:2px; vertical-align:middle; transition:all 0.3s; align-self:center; line-height:1.4; }

@keyframes fadeUp { from{opacity:0;transform:translateY(2rem)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes marqueeLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes marqueeRight { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
@keyframes rr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes rr-fadeUp { from{opacity:0;transform:translateY(1rem)} to{opacity:1;transform:translateY(0)} }

.marquee-track { display:flex; width:max-content; gap:0.75rem; }
.marquee-left .marquee-track { animation:marqueeLeft 60s linear infinite; }
.marquee-right .marquee-track { animation:marqueeRight 60s linear infinite; }
.marquee-row { overflow:hidden; position:relative; }
.marquee-row::before,.marquee-row::after { content:''; position:absolute; top:0; bottom:0; width:6rem; z-index:2; pointer-events:none; }
.marquee-row::before { left:0; background:linear-gradient(to right,var(--forest),transparent); }
.marquee-row::after { right:0; background:linear-gradient(to left,var(--forest),transparent); }
.job-pill { display:inline-flex; align-items:center; gap:0.5rem; padding:0.6rem 1.2rem; font-family:'Space Mono',monospace; font-size:0.8rem; letter-spacing:0.03em; white-space:nowrap; border:1px solid rgba(255,255,255,0.08); transition:border-color 0.3s,background 0.3s; cursor:default; }
.job-pill:hover { border-color:rgba(201,146,26,0.4); background:rgba(201,146,26,0.08); }
.job-pill-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.marquee-paused .marquee-track { animation-play-state:paused !important; }
.marquee-pause-btn { display:inline-flex; align-items:center; gap:0.5rem; padding:0.5rem 1.2rem; font-family:'Space Mono',monospace; font-size:0.75rem; letter-spacing:0.08em; color:var(--muted); background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.08); cursor:pointer; transition:all 0.25s; margin-left:1.5rem; }
.marquee-pause-btn:hover { border-color:rgba(201,146,26,0.4); color:var(--goldl); background:rgba(201,146,26,0.08); }

@media(max-width:860px) {
  .nav-links{display:none} .hero-sidestats{display:none} .hero{padding:0 1.5rem 4rem}
  .sec,.sec-sm{padding:5rem 1.5rem} .act-break{min-height:60vh;padding:3rem 1.5rem}
  .formula-banner{flex-direction:column;gap:0.5rem;text-align:center;padding:1.5rem} .formula-arrow{transform:rotate(90deg)}
  .grid-2{grid-template-columns:1fr !important} .grid-3{grid-template-columns:1fr !important}
}
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
.grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
`;

// ─── Helpers ─────────────────────────────────────────────────────
function useReveal(threshold=0.12){const ref=useRef(null);const[visible,setVisible]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVisible(true);obs.disconnect();}},{threshold});obs.observe(el);return()=>obs.disconnect();},[threshold]);return[ref,visible];}
function Reveal({children,delay=0,className=""}){const[ref,visible]=useReveal();return(<div ref={ref} className={`rv ${visible?"in":""} ${delay?`rv-d${delay}`:""} ${className}`}>{children}</div>);}
function Label({children,color}){return <p className="rr-label" style={{marginBottom:"0.75rem",color:color||"var(--goldl)"}}>{children}</p>;}

function ActBreak({text,sub,bg}){return(<section className="act-break" style={{background:bg||"var(--forest)"}}><Reveal><h2 className="rr-display" style={{fontSize:"clamp(3rem,7vw,6.5rem)",color:"var(--cream)",lineHeight:1}}>{text}</h2>{sub&&<p style={{marginTop:"1.5rem",fontSize:"1.1rem",color:"var(--muted)",fontStyle:"italic"}}>{sub}</p>}</Reveal></section>);}

// ─── TypewriterCity ──────────────────────────────────────────────
const CITIES=["Manila","Quezon City","Davao","Cebu","Zamboanga","Taguig","Antipolo","Cagayan de Oro","Parañaque","Las Piñas"];
function TypewriterCity(){const[displayed,setDisplayed]=useState("Manila");const timerRef=useRef(null);const phaseRef=useRef("pausing");const displayedRef=useRef("Manila");const cityIdxRef=useRef(0);useEffect(()=>{function tick(){const ph=phaseRef.current;const cur=displayedRef.current;const target=CITIES[cityIdxRef.current];if(ph==="typing"){if(cur.length<target.length){const next=target.slice(0,cur.length+1);displayedRef.current=next;setDisplayed(next);timerRef.current=setTimeout(tick,80);}else{phaseRef.current="pausing";timerRef.current=setTimeout(tick,1800);}}else if(ph==="pausing"){phaseRef.current="deleting";timerRef.current=setTimeout(tick,45);}else{if(cur.length>0){const next=cur.slice(0,-1);displayedRef.current=next;setDisplayed(next);timerRef.current=setTimeout(tick,45);}else{cityIdxRef.current=(cityIdxRef.current+1)%CITIES.length;phaseRef.current="typing";timerRef.current=setTimeout(tick,300);}}}timerRef.current=setTimeout(tick,1800);return()=>clearTimeout(timerRef.current);},[]);return(<span className="tw-outer"><span className="tw-text">{displayed}</span><span className="tw-cursor"/></span>);}

// ─── OdometerNumber ──────────────────────────────────────────────
function OdometerDigit({target,started,delay=0}){const colRef=useRef(null);useEffect(()=>{if(!started||!colRef.current)return;const t=setTimeout(()=>{if(colRef.current)colRef.current.style.transform=`translateY(-${target}em)`;},delay);return()=>clearTimeout(t);},[started,target,delay]);return(<span className="od-window"><span ref={colRef} className="od-col" style={{transform:"translateY(0)"}}>{[0,1,2,3,4,5,6,7,8,9].map(d=><span key={d} className="od-row">{d}</span>)}</span></span>);}
function OdometerNumber({value,style:s}){const[started,setStarted]=useState(false);const ref=useRef(null);useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setStarted(true);obs.disconnect();}},{threshold:0.6});obs.observe(el);return()=>obs.disconnect();},[]);let dc=0;return(<span ref={ref} className="od-outer" style={s}>{value.split("").map((c,i)=>/\d/.test(c)?<OdometerDigit key={i} target={parseInt(c)} started={started} delay={dc++*90}/>:<span key={i} className="od-static">{c}</span>)}</span>);}

// ─── CurrencyFlip ────────────────────────────────────────────────
function CurrencyFlip({usd,php,size="inherit"}){const[showPHP,setShowPHP]=useState(false);useEffect(()=>{const id=setInterval(()=>setShowPHP(p=>!p),3000);return()=>clearInterval(id);},[]);return(<span className="curr-outer" style={{fontSize:size}}><span className="curr-val-wrap" style={{minWidth:"0.7em"}}><span className="curr-val-inner" style={{transform:showPHP?"translateY(-1em)":"translateY(0)"}}><span className="curr-val-item">$</span><span className="curr-val-item">&#8369;</span></span></span><span className="curr-val-wrap" style={{minWidth:`${Math.max(usd.length,php.length)*0.6}em`}}><span className="curr-val-inner" style={{transform:showPHP?"translateY(-1em)":"translateY(0)"}}><span className="curr-val-item">{usd}</span><span className="curr-val-item">{php}</span></span></span><span className="curr-badge" style={{color:showPHP?"#86efac":"var(--gold)",background:showPHP?"rgba(134,239,172,0.1)":"rgba(201,146,26,0.12)",borderColor:showPHP?"rgba(134,239,172,0.25)":"rgba(201,146,26,0.25)"}}>{showPHP?"PHP":"USD"}</span></span>);}

// ─── Toast Citation System ───────────────────────────────────────
const ToastContext = React.createContext({ show: () => {} });

function ToastProvider({ children }) {
  const [toast, setToast] = React.useState(null);
  const timerRef = React.useRef(null);

  const show = React.useCallback(({ label, body, url }) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ label, body, url, key: Date.now() });
    timerRef.current = setTimeout(() => setToast(null), 8000);
  }, []);

  const dismiss = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <div key={toast.key} className="cite-toast" onClick={dismiss}>
          <div className="cite-toast-inner">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
              <span className="cite-toast-label">{toast.label}</span>
              <button onClick={e => { e.stopPropagation(); dismiss(); }} className="cite-toast-close">&times;</button>
            </div>
            <p className="cite-toast-body">{toast.body}</p>
            {toast.url && (
              <a href={toast.url} target="_blank" rel="noopener noreferrer" className="cite-toast-link" onClick={e => e.stopPropagation()}>
                View source &#8599;
              </a>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

function CiteTip({ label, body, url }) {
  const { show } = React.useContext(ToastContext);
  return (
    <button
      className="cite-btn"
      onClick={e => { e.preventDefault(); show({ label, body, url }); }}
      aria-label="View source"
    >&#8599;</button>
  );
}

// ─── DATA ────────────────────────────────────────────────────────
const DATA_VS=[
  {stat:">50%",desc:"of businesses on Upwork/Fiverr in 2022 spent $0 on them by Q2 2025",src:"Ramp / arXiv:2602.00139 / Jan 2026",tipLabel:"Ramp - Payrolls to Prompts",tipBody:"Study of thousands of firms 2021-2025. Writing & translation demand fell 20-50%.",url:"https://arxiv.org/abs/2602.00139"},
  {stat:"$0.03",isCurrency:true,statUSD:"0.03",statPHP:"1.80",desc:"in AI spend replaces $1 of freelance labor — a 20-25x cost reduction",src:"Ramp / arXiv:2602.00139 / Jan 2026",tipLabel:"Ramp - Payrolls to Prompts",tipBody:"AI platform spend rose sharply while freelance platform spend collapsed.",url:"https://arxiv.org/abs/2602.00139"},
  {stat:"50%",desc:"of entry-level white-collar jobs at risk within 5 years",src:"Dario Amodei, Anthropic / 2025",tipLabel:"Dario Amodei - Machines of Loving Grace",tipBody:"Entry-level knowledge work most exposed in near term.",url:"https://darioamodei.com/machines-of-loving-grace"},
  {stat:"170M",desc:"new jobs created by 2030 — but requiring fundamentally different skills",src:"World Economic Forum / 2025",tipLabel:"WEF - Future of Jobs Report 2025",tipBody:"170M created, 92M displaced, net +78M. Survey of 1,000+ employers.",url:"https://www.weforum.org/reports/the-future-of-jobs-report-2025/"},
];
const DATA_WITH=[
  {stat:"+78M",desc:"net new jobs by 2030 — most in AI-adjacent roles that didn't exist 3 years ago",src:"World Economic Forum / 2025",tipLabel:"WEF - Future of Jobs Report 2025",tipBody:"170M created, 92M displaced. The net gain favors those who adapt.",url:"https://www.weforum.org/reports/the-future-of-jobs-report-2025/"},
  {stat:"10x",desc:"productivity boost for developers using AI coding assistants in controlled studies",src:"Google / DORA 2024",tipLabel:"Google DORA Report",tipBody:"Developers using AI tools completed tasks significantly faster with comparable quality.",url:"https://dora.dev/research/2024/"},
  {stat:"126%",desc:"wage premium for workers with AI skills vs those without, same job title",src:"PwC Global AI Jobs Barometer / 2024",tipLabel:"PwC - AI Jobs Barometer",tipBody:"Workers with AI skills earn significantly more across virtually all sectors analyzed.",url:"https://www.pwc.com/gx/en/issues/artificial-intelligence/job-barometer.html"},
  {stat:"$4.4T",desc:"projected annual value AI adds to the global economy — and the Philippines is in the talent pipeline",src:"McKinsey Global Institute / 2023",tipLabel:"McKinsey - The Economic Potential of Generative AI",tipBody:"Generative AI alone could add $2.6-4.4T annually across 63 use cases analyzed.",url:"https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier"},
];

const COURSES=[
  {provider:"Anthropic",name:"AI Fluency: Frameworks & Foundations",desc:"3-4 hours. The 4D Framework for human-AI partnership.",url:"https://anthropic.skilljar.com/",tag:"Start here"},
  {provider:"Anthropic",name:"Prompt Engineering Interactive Course",desc:"9 chapters with hands-on exercises. Communicate effectively with AI.",url:"https://github.com/anthropics/courses/tree/master/prompt_engineering_interactive_tutorial",tag:"Hands-on"},
  {provider:"OpenAI",name:"OpenAI Academy",desc:"Free courses from basics to advanced. Prompt engineering, agents, applications.",url:"https://academy.openai.com/",tag:"Comprehensive"},
  {provider:"DeepLearning.AI",name:"ChatGPT Prompt Engineering for Developers",desc:"By Andrew Ng. 9 lessons on building smart applications with LLMs.",url:"https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",tag:"For devs"},
  {provider:"Google",name:"Google AI Essentials",desc:"Beginner-friendly intro to generative AI and responsible practices.",url:"https://grow.google/ai/",tag:"Beginner"},
  {provider:"Microsoft",name:"Generative AI for Beginners",desc:"18-lesson open-source curriculum. Build generative AI apps from scratch.",url:"https://github.com/microsoft/generative-ai-for-beginners",tag:"Open source"},
];

// ─── SECTIONS ────────────────────────────────────────────────────
function Nav({activeSection}){const links=[{id:"problem",label:"The Problem"},{id:"formula",label:"The Formula"},{id:"skills",label:"The Skill"},{id:"upside",label:"The Upside"},{id:"courses",label:"Start"}];return(<nav className="nav"><div className="nav-logo">Rice <span>/</span> Race</div><div className="nav-links">{links.map(l=><a key={l.id} href={`#${l.id}`} className={activeSection===l.id?"active":""}>{l.label}</a>)}</div></nav>);}

function Hero(){return(
<section id="hero" className="hero">
  <div className="hero-ghost" aria-hidden="true">RICE{"\n"}RACE</div>
  <div className="hero-sidestats" aria-hidden="true">
    <div>
      <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:"var(--creamd)",letterSpacing:"0.1em",marginBottom:"0.4rem",textAlign:"right"}}>HUMAN LABOR</div>
      <div className="hero-sidestat-num" style={{color:"var(--redl)"}}>&#8369;60.00</div>
      <div className="hero-sidestat-lbl" style={{color:"var(--redl)",opacity:0.7}}>$1.00 USD</div>
    </div>
    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.4rem",color:"var(--goldd)",textAlign:"right",letterSpacing:"0.1em"}}>VS</div>
    <div>
      <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:"var(--creamd)",letterSpacing:"0.1em",marginBottom:"0.4rem",textAlign:"right"}}>AI COST</div>
      <div className="hero-sidestat-num" style={{color:"var(--goldl)"}}>&#8369;1.80</div>
      <div className="hero-sidestat-lbl" style={{color:"var(--goldl)",opacity:0.7}}>$0.03 USD</div>
    </div>
    <div><div className="hero-sidestat-lbl" style={{borderTop:"1px solid rgba(201,146,26,0.3)",paddingTop:"0.8rem"}}>Ramp / Payrolls to Prompts / 2026</div></div>
  </div>
  <div className="hero-kicker"><Label>Uplifting Filipinos Through AI</Label></div>
  <h1 className="rr-display hero-h1">The<br/>Rice<em>Race.</em></h1>
  <p className="hero-sub">The job market is shifting faster than any graduation speech will prepare you for. This is the briefing they did not give you in class.</p>
  <div className="hero-ctas">
    <a href="#problem" className="btn-p">Start With the Problem &#8595;</a>
    <a href="#formula" className="btn-g">Jump to the formula &#8594;</a>
  </div>
  <div className="scroll-hint" aria-hidden="true">Scroll</div>
</section>);}

const WITTY_LINES = {
  tito: [
    "Consulting the family group chat...",
    "Cross-referencing with actual job data...",
    "Measuring love-to-fear ratio...",
    "Translating passive-aggressive Tagalog...",
    "Checking if Tita has a point (she might)...",
    "Decoding 30 years of Filipino parenting...",
    "Running emotional bias detection...",
    "Searching for the love underneath the lecture...",
  ],
  career: [
    "Scanning 2026 job market data...",
    "Finding paths your guidance counselor missed...",
    "Cross-referencing your degree with AI trends...",
    "Calculating automation-proof combinations...",
    "Asking: what would a recruiter pay extra for?",
    "Mapping skills nobody told you were valuable...",
    "Discovering careers that didn't exist last year...",
    "Building your futureproof blueprint...",
  ],
  gov: [
    "Reading between the press releases...",
    "Comparing promises vs actual budget allocations...",
    "Fact-checking campaign slogans since 1986...",
    "Generating campaign slogan... and the reality...",
    "Cross-referencing with countries that got it right...",
    "Calculating the gap between speeches and action...",
    "Reviewing Senate hearing transcripts (the dramatic parts)...",
    "Loading transparency... please wait... still waiting...",
  ],
};

function WittySpinner({type}){
  const lines = WITTY_LINES[type] || WITTY_LINES.tito;
  const [idx, setIdx] = React.useState(Math.floor(Math.random() * lines.length));
  React.useEffect(() => {
    const t = setInterval(() => setIdx(prev => (prev + 1) % lines.length), 2200);
    return () => clearInterval(t);
  }, [lines.length]);
  return(
    <div style={{padding:"1.5rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.8rem"}}>
      <div style={{width:28,height:28,border:"2.5px solid rgba(201,146,26,0.15)",borderTop:"2.5px solid var(--goldl)",borderRadius:"50%",animation:"rr-spin 0.8s linear infinite"}}/>
      <p key={idx} style={{fontFamily:"'Space Mono',monospace",fontSize:"0.75rem",color:"var(--goldl)",letterSpacing:"0.03em",textAlign:"center",animation:"rr-fadeUp 0.3s ease"}}>{lines[idx]}</p>
    </div>
  );
}

function Intro(){
  const animRef = React.useRef(null);
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.3 });
    if (animRef.current) obs.observe(animRef.current);
    return () => obs.disconnect();
  }, []);

  // Generate rice grain positions for filling animation
  const grains = React.useMemo(() => Array.from({length:28}, (_,i) => ({
    x: 18 + Math.random() * 64,
    y: 85 - (i/28) * 55 - Math.random() * 8,
    delay: i * 0.06,
    rot: Math.random() * 40 - 20,
  })), []);

  return(
<section className="sec" style={{background:"linear-gradient(to bottom, var(--darkgreen), var(--forest))"}}>
  <div className="max" style={{maxWidth:"50rem"}}>
    <Reveal>
      <Label>Before We Begin</Label>
      <h2 className="rr-display" style={{fontSize:"clamp(2.5rem,5vw,4.5rem)",marginTop:"0.8rem",marginBottom:"1.5rem"}}>This Is For the One Who Is a Little <span style={{color:"var(--goldl)"}}>Scared</span> Right Now.</h2>
      <p style={{fontSize:"1.15rem",color:"var(--creamd)",lineHeight:1.75,marginBottom:"2.5rem"}}>Excited. Grateful. Somewhere underneath it all — quietly terrified about what comes next. That is exactly the right person for this talk. The fear means you are paying attention.</p>
    </Reveal>

    {/* Rice vs Race animation */}
    <Reveal delay={1}>
      <div ref={animRef} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",maxWidth:"46rem",margin:"0 auto 3rem",alignItems:"end"}}>
        {/* LEFT: Hamster wheel — the race */}
        <div style={{textAlign:"center"}}>
          <div style={{position:"relative",width:200,height:200,margin:"0 auto 1.2rem"}}>
            <svg viewBox="0 0 120 120" style={{width:"100%",height:"auto"}}>
              {/* Outer wheel */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(248,113,113,0.2)" strokeWidth="1.5"/>
              <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(248,113,113,0.08)" strokeWidth="0.8"/>
              {/* Spokes that spin */}
              <g style={{transformOrigin:"60px 60px",animation: go ? "rr-spin 3s linear infinite" : "none"}}>
                {[0,45,90,135].map(a => <line key={a} x1="60" y1="18" x2="60" y2="102" stroke="rgba(248,113,113,0.12)" strokeWidth="0.8" transform={`rotate(${a} 60 60)`}/>)}
              </g>
              {/* Runner */}
              <text x="60" y="67" textAnchor="middle" fontSize="26" style={{filter:"drop-shadow(0 0 8px rgba(248,113,113,0.4))"}}>🏃</text>
              {/* Ground line */}
              <line x1="10" y1="112" x2="110" y2="112" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
            </svg>
          </div>
          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.4rem",color:"var(--redl)",letterSpacing:"0.03em"}}>THE RACE</p>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:"rgba(248,113,113,0.5)",letterSpacing:"0.06em",marginTop:"0.35rem"}}>SPRINT · COMPETE · BURN OUT</p>
        </div>

        {/* RIGHT: Rice bowl filling */}
        <div style={{textAlign:"center"}}>
          <div style={{position:"relative",width:200,height:200,margin:"0 auto 1.2rem"}}>
            <svg viewBox="0 0 120 120" style={{width:"100%",height:"auto"}}>
              {/* Bowl shape */}
              <path d="M 15,55 Q 15,100 60,105 Q 105,100 105,55" fill="none" stroke="rgba(201,146,26,0.3)" strokeWidth="1.5"/>
              <path d="M 15,55 Q 15,100 60,105 Q 105,100 105,55 Z" fill="rgba(201,146,26,0.04)"/>
              {/* Rice grains falling in */}
              {grains.map((g, i) => (
                <ellipse key={i} cx={g.x} cy={g.y} rx="4" ry="2"
                  fill="rgba(201,146,26,0.7)"
                  transform={`rotate(${g.rot} ${g.x} ${g.y})`}
                  style={{
                    opacity: go ? 1 : 0,
                    transition: `opacity 0.3s ease ${g.delay + 0.4}s`,
                  }}
                />
              ))}
              {/* Seedling at top */}
              <text x="60" y="35" textAnchor="middle" fontSize="22" style={{
                opacity: go ? 1 : 0,
                transition:"opacity 0.6s ease 2.2s",
                filter:"drop-shadow(0 0 8px rgba(201,146,26,0.4))",
              }}>🌾</text>
              {/* Ground line */}
              <line x1="10" y1="112" x2="110" y2="112" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
            </svg>
          </div>
          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.4rem",color:"var(--goldl)",letterSpacing:"0.03em"}}>THE RICE</p>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:"rgba(201,146,26,0.6)",letterSpacing:"0.06em",marginTop:"0.35rem"}}>PLANT · TEND · GROW · COMPOUND</p>
        </div>
      </div>
    </Reveal>

    <Reveal delay={2}>
      <div style={{maxWidth:"40rem",margin:"0 auto",textAlign:"center"}}>
        <p style={{fontSize:"1.1rem",color:"var(--creamd)",lineHeight:1.8,marginBottom:"1rem"}}><em>"Kumain ka na ba?"</em> isn't really about eating. It's a question about survival. In the Philippines, rice measures everything — work, worth, security.</p>
        <p style={{fontSize:"1.1rem",color:"var(--creamd)",lineHeight:1.8,marginBottom:"1.5rem"}}>Most career advice puts you in a <strong style={{color:"var(--redl)"}}>race</strong> — sprint for grades, sprint for certifications, sprint against a hundred other applicants. That race is getting harder and the prize is getting smaller.</p>
        <p style={{fontSize:"1.15rem",color:"var(--goldl)",lineHeight:1.8,fontWeight:500}}>This talk is about the other side. <strong>Rice is not caught. It is cultivated.</strong> Your career doesn't have to be a race you win. It can be a field you grow.</p>
      </div>
    </Reveal>
  </div>
</section>);}

function AIShowcase(){
  const [tab, setTab] = React.useState(0);
  const tabs = ["🧓 Tito/Tita Analyzer", "🔀 Career + AI Futureproof", "🏛️ Good vs Bad Governance"];
  return(
<section className="sec" style={{background:"linear-gradient(to bottom, var(--forest), var(--darkgreen))"}}>
  <div className="max" style={{maxWidth:"52rem"}}>
    <Reveal>
      <Label>Try It Live</Label>
      <h2 className="rr-display" style={{fontSize:"clamp(2rem,4vw,3rem)",marginTop:"0.8rem",marginBottom:"0.5rem"}}>AI, Right Now, For <span style={{color:"var(--goldl)"}}>You</span></h2>
      <p style={{fontSize:"0.95rem",color:"var(--muted)",lineHeight:1.6,marginBottom:"2rem"}}>Three demos powered by Claude AI. Tap a preset to see results — inside <strong style={{color:"var(--goldl)"}}>claude.ai</strong> they generate live. Otherwise you'll see curated examples.</p>
    </Reveal>

    {/* Tabs */}
    <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
      {tabs.map((t, i) => (
        <button key={i} onClick={() => setTab(i)} style={{
          padding:"0.6rem 1.2rem",cursor:"pointer",
          background: tab === i ? "rgba(201,146,26,0.12)" : "rgba(255,255,255,0.02)",
          border: tab === i ? "1px solid rgba(201,146,26,0.35)" : "1px solid rgba(255,255,255,0.06)",
          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,fontSize:"0.95rem",
          color: tab === i ? "var(--goldl)" : "var(--muted)",
          transition:"all 0.2s",
        }}>{t}</button>
      ))}
    </div>

    <div style={{display: tab === 0 ? "block" : "none"}}><TitoTitaAnalyzer/></div>
    <div style={{display: tab === 1 ? "block" : "none"}}><CareerPathFinder/></div>
    <div style={{display: tab === 2 ? "block" : "none"}}><GovernanceAnalyzer/></div>
  </div>
</section>);}

const TITO_FALLBACKS = {
  "Mag-nurse ka nalang, siguradong may trabaho.": {emoji:"🩺",headline:"\"I'm scared for you and this is the only safe path I know.\"",verdict:"Loving but Outdated",emotional_bias:"This comes from a generation that saw nurses get stable jobs and visas abroad. Your Tita watched her neighbor's kid move to the US and send money home — that's her entire dataset.",reality_2026:"Nursing is still in demand globally, but PH nursing boards have a ~50% passing rate, and the pipeline takes 4-6 years before you earn abroad. Meanwhile, IT roles can go remote in months. Healthcare AI is also creating hybrid roles where tech skills + medical knowledge = premium salary.",what_actually_works:"If you love healthcare, explore health informatics or medical AI — your IT skills + a health domain = a niche most nurses can't fill. If you don't love healthcare, don't spend 6 years proving your Tita right.",love_rating:4},
  "Walang pera sa IT, mag-abroad ka na.": {emoji:"✈️",headline:"\"This country can't take care of you. Leave before it's too late.\"",verdict:"Half-right, Half-fear",emotional_bias:"\"Mag-abroad\" is the Filipino dream escalation — when local options feel uncertain, the answer is always \"leave.\" This is love disguised as escape planning. They want you safe, and \"safe\" means \"not here.\"",reality_2026:"Remote IT work from PH can pay ₱80K-200K/month without leaving. Global companies hire Filipino devs for 60-70% of US rates — which is still 3-5x local salary. The \"abroad\" premium is shrinking while cost of living there is rising.",what_actually_works:"Build remote-ready skills: strong English, Git/deployment workflows, async communication. Apply to remote-first companies. You get the abroad salary without the abroad loneliness. Then visit your Tito for vacation, not survival.",love_rating:3},
  "Bakit ka pa mag-aral ng computers? May AI na.": {emoji:"🤖",headline:"\"I don't understand your world but I'm terrified for you in it.\"",verdict:"Accidentally Profound",emotional_bias:"This is panic dressed as wisdom. They saw a headline about AI replacing programmers and connected it to you immediately — because they care about you, not because they understand the technology.",reality_2026:"AI is replacing routine coding tasks, yes. But it's creating 2-3x more roles in AI integration, prompt engineering, and system design. Companies need people who UNDERSTAND computers to USE AI effectively. The ones who should worry aren't CS grads — they're the ones who never learned to think systematically.",what_actually_works:"Lean INTO AI, not away from it. Learn to use Claude, Copilot, and Cursor as daily tools. The grad who can build with AI is 10x more productive than one who codes from scratch. Your Tito accidentally gave you the best career advice — just in reverse.",love_rating:2},
  "Mag-call center ka muna habang nag-aaral.": {emoji:"📞",headline:"\"Survive first. Dream later. That's how I did it.\"",verdict:"Practical but Limiting",emotional_bias:"This is survival advice from someone who's been practical their whole life. BPO is the known path — it pays, it's hiring, and your English is good. It's not bad advice, it's just incomplete.",reality_2026:"BPO still employs 1.7M Filipinos, but AI voice agents and chatbots are eating entry-level support roles. The growth is in \"knowledge process outsourcing\" — analytics, AI training data, specialized support — which pays 2-3x basic call center rates.",what_actually_works:"If you need income now, try freelance dev work on Upwork/Toptal instead — it pays more per hour, builds your portfolio, and the skills compound. If BPO is your bridge, target QA, data annotation, or AI training roles — not voice support.",love_rating:4},
  "Kumuha ka ng government job, stable yun.": {emoji:"🏛️",headline:"\"I just want you to never worry about money like I did.\"",verdict:"Stable but Stagnant",emotional_bias:"Government = pension + security + respect sa barangay. Your Tito probably knows someone who retired comfortably from a government post. In their world, stability IS success.",reality_2026:"Government IT roles in PH pay ₱18K-35K/month for positions that would earn ₱60K-150K in private sector or remote work. The stability is real but the ceiling is very low. DICT and other agencies are modernizing, but slowly — budget cycles move in years, not sprints.",what_actually_works:"If you want impact + stability, consider GovTech startups or consulting for government agencies — you get the mission without the salary cap. Or: build your private career first, earn and learn for 5 years, then bring that expertise to public service when you can afford to.",love_rating:5},
};

function TitoTitaAnalyzer(){
  const presets = Object.keys(TITO_FALLBACKS);
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [live, setLive] = React.useState(null); // null=unknown, true=api works, false=fallback

  // Check API availability on mount
  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/claude", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:10,messages:[{role:"user",content:"Say ok"}]}),
        });
        setLive(r.ok);
      } catch { setLive(false); }
    })();
  }, []);

  const analyze = async (advice) => {
    const text = advice || input;
    if (!text.trim()) return;
    // Try fallback first if no API
    if (live === false) {
      const fb = TITO_FALLBACKS[text];
      if (fb) { setResult(fb); return; }
      setResult(TITO_FALLBACKS[presets[0]]); return;
    }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system: `You are a witty, warm Filipino career advisor for IT graduates (2026). Analyze the "Tito/Tita advice" given. Respond in this EXACT JSON format, no other text:
{"emoji":"(one relevant emoji)","headline":"(one sentence in quotes — what they ACTUALLY mean underneath the advice, emotionally honest, starts with a quote mark)","verdict":"(2-3 word verdict like 'Outdated but loving' or 'Half-right, half-fear')","emotional_bias":"(1-2 sentences on the emotional/cultural motivation behind this advice)","reality_2026":"(2-3 sentences on what the actual job market data says in 2026 Philippines — be specific with trends)","what_actually_works":"(2-3 sentences of practical counter-advice for a fresh IT grad)","love_rating":"(1-5, how much love vs how much fear is driving this advice)"}
Be funny but respectful. These are real family dynamics. Mix Taglish naturally.`,
          messages:[{role:"user",content:`Analyze this Tito/Tita career advice: "${text}"`}],
        }),
      });
      const data = await res.json();
      const raw = data.content?.map(c => c.text || "").join("") || "";
      setResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch(e) {
      // Fallback on error
      const fb = TITO_FALLBACKS[text];
      if (fb) { setResult(fb); setLive(false); }
      else { setError("Couldn't analyze — try a preset."); setLive(false); }
    }
    setLoading(false);
  };

  return(
<div>
  {/* Mode indicator */}
  {live === false && (
    <div style={{marginBottom:"1rem",padding:"0.6rem 1rem",background:"rgba(201,146,26,0.06)",border:"1px solid rgba(201,146,26,0.15)",display:"flex",alignItems:"center",gap:"0.5rem"}}>
      <span style={{fontSize:"0.85rem"}}>💡</span>
      <p style={{fontSize:"0.8rem",color:"var(--creamd)",lineHeight:1.5}}>Showing pre-generated examples. <strong style={{color:"var(--goldl)"}}>To try it live with your own input</strong>, open this artifact inside <a href="https://claude.ai" target="_blank" rel="noopener" style={{color:"var(--goldl)",textDecoration:"underline"}}>claude.ai</a> — it runs on Claude's API in real time.</p>
    </div>
  )}

  {/* Presets */}
  <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:"var(--muted)",marginBottom:"0.6rem",letterSpacing:"0.06em"}}>COMMON TITO/TITA LINES (TAP ONE)</p>
  <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1rem"}}>
    {presets.map((p,i) => (
      <button key={i} onClick={() => { setInput(p); analyze(p); }} style={{
        padding:"0.45rem 0.8rem",cursor:"pointer",
        background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",
        fontSize:"0.8rem",color:"var(--creamd)",transition:"all 0.2s",
      }}
        onMouseEnter={e => {e.currentTarget.style.borderColor = "rgba(201,146,26,0.3)"; e.currentTarget.style.color = "var(--goldl)";}}
        onMouseLeave={e => {e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--creamd)";}}
      >"{p}"</button>
    ))}
  </div>

  {/* Custom input — only when API is available */}
  {live !== false && (
    <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem"}}>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Or type your own Tito/Tita advice..."
        onKeyDown={e => e.key === "Enter" && analyze()}
        style={{flex:1,padding:"0.7rem 1rem",background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--cream)",fontSize:"0.9rem",fontFamily:"'Barlow',sans-serif",outline:"none"}}
      />
      <button onClick={() => analyze()} disabled={loading} style={{
        padding:"0.7rem 1.5rem",cursor: loading ? "wait" : "pointer",
        background: loading ? "rgba(201,146,26,0.1)" : "rgba(201,146,26,0.15)",
        border:"1px solid rgba(201,146,26,0.3)",
        fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"0.95rem",color:"var(--goldl)",
      }}>{loading ? "Thinking..." : "Analyze 🔍"}</button>
    </div>
  )}

  {/* Result */}
  {error && <p style={{color:"var(--redl)",fontSize:"0.85rem"}}>{error}</p>}
  {loading && <WittySpinner type="tito"/>}
  {!loading && result && (
    <div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.06)",padding:"1.5rem",animation:"rr-fadeUp 0.4s ease"}}>
      {/* Big headline — what they actually mean */}
      {result.headline && <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"clamp(1.2rem,2.5vw,1.6rem)",color:"var(--cream)",lineHeight:1.35,marginBottom:"1.2rem",paddingBottom:"1rem",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>{result.headline}</p>}
      <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"1rem"}}>
        <span style={{fontSize:"1.8rem"}}>{result.emoji}</span>
        <div>
          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.3rem",color:"var(--goldl)"}}>{result.verdict}</p>
          <div style={{display:"flex",alignItems:"center",gap:"0.3rem",marginTop:"0.15rem"}}>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"var(--muted)"}}>LOVE RATING:</span>
            {[1,2,3,4,5].map(n => <span key={n} style={{fontSize:"0.7rem"}}>{n <= (result.love_rating||3) ? "❤️" : "🖤"}</span>)}
          </div>
        </div>
      </div>
      {[
        {label:"EMOTIONAL BIAS", text:result.emotional_bias, color:"#F87171"},
        {label:"REALITY CHECK · 2026", text:result.reality_2026, color:"var(--goldl)"},
        {label:"WHAT ACTUALLY WORKS", text:result.what_actually_works, color:"#86efac"},
      ].map((s,i) => (
        <div key={i} style={{marginTop:"0.8rem",paddingTop:"0.8rem",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:s.color,letterSpacing:"0.08em",marginBottom:"0.3rem"}}>{s.label}</p>
          <p style={{fontSize:"0.9rem",color:"var(--creamd)",lineHeight:1.6}}>{s.text}</p>
        </div>
      ))}
    </div>
  )}
</div>);}

const CAREER_FALLBACKS = {
  "BS Information Technology": {degree:"BS Information Technology",top_skill:"Systems Integration — making different tools talk to each other",paths:[
    {emoji:"🏗️",title:"AI Implementation Architect",description:"You bridge the gap between AI tools and business operations — configuring, integrating, and customizing AI workflows for companies that don't have ML engineers. Accenture PH, Thinking Machines, and remote SaaS companies actively hire for this hybrid role.",salary_range:"₱50,000 – ₱120,000/mo",ai_tools:"LangChain, Claude API, Zapier AI Actions",automation_shield:"AI can build AI tools, but it can't sit in a meeting with a confused CFO and translate 'we need better reports' into a working automation pipeline.",surprise_factor:7},
    {emoji:"🎓",title:"AI Learning Experience Designer",description:"Design AI-powered learning platforms for Filipino students and corporate training. Your IT background means you can build the systems, not just use them. Eskwelabs, Zuitt, and international EdTech platforms hire Filipino instructional technologists.",salary_range:"₱40,000 – ₱90,000/mo",ai_tools:"NotebookLM, Claude, Articulate Rise + AI plugins",automation_shield:"AI generates content, but designing what sequence a struggling student needs to see next requires human empathy + technical architecture.",surprise_factor:8},
    {emoji:"🔍",title:"AI Quality & Red Team Specialist",description:"Test AI systems for bias, hallucination, and edge cases before they ship. Your systematic IT training is perfect for breaking things methodically. Scale AI, Anthropic, and OpenAI hire remote QA evaluators, many from PH.",salary_range:"₱45,000 – ₱150,000/mo",ai_tools:"Claude, ChatGPT, custom eval frameworks, Python",automation_shield:"You literally teach AI where it's wrong — the humans who stress-test AI are the last ones AI can replace (who watches the watchmen?).",surprise_factor:6},
  ],mindset_shift:"Your IT degree didn't just teach you to code — it taught you systems thinking, debugging under pressure, and translating between humans and machines. AI makes that translation layer 10x more valuable, not obsolete."},
  "BS Computer Science": {degree:"BS Computer Science",top_skill:"Computational Thinking — decomposing any problem into solvable pieces",paths:[
    {emoji:"🧬",title:"AI + Domain Science Engineer",description:"Apply your CS algorithms knowledge to genomics, climate modeling, or drug discovery. Biotech and research labs need people who understand both computation and AI pipelines. Philippine Genome Center and remote biotech startups are hiring.",salary_range:"₱60,000 – ₱180,000/mo",ai_tools:"AlphaFold, PyTorch, Hugging Face Transformers",automation_shield:"AI can predict protein structures, but designing the experiment, cleaning the data, and knowing what question to ask requires CS + domain intuition.",surprise_factor:9},
    {emoji:"🛡️",title:"AI Security Red Teamer",description:"Hack AI systems professionally — find prompt injections, data poisoning, and adversarial attacks before bad actors do. Your CS fundamentals in algorithms and systems give you the edge. CrowdStrike, Trail of Bits, and Anthropic hire remotely.",salary_range:"₱70,000 – ₱200,000/mo",ai_tools:"Burp Suite + AI extensions, Claude for adversarial testing, custom Python exploits",automation_shield:"Offensive security requires creative, adversarial thinking that adapts faster than any automated scanner — you think like an attacker, not a pattern.",surprise_factor:8},
    {emoji:"⚙️",title:"AI Infrastructure & MLOps Engineer",description:"Build and maintain the systems that make AI actually work in production — model serving, monitoring, scaling, cost optimization. Every company deploying AI needs this and almost nobody is trained for it yet. Grab, Maya, and remote startups are desperate.",salary_range:"₱55,000 – ₱160,000/mo",ai_tools:"Docker, Kubernetes, AWS SageMaker, Weights & Biases",automation_shield:"AI can write code but it can't debug a 3 AM production incident where the model is serving garbage because a data pipeline silently broke.",surprise_factor:7},
  ],mindset_shift:"CS didn't just teach you to code — it taught you computational thinking: decomposing any problem into solvable pieces. AI is the most powerful tool ever built for people who already think in systems. You're not competing with AI. You're its ideal operator."},
  "BS Nursing": {degree:"BS Nursing",top_skill:"Human Judgment Under Pressure — the one thing AI can't fake",paths:[
    {emoji:"🤖",title:"Clinical AI Validation Specialist",description:"Evaluate whether AI diagnostic tools actually work in real clinical settings. Your patient care experience is irreplaceable — you know what doctors miss, what patients hide, and where AI outputs need human override. Telehealth companies and MedTech firms hire nurses for this.",salary_range:"₱45,000 – ₱100,000/mo",ai_tools:"Clinical decision support systems, Google Health AI, Epic + AI integrations",automation_shield:"AI can read an X-ray, but you know the patient was squirming and anxious — that context decides whether the AI's suggestion is helpful or dangerous.",surprise_factor:9},
    {emoji:"📊",title:"Health Data Intelligence Analyst",description:"Turn hospital data into insights that administrators and policymakers actually act on. Your clinical background means you know which numbers matter and which are noise. PhilHealth, WHO PH, and health analytics firms need this badly.",salary_range:"₱35,000 – ₱80,000/mo",ai_tools:"Tableau + AI, Claude for report synthesis, Power BI Copilot",automation_shield:"AI crunches the data, but knowing that 'bed turnover rate' means something different in a rural clinic vs Manila hospital — that's clinical judgment, not computation.",surprise_factor:8},
    {emoji:"🌐",title:"Digital Health Product Manager",description:"Lead the design of telehealth apps, AI triage systems, and patient portals. You've worked the floor — you know what nurses need that developers keep getting wrong. KonsultaMD, mWell, and international health startups seek clinical-turned-tech talent.",salary_range:"₱50,000 – ₱130,000/mo",ai_tools:"Figma + AI, Claude for spec writing, user research AI tools",automation_shield:"AI can build the interface, but it's never held a patient's hand at 2 AM — you design from empathy, not assumptions.",surprise_factor:7},
  ],mindset_shift:"Nursing didn't just teach you medicine — it taught you empathy under pressure, pattern recognition in chaos, and life-or-death prioritization. AI amplifies all of that. The nurse who can speak both clinical and technical becomes the most trusted person in any health-tech room."},
};

function CareerPathFinder(){
  const degrees = ["BS Information Technology","BS Computer Science","BS Information Systems","BS Computer Engineering","BS Electronics Engineering","BS Business Administration","BS Accountancy","BS Nursing","AB Communication","BS Architecture"];
  const [degree, setDegree] = React.useState("");
  const [custom, setCustom] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [live, setLive] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/claude", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:10,messages:[{role:"user",content:"Say ok"}]}),
        });
        setLive(r.ok);
      } catch { setLive(false); }
    })();
  }, []);

  const find = async (deg) => {
    const d = deg || custom || degree;
    if (!d.trim()) return;
    if (live === false) {
      const fb = CAREER_FALLBACKS[d];
      if (fb) { setResult(fb); return; }
      // Show closest match or first fallback
      setResult(CAREER_FALLBACKS["BS Information Technology"]); return;
    }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1200,
          system: `You are an AI career futureproofing strategist for Filipino graduates (2026). Given a degree, show how to COMBINE that degree with AI to become irreplaceable — not replaced. Suggest 3 specific career paths where their existing degree PLUS AI skills creates a premium, hard-to-automate niche. Respond in EXACT JSON, no other text:
{"degree":"(echo back)","top_skill":"(the ONE core skill from this degree that AI amplifies most — format: 'Skill Name — short explanation', max 12 words)","paths":[{"emoji":"(icon)","title":"(creative 3-5 word title)","description":"(2-3 sentences: what this AI-enhanced role does, why their specific degree gives them an edge AI alone can't replicate, and one company or sector in PH/remote hiring for this)","salary_range":"(realistic PH or remote salary range in PHP/month for 1-2 years experience)","ai_tools":"(2-3 specific AI tools they'd use daily in this role — actual product names)","automation_shield":"(1 sentence: why this specific combination is hard for pure AI to replace)","surprise_factor":"(1-10, how unexpected this path is)"}],"mindset_shift":"(1-2 sentences: the key reframe — what their degree ACTUALLY trained them for that AI can't replicate, and how AI turns that into a superpower)"}
Be specific to PH job market. Reference real companies, sectors, AI tools, or platforms. The message: AI doesn't replace your degree — it amplifies it.`,
          messages:[{role:"user",content:`Find 3 unconventional career paths for a fresh graduate with: ${d}`}],
        }),
      });
      const data = await res.json();
      const raw = data.content?.map(c => c.text || "").join("") || "";
      setResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch(e) {
      const fb = CAREER_FALLBACKS[d];
      if (fb) { setResult(fb); setLive(false); }
      else { setError("Couldn't generate paths — try a preset degree."); setLive(false); }
    }
    setLoading(false);
  };

  return(
<div>
  {live === false && (
    <div style={{marginBottom:"1rem",padding:"0.6rem 1rem",background:"rgba(201,146,26,0.06)",border:"1px solid rgba(201,146,26,0.15)",display:"flex",alignItems:"center",gap:"0.5rem"}}>
      <span style={{fontSize:"0.85rem"}}>💡</span>
      <p style={{fontSize:"0.8rem",color:"var(--creamd)",lineHeight:1.5}}>Showing pre-generated examples for selected degrees. <strong style={{color:"var(--goldl)"}}>Try it live inside <a href="https://claude.ai" target="_blank" rel="noopener" style={{color:"var(--goldl)",textDecoration:"underline"}}>claude.ai</a></strong> to get personalized results for any degree or specialization.</p>
    </div>
  )}

  <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:"var(--muted)",marginBottom:"0.6rem",letterSpacing:"0.06em"}}>{live === false ? "SELECT A DEGREE TO SEE EXAMPLE RESULTS" : "SELECT YOUR DEGREE (OR TYPE BELOW)"}</p>
  <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1rem"}}>
    {degrees.map((d,i) => {
      const hasFallback = !!CAREER_FALLBACKS[d];
      const show = live !== false || hasFallback;
      return show ? (
        <button key={i} onClick={() => { setDegree(d); find(d); }} style={{
          padding:"0.4rem 0.7rem",cursor:"pointer",
          background: degree === d ? "rgba(201,146,26,0.12)" : "rgba(255,255,255,0.03)",
          border: degree === d ? "1px solid rgba(201,146,26,0.35)" : "1px solid rgba(255,255,255,0.08)",
          fontSize:"0.75rem",color: degree === d ? "var(--goldl)" : "var(--creamd)",transition:"all 0.2s",
        }}>{d}{live === false && !hasFallback ? "" : ""}</button>
      ) : null;
    })}
  </div>

  {/* Custom input — only when API is available */}
  {live !== false && (
    <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem"}}>
      <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="Or type your degree / specialization..."
        onKeyDown={e => e.key === "Enter" && find()}
        style={{flex:1,padding:"0.7rem 1rem",background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--cream)",fontSize:"0.9rem",fontFamily:"'Barlow',sans-serif",outline:"none"}}
      />
      <button onClick={() => find()} disabled={loading} style={{
        padding:"0.7rem 1.5rem",cursor: loading ? "wait" : "pointer",
        background: loading ? "rgba(201,146,26,0.1)" : "rgba(201,146,26,0.15)",
        border:"1px solid rgba(201,146,26,0.3)",
        fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"0.95rem",color:"var(--goldl)",
      }}>{loading ? "Mapping paths..." : "Find Paths 🔀"}</button>
    </div>
  )}

  {error && <p style={{color:"var(--redl)",fontSize:"0.85rem"}}>{error}</p>}
  {loading && <WittySpinner type="career"/>}
  {!loading && result && (
    <div style={{animation:"rr-fadeUp 0.4s ease"}}>
      {/* Big headline — top skill to focus */}
      {result.top_skill && <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"clamp(1.2rem,2.5vw,1.6rem)",color:"var(--cream)",lineHeight:1.35,marginBottom:"1.2rem",paddingBottom:"0.8rem",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>🎯 {result.top_skill}</p>}
      <div style={{marginBottom:"1.2rem",padding:"0.6rem 1rem",background:"rgba(201,146,26,0.06)",borderLeft:"3px solid var(--goldd)"}}>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:"var(--goldl)",letterSpacing:"0.04em"}}>{result.degree}</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
        {(result.paths||[]).map((p,i) => (
          <div key={i} style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.06)",padding:"1.2rem 1.5rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.6rem"}}>
              <span style={{fontSize:"1.4rem"}}>{p.emoji}</span>
              <div style={{flex:1}}>
                <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.1rem",color:"var(--cream)"}}>{p.title}</p>
                <div style={{display:"flex",alignItems:"center",gap:"0.8rem",marginTop:"0.15rem"}}>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"#86efac"}}>{p.salary_range}</span>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.55rem",color:"var(--muted)"}}>SURPRISE: {"⚡".repeat(Math.min(Math.ceil((p.surprise_factor||5)/2),5))}</span>
                </div>
              </div>
            </div>
            <p style={{fontSize:"0.9rem",color:"var(--creamd)",lineHeight:1.6,marginBottom:"0.5rem"}}>{p.description}</p>
            {p.ai_tools && <p style={{fontSize:"0.75rem",color:"var(--muted)",lineHeight:1.5,marginBottom:"0.35rem"}}>🛠️ <strong style={{color:"var(--creamd)"}}>Tools:</strong> {p.ai_tools}</p>}
            <p style={{fontSize:"0.8rem",color:"var(--goldl)",lineHeight:1.5,fontStyle:"italic"}}>🛡️ {p.automation_shield || p.ai_leverage}</p>
          </div>
        ))}
      </div>
      {result.mindset_shift && (
        <div style={{marginTop:"1.2rem",padding:"1rem 1.2rem",background:"rgba(201,146,26,0.06)",borderLeft:"3px solid var(--goldd)"}}>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"var(--goldl)",letterSpacing:"0.08em",marginBottom:"0.3rem"}}>MINDSET SHIFT</p>
          <p style={{fontSize:"0.95rem",color:"var(--cream)",lineHeight:1.6}}>{result.mindset_shift}</p>
        </div>
      )}
    </div>
  )}
</div>);}

const GOV_FALLBACKS = {
  "Public Transportation": {
    topic:"Public Transportation",emoji:"🚌",
    good:{slogan:"\"Build the system. Trust the system. Fund the system.\"",title:"Integrated Transit Authority",points:["Unified fare system across MRT, LRT, buses, and jeepneys using one Beep card with automatic transfers","Data-driven route planning: AI analyzes ridership patterns to optimize schedules and reduce waiting times","Protected bike lanes + last-mile e-trike network so people don't need to walk 2km from the station","Transparent budget tracker: every citizen can see where the ₱X billion transport budget went, per project, in real time"],tone:"Singapore didn't have good transit in 1965 either. They decided to build it and stuck with the plan for 40 years."},
    bad:{slogan:"\"Uunahin ko ang commuter!\" *builds another skyway for cars*",title:"The Actual Current Vibe™",points:["MRT breaks down on a Monday. Official statement: 'We are looking into it.' Next Monday: same thing. Statement: copy-paste.","Jeepney modernization program announced in 2017, 'fully implemented' deadline moved to 2025, then 2027, then 2030, then ✨vibes✨","EDSA Busway works surprisingly well so naturally there are already plans to 'improve' it with something more expensive and less functional","₱200B budget for new rail lines that somehow costs ₱350B by the time it's half-built. The other half? 'Phase 2' — coming s**n™"],tone:"The traffic isn't the failure. The failure is that we've accepted it as a personality trait."},
  },
  "Public Education": {
    topic:"Public Education",emoji:"📚",
    good:{slogan:"\"Invest in teachers. The rest follows.\"",title:"Future-Ready Education System",points:["Curriculum updated every 3 years based on actual employer demand data — not textbooks from 2008","AI-assisted personalized learning: students who struggle get different exercises, not the same homework everyone fails","Teachers paid ₱50K+ starting with clear career progression, because you can't build a nation on underpaid heroes","Free broadband in every public school + device lending program so 'online class' doesn't mean 'screenshot class'"],tone:"South Korea rebuilt its entire education system after the war. It wasn't magic — it was budget priority + 30 years of consistency."},
    bad:{slogan:"\"Education is my top priority!\" *checks budget: defense got more*",title:"DepEd Reality Check",points:["K-12 was supposed to fix everything. Plot twist: graduates still can't get hired because the curriculum was designed by committee in 2012","Teachers buying chalk and paper from their own ₱25K salary while the department orders another 'digital transformation' study","Classrooms built for 40 students holding 65, but the official report says 'classroom shortage reduced by 15%' — technically true, spiritually bankrupt","₱X billion laptop procurement where half the units arrive broken and the other half have Windows 7. Year: 2026."],tone:"We don't have an education crisis. We have a 'we know what to do but keep choosing not to do it' crisis."},
  },
  "Healthcare System": {
    topic:"Healthcare System",emoji:"🏥",
    good:{slogan:"\"Healthcare is a right, not a privilege. Fund it like one.\"",title:"Universal Health Coverage That Works",points:["PhilHealth actually covers 90%+ of hospital costs instead of the current 'we cover 30% of the bill for the room but not the doctor, medicine, or oxygen' model","Rural telemedicine network: every barangay health center has video consult access to specialists in Manila, powered by AI triage","Medicine price regulation with teeth — not just 'suggested retail price' that pharmacies treat as a vague suggestion","Health workers paid living wages with rural assignment bonuses so provinces don't have zero doctors for 50,000 people"],tone:"Thailand achieved universal healthcare at a lower GDP per capita than the Philippines has right now. It's not about money. It's about priority."},
    bad:{slogan:"\"Universal healthcare para sa lahat!\" *lahat = lahat ng paperwork*",title:"DOH Moment",points:["PhilHealth: 'You're covered!' Hospital: 'That will be ₱45,000.' PhilHealth covered: ₱3,200. Patient: 'So I'm covered... in debt?'","Public hospitals where the hallway IS the ward, the waiting list for an MRI is 3 months, and 'libre' means 'free to wait forever'","Billions in pandemic funds that went to... actually nobody can fully explain where it went. Investigation ongoing since 2021. Still ongoing. Very on-going.","Nurses trained here, exported abroad, hospitals understaffed — but sure, let's open another nursing school"],tone:"We produce world-class healthcare workers. We just can't afford to keep them. That's not a flex — that's a business model failure."},
  },
  "Anti-Corruption": {
    topic:"Anti-Corruption",emoji:"🐊",
    good:{slogan:"\"Make stealing impossible, not just illegal.\"",title:"Transparent Digital Governance",points:["All government contracts on a public blockchain — every peso tracked from budget allocation to final payment, viewable by anyone","AI-powered anomaly detection: flags suspicious procurement patterns (like 5 bidders with the same address) automatically","Asset declaration verification: officials' SALN cross-referenced with actual property records, bank data, and lifestyle indicators using AI","Whistleblower protection + bounty system: report corruption, get 10% of recovered funds, guaranteed witness protection"],tone:"Estonia digitized its entire government. Corruption dropped because you can't steal what everyone can see."},
    bad:{slogan:"\"Zero tolerance for corruption!\" *tolerance: still loading... 0%... 0%...*",title:"Corruption: A Love Story",points:["SALN says net worth is ₱2M. Drives a Porsche. Lives in a mansion. 'It belongs to my friend.' Case closed. Next!","'Pork barrel' was abolished in 2013. Then reappeared as 'Congressional insertions.' Same pig, different lipstick. 🐷","Investigation launched → media coverage → Senate hearing → dramatic speech → 'we will file charges' → nothing happens → repeat next scandal","Anti-corruption agency budget: ₱X million. Amount lost to corruption annually: ₱X billion. The math isn't mathing."],tone:"We don't lack anti-corruption laws. We lack anti-corruption follow-through. The laws exist. The political will is in witness protection."},
  },
  "Internet & Digital Infrastructure": {
    topic:"Internet & Digital Infrastructure",emoji:"📡",
    good:{slogan:"\"Internet is a utility. Regulate it like water and power.\"",title:"Digital Philippines 2030",points:["Minimum 100Mbps broadband to every municipality, subsidized for low-income households — internet as a utility, not a luxury","Open-access tower policy: one tower, multiple providers, so telcos compete on service quality instead of coverage monopoly","Free public WiFi that actually works — not 'FreeWiFi' that connects but loads nothing while collecting your data","Digital ID system that streamlines government transactions: one login, all agencies, no more 47 photocopies of your birth certificate"],tone:"India connected 600,000 villages to broadband in 5 years. The Philippines has 42,000 barangays. It's a choice, not a constraint."},
    bad:{slogan:"\"Digital transformation na!\" *website still requires Internet Explorer 8*",title:"#ISPain",points:["Paying ₱1,899/month for '100Mbps' that delivers 12Mbps at 9PM. Speed test done at 3AM for the advertisement. Technically correct™.","'Fiber is available in your area!' Technician arrives: 'Sir, sa kabilang street lang po talaga.' Your street: copper wire from 2003.","DITO Telecommunity launched as the third player to 'break the duopoly.' Three years later: Globe and Smart still vibing. DITO: buffering...","Government free WiFi project in public spaces. Speed: enough to load a Google search. Maybe. On a good day. If the router feels like it."],tone:"We literally have 'internet café' as a childhood memory because home internet was a luxury. In 2026, it still is for many families."},
  },
};

function GovernanceAnalyzer(){
  const topics = Object.keys(GOV_FALLBACKS);
  const [selected, setSelected] = React.useState(null);
  const [custom, setCustom] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [live, setLive] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/claude", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:10,messages:[{role:"user",content:"Say ok"}]}),
        });
        setLive(r.ok);
      } catch { setLive(false); }
    })();
  }, []);

  const analyze = async (topic) => {
    const t = topic || custom;
    if (!t.trim()) return;
    setSelected(topic || t);
    if (live === false) {
      const fb = GOV_FALLBACKS[t];
      if (fb) { setResult(fb); return; }
      setResult(GOV_FALLBACKS[topics[0]]); return;
    }
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1200,
          system: `You analyze Philippine governance topics by showing two sides: ideal good governance vs the actual reality (bad governance). Be funny, sharp, culturally specific to PH. Use Taglish where natural. For anything explicit use asterisks (e.g. b*llsh*t, f**k). Respond in EXACT JSON, no other text:
{"topic":"(echo)","emoji":"(relevant emoji)","good":{"slogan":"(an aspirational one-line campaign tagline for a politician who ACTUALLY means it — idealistic, sharp, max 10 words)","title":"(aspirational title)","points":["(4 specific policy points that would actually work — reference real countries that did it right)"],"tone":"(1-2 sentence inspirational closer)"},"bad":{"slogan":"(a sarcastic campaign slogan in quotes, followed by asterisk and what actually happens — funny, max 15 words)","title":"(sarcastic title)","points":["(4 specific, funny, painfully accurate descriptions of the current reality — be specific about agencies, programs, or incidents everyone knows)"],"tone":"(1-2 sentence sardonic closer that hits hard)"}}
The good side should be genuinely inspiring with real examples. The bad side should be cathartic, funny, and accurate — the kind of thing everyone thinks but nobody says in a government meeting.`,
          messages:[{role:"user",content:`Analyze this Philippine governance topic — good vs bad: ${t}`}],
        }),
      });
      const data = await res.json();
      const raw = data.content?.map(c => c.text || "").join("") || "";
      setResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch(e) {
      const fb = GOV_FALLBACKS[t];
      if (fb) { setResult(fb); setLive(false); }
      else { setResult(GOV_FALLBACKS[topics[0]]); setLive(false); }
    }
    setLoading(false);
  };

  return(
<div>
  {live === false && (
    <div style={{marginBottom:"1rem",padding:"0.6rem 1rem",background:"rgba(201,146,26,0.06)",border:"1px solid rgba(201,146,26,0.15)",display:"flex",alignItems:"center",gap:"0.5rem"}}>
      <span style={{fontSize:"0.85rem"}}>💡</span>
      <p style={{fontSize:"0.8rem",color:"var(--creamd)",lineHeight:1.5}}>Showing pre-generated analysis. <strong style={{color:"var(--goldl)"}}>Open in <a href="https://claude.ai" target="_blank" rel="noopener" style={{color:"var(--goldl)",textDecoration:"underline"}}>claude.ai</a></strong> to generate fresh takes on any governance topic.</p>
    </div>
  )}

  <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:"var(--muted)",marginBottom:"0.6rem",letterSpacing:"0.06em"}}>{live === false ? "SELECT A TOPIC TO SEE EXAMPLE ANALYSIS" : "PICK A TOPIC OR TYPE YOUR OWN"}</p>
  <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1rem"}}>
    {topics.map((t,i) => (
      <button key={i} onClick={() => { setCustom(""); analyze(t); }} style={{
        padding:"0.45rem 0.8rem",cursor:"pointer",
        background: selected === t ? "rgba(201,146,26,0.12)" : "rgba(255,255,255,0.03)",
        border: selected === t ? "1px solid rgba(201,146,26,0.35)" : "1px solid rgba(255,255,255,0.08)",
        fontSize:"0.8rem",color: selected === t ? "var(--goldl)" : "var(--creamd)",transition:"all 0.2s",
      }}>{GOV_FALLBACKS[t]?.emoji} {t}</button>
    ))}
  </div>

  {/* Custom input — only when API is available */}
  {live !== false && (
    <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem"}}>
      <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="Or type any PH governance topic... (e.g. 'War on Drugs', 'OFW Support', 'Flood Control')"
        onKeyDown={e => e.key === "Enter" && analyze()}
        style={{flex:1,padding:"0.7rem 1rem",background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--cream)",fontSize:"0.9rem",fontFamily:"'Barlow',sans-serif",outline:"none"}}
      />
      <button onClick={() => analyze()} disabled={loading} style={{
        padding:"0.7rem 1.5rem",cursor: loading ? "wait" : "pointer",
        background: loading ? "rgba(201,146,26,0.1)" : "rgba(201,146,26,0.15)",
        border:"1px solid rgba(201,146,26,0.3)",
        fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"0.95rem",color:"var(--goldl)",
      }}>{loading ? "Analyzing..." : "Analyze 🏛️"}</button>
    </div>
  )}

  {loading && <WittySpinner type="gov"/>}

  {!loading && result && (
    <div style={{animation:"rr-fadeUp 0.4s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
        {/* Good Governance */}
        <div style={{background:"rgba(134,239,172,0.04)",border:"1px solid rgba(134,239,172,0.15)",padding:"1.2rem"}}>
          {result.good.slogan && <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"clamp(1rem,1.8vw,1.2rem)",color:"#86efac",lineHeight:1.35,marginBottom:"0.8rem",paddingBottom:"0.6rem",borderBottom:"1px solid rgba(134,239,172,0.12)"}}>🎤 {result.good.slogan}</p>}
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.8rem"}}>
            <span style={{fontSize:"1.2rem"}}>✅</span>
            <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.05rem",color:"#86efac"}}>{result.good.title}</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
            {(result.good.points||[]).map((p,i) => (
              <div key={i} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"#86efac",marginTop:3,flexShrink:0}}>{i+1}.</span>
                <p style={{fontSize:"0.82rem",color:"var(--creamd)",lineHeight:1.55}}>{p}</p>
              </div>
            ))}
          </div>
          {result.good.tone && <p style={{fontSize:"0.8rem",color:"#86efac",lineHeight:1.5,marginTop:"0.8rem",paddingTop:"0.6rem",borderTop:"1px solid rgba(134,239,172,0.1)",fontStyle:"italic"}}>{result.good.tone}</p>}
        </div>

        {/* Bad Governance */}
        <div style={{background:"rgba(248,113,113,0.04)",border:"1px solid rgba(248,113,113,0.15)",padding:"1.2rem"}}>
          {result.bad.slogan && <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"clamp(1rem,1.8vw,1.2rem)",color:"#F87171",lineHeight:1.35,marginBottom:"0.8rem",paddingBottom:"0.6rem",borderBottom:"1px solid rgba(248,113,113,0.12)"}}>🎤 {result.bad.slogan}</p>}
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.8rem"}}>
            <span style={{fontSize:"1.2rem"}}>💀</span>
            <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.05rem",color:"#F87171"}}>{result.bad.title}</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
            {(result.bad.points||[]).map((p,i) => (
              <div key={i} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"#F87171",marginTop:3,flexShrink:0}}>{i+1}.</span>
                <p style={{fontSize:"0.82rem",color:"var(--creamd)",lineHeight:1.55}}>{p}</p>
              </div>
            ))}
          </div>
          {result.bad.tone && <p style={{fontSize:"0.8rem",color:"#F87171",lineHeight:1.5,marginTop:"0.8rem",paddingTop:"0.6rem",borderTop:"1px solid rgba(248,113,113,0.1)",fontStyle:"italic"}}>{result.bad.tone}</p>}
        </div>
      </div>

      {/* Bottom note */}
      <div style={{marginTop:"1rem",padding:"0.8rem 1rem",background:"rgba(201,146,26,0.06)",borderLeft:"3px solid var(--goldd)"}}>
        <p style={{fontSize:"0.85rem",color:"var(--creamd)",lineHeight:1.6}}><strong style={{color:"var(--goldl)"}}>The point:</strong> AI can map out what good governance looks like in seconds — the research, the comparisons, the policy frameworks. The problem was never "we don't know what to do." It's always been about will. <strong style={{color:"var(--goldl)"}}>Your generation gets to be the one that actually does it.</strong></p>
      </div>
    </div>
  )}
</div>);}

function AIReveal(){return(
<section className="sec" style={{background:"linear-gradient(to bottom, var(--darkgreen), var(--forest))"}}>
  <div className="max" style={{maxWidth:"48rem"}}>
    <Reveal>
      <Label>Remember Those Demos?</Label>
      <h2 className="rr-display" style={{fontSize:"clamp(2rem,4vw,3rem)",marginTop:"0.8rem",marginBottom:"1.5rem"}}>Everything You Just Used Was Built With a <span style={{color:"var(--goldl)"}}>Prompt</span></h2>
    </Reveal>

    <Reveal delay={1}>
      <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.8,marginBottom:"2rem",textAlign:"center"}}>The Tito/Tita Analyzer? Not a database. The Career Futureproofer? Not a lookup table. The Governance Analyzer? Not a political science thesis. Each one was Claude receiving a carefully written prompt — a <strong style={{color:"var(--goldl)"}}>role</strong>, <strong style={{color:"var(--goldl)"}}>context</strong>, <strong style={{color:"var(--goldl)"}}>constraints</strong>, and a <strong style={{color:"var(--goldl)"}}>format</strong> — and generating a unique response in real time.</p>
    </Reveal>

    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.8rem",marginBottom:"2rem"}}>
      {[
        {emoji:"🧓",name:"Tito/Tita Analyzer",prompt:"\"Analyze this career advice. Return verdict, emotional_bias, reality_2026, what_actually_works, love_rating.\"",insight:"Role + structured output = an entire app."},
        {emoji:"🔀",name:"Career + AI Futureproof",prompt:"\"Given a degree, show 3 paths combining it with AI. Include ai_tools, automation_shield, salary.\"",insight:"Specificity + constraints = personalized results."},
        {emoji:"🏛️",name:"Good vs Bad Governance",prompt:"\"Show two sides: ideal policy vs actual reality. 4 points each. Be funny but accurate.\"",insight:"Dual framing + cultural context = catharsis + clarity."},
      ].map((d,i) => (
        <Reveal key={i} delay={i+2}>
          <div style={{background:"rgba(0,0,0,0.25)",border:"1px solid rgba(255,255,255,0.06)",padding:"1.2rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.6rem"}}>
              <span style={{fontSize:"1.2rem"}}>{d.emoji}</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1rem",color:"var(--cream)"}}>{d.name}</span>
            </div>
            <div style={{background:"rgba(0,0,0,0.3)",padding:"0.6rem 0.8rem",marginBottom:"0.6rem",borderLeft:"2px solid rgba(201,146,26,0.3)"}}>
              <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:"var(--creamd)",lineHeight:1.5}}>{d.prompt}</p>
            </div>
            <p style={{fontSize:"0.85rem",color:"var(--goldl)",lineHeight:1.5}}>{d.insight}</p>
          </div>
        </Reveal>
      ))}
    </div>

    <Reveal delay={4}>
      <div style={{padding:"1.2rem 1.5rem",background:"rgba(201,146,26,0.08)",borderLeft:"3px solid var(--goldd)",textAlign:"center"}}>
        <p style={{fontSize:"1.1rem",color:"var(--cream)",lineHeight:1.7,fontWeight:500}}>You didn't use three apps. You used <strong style={{color:"var(--goldl)"}}>three prompts.</strong></p>
        <p style={{fontSize:"0.95rem",color:"var(--creamd)",lineHeight:1.7,marginTop:"0.5rem"}}>The skill isn't knowing how to code an app. It's knowing how to <strong style={{color:"var(--goldl)"}}>think clearly enough to write the right instruction.</strong> That's the skill this talk is about.</p>
      </div>
    </Reveal>

    <Reveal delay={5}>
      <div style={{marginTop:"2rem",padding:"1.5rem 2rem",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(201,146,26,0.2)",textAlign:"center"}}>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:"var(--muted)",letterSpacing:"0.12em",marginBottom:"0.8rem"}}>ONE MORE THING</p>
        <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(1.4rem,3vw,2.2rem)",color:"var(--cream)",lineHeight:1.3}}>This entire presentation — every section, every animation, every line of code — was built with <span style={{color:"var(--goldl)"}}>Claude Opus 4.6.</span></p>
        <div style={{width:"3rem",height:"2px",background:"var(--gold)",margin:"1.2rem auto",opacity:0.3}}/>
        <p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.7}}>3,000+ lines of React. Interactive demos. Animated charts. Typewriter effects. Confetti. <strong style={{color:"var(--goldl)"}}>Zero lines of code written by hand.</strong></p>
        <p style={{fontSize:"0.9rem",color:"var(--muted)",lineHeight:1.7,marginTop:"0.8rem",fontStyle:"italic"}}>The person who made this isn't a React developer. He's a Webflow developer who knew how to describe what he wanted. That's the point.</p>

        {/* How it was built */}
        <div style={{marginTop:"2rem",padding:"1.5rem",background:"rgba(201,146,26,0.06)",border:"1px solid rgba(201,146,26,0.12)",textAlign:"left"}}>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:"var(--goldl)",letterSpacing:"0.12em",marginBottom:"1rem"}}>HOW THIS WAS MADE</p>
          <div style={{display:"flex",gap:"1.5rem",alignItems:"flex-start",flexWrap:"wrap"}}>
            <img src="/phone-build.jpg" alt="Building the Rice Race on a phone" style={{width:"140px",height:"auto",borderRadius:"4px",border:"1px solid rgba(201,146,26,0.2)",flexShrink:0}} />
            <div style={{flex:1,minWidth:"220px"}}>
              <div style={{display:"flex",flexDirection:"column",gap:"0.8rem"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:"0.6rem"}}>
                  <span style={{color:"var(--goldl)",fontSize:"1.1rem",lineHeight:1}}>①</span>
                  <p style={{fontSize:"0.85rem",color:"var(--creamd)",lineHeight:1.6}}>Started as a <strong style={{color:"var(--goldl)"}}>Claude Artifact</strong> — built entirely through conversation with Claude AI on a phone.</p>
                </div>
                <div style={{display:"flex",alignItems:"flex-start",gap:"0.6rem"}}>
                  <span style={{color:"var(--goldl)",fontSize:"1.1rem",lineHeight:1}}>②</span>
                  <p style={{fontSize:"0.85rem",color:"var(--creamd)",lineHeight:1.6}}>Deployed to <strong style={{color:"var(--goldl)"}}>Vercel</strong> from a phone — yes, a phone — because why not.</p>
                </div>
                <div style={{display:"flex",alignItems:"flex-start",gap:"0.6rem"}}>
                  <span style={{color:"var(--goldl)",fontSize:"1.1rem",lineHeight:1}}>③</span>
                  <p style={{fontSize:"0.85rem",color:"var(--creamd)",lineHeight:1.6}}>Further updated with <strong style={{color:"var(--goldl)"}}>Claude Code</strong> — AI-powered terminal for live iteration and deployment.</p>
                </div>
              </div>
              <a href="https://claude.ai/public/artifacts/d704a2f3-8a46-4429-87cc-b27c06c57a0d" target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",marginTop:"1.2rem",padding:"0.6rem 1.2rem",background:"var(--gold)",color:"var(--forest)",fontFamily:"'Space Mono',monospace",fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",textDecoration:"none",transition:"background 0.2s"}}>✦ View Original Artifact</a>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  </div>
</section>);}

function Problem(){
  const trackRef = React.useRef(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (trackRef.current) obs.observe(trackRef.current);
    return () => obs.disconnect();
  }, []);

  const tracks = [
    { label: "RACE #1", name: "THE GRIND", id: "grind",
      lane1: { label: "IT/CS GRADUATES", emoji: "🎓", pct: 88, color: "#F87171" },
      lane2: { label: "ENTRY-LEVEL JOBS", emoji: "💼", pct: 32, color: "#6B7280" },
      verdict: "More runners. Fewer lanes.", bg: "#1a0808" },
    { label: "RACE #2", name: "THE BID", id: "bid",
      lane1: { label: "YOUR SALARY", emoji: "💰", pct: 45, color: "#F87171" },
      lane2: { label: "AI COST (FALLING)", emoji: "⚡", pct: 12, color: "#C9921A" },
      verdict: "You're expensive. AI isn't.", bg: "#1a0d08" },
    { label: "RACE #3", name: "THE PLATEAU", id: "plateau",
      lane1: { label: "YOUR SKILLS", emoji: "📈", pct: 42, color: "#F87171" },
      lane2: { label: "AI CAPABILITY", emoji: "🤖", pct: 82, color: "#C9921A" },
      verdict: "It's not slowing down. You are.", bg: "#0d0808" },
  ];

  return(
<section id="problem" className="sec" style={{background:"linear-gradient(to bottom, var(--forest), #0F0505)",overflow:"hidden"}}>
  <div className="max">
    <Reveal><Label>01 - The Problem</Label></Reveal>

    {/* Top: headline + stats */}
    <div className="grid-2" style={{gap:"3.5rem",marginTop:"2.5rem",alignItems:"start"}}>
      <Reveal>
        <h2 className="rr-display" style={{fontSize:"clamp(3.5rem,7vw,6.5rem)",marginBottom:"1.5rem"}}>Three<br/>Races.<br/>One <span style={{color:"var(--goldl)"}}>Field.</span></h2>
        <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.75}}>The traditional path — study hard, get the diploma, find a stable job — was designed for a world that no longer fully exists. Entry-level job postings fell <strong style={{color:"var(--goldl)"}}>29%</strong> globally since January 2024.<CiteTip label="WEF / Randstad 2025" body="Based on analysis of 126 million job postings worldwide." url="https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/"/> The field shrank before you even stepped onto it.</p>
      </Reveal>
      <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
        {[{num:"-29%",desc:"Entry-level job postings globally since Jan 2024",src:"WEF / Randstad / 2025"},{num:"59%",desc:"of Filipinos cite job security as top financial concern",src:"TransUnion Consumer Pulse PH / Q2 2025"},{num:"2.54M",desc:"Filipinos unemployed in Oct 2025 — during holiday hiring season",src:"PSA / October 2025"}].map((s,i)=>(<Reveal key={i} delay={i+1}><div className="statcard"><div className="statcard-num"><OdometerNumber value={s.num}/></div><div className="statcard-desc">{s.desc}</div><div className="statcard-src">{s.src}</div></div></Reveal>))}
      </div>
    </div>

    {/* Transition into tracks */}
    <Reveal>
      <div style={{textAlign:"center",margin:"4rem 0 2rem"}}>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:"var(--redl)",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>YOU ARE HERE</p>
        <h3 className="rr-display" style={{fontSize:"clamp(1.8rem,3.5vw,2.8rem)"}}>You're Losing <span style={{color:"var(--redl)"}}>All Three.</span></h3>
      </div>
    </Reveal>

    {/* Race tracks */}
    <div ref={trackRef} style={{display:"flex",flexDirection:"column",gap:"1.5rem",maxWidth:"56rem",margin:"0 auto"}}>
      {tracks.map((t, ti) => (
        <Reveal key={ti} delay={ti + 1}>
          <a href={"#" + t.id} style={{textDecoration:"none",display:"block"}}>
            <div style={{background:t.bg,border:"1px solid rgba(255,255,255,0.05)",padding:"1.2rem 1.5rem",overflow:"hidden",transition:"border-color 0.25s",cursor:"pointer"}}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
            >
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.85rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"var(--redl)",letterSpacing:"0.08em"}}>{t.label}</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.15rem",color:"var(--cream)",letterSpacing:"0.03em"}}>{t.name}</span>
                </div>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"var(--muted)"}}>→</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                {[t.lane1, t.lane2].map((lane, li) => (
                  <div key={li} style={{position:"relative",height:36,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.04)",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:"50%",left:0,right:0,borderTop:"1px dashed rgba(255,255,255,0.06)"}}/>
                    <div style={{position:"absolute",left:0,top:0,bottom:0,width:2,background:"rgba(255,255,255,0.1)"}}/>
                    <div style={{position:"absolute",right:0,top:0,bottom:0,width:2,background:"rgba(255,255,255,0.08)"}}/>
                    {[25,50,75].map(m => <div key={m} style={{position:"absolute",left:m+"%",top:0,bottom:0,width:1,background:"rgba(255,255,255,0.03)"}}/>)}
                    <div style={{position:"absolute",top:3,bottom:3,left:0,width: vis ? lane.pct+"%" : "0%",background:`linear-gradient(90deg, ${lane.color}25, ${lane.color}40)`,borderRight:`3px solid ${lane.color}`,transition:`width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${ti*0.15+li*0.1}s`}}/>
                    <div style={{position:"absolute",left: vis ? `calc(${lane.pct}% - 14px)` : "-14px",top:"50%",transform:"translateY(-50%)",width:28,height:28,borderRadius:"50%",background:lane.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",boxShadow:`0 0 12px ${lane.color}60`,transition:`left 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${ti*0.15+li*0.1}s`,zIndex:2}}>{lane.emoji}</div>
                    <div style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",zIndex:1}}>
                      <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.55rem",color:"rgba(255,255,255,0.3)",letterSpacing:"0.04em"}}>{lane.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:"var(--redl)",letterSpacing:"0.06em",marginTop:"0.65rem",opacity:0.7}}>{t.verdict}</p>
            </div>
          </a>
        </Reveal>
      ))}
    </div>

    <Reveal delay={4}>
      <p style={{textAlign:"center",fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:"var(--muted)",marginTop:"1.5rem",letterSpacing:"0.06em"}}>↓ SCROLL TO SEE EACH RACE IN DETAIL ↓</p>
    </Reveal>
  </div>
</section>);}

/* ── SPREAD CHARTS ───────────────────────────────────────── */

const GRIND_DATA = [
  { year:"'18", grads:78, jobs:100 },
  { year:"'19", grads:85, jobs:96 },
  { year:"'20", grads:90, jobs:82 },
  { year:"'21", grads:95, jobs:78 },
  { year:"'22", grads:102, jobs:74 },
  { year:"'23", grads:110, jobs:68 },
  { year:"'24", grads:118, jobs:55 },
  { year:"'25", grads:125, jobs:42 },
];

const PLATEAU_DATA = [
  { year:"Yr 1", skill:90, ai:8 },
  { year:"Yr 2", skill:92, ai:14 },
  { year:"Yr 3", skill:88, ai:25 },
  { year:"Yr 4", skill:85, ai:40 },
  { year:"Yr 5", skill:82, ai:58 },
  { year:"Yr 6", skill:78, ai:72 },
  { year:"Yr 7", skill:74, ai:85 },
  { year:"Yr 8", skill:68, ai:95 },
];

function SpreadChart({ data, line1Key, line2Key, line1Color, line2Color, line1Label, line2Label, xKey, yDomain }) {
  const [ref, visible] = useReveal(0.2);
  const [show, setShow] = useState(false);
  useEffect(() => { if (visible) { const t = setTimeout(() => setShow(true), 200); return () => clearTimeout(t); } }, [visible]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "rgba(13,26,13,0.95)", border: "1px solid rgba(201,146,26,0.25)", padding: "0.6rem 0.8rem", fontFamily: "'Space Mono',monospace", fontSize: "0.7rem" }}>
        <div style={{ color: "var(--creamd)", marginBottom: "0.3rem", letterSpacing: "0.06em" }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, lineHeight: 1.6 }}>{p.name}: {p.value}</div>
        ))}
      </div>
    );
  };

  return (
    <div ref={ref} style={{ width: "100%", opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
      {/* Legend */}
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "1.5rem", height: "3px", background: line1Color }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: line1Color, letterSpacing: "0.08em" }}>{line1Label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "1.5rem", height: "0", borderTop: "3px dashed " + line2Color, opacity: 0.8 }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: line2Color, letterSpacing: "0.08em" }}>{line2Label}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={show ? data : data.map(d => ({ ...d, [line1Key]: 50, [line2Key]: 50 }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${line1Key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={line1Color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={line1Color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`grad-${line2Key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={line2Color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={line2Color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tickLine={false} />
          <YAxis domain={yDomain || [0, 140]} tick={{ fill: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono',monospace", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey={line1Key} stroke={line1Color} strokeWidth={2.5} fill={`url(#grad-${line1Key})`} name={line1Label} dot={false} animationDuration={1500} animationEasing="ease-out" />
          <Area type="monotone" dataKey={line2Key} stroke={line2Color} strokeWidth={2.5} strokeDasharray="6 4" fill={`url(#grad-${line2Key})`} name={line2Label} dot={false} animationDuration={1500} animationEasing="ease-out" />
        </AreaChart>
      </ResponsiveContainer>
      {/* Gap annotation */}
      <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "rgba(248,113,113,0.5)", letterSpacing: "0.1em" }}>THE GAP IS THE GRIND</span>
      </div>
    </div>
  );
}

function RaceGrind(){return(
<section id="grind" className="sec" style={{background:"linear-gradient(to bottom, #0F0505, #0A0305)"}}>
  <div className="max">
    <Reveal>
      <Label color="var(--redl)">Race #1</Label>
      <h2 className="rr-display" style={{fontSize:"clamp(3rem,6vw,5.5rem)",marginTop:"0.5rem",marginBottom:"1rem"}}>Race #1:<br/><span style={{color:"#F87171"}}>The Grind</span></h2>
      <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.75,maxWidth:"40rem",marginBottom:"2.5rem"}}>Everyone competing for the same shrinking number of entry-level positions.<CiteTip label="WEF Future of Jobs 2025" body="Entry-level postings fell 29% globally since Jan 2024. 41% of employers plan to reduce workforce in AI-exposed roles." url="https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/"/> More graduates, fewer openings, longer timelines. <strong style={{color:"var(--redl)"}}>Nobody told you the starting gun had already fired.</strong></p>
    </Reveal>
    <SpreadChart
      data={GRIND_DATA}
      xKey="year"
      line1Key="grads"
      line2Key="jobs"
      line1Color="#F87171"
      line2Color="#EF4444"
      line1Label="IT/CS GRADUATES (INDEX)"
      line2Label="ENTRY-LEVEL POSTINGS (INDEX)"
      yDomain={[0, 140]}
    />
    <Reveal delay={1}>
      <div style={{display:"flex",gap:"1.5rem",marginTop:"2.5rem",flexWrap:"wrap",justifyContent:"center"}}>
        {[{num:"-29%",desc:"Entry-level postings since Jan 2024",src:"WEF / Randstad"},{num:"2.54M",desc:"Filipinos unemployed, Oct 2025",src:"PSA"}].map((s,i)=>(
          <div key={i} style={{flex:"1 1 200px",maxWidth:"260px",borderTop:"3px solid rgba(185,28,28,0.5)",padding:"1.25rem",background:"rgba(0,0,0,0.35)",textAlign:"center"}}>
            <div className="statcard-num" style={{color:"var(--redl)",fontSize:"2rem"}}><OdometerNumber value={s.num}/></div>
            <p style={{fontSize:"0.85rem",color:"var(--creamd)",lineHeight:1.5,marginTop:"0.4rem"}}>{s.desc}</p>
            <p style={{fontSize:"0.7rem",color:"var(--goldd)",marginTop:"0.3rem",fontFamily:"'Space Mono',monospace"}}>{s.src}</p>
          </div>
        ))}
      </div>
    </Reveal>
  </div>
</section>);}

function RaceDisruption(){
  const RATE = 60;
  const AI_RATIO = 0.03;
  const [amount, setAmount] = React.useState(1);
  const [isPHP, setIsPHP] = React.useState(true);

  // Always compute in USD internally
  const usdVal = isPHP ? amount / RATE : amount;
  const aiUsd = usdVal * AI_RATIO;
  const displayRate = isPHP ? amount : amount * RATE;
  const displayAI = isPHP ? aiUsd * RATE : aiUsd;
  const symbol = isPHP ? "₱" : "$";
  const mult = usdVal > 0 ? Math.round(1 / AI_RATIO) : 0;

  const fmt = (n) => n < 0.01 && n > 0 ? n.toFixed(4) : n < 1 ? n.toFixed(2) : Number(n.toFixed(2)).toLocaleString();

  const inputStyle = { background:"none", border:"none", borderBottom:"2px solid var(--redl)", color:"var(--redl)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"inherit", width:`${Math.max(2, String(amount).length + 1)}ch`, textAlign:"center", outline:"none", caretColor:"var(--redl)" };

  return(
<section id="disruption" className="sec" style={{background:"linear-gradient(to bottom, #130606, #0D0404)",textAlign:"center"}}>
  <div className="max" style={{maxWidth:"56rem"}}>
    <Reveal><Label color="var(--redl)">Race #2</Label><h2 className="rr-display" style={{fontSize:"clamp(3rem,6vw,5.5rem)",marginTop:"0.5rem",marginBottom:"2rem"}}><span style={{color:"#FF4444"}}>The Disruption</span></h2></Reveal>
    <Reveal delay={1}>
      {/* Currency toggle */}
      <div style={{display:"flex",justifyContent:"center",marginBottom:"2rem"}}>
        <div style={{display:"inline-flex",border:"1px solid rgba(201,146,26,0.25)",overflow:"hidden"}}>
          <button onClick={()=>{setIsPHP(false);setAmount(isPHP?Math.round(amount/RATE*100)/100:amount);}} style={{fontFamily:"'Space Mono',monospace",fontSize:"0.8rem",letterSpacing:"0.08em",padding:"0.5rem 1.5rem",cursor:"pointer",border:"none",transition:"all 0.2s",background:!isPHP?"var(--gold)":"transparent",color:!isPHP?"var(--forest)":"var(--creamd)"}}>USD $</button>
          <button onClick={()=>{setIsPHP(true);setAmount(!isPHP?Math.round(amount*RATE):amount);}} style={{fontFamily:"'Space Mono',monospace",fontSize:"0.8rem",letterSpacing:"0.08em",padding:"0.5rem 1.5rem",cursor:"pointer",border:"none",borderLeft:"1px solid rgba(201,146,26,0.25)",transition:"all 0.2s",background:isPHP?"var(--gold)":"transparent",color:isPHP?"var(--forest)":"var(--creamd)"}}>PHP ₱</button>
        </div>
      </div>

      <div style={{display:"flex",alignItems:"stretch",justifyContent:"center",gap:"1.5rem",flexWrap:"wrap",marginBottom:"1.5rem"}}>
        {/* YOUR RATE */}
        <div style={{flex:"1 1 220px",maxWidth:"280px",background:"rgba(185,28,28,0.08)",border:"1px solid rgba(185,28,28,0.25)",padding:"1.5rem 2rem",textAlign:"center"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.72rem",color:"var(--redl)",letterSpacing:"0.12em",marginBottom:"0.75rem"}}>YOUR RATE</div>
          <div className="rr-display" style={{fontSize:"clamp(3rem,7vw,4.5rem)",color:"var(--redl)",lineHeight:1,display:"flex",alignItems:"baseline",justifyContent:"center"}}>
            <span>{symbol}</span>
            <input
              type="number"
              value={amount}
              onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= 0 && v <= 999999) setAmount(v); }}
              style={inputStyle}
              min="0" max="999999" step={isPHP ? 1 : 0.01}
            />
          </div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.85rem",color:"rgba(248,113,113,0.5)",marginTop:"0.4rem"}}>{isPHP ? `$${(amount/RATE).toFixed(2)}` : `₱${(amount*RATE).toLocaleString()}`}</div>
        </div>

        {/* Arrow */}
        <div style={{display:"flex",alignItems:"center",flexShrink:0}}><div className="rr-display" style={{fontSize:"2rem",color:"var(--goldd)"}}>&#8594;</div></div>

        {/* AI COST */}
        <div style={{flex:"1 1 220px",maxWidth:"280px",background:"rgba(201,146,26,0.06)",border:"1px solid rgba(201,146,26,0.2)",padding:"1.5rem 2rem",textAlign:"center"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.72rem",color:"var(--goldl)",letterSpacing:"0.12em",marginBottom:"0.75rem"}}>AI REPLACEMENT COST</div>
          <div className="rr-display" style={{fontSize:"clamp(3rem,7vw,4.5rem)",color:"var(--goldl)",lineHeight:1}}>{symbol}{fmt(displayAI)}</div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.85rem",color:"rgba(232,184,75,0.5)",marginTop:"0.4rem"}}>{isPHP ? `$${aiUsd.toFixed(4)}` : `₱${(aiUsd*RATE).toFixed(2)}`}</div>
        </div>
      </div>

      {/* Multiplier */}
      <div style={{marginBottom:"1.5rem"}}>
        <span style={{display:"inline-block",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.5rem",color:"var(--goldl)",background:"rgba(201,146,26,0.1)",border:"1px solid rgba(201,146,26,0.25)",padding:"0.4rem 1.2rem",letterSpacing:"0.05em"}}>{mult}x cheaper</span>
      </div>

      {/* Presets */}
      <div style={{display:"flex",gap:"0.5rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"2.5rem"}}>
        {(isPHP ? [56, 500, 5000, 28000, 56000] : [1, 100, 500, 1000, 5000]).map(v => (
          <button key={v} onClick={() => setAmount(v)} style={{fontFamily:"'Space Mono',monospace",fontSize:"0.75rem",color:amount===v?"var(--forest)":"var(--creamd)",background:amount===v?"var(--gold)":"rgba(255,255,255,0.05)",border:"1px solid " + (amount===v?"var(--gold)":"rgba(255,255,255,0.1)"),padding:"0.4rem 1rem",cursor:"pointer",transition:"all 0.2s",letterSpacing:"0.05em"}}>{symbol}{v.toLocaleString()}</button>
        ))}
      </div>
    </Reveal>
    <Reveal delay={2}>
      <p style={{fontSize:"1.15rem",color:"var(--creamd)",lineHeight:1.75,maxWidth:"40rem",margin:"0 auto"}}>More than half of businesses on Upwork/Fiverr in 2022 abandoned them entirely by 2025.<CiteTip label="Ramp - Payrolls to Prompts" body="First firm-level empirical study. Tracked thousands of companies' spend 2021-2025." url="https://arxiv.org/abs/2602.00139"/> <strong style={{color:"var(--redl)"}}>The platforms Filipinos built careers on are emptying out.</strong></p>
    </Reveal>
  </div>
</section>);}

function RacePlateau(){return(
<section id="plateau" className="sec" style={{background:"linear-gradient(to bottom, #0D0606, #090404)"}}>
  <div className="max">
    <Reveal>
      <Label color="var(--redl)">Race #3</Label>
      <h2 className="rr-display" style={{fontSize:"clamp(3rem,6vw,5.5rem)",marginTop:"0.5rem",marginBottom:"1rem"}}>Race #3:<br/><span style={{color:"#F87171"}}>The Plateau</span></h2>
      <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.75,maxWidth:"40rem",marginBottom:"2.5rem"}}>Some of you will land the role. Stable. Decent. Comfortable. And then — nothing moves.<CiteTip label="WEF Future of Jobs 2025" body="39% of core skills will change by 2030. 59 of 100 workers need training." url="https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/"/> <strong style={{color:"var(--redl)"}}>Executing tasks without learning to evaluate or direct them</strong> — that is exactly what AI comes for next.</p>
    </Reveal>
    <SpreadChartPlateau />
    <Reveal delay={1}>
      <div style={{display:"flex",gap:"1.5rem",marginTop:"2.5rem",flexWrap:"wrap",justifyContent:"center"}}>
        {[{num:"39%",desc:"of core job skills will change by 2030",src:"WEF / 2025"},{num:"59/100",desc:"workers will need reskilling this decade",src:"WEF / 2025"}].map((s,i)=>(
          <div key={i} style={{flex:"1 1 200px",maxWidth:"260px",borderTop:"3px solid rgba(185,28,28,0.5)",padding:"1.25rem",background:"rgba(0,0,0,0.35)",textAlign:"center"}}>
            <div className="statcard-num" style={{color:"var(--redl)",fontSize:"2rem"}}><OdometerNumber value={s.num}/></div>
            <p style={{fontSize:"0.85rem",color:"var(--creamd)",lineHeight:1.5,marginTop:"0.4rem"}}>{s.desc}</p>
            <p style={{fontSize:"0.7rem",color:"var(--goldd)",marginTop:"0.3rem",fontFamily:"'Space Mono',monospace"}}>{s.src}</p>
          </div>
        ))}
      </div>
    </Reveal>
  </div>
</section>);}

function SpreadChartPlateau() {
  const [ref, visible] = useReveal(0.2);
  const [show, setShow] = useState(false);
  useEffect(() => { if (visible) { const t = setTimeout(() => setShow(true), 200); return () => clearTimeout(t); } }, [visible]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "rgba(13,26,13,0.95)", border: "1px solid rgba(201,146,26,0.25)", padding: "0.6rem 0.8rem", fontFamily: "'Space Mono',monospace", fontSize: "0.7rem" }}>
        <div style={{ color: "var(--creamd)", marginBottom: "0.3rem", letterSpacing: "0.06em" }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, lineHeight: 1.6 }}>{p.name}: {p.value}</div>
        ))}
      </div>
    );
  };

  const crossIdx = PLATEAU_DATA.findIndex((d, i) => i > 0 && d.ai >= d.skill);

  return (
    <div ref={ref} style={{ width: "100%", opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "1.5rem", height: "3px", background: "#F87171" }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "#F87171", letterSpacing: "0.08em" }}>YOUR SKILL VALUE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "1.5rem", height: "3px", background: "#E8B84B" }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "#E8B84B", letterSpacing: "0.08em" }}>AI CAPABILITY</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={show ? PLATEAU_DATA : PLATEAU_DATA.map(d => ({ ...d, skill: 50, ai: 50 }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-plat-skill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#F87171" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grad-plat-ai" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8B84B" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#E8B84B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tickLine={false} />
          <YAxis domain={[0, 110]} tick={{ fill: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono',monospace", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          {crossIdx >= 0 && <ReferenceLine x={PLATEAU_DATA[crossIdx].year} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" label={{ value: "AI OVERTAKES", position: "top", fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'Space Mono',monospace" }} />}
          <Area type="monotone" dataKey="skill" stroke="#F87171" strokeWidth={2.5} fill="url(#grad-plat-skill)" name="YOUR SKILL VALUE" dot={false} animationDuration={1500} animationEasing="ease-out" />
          <Area type="monotone" dataKey="ai" stroke="#E8B84B" strokeWidth={2.5} fill="url(#grad-plat-ai)" name="AI CAPABILITY" dot={false} animationDuration={1500} animationEasing="ease-out" />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "rgba(232,184,75,0.5)", letterSpacing: "0.1em" }}>THE CROSSOVER IS THE CLIFF</span>
      </div>
    </div>
  );
}

function CostBar() {
  const [ref, visible] = useReveal(0.3);
  return (
    <div ref={ref} style={{ marginBottom: "3rem" }}>
      {/* Human bar */}
      <div style={{ marginBottom: "0.4rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "var(--redl)", letterSpacing: "0.08em" }}>$1.00 / ₱56 — HUMAN LABOR</span>
      </div>
      <div style={{ height: "2.5rem", background: "rgba(185,28,28,0.12)", position: "relative", overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ height: "100%", width: visible ? "100%" : "0%", background: "linear-gradient(to right, #B91C1C, #991B1B)", transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "1rem" }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "rgba(255,255,255,0.9)" }}>$1.00</span>
        </div>
      </div>
      {/* AI bar */}
      <div style={{ marginBottom: "0.4rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "var(--goldl)", letterSpacing: "0.08em" }}>$0.03 / ₱1.68 — AI COST</span>
      </div>
      <div style={{ height: "2.5rem", background: "rgba(201,146,26,0.06)", position: "relative", overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ height: "100%", width: visible ? "3%" : "0%", minWidth: visible ? "3.5rem" : "0", background: "linear-gradient(to right, #C9921A, #E8B84B)", transition: "width 1.4s cubic-bezier(0.16,1,0.3,1) 0.4s", boxShadow: visible ? "0 0 20px rgba(232,184,75,0.3)" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "var(--forest)", whiteSpace: "nowrap" }}>$0.03</span>
        </div>
      </div>
      {/* Multiplier */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.8rem", color: "var(--goldd)", letterSpacing: "0.1em", opacity: visible ? 1 : 0, transition: "opacity 0.6s 1.2s" }}>← 33x COST REDUCTION →</span>
      </div>
    </div>
  );
}

function CostBarWith() {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ marginBottom: "3rem" }}>
      <div style={{ marginBottom: "0.4rem" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.08em" }}>WITHOUT AI SKILLS</span>
      </div>
      <div style={{ height: "2.5rem", background: "rgba(255,255,255,0.03)", position: "relative", overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ height: "100%", width: visible ? "44%" : "0%", background: "linear-gradient(to right, rgba(255,255,255,0.12), rgba(255,255,255,0.08))", transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "1rem" }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "var(--creamd)" }}>Base Salary</span>
        </div>
      </div>
      <div style={{ marginBottom: "0.4rem" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "#86efac", letterSpacing: "0.08em" }}>WITH AI SKILLS (SAME JOB TITLE)</span>
      </div>
      <div style={{ height: "2.5rem", background: "rgba(134,239,172,0.04)", position: "relative", overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ height: "100%", width: visible ? "100%" : "0%", background: "linear-gradient(to right, #16a34a, #22c55e)", transition: "width 1.4s cubic-bezier(0.16,1,0.3,1) 0.4s", boxShadow: visible ? "0 0 20px rgba(34,197,94,0.2)" : "none", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "1rem" }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#052e16" }}>+126% Premium</span>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.8rem", color: "#86efac", letterSpacing: "0.1em", opacity: visible ? 1 : 0, transition: "opacity 0.6s 1.2s" }}>← SAME ROLE. DIFFERENT SKILLS. 2.26x PAY. →</span>
      </div>
    </div>
  );
}

function DataSection(){
  const [mode, setMode] = React.useState("vs");
  const isVs = mode === "vs";
  const data = isVs ? DATA_VS : DATA_WITH;

  const fireConfetti = () => {
    if (!window.confetti) return;
    // Burst from both sides
    const colors = ["#86efac","#22c55e","#C9921A","#E8B84B","#ffffff"];
    window.confetti({particleCount:80,spread:70,origin:{x:0.3,y:0.6},colors,gravity:0.8,scalar:1.1,ticks:120});
    window.confetti({particleCount:80,spread:70,origin:{x:0.7,y:0.6},colors,gravity:0.8,scalar:1.1,ticks:120});
    // Delayed center burst
    setTimeout(()=>{
      window.confetti({particleCount:40,spread:100,origin:{x:0.5,y:0.5},colors,gravity:0.6,scalar:0.9,ticks:100});
    },200);
  };
return(
<section id="data" className="sec" style={{background: isVs ? "linear-gradient(to bottom, #090D09, #0D1A0D)" : "linear-gradient(to bottom, #0D1A0D, #091A09)",transition:"background 0.6s ease"}}>
  <div className="max">
    <Reveal><Label>{isVs ? "The Disruption Data" : "The Opportunity Data"}</Label><h2 className="rr-display" style={{fontSize:"clamp(2.5rem,5.5vw,5rem)",marginTop:"0.8rem",marginBottom:"1.5rem"}}>{isVs ? <>The Numbers <span style={{color:"var(--redl)"}}>Hurt.</span></> : <>The Numbers <span style={{color:"#86efac"}}>Help.</span></>}</h2></Reveal>

    {/* Toggle */}
    <div style={{display:"flex",justifyContent:"center",marginBottom:"2.5rem"}}>
      <div style={{display:"inline-flex",border:"2px solid rgba(255,255,255,0.12)",overflow:"hidden"}}>
        <button onClick={()=>setMode("vs")} style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(1.2rem,2.5vw,1.6rem)",letterSpacing:"0.05em",padding:"0.9rem 2.5rem",cursor:"pointer",border:"none",transition:"all 0.3s",background:isVs?"rgba(185,28,28,0.3)":"transparent",color:isVs?"#F87171":"var(--muted)",position:"relative",zIndex:1}}>⚔️ vs AI</button>
        <button onClick={()=>{setMode("with");fireConfetti();}} style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(1.2rem,2.5vw,1.6rem)",letterSpacing:"0.05em",padding:"0.9rem 2.5rem",cursor:"pointer",border:"none",borderLeft:"2px solid rgba(255,255,255,0.08)",transition:"all 0.3s",background:!isVs?"rgba(22,163,74,0.25)":"transparent",color:!isVs?"#86efac":"var(--muted)",position:"relative",zIndex:1}}>🌾 with AI</button>
      </div>
    </div>

    {isVs ? <CostBar /> : <CostBarWith />}
    <div key={mode} style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1px",background:isVs?"rgba(185,28,28,0.08)":"rgba(22,163,74,0.06)",marginBottom:"2.5rem"}}>
      {data.map((d,i)=>(<Reveal key={mode+i} delay={i%2+1}><div className="dcard" style={!isVs?{borderColor:"rgba(22,163,74,0.12)"}:{}}><div className="dcard-stat" style={!isVs?{color:"#86efac"}:{}}>{d.isCurrency?<CurrencyFlip usd={d.statUSD} php={d.statPHP}/>:<OdometerNumber value={d.stat}/>}</div><p className="dcard-body">{d.desc}</p><div style={{display:"flex",alignItems:"center",marginTop:"0.75rem"}}><span className="dcard-src">{d.src}</span><CiteTip label={d.tipLabel} body={d.tipBody} url={d.url}/></div></div></Reveal>))}
    </div>
    <Reveal><p style={{fontSize:"1.05rem",color:"var(--muted)",textAlign:"center",fontStyle:"italic"}}>{isVs ? "This already happened. The question is what you do next." : "Same economy. Same AI. Different positioning. That's the whole game."}</p></Reveal>
  </div>
</section>);}

function Reframe(){return(
<section className="act-break" style={{minHeight:"100vh",background:"radial-gradient(ellipse 70% 55% at 50% 50%,rgba(42,107,42,0.15) 0%,transparent 70%), var(--forest)"}}>
  <Reveal><Label>The Reframe</Label></Reveal>
  <Reveal delay={1}><h2 className="rr-display" style={{fontSize:"clamp(4.5rem,12vw,11rem)",marginTop:"1.5rem",lineHeight:0.9}}>Rice Is Not Caught.</h2></Reveal>
  <Reveal delay={2}><h2 className="rr-display" style={{fontSize:"clamp(4.5rem,12vw,11rem)",color:"var(--goldl)",lineHeight:0.9,marginTop:"0.5rem"}}>It Is Grown.</h2></Reveal>
</section>);}

function QuoteSection(){return(
<section className="sec" style={{background:"var(--darkgreen)",overflow:"hidden",position:"relative",minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",paddingTop:"6rem",paddingBottom:"6rem"}}>
  <div style={{position:"absolute",top:"-5rem",left:"-2rem",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(20rem,40vw,45rem)",color:"transparent",WebkitTextStroke:"1px rgba(201,146,26,0.03)",pointerEvents:"none",lineHeight:1}} aria-hidden="true">"</div>
  <div style={{position:"absolute",bottom:"-5rem",right:"-2rem",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(20rem,40vw,45rem)",color:"transparent",WebkitTextStroke:"1px rgba(201,146,26,0.03)",pointerEvents:"none",lineHeight:1,transform:"rotate(180deg)"}} aria-hidden="true">"</div>
  <div className="max" style={{position:"relative",zIndex:2,maxWidth:"64rem",textAlign:"center"}}>
    <Reveal>
      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(8rem,16vw,14rem)",color:"var(--gold)",lineHeight:0.4,opacity:0.35,display:"block",marginBottom:"2rem"}} aria-hidden="true">"</span>
      <p style={{fontFamily:"'Barlow',sans-serif",fontWeight:300,fontSize:"clamp(2.2rem,4.5vw,4rem)",color:"var(--cream)",lineHeight:1.3,letterSpacing:"-0.01em"}}>A <strong style={{fontWeight:700,color:"var(--goldl)"}}>25-year-old</strong> in <span style={{color:"var(--goldl)"}}><TypewriterCity/></span> can probably do <strong style={{fontWeight:700,color:"var(--goldl)",fontSize:"1.15em"}}>more</strong> than any previous 25-year-old in history could.</p>
      <div style={{width:"4rem",height:"2px",background:"var(--gold)",margin:"2.5rem auto",opacity:0.4}}/>
      <p style={{fontFamily:"'Space Mono',monospace",fontSize:"clamp(0.75rem,1.2vw,1rem)",color:"var(--creamd)",letterSpacing:"0.12em"}}>SAM ALTMAN, OPENAI CEO</p>
      <p style={{fontFamily:"'Space Mono',monospace",fontSize:"clamp(0.6rem,0.9vw,0.75rem)",color:"var(--muted)",letterSpacing:"0.08em",marginTop:"0.4rem"}}>People by WTF Podcast / August 2025<CiteTip label="Sam Altman - People by WTF Podcast" body="Episode 13, August 2025. Said to a Mumbai audience." url="https://www.youtube.com/watch?v=K6KVMqvlDmA"/></p>
    </Reveal>
  </div>
</section>);}

function FormulaOverview(){return(
<section id="formula" className="sec" style={{background:"#0A130A",overflow:"hidden",position:"relative"}}>
  <div className="formula-bg" aria-hidden="true">GROW</div>
  <div className="max" style={{position:"relative",zIndex:2,textAlign:"center"}}>
    <Reveal><Label>02 - The Formula</Label></Reveal>
    <Reveal delay={1}><h2 className="rr-display" style={{fontSize:"clamp(3rem,6vw,5.5rem)",marginTop:"0.8rem",marginBottom:"0.7rem"}}>Three Moves.<br/><span style={{color:"var(--goldl)"}}>One Formula.</span></h2></Reveal>
    <Reveal delay={2}>
      <p style={{color:"var(--creamd)",fontSize:"1.1rem",maxWidth:"38rem",margin:"0 auto 3rem",lineHeight:1.7}}>Not shortcuts. A sequence. In order.</p>
      <div className="formula-banner" style={{maxWidth:"54rem",margin:"0 auto"}}><span className="formula-step">Develop Expertise</span><span className="formula-arrow">&#8594;</span><span className="formula-step">Apply AI</span><span className="formula-arrow">&#8594;</span><span className="formula-step">Market Your Value</span></div>
    </Reveal>
  </div>
</section>);}

function Roots(){return(
<section id="roots" className="sec" style={{background:"linear-gradient(to bottom, rgba(30,77,30,0.15), var(--forest))"}}>
  <div className="max"><div className="grid-2" style={{gap:"3.5rem",alignItems:"start"}}>
    <Reveal>
      <Label>02.1 / Roots</Label>
      <h2 className="rr-display" style={{fontSize:"clamp(3rem,5.5vw,5rem)",marginTop:"0.5rem",marginBottom:"0.5rem"}}>Develop<br/><span style={{color:"var(--goldl)"}}>Expertise.</span></h2>
      <p className="rr-mono" style={{fontSize:"0.85rem",color:"var(--goldl)",marginBottom:"1.5rem",letterSpacing:"0.05em"}}>KNOW YOUR WORTH. PLANT BEFORE YOU GROW.</p>
      <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.75,marginBottom:"1rem"}}>You need to know <strong style={{color:"var(--cream)"}}>who you help</strong> and <strong style={{color:"var(--cream)"}}>what expensive problem you solve</strong>. Jonathan Stark calls it the <strong style={{color:"var(--goldl)"}}>XY Positioning Statement</strong> — the single most valuable sentence in your career.</p>
      <div style={{background:"rgba(0,0,0,0.35)",border:"1px solid rgba(201,146,26,0.3)",padding:"1.5rem",marginTop:"1.2rem"}}>
        <p className="rr-display" style={{fontSize:"1.8rem",color:"var(--goldl)",lineHeight:1.2}}>"I help <span style={{borderBottom:"2px solid var(--gold)",paddingBottom:"2px"}}>X</span> with <span style={{borderBottom:"2px solid var(--gold)",paddingBottom:"2px"}}>Y</span>."</p>
        <p style={{fontSize:"1rem",color:"var(--creamd)",marginTop:"0.8rem",lineHeight:1.6}}>X = your ideal client/employer (WHO)<br/>Y = their expensive problem you solve (WHAT outcome)</p>
      </div>
    </Reveal>
    <Reveal delay={1}>
      <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
        <div className="xy-card xy-bad"><div className="xy-tag" style={{color:"var(--redl)"}}>&#10005; Discipline-focused (weak)</div><p style={{fontSize:"1.1rem",color:"var(--cream)",fontStyle:"italic"}}>"I'm a web developer."</p><p style={{fontSize:"1rem",color:"var(--muted)",marginTop:"0.3rem"}}>Commodity. Competing on rate. Replaceable.</p></div>
        <div className="xy-card xy-good"><div className="xy-tag" style={{color:"var(--goldl)"}}>&#10003; Outcome-focused (strong)</div><p style={{fontSize:"1.1rem",color:"var(--cream)",fontStyle:"italic"}}>"I help e-commerce brands convert traffic into repeat customers."</p><p style={{fontSize:"1rem",color:"var(--creamd)",marginTop:"0.3rem"}}>Specific. Valuable. The client hears their problem solved.</p></div>
      </div>
      <div style={{marginTop:"1.5rem",padding:"1rem",background:"rgba(201,146,26,0.08)",borderLeft:"3px solid var(--gold)"}}><p style={{fontSize:"1rem",color:"var(--cream)",lineHeight:1.6}}><strong style={{color:"var(--goldl)"}}>Your homework:</strong> Write your XY statement today. It will be wrong the first time. Rewrite it every month. By the sixth version, you will have clarity most people never find.</p></div>
      <XYGenerator />
    </Reveal>
  </div></div>
</section>);}

function XYGenerator() {
  const xOptions = [
    "e-commerce brands",
    "local restaurants in Manila",
    "OFW families",
    "SaaS startups",
    "real estate agents",
    "BPO companies transitioning to AI",
    "Filipino content creators",
    "small law firms",
    "healthcare clinics",
    "university departments",
    "logistics companies in Visayas",
    "NGOs serving rural communities",
  ];
  const yOptions = [
    "convert website traffic into repeat customers",
    "automate their reporting so they reclaim 10 hours a week",
    "send money home faster and cheaper with AI-powered remittance tools",
    "onboard users in half the time with smarter flows",
    "fill vacancies 3x faster with AI-matched listings",
    "reskill their agents before AI replaces the tasks",
    "grow their audience without burning out on content",
    "draft contracts in minutes instead of days",
    "reduce patient no-shows with automated follow-ups",
    "modernize their curriculum with AI-integrated coursework",
    "track shipments in real-time with predictive routing",
    "reach more beneficiaries with less admin overhead",
  ];

  const [xIdx, setXIdx] = useState(0);
  const [yIdx, setYIdx] = useState(0);
  const [xText, setXText] = useState(xOptions[0]);
  const [yText, setYText] = useState(yOptions[0]);
  const [spinning, setSpinning] = useState(null);

  const shuffleX = () => {
    setSpinning("x");
    let count = 0;
    const iv = setInterval(() => {
      const next = Math.floor(Math.random() * xOptions.length);
      setXText(xOptions[next]);
      setXIdx(next);
      count++;
      if (count > 6) { clearInterval(iv); setSpinning(null); }
    }, 80);
  };
  const shuffleY = () => {
    setSpinning("y");
    let count = 0;
    const iv = setInterval(() => {
      const next = Math.floor(Math.random() * yOptions.length);
      setYText(yOptions[next]);
      setYIdx(next);
      count++;
      if (count > 6) { clearInterval(iv); setSpinning(null); }
    }, 80);
  };

  const btnStyle = {
    fontFamily: "'Space Mono',monospace",
    fontSize: "0.7rem",
    letterSpacing: "0.08em",
    padding: "0.4rem 0.8rem",
    cursor: "pointer",
    border: "1px solid rgba(201,146,26,0.3)",
    background: "rgba(201,146,26,0.1)",
    color: "var(--goldl)",
    transition: "all 0.2s",
    flexShrink: 0,
  };

  const inputStyle = (accent) => ({
    width: "100%",
    background: "rgba(0,0,0,0.4)",
    border: "1px solid " + accent + "40",
    borderLeft: "3px solid " + accent,
    padding: "0.75rem 1rem",
    fontFamily: "'Barlow',sans-serif",
    fontSize: "1.05rem",
    color: "#fff",
    outline: "none",
    lineHeight: 1.5,
    transition: "border-color 0.2s",
  });

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#86efac" }} />
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "#86efac", letterSpacing: "0.08em" }}>TRY IT NOW — SHUFFLE OR TYPE YOUR OWN</p>
      </div>

      {/* Statement preview */}
      <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(201,146,26,0.2)", padding: "1.25rem 1.5rem", marginBottom: "1.25rem", textAlign: "center" }}>
        <p className="rr-display" style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)", color: "var(--cream)", lineHeight: 1.4 }}>
          "I help <span style={{ color: "#FDE68A", borderBottom: "2px solid #FDE68A", paddingBottom: "1px", transition: "all 0.15s", opacity: spinning === "x" ? 0.5 : 1 }}>{xText}</span> <span style={{ color: "var(--creamd)" }}>{yText ? "" : "with ..."}</span><span style={{ color: "#86efac", borderBottom: "2px solid #86efac", paddingBottom: "1px", transition: "all 0.15s", opacity: spinning === "y" ? 0.5 : 1 }}>{yText}</span>."
        </p>
      </div>

      {/* X input */}
      <div style={{ marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "#FDE68A", letterSpacing: "0.1em" }}>X — WHO YOU HELP</span>
          <button onClick={shuffleX} style={btnStyle}>🎲 SHUFFLE</button>
        </div>
        <input
          type="text"
          value={xText}
          onChange={(e) => setXText(e.target.value)}
          style={inputStyle("#FDE68A")}
          placeholder="e.g. local restaurants in Manila"
        />
      </div>

      {/* Y input */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "#86efac", letterSpacing: "0.1em" }}>Y — WHAT OUTCOME YOU DELIVER</span>
          <button onClick={shuffleY} style={btnStyle}>🎲 SHUFFLE</button>
        </div>
        <input
          type="text"
          value={yText}
          onChange={(e) => setYText(e.target.value)}
          style={inputStyle("#86efac")}
          placeholder="e.g. convert traffic into repeat customers"
        />
      </div>

      {/* Encouragement */}
      <div style={{ padding: "0.8rem 1rem", background: "rgba(134,239,172,0.06)", border: "1px solid rgba(134,239,172,0.12)", textAlign: "center" }}>
        <p style={{ fontSize: "0.88rem", color: "var(--creamd)", lineHeight: 1.6, fontFamily: "'Barlow',sans-serif" }}>
          It's okay if this feels wrong. <strong style={{ color: "#86efac" }}>Pick one and let it be wrong.</strong> Rewrite it next month. By the sixth version, it'll be true.
        </p>
      </div>
    </div>
  );
}

function Graft(){return(
<section id="graft" className="sec" style={{background:"linear-gradient(to bottom, rgba(30,58,95,0.12), var(--forest))"}}>
  <div className="max"><div className="grid-2" style={{gap:"3.5rem",alignItems:"start"}}>
    <Reveal>
      <Label>02.2 / Graft</Label>
      <h2 className="rr-display" style={{fontSize:"clamp(3rem,5.5vw,5rem)",marginTop:"0.5rem",marginBottom:"0.5rem"}}>Apply<br/><span style={{color:"var(--goldl)"}}>AI.</span></h2>
      <p className="rr-mono" style={{fontSize:"0.85rem",color:"var(--goldl)",marginBottom:"1.5rem",letterSpacing:"0.05em"}}>LEARN TO GRADE. NOT JUST DO.</p>
      <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.75}}>Anthropic engineers do in 2 hours what used to take 8.<CiteTip label="Anthropic Internal Study" body="Aug 2025. Self-reported productivity gains jumped from 20% to 50% in one year."/> OpenAI's top AI adopters save 10+ hours a week.<CiteTip label="OpenAI Enterprise Research" body="2025. Frontier workers send 6x more AI messages than average; coding-specific: 17x more." url="https://openai.com/research/"/> But the people winning are not generating more output — they are <strong style={{color:"var(--cream)"}}>evaluating, catching errors, and knowing when AI is wrong</strong>.</p>
      <div style={{background:"rgba(13,34,24,0.8)",borderLeft:"3px solid var(--gold)",padding:"1.2rem 1.5rem",marginTop:"1.5rem"}}>
        <p style={{fontSize:"1.05rem",color:"var(--cream)",lineHeight:1.65,fontStyle:"italic"}}>"People used to go to school to learn how to do the homework. Today, everyone needs to learn how to <span style={{color:"var(--goldl)"}}>grade the homework.</span>"</p>
        <p className="rr-mono" style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:"0.5rem"}}>— PO-SHEN LOH / CARNEGIE MELLON<CiteTip label="Po-Shen Loh - EO Talk 2025" body="Former US Math Olympiad coach on the shift from doing to evaluating." url="https://www.youtube.com/watch?v=ivVPJhYM8Ng"/></p>
      </div>
    </Reveal>
    <Reveal delay={1}>
      <DoerVsGrader />
    </Reveal>
  </div></div>
</section>);}

function DoerVsGrader() {
  const [mode, setMode] = useState("doer");
  const isGrader = mode === "grader";

  const doerSteps = [
    { label: "Research best practices", time: "45 min", icon: "📚" },
    { label: "Write HTML structure", time: "30 min", icon: "⌨️" },
    { label: "Style with CSS", time: "40 min", icon: "🎨" },
    { label: "Add responsive breakpoints", time: "25 min", icon: "📱" },
    { label: "Debug cross-browser issues", time: "35 min", icon: "🐛" },
    { label: "Write copy manually", time: "20 min", icon: "✍️" },
    { label: "Final review & deploy", time: "15 min", icon: "🚀" },
  ];
  const graderSteps = [
    { label: "Describe the goal & constraints to AI", time: "5 min", icon: "🎯" },
    { label: "AI generates full component", time: "10 sec", icon: "⚡" },
    { label: "Evaluate: does this solve the right problem?", time: "3 min", icon: "🔍", highlight: true },
    { label: "Catch: fix hallucinated class names", time: "2 min", icon: "🚨", highlight: true },
    { label: "Judge: is this accessible? Performant?", time: "3 min", icon: "⚖️", highlight: true },
    { label: "Iterate prompt with specific feedback", time: "2 min", icon: "🔄" },
    { label: "Ship with confidence", time: "1 min", icon: "🚀" },
  ];

  const steps = isGrader ? graderSteps : doerSteps;
  const totalDoer = "3 hrs 30 min";
  const totalGrader = "16 min";

  const tabStyle = (active) => ({
    flex: 1,
    padding: "0.7rem 1rem",
    fontFamily: "'Barlow Condensed',sans-serif",
    fontWeight: 700,
    fontSize: "1rem",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "none",
    transition: "all 0.25s",
    background: active ? (isGrader ? "rgba(134,239,172,0.15)" : "rgba(252,165,165,0.12)") : "rgba(0,0,0,0.3)",
    color: active ? (isGrader ? "#86efac" : "#FCA5A5") : "var(--muted)",
    borderBottom: active ? ("2px solid " + (isGrader ? "#86efac" : "#FCA5A5")) : "2px solid transparent",
  });

  return (
    <div>
      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>TASK: BUILD A LANDING PAGE SECTION</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "0" }}>
        <button onClick={() => setMode("doer")} style={tabStyle(mode === "doer")}>👷 The Doer</button>
        <button onClick={() => setMode("grader")} style={tabStyle(mode === "grader")}>🧠 The Grader</button>
      </div>

      {/* Steps */}
      <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none", padding: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {steps.map((s, i) => (
            <div key={mode + i} style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.5rem 0.6rem",
              background: s.highlight ? "rgba(134,239,172,0.06)" : "transparent",
              borderLeft: s.highlight ? "2px solid #86efac" : "2px solid transparent",
              opacity: 0, animation: "fadeSlideIn 0.3s ease forwards", animationDelay: `${i * 0.06}s`,
            }}>
              <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>{s.icon}</span>
              <span style={{ fontSize: "0.88rem", color: s.highlight ? "#86efac" : "var(--creamd)", fontFamily: "'Barlow',sans-serif", flex: 1 }}>{s.label}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: isGrader ? (s.highlight ? "#86efac" : "var(--goldd)") : "#FCA5A5", flexShrink: 0 }}>{s.time}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.08em" }}>TOTAL TIME</span>
          <span className="rr-display" style={{ fontSize: "1.8rem", color: isGrader ? "#86efac" : "#FCA5A5" }}>{isGrader ? totalGrader : totalDoer}</span>
        </div>

        {/* Punchline */}
        {isGrader && (
          <div style={{ marginTop: "0.75rem", padding: "0.7rem 0.8rem", background: "rgba(134,239,172,0.06)", border: "1px solid rgba(134,239,172,0.12)", textAlign: "center" }}>
            <p style={{ fontSize: "0.85rem", color: "#86efac", fontFamily: "'Space Mono',monospace", letterSpacing: "0.04em" }}>
              13x faster. Same output. <strong>The skill was judgment, not typing.</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Harvest(){return(
<section id="harvest" className="sec" style={{background:"linear-gradient(to bottom, rgba(91,58,0,0.1), var(--forest))"}}>
  <div className="max"><div className="grid-2" style={{gap:"3.5rem",alignItems:"start"}}>
    <Reveal>
      <Label>02.3 / Harvest</Label>
      <h2 className="rr-display" style={{fontSize:"clamp(3rem,5.5vw,5rem)",marginTop:"0.5rem",marginBottom:"0.5rem"}}>Market<br/>Your <span style={{color:"var(--goldl)"}}>Value.</span></h2>
      <p className="rr-mono" style={{fontSize:"0.85rem",color:"var(--goldl)",marginBottom:"1.5rem",letterSpacing:"0.05em"}}>BUILD INCOME YOU DESIGNED. NOT INCOME YOU WERE ASSIGNED.</p>
      <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.75}}>The goal is not just a job. It is building systems that generate value whether you are at the keyboard or not.</p>
    </Reveal>
    <Reveal delay={1}>
      <IncomeStackBuilder />
    </Reveal>
  </div></div>
</section>);}

function IncomeStackBuilder() {
  const [active, setActive] = useState({ freelance: true, productized: false, products: false });

  const stacks = [
    {
      key: "freelance",
      label: "Level 1: Freelancing",
      icon: "⏱",
      color: "#FDBA74",
      monthly: 45000,
      desc: "Trade time for money — but with positioning + AI, charge 3-5x more than commodity rates.",
      math: "₱2,500/hr × 18 hrs/week",
      model: "Linear — you stop, it stops.",
    },
    {
      key: "productized",
      label: "Level 2: Productized Services",
      icon: "📦",
      color: "#86efac",
      monthly: 60000,
      desc: "Fixed-scope offers. Repeatable. \"I'll audit your site and deliver a conversion report in 5 days.\"",
      math: "₱15,000/audit × 4 clients/mo",
      model: "Scalable — hire a VA, run 8/mo.",
    },
    {
      key: "products",
      label: "Level 3: Digital Products",
      icon: "♾️",
      color: "#c4b5fd",
      monthly: 35000,
      desc: "Templates, courses, tools, SaaS. Build once, sell infinitely. Compound interest of career capital.",
      math: "₱500/template × ~70 sales/mo",
      model: "Passive — you sleep, it sells.",
    },
  ];

  const total = stacks.reduce((sum, s) => sum + (active[s.key] ? s.monthly : 0), 0);
  const barMax = 140000;

  const toggleStyle = (isOn, color) => ({
    width: 40, height: 22, borderRadius: 11,
    background: isOn ? color : "rgba(255,255,255,0.1)",
    border: "none", cursor: "pointer", position: "relative",
    transition: "background 0.2s", flexShrink: 0,
  });

  const dotStyle = (isOn) => ({
    position: "absolute", top: 2, left: isOn ? 20 : 2,
    width: 18, height: 18, borderRadius: "50%",
    background: "#fff", transition: "left 0.2s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
  });

  return (
    <div>
      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.08em", marginBottom: "1rem" }}>TOGGLE INCOME STREAMS · SEE THE STACK</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
        {stacks.map((s) => {
          const isOn = active[s.key];
          return (
            <div key={s.key} style={{
              background: isOn ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.2)",
              border: "1px solid " + (isOn ? s.color + "40" : "rgba(255,255,255,0.04)"),
              borderLeft: "3px solid " + (isOn ? s.color : "rgba(255,255,255,0.08)"),
              padding: "1rem 1.1rem",
              transition: "all 0.25s",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: isOn ? "0.6rem" : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                  <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1rem", color: isOn ? s.color : "var(--muted)", textTransform: "uppercase", transition: "color 0.2s" }}>{s.label}</span>
                </div>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.8rem", color: isOn ? s.color : "var(--muted)", transition: "color 0.2s", flexShrink: 0 }}>
                  {isOn ? "₱" + s.monthly.toLocaleString() + "/mo" : "—"}
                </span>
                <button onClick={() => setActive(p => ({...p, [s.key]: !p[s.key]}))} style={toggleStyle(isOn, s.color)}>
                  <div style={dotStyle(isOn)} />
                </button>
              </div>
              {isOn && (
                <div style={{ opacity: 1, transition: "opacity 0.3s" }}>
                  <p style={{ fontSize: "0.88rem", color: "var(--creamd)", lineHeight: 1.55, marginBottom: "0.5rem" }}>{s.desc}</p>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: s.color, letterSpacing: "0.06em" }}>{s.math}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.06em" }}>{s.model}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Revenue bar */}
      <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", padding: "1rem 1.1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.08em" }}>MONTHLY INCOME</span>
          <span className="rr-display" style={{ fontSize: "2rem", color: total > 100000 ? "#86efac" : "var(--goldl)", transition: "color 0.3s" }}>
            ₱{total.toLocaleString()}
          </span>
        </div>
        {/* Stacked bar */}
        <div style={{ height: 28, background: "rgba(255,255,255,0.04)", overflow: "hidden", display: "flex" }}>
          {stacks.map((s) => (
            <div key={s.key} style={{
              width: active[s.key] ? `${(s.monthly / barMax) * 100}%` : "0%",
              height: "100%",
              background: s.color,
              opacity: 0.8,
              transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
              position: "relative",
            }} />
          ))}
        </div>
        {/* Legend dots */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
          {stacks.filter(s => active[s.key]).map(s => (
            <span key={s.key} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: s.color }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }} />
              {s.label.replace("Level ", "L")}
            </span>
          ))}
        </div>

        {/* All three active punchline */}
        {active.freelance && active.productized && active.products && (
          <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.8rem", background: "rgba(196,181,253,0.06)", border: "1px solid rgba(196,181,253,0.15)", textAlign: "center" }}>
            <p style={{ fontSize: "0.85rem", color: "#c4b5fd", fontFamily: "'Space Mono',monospace" }}>
              That's <strong>₱140k/mo</strong> from 3 streams. One is passive. <strong>This is the stack.</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillsOverview(){return(
<section id="skills" className="sec" style={{background:"#0A130A",overflow:"hidden",position:"relative",paddingTop:"6rem",paddingBottom:"6rem"}}>
  {/* Giant background text */}
  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(10rem,25vw,22rem)",color:"transparent",WebkitTextStroke:"1px rgba(201,146,26,0.03)",pointerEvents:"none",lineHeight:0.85,whiteSpace:"nowrap",userSelect:"none"}} aria-hidden="true">SOLVE</div>
  <div className="max" style={{position:"relative",zIndex:2,textAlign:"center"}}>
    <Reveal><Label>03 - The Skill That Matters Most</Label></Reveal>
    <Reveal delay={1}><h2 className="rr-display" style={{fontSize:"clamp(3.5rem,8vw,7.5rem)",marginTop:"0.8rem",marginBottom:"0.7rem",lineHeight:0.95}}>Creative<br/>Problem<br/><span style={{color:"var(--goldl)"}}>Solving.</span></h2></Reveal>
    <Reveal delay={2}>
      <p style={{color:"var(--creamd)",fontSize:"1.15rem",maxWidth:"40rem",margin:"0 auto 1.5rem",lineHeight:1.75}}>Google's AI solved 4 of 6 International Math Olympiad problems — problems designed to have <em>never appeared anywhere before</em>.<CiteTip label="Po-Shen Loh - EO Talk 2025" body="Former US Math Olympiad coach. Used to say creativity was the last thing AI couldn't do." url="https://www.youtube.com/watch?v=ivVPJhYM8Ng"/> Even creativity is no longer safe.</p>
      <p style={{color:"var(--cream)",fontSize:"1.15rem",maxWidth:"40rem",margin:"0 auto 3.5rem",lineHeight:1.75}}>What remains? The ability to <strong style={{color:"var(--goldl)"}}>see the real problem</strong>, ask whether there is another way, and execute — with or without AI.</p>
    </Reveal>
    <Reveal delay={3}>
      <div style={{display:"flex",gap:"1px",maxWidth:"54rem",margin:"0 auto",flexWrap:"wrap",justifyContent:"center"}}>
        {[
          {num:"03.1",label:"Diagnose",desc:"See what others miss",color:"#86efac",icon:"🔍"},
          {num:"03.2",label:"Strategize",desc:"Find another way",color:"#fbbf24",icon:"♟️"},
          {num:"03.3",label:"Execute",desc:"Ship with judgment",color:"#c4b5fd",icon:"⚡"},
        ].map((s,i) => (
          <div key={i} style={{flex:"1 1 160px",background:"rgba(0,0,0,0.4)",padding:"1.5rem 1.25rem",borderTop:"3px solid " + s.color,position:"relative",overflow:"hidden"}}>
            <div style={{fontSize:"1.8rem",marginBottom:"0.5rem"}}>{s.icon}</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:s.color,letterSpacing:"0.12em",marginBottom:"0.4rem"}}>{s.num}</div>
            <div className="rr-display" style={{fontSize:"1.6rem",color:"var(--cream)",marginBottom:"0.4rem"}}>{s.label}</div>
            <p style={{fontSize:"0.88rem",color:"var(--muted)",lineHeight:1.5}}>{s.desc}</p>
          </div>
        ))}
      </div>
    </Reveal>
  </div>
</section>);}

// ─── 3D Matchstick Pyramid ───────────────────────────────────────
function MatchstickPyramid() {
  const mountRef = React.useRef(null);
  const frameRef = React.useRef(null);

  React.useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let renderer, isDragging = false, prevX = 0, prevY = 0, rotX = -0.3, rotY = 0;
    let autoRotate = true, autoTimer = null;
    const W = el.clientWidth, H = Math.min(W * 0.7, 320);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 0, 4.5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = "grab";

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffe8a0, 1.2);
    dir.position.set(3, 5, 4);
    scene.add(dir);
    const rim = new THREE.PointLight(0xe8b84b, 0.6, 10);
    rim.position.set(-3, -1, 2);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    // Regular tetrahedron vertices — centered at geometric center
    const a = 1.6;
    const rawVerts = [
      new THREE.Vector3(0, a * 0.82, 0),
      new THREE.Vector3(-a * 0.5, -a * 0.27, a * 0.47),
      new THREE.Vector3(a * 0.5, -a * 0.27, a * 0.47),
      new THREE.Vector3(0, -a * 0.27, -a * 0.47),
    ];
    // Find centroid and offset so center is at origin
    const cx = rawVerts.reduce((s,v) => s + v.x, 0) / 4;
    const cy = rawVerts.reduce((s,v) => s + v.y, 0) / 4;
    const cz = rawVerts.reduce((s,v) => s + v.z, 0) / 4;
    const verts = rawVerts.map(v => new THREE.Vector3(v.x - cx, v.y - cy, v.z - cz));

    const edges = [[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]];
    const stickMat = new THREE.MeshStandardMaterial({ color: 0xc9921a, roughness: 0.4, metalness: 0.2 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0xe8b84b, roughness: 0.3, metalness: 0.1, emissive: 0xe8b84b, emissiveIntensity: 0.3 });

    edges.forEach(([i, j]) => {
      const start = verts[i], end = verts[j];
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const len = start.distanceTo(end);
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, len, 8), stickMat);
      cyl.position.copy(mid);
      cyl.lookAt(end);
      cyl.rotateX(Math.PI / 2);
      group.add(cyl);
    });

    verts.forEach((v, i) => {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(i === 0 ? 0.1 : 0.08, 16, 16), headMat);
      sphere.position.copy(v);
      group.add(sphere);
    });

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xe8b84b, transparent: true, opacity: 0.08 })
    );
    glow.position.copy(verts[0]);
    group.add(glow);

    group.position.y = 0;

    // Controls
    const onDown = (x, y) => { isDragging = true; prevX = x; prevY = y; autoRotate = false; if (autoTimer) clearTimeout(autoTimer); renderer.domElement.style.cursor = "grabbing"; };
    const onMove = (x, y) => { if (!isDragging) return; rotY += (x - prevX) * 0.008; rotX += (y - prevY) * 0.008; rotX = Math.max(-1.2, Math.min(1.2, rotX)); prevX = x; prevY = y; };
    const onUp = () => { isDragging = false; renderer.domElement.style.cursor = "grab"; autoTimer = setTimeout(() => { autoRotate = true; }, 3000); };

    renderer.domElement.addEventListener("mousedown", e => onDown(e.clientX, e.clientY));
    window.addEventListener("mousemove", e => onMove(e.clientX, e.clientY));
    window.addEventListener("mouseup", onUp);
    renderer.domElement.addEventListener("touchstart", e => { e.preventDefault(); onDown(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
    window.addEventListener("touchmove", e => onMove(e.touches[0].clientX, e.touches[0].clientY));
    window.addEventListener("touchend", onUp);

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      if (autoRotate) rotY += 0.004;
      group.rotation.y = rotY;
      group.rotation.x = rotX;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ margin: "2rem auto", textAlign: "center" }}>
      <div ref={mountRef} style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }} />
    </div>
  );
}

function Diagnose(){
  const [stage, setStage] = useState(0);
  // 0: scattered, 1: base triangle, 2: star of david WRONG, 3: isometric hint, 4: 3D pyramid

  const stickColor = "#C9921A";
  const tipColor = "#E8B84B";

  return(
<section className="sec" style={{background:"var(--darkgreen)",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
  <div className="max" style={{maxWidth:"52rem",textAlign:"center"}}>
    <Reveal><Label color="#86efac">03.1 / Diagnose</Label><h2 className="rr-display" style={{fontSize:"clamp(2.5rem,5vw,4rem)",color:"var(--cream)",marginBottom:"1.5rem"}}>See What Others <span style={{color:"#86efac"}}>Miss.</span></h2></Reveal>

    <Reveal delay={1}>
      <div style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(134,239,172,0.15)",padding:"1.5rem 2rem",marginBottom:"2rem"}}>
        <p className="rr-display" style={{fontSize:"1.4rem",color:"var(--cream)",lineHeight:1.4}}>You have <span style={{color:"#86efac"}}>6 matchsticks</span>. Make <span style={{color:"#86efac"}}>4 equilateral triangles</span>.</p>
        <p style={{fontSize:"0.9rem",color:"var(--muted)",marginTop:"0.5rem"}}>All triangles must be the same size. No breaking sticks.</p>
      </div>
    </Reveal>

    {/* SVG matchstick area */}
    <div style={{position:"relative",width:"100%",maxWidth:"420px",margin:"0 auto 1.5rem",height: stage >= 4 ? "auto" : 300}}>
      {stage < 4 && (
        <svg viewBox="0 0 300 260" style={{width:"100%",height:"100%"}} xmlns="http://www.w3.org/2000/svg">

          {/* Stage 0: Scattered */}
          {stage === 0 && <>
            {[[30,80,120,90],[50,140,160,130],[100,170,200,180],[140,60,230,50],[170,110,260,120],[60,200,180,210]].map(([x1,y1,x2,y2],i) => (
              <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stickColor} strokeWidth="5" strokeLinecap="round"/><circle cx={x1} cy={y1} r="4" fill={tipColor}/><circle cx={x2} cy={y2} r="4" fill={tipColor}/></g>
            ))}
            <text x="150" y="248" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="'Space Mono',monospace">6 MATCHSTICKS · SCATTERED</text>
          </>}

          {/* Stage 1: Base triangle + 3 leftover */}
          {stage === 1 && <>
            {[[80,180,220,180],[220,180,150,58],[150,58,80,180]].map(([x1,y1,x2,y2],i) => (
              <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stickColor} strokeWidth="5" strokeLinecap="round"/><circle cx={x1} cy={y1} r="5" fill={tipColor}/><circle cx={x2} cy={y2} r="5" fill={tipColor}/></g>
            ))}
            {[[20,30,60,55],[25,70,65,85],[240,35,270,60]].map(([x1,y1,x2,y2],i) => (
              <g key={i+3} opacity="0.4"><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stickColor} strokeWidth="4" strokeLinecap="round" strokeDasharray="4 3"/><circle cx={x1} cy={y1} r="3" fill={tipColor} opacity="0.5"/><circle cx={x2} cy={y2} r="3" fill={tipColor} opacity="0.5"/></g>
            ))}
            <text x="150" y="210" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily="'Space Mono',monospace">1 TRIANGLE · 3 LEFT OVER</text>
            <text x="150" y="230" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="'Space Mono',monospace">CAN YOU MAKE 3 MORE?</text>
          </>}

          {/* Stage 2: Star of David — WRONG attempt */}
          {stage === 2 && <>
            {/* Upward triangle */}
            {[[80,185,220,185],[220,185,150,63],[150,63,80,185]].map(([x1,y1,x2,y2],i) => (
              <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stickColor} strokeWidth="5" strokeLinecap="round"/><circle cx={x1} cy={y1} r="5" fill={tipColor}/></g>
            ))}
            {/* Downward triangle overlapping */}
            {[[80,90,220,90],[220,90,150,212],[150,212,80,90]].map(([x1,y1,x2,y2],i) => (
              <g key={i+3}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stickColor} strokeWidth="5" strokeLinecap="round" opacity="0.7"/><circle cx={x1} cy={y1} r="5" fill={tipColor} opacity="0.7"/></g>
            ))}
            {/* Big red X */}
            <text x="150" y="138" textAnchor="middle" fill="#EF4444" fontSize="50" fontFamily="'Barlow Condensed',sans-serif" fontWeight="900" opacity="0.8">✗</text>
            <text x="150" y="240" textAnchor="middle" fill="#FCA5A5" fontSize="11" fontFamily="'Space Mono',monospace">6 TRIANGLES, NOT 4 · DIFFERENT SIZES</text>
            <text x="150" y="255" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="'Space Mono',monospace">STILL FLAT. STILL STUCK.</text>
          </>}

          {/* Stage 3: Isometric hint — base in perspective + apex rising */}
          {stage === 3 && <>
            {/* Base triangle in isometric perspective — tilted to show depth */}
            <line x1="60" y1="185" x2="240" y2="185" stroke={stickColor} strokeWidth="5" strokeLinecap="round"/>
            <line x1="240" y1="185" x2="190" y2="140" stroke={stickColor} strokeWidth="5" strokeLinecap="round"/>
            <line x1="190" y1="140" x2="60" y2="185" stroke={stickColor} strokeWidth="5" strokeLinecap="round"/>
            <circle cx="60" cy="185" r="5" fill={tipColor}/>
            <circle cx="240" cy="185" r="5" fill={tipColor}/>
            <circle cx="190" cy="140" r="5" fill={tipColor}/>
            {/* Three edges going UP to apex — staggered animation */}
            {[[60,185,150,40],[240,185,150,40],[190,140,150,40]].map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#86efac" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 5" opacity="0" style={{animation:"fadeSlideIn 0.6s ease forwards",animationDelay:`${i*0.2}s`}}/>
            ))}
            {/* Apex glow */}
            <circle cx="150" cy="40" r="10" fill="#86efac" opacity="0" style={{animation:"fadeSlideIn 0.6s ease forwards",animationDelay:"0.7s"}}/>
            <circle cx="150" cy="40" r="5" fill="#fff" opacity="0" style={{animation:"fadeSlideIn 0.6s ease forwards",animationDelay:"0.7s"}}/>
            {/* Shadow on ground for depth */}
            <ellipse cx="155" cy="195" rx="80" ry="10" fill="rgba(0,0,0,0.15)" style={{animation:"fadeSlideIn 0.5s ease forwards",animationDelay:"0.3s"}}/>
            <text x="150" y="225" textAnchor="middle" fill="#86efac" fontSize="13" fontFamily="'Barlow Condensed',sans-serif" fontWeight="700" letterSpacing="0.1em" opacity="0" style={{animation:"fadeSlideIn 0.6s ease forwards",animationDelay:"0.9s"}}>↑ NOBODY SAID IT HAD TO BE FLAT ↑</text>
            <text x="150" y="248" textAnchor="middle" fill="rgba(134,239,172,0.4)" fontSize="10" fontFamily="'Space Mono',monospace" opacity="0" style={{animation:"fadeSlideIn 0.6s ease forwards",animationDelay:"1.1s"}}>GO UP. BUILD A TETRAHEDRON.</text>
          </>}
        </svg>
      )}

      {stage >= 4 && <MatchstickPyramid />}
    </div>

    {/* Step buttons */}
    <div style={{marginBottom:"2rem"}}>
      {stage === 0 && <button onClick={() => setStage(1)} style={diagBtnStyle("#86efac")}>I'll try flat first →</button>}
      {stage === 1 && <button onClick={() => setStage(2)} style={diagBtnStyle("#fbbf24")}>What if I overlap two triangles? →</button>}
      {stage === 2 && <button onClick={() => setStage(3)} style={diagBtnStyle("#c4b5fd")}>That didn't work... hint? →</button>}
      {stage === 3 && <button onClick={() => setStage(4)} style={diagBtnStyle("#86efac")}>Build the pyramid →</button>}
      {stage >= 4 && <p className="rr-mono" style={{fontSize:"0.7rem",color:"var(--goldd)",letterSpacing:"0.08em"}}>DRAG TO ROTATE · 6 MATCHSTICKS · 4 TRIANGLES · 1 PYRAMID</p>}
    </div>

    {/* Lesson text — appears at stage 3+ */}
    {stage >= 3 && (
      <Reveal>
        <div style={{background:"rgba(0,0,0,0.3)",padding:"1.5rem 2rem",borderLeft:"3px solid #86efac",textAlign:"left",maxWidth:"44rem",margin:"0 auto"}}>
          <p style={{fontSize:"1.1rem",color:"var(--cream)",lineHeight:1.72,marginBottom:"0.75rem"}}>Every wrong answer was flat. The constraint you never questioned — <em>it has to be 2D</em> — was the real problem.</p>
          <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.65}}>That self-imposed assumption you never examined? <strong style={{color:"#86efac"}}>That is what you are diagnosing.</strong> Not the stated problem — the <em>actual</em> one.<CiteTip label="Po-Shen Loh - EO Talk 2025" body="'Is there another way?' — his single entrepreneurial question." url="https://www.youtube.com/watch?v=ivVPJhYM8Ng"/></p>
        </div>
      </Reveal>
    )}
  </div>
</section>);}

const diagBtnStyle = (color) => ({
  fontFamily: "'Barlow Condensed',sans-serif",
  fontWeight: 700,
  fontSize: "1.1rem",
  letterSpacing: "0.04em",
  padding: "0.7rem 2rem",
  cursor: "pointer",
  border: "2px solid " + color,
  background: "transparent",
  color,
  transition: "all 0.2s",
  textTransform: "uppercase",
});

function Strategize(){
  const [activeHMW, setActiveHMW] = useState(null);

  const problem = "Filipino IT graduates can't find jobs because AI is replacing entry-level work.";

  const hmws = [
    { color: "#FDE68A", angle: "Flip the threat", hmw: "How might we train graduates to manage AI systems instead of compete with them?", insight: "The threat becomes the tool. AI literacy as the new baseline." },
    { color: "#A7F3D0", angle: "Serve the underserved", hmw: "How might we build AI tools for problems only Filipinos understand?", insight: "Typhoon warnings, palengke inventory, Tagalog NLP — local context is the moat." },
    { color: "#FCA5A5", angle: "Remove the middleman", hmw: "How might we help graduates sell directly to global clients using AI as leverage?", insight: "Skip the job board. Productize your skill. The client doesn't care about your diploma." },
    { color: "#93C5FD", angle: "Change the timeline", hmw: "How might we start building AI portfolios while still in school?", insight: "Don't wait for graduation. Ship something by semester 6." },
    { color: "#DDD6FE", angle: "Invert the model", hmw: "How might we make employers compete for graduates who already have AI-built proof of work?", insight: "A portfolio of shipped projects beats a resume of certifications." },
  ];

  return(
<section className="sec" style={{background:"var(--darkgreen)",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
  <div className="max">
    <div className="grid-2" style={{gap:"3rem",alignItems:"start"}}>
      <Reveal>
        <Label color="#fbbf24">03.2 / Strategize</Label>
        <h2 className="rr-display" style={{fontSize:"clamp(2.5rem,5vw,4rem)",color:"var(--cream)",marginBottom:"0.5rem"}}>Find Another <span style={{color:"#fbbf24"}}>Way.</span></h2>
        <p className="rr-mono" style={{fontSize:"0.8rem",color:"#fbbf24",marginBottom:"1.5rem",letterSpacing:"0.05em"}}>"HOW MIGHT WE..." — THE REFRAME THAT CHANGES EVERYTHING</p>
        <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.75,marginBottom:"1.5rem"}}>Design thinkers don't solve problems head-on. They <strong style={{color:"var(--cream)"}}>reframe the question</strong> until new solutions appear. The tool is three words: <em>"How might we..."</em></p>

        {/* Problem card */}
        <div style={{background:"rgba(185,28,28,0.08)",border:"1px solid rgba(185,28,28,0.2)",padding:"1rem 1.25rem",marginBottom:"1rem"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"var(--redl)",letterSpacing:"0.1em",marginBottom:"0.4rem"}}>THE PROBLEM</div>
          <p style={{fontSize:"1rem",color:"#FCA5A5",lineHeight:1.5,fontStyle:"italic"}}>{problem}</p>
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0.5rem 0"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.5rem",color:"#fbbf24"}}>↓ REFRAME ↓</span>
        </div>
      </Reveal>

      {/* HMW sticky notes */}
      <Reveal delay={1}>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:"var(--muted)",letterSpacing:"0.08em",marginBottom:"1rem"}}>CLICK A CARD TO EXPLORE THE ANGLE</p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
          {hmws.map((h, i) => {
            const isActive = activeHMW === i;
            return (
              <div key={i}
                onClick={() => setActiveHMW(isActive ? null : i)}
                style={{
                  background: h.color,
                  padding: "0.9rem 1.1rem",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  transform: isActive ? "scale(1.02)" : "rotate(" + (i % 2 === 0 ? "-0.5" : "0.5") + "deg)",
                  boxShadow: isActive ? "4px 6px 20px rgba(0,0,0,0.35)" : "2px 3px 8px rgba(0,0,0,0.2)",
                }}>
                {/* Angle tag */}
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.58rem",letterSpacing:"0.1em",color:"rgba(0,0,0,0.4)",textTransform:"uppercase",marginBottom:"0.3rem"}}>{h.angle}</div>
                {/* HMW question */}
                <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1rem",color:"rgba(0,0,0,0.85)",lineHeight:1.3}}>{h.hmw}</p>
                {/* Expanded insight */}
                {isActive && (
                  <div style={{marginTop:"0.6rem",paddingTop:"0.5rem",borderTop:"1px solid rgba(0,0,0,0.1)"}}>
                    <p style={{fontSize:"0.82rem",color:"rgba(0,0,0,0.6)",lineHeight:1.5,fontFamily:"'Barlow',sans-serif"}}>{h.insight}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{marginTop:"1rem",padding:"0.7rem 1rem",background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.12)",textAlign:"center"}}>
          <p style={{fontSize:"0.85rem",color:"#fbbf24",fontFamily:"'Space Mono',monospace"}}>Same problem. 5 different doors. <strong>Strategy is choosing which door to walk through.</strong></p>
        </div>
      </Reveal>
    </div>
  </div>
</section>);}

function Execute(){
  const items = [
    { id: "problem", label: "Does this solve the right problem?", sub: "Not the stated one — the real one you diagnosed." },
    { id: "verify", label: "Did I verify AI's claims?", sub: "Check facts, test code, validate logic. Trust but verify." },
    { id: "audience", label: "Does the audience actually need this?", sub: "Not what's cool — what's useful." },
    { id: "edge", label: "Did I catch the edge cases?", sub: "AI optimizes for the average. You protect the outliers." },
    { id: "name", label: "Would I stake my name on this?", sub: "If yes, ship. If no, grade harder." },
  ];

  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked(p => ({...p, [id]: !p[id]}));
  const count = Object.values(checked).filter(Boolean).length;
  const allDone = count === items.length;
  const pct = (count / items.length) * 100;

  return(
<section className="sec" style={{background:"var(--darkgreen)",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
  <div className="max"><div className="grid-2" style={{gap:"3rem",alignItems:"start"}}>
    <Reveal>
      <Label color="#c4b5fd">03.3 / Execute</Label>
      <h2 className="rr-display" style={{fontSize:"clamp(2.5rem,5vw,4rem)",color:"var(--cream)",marginBottom:"0.5rem"}}>Ship With <span style={{color:"#c4b5fd"}}>Judgment.</span></h2>
      <p className="rr-mono" style={{fontSize:"0.8rem",color:"#c4b5fd",marginBottom:"1.5rem",letterSpacing:"0.05em"}}>AI IS THE CONTEXT PROVIDER. YOU ARE THE DECISION-MAKER.</p>
      <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.75,marginBottom:"1rem"}}>With AI or without. Either way. <strong style={{color:"var(--cream)"}}>Adapt when the plan breaks.</strong> The person who can evaluate AI output, catch its errors, and know when it is wrong — that is irreplaceable.</p>
      <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.75}}>Before you hit send, publish, or deploy — run through this. Every time.</p>
    </Reveal>

    <Reveal delay={1}>
      <div style={{background:"rgba(0,0,0,0.35)",border:"1px solid rgba(196,181,253,0.15)",padding:"1.25rem",overflow:"hidden"}}>
        {/* Progress bar */}
        <div style={{marginBottom:"1rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"0.4rem"}}>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.68rem",color:"var(--muted)",letterSpacing:"0.08em"}}>SHIP READINESS</span>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.75rem",color: allDone ? "#86efac" : "#c4b5fd",transition:"color 0.3s"}}>{count}/{items.length}</span>
          </div>
          <div style={{height:6,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
            <div style={{height:"100%",width:pct+"%",background: allDone ? "#86efac" : "linear-gradient(to right, #c4b5fd, #a78bfa)",transition:"width 0.4s cubic-bezier(0.16,1,0.3,1)",boxShadow: allDone ? "0 0 12px rgba(134,239,172,0.4)" : "none"}}/>
          </div>
        </div>

        {/* Checklist items */}
        <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
          {items.map((item) => {
            const isOn = checked[item.id];
            return (
              <div key={item.id}
                onClick={() => toggle(item.id)}
                style={{
                  display:"flex",gap:"0.75rem",alignItems:"flex-start",
                  padding:"0.7rem 0.8rem",
                  background: isOn ? "rgba(134,239,172,0.05)" : "transparent",
                  borderLeft: "2px solid " + (isOn ? "#86efac" : "rgba(255,255,255,0.06)"),
                  cursor:"pointer",
                  transition:"all 0.2s",
                }}>
                {/* Checkbox */}
                <div style={{
                  width:20,height:20,flexShrink:0,marginTop:2,
                  border: "2px solid " + (isOn ? "#86efac" : "rgba(255,255,255,0.2)"),
                  background: isOn ? "rgba(134,239,172,0.15)" : "transparent",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  transition:"all 0.2s",
                }}>
                  {isOn && <span style={{color:"#86efac",fontSize:"0.8rem",fontWeight:900,lineHeight:1}}>✓</span>}
                </div>
                {/* Text */}
                <div>
                  <p style={{
                    fontSize:"0.95rem",
                    color: isOn ? "#86efac" : "var(--cream)",
                    fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:700,
                    textDecoration: isOn ? "line-through" : "none",
                    textDecorationColor: "rgba(134,239,172,0.3)",
                    transition:"all 0.2s",
                  }}>{item.label}</p>
                  <p style={{fontSize:"0.78rem",color:"var(--muted)",marginTop:"0.15rem",lineHeight:1.4}}>{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Punchline */}
        {allDone && (
          <div style={{marginTop:"1rem",padding:"0.8rem 1rem",background:"rgba(134,239,172,0.08)",border:"1px solid rgba(134,239,172,0.2)",textAlign:"center",animation:"fadeSlideIn 0.4s ease forwards"}}>
            <p className="rr-display" style={{fontSize:"1.3rem",color:"#86efac"}}>Ship it. Your name is on it.</p>
            <p style={{fontSize:"0.82rem",color:"var(--creamd)",marginTop:"0.3rem"}}>The advantage was never the tool. It was your judgment.</p>
          </div>
        )}
      </div>
    </Reveal>
  </div></div>
</section>);}

/* ── Chat Phone Components ── */
function ChatPhone({ title, subtitle, color, bgBar, children }) {
  return (
    <div style={{
      background: "#0A0A0A",
      borderRadius: "1.2rem",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{
        background: bgBar,
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1.1rem", color, textTransform: "uppercase", letterSpacing: "0.04em" }}>{title}</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.08em", marginTop: "0.15rem" }}>{subtitle}</div>
        </div>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, opacity: 0.6 }} />
      </div>
      <div style={{ padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "0.6rem", minHeight: 360 }}>
        {children}
      </div>
    </div>
  );
}

function Bubble({ from, color, delay = 0, children }) {
  const [ref, visible] = useReveal(0.1);
  const [show, setShow] = useState(false);
  useEffect(() => { if (visible) { const t = setTimeout(() => setShow(true), delay * 300); return () => clearTimeout(t); } }, [visible, delay]);

  if (from === "system") {
    return (
      <div ref={ref} style={{ textAlign: "center", padding: "0.6rem 0.8rem", marginTop: "0.5rem", opacity: show ? 1 : 0, transition: "opacity 0.4s ease" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: color || "var(--muted)", letterSpacing: "0.06em", lineHeight: 1.5 }}>{children}</span>
      </div>
    );
  }

  const isYou = from === "you";
  return (
    <div ref={ref} style={{
      display: "flex",
      justifyContent: isYou ? "flex-end" : "flex-start",
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(8px)",
      transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        maxWidth: "82%",
        padding: "0.7rem 0.95rem",
        borderRadius: isYou ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
        background: isYou ? "rgba(255,255,255,0.08)" : (color ? color + "18" : "rgba(255,255,255,0.04)"),
        border: "1px solid " + (isYou ? "rgba(255,255,255,0.12)" : (color ? color + "30" : "rgba(255,255,255,0.06)")),
      }}>
        {!isYou && <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: color || "var(--muted)", letterSpacing: "0.08em", marginBottom: "0.3rem", textTransform: "uppercase" }}>Recruiter</div>}
        <p style={{ fontSize: "0.88rem", color: isYou ? "#fff" : "var(--cream)", lineHeight: 1.55, fontFamily: "'Barlow',sans-serif", margin: 0 }}>{children}</p>
      </div>
    </div>
  );
}

function HowHiringChanges(){return(
<section id="hiring" className="sec" style={{background:"linear-gradient(165deg, #0D1A0D 0%, #0A180D 50%, #101D10 100%)"}}>
  <div className="max">
    <Reveal>
      <div style={{textAlign:"center",marginBottom:"3rem"}}>
        <Label>The New Hiring Filter</Label>
        <h2 className="rr-display" style={{fontSize:"clamp(2.8rem,5.5vw,5rem)",marginTop:"0.5rem"}}>They Won't Hire<br/>You for <span style={{color:"var(--goldl)"}}>What<br/>You Know.</span></h2>
        <p style={{fontSize:"1rem",color:"var(--muted)",marginTop:"1rem",maxWidth:"34rem",margin:"1rem auto 0"}}>Two interviews. Same candidate. Different decade.<CiteTip label="Po-Shen Loh - 2025 Talk" body="Now focused on building thoughtful networks to help humanity after AI." url="https://www.youtube.com/watch?v=BfBGhSqvcu4"/></p>
      </div>
    </Reveal>

    <div className="grid-2" style={{gap:"2rem",alignItems:"start",marginBottom:"3rem"}}>
      {/* OLD INTERVIEW */}
      <Reveal>
        <ChatPhone title="The Old Interview" subtitle="2020" color="#FCA5A5" bgBar="rgba(252,165,165,0.08)">
          <Bubble from="recruiter" color="#FCA5A5" delay={0}>What programming languages do you know?</Bubble>
          <Bubble from="you" delay={1}>Java, Python, a bit of React.</Bubble>
          <Bubble from="recruiter" color="#FCA5A5" delay={2}>How many years of experience?</Bubble>
          <Bubble from="you" delay={3}>I just graduated, but I did an internship—</Bubble>
          <Bubble from="recruiter" color="#FCA5A5" delay={4}>We need at least 3 years. What's your GPA?</Bubble>
          <Bubble from="you" delay={5}>3.4, cum laude.</Bubble>
          <Bubble from="recruiter" color="#FCA5A5" delay={6}>We'll keep your resume on file.</Bubble>
          <Bubble from="system" color="#FCA5A5" delay={7}>📋 Evaluated on: credentials, memorized skills, years served.</Bubble>
        </ChatPhone>
      </Reveal>

      {/* NEW INTERVIEW */}
      <Reveal delay={1}>
        <ChatPhone title="The New Interview" subtitle="2026" color="#86efac" bgBar="rgba(134,239,172,0.06)">
          <Bubble from="recruiter" color="#86efac" delay={0}>Here's a problem we've never solved. You have AI tools and 30 minutes. Show us how you'd approach it.</Bubble>
          <Bubble from="you" delay={1}>Can I start by asking who this is actually for?</Bubble>
          <Bubble from="recruiter" color="#86efac" delay={2}>That's exactly the right first question.</Bubble>
          <Bubble from="recruiter" color="#86efac" delay={3}>Tell me — when was the last time you changed someone's mind?</Bubble>
          <Bubble from="you" delay={4}>Last week, actually. My teammate wanted to scrap a feature. I built a quick prototype with AI instead and showed her the data.</Bubble>
          <Bubble from="recruiter" color="#86efac" delay={5}>This kind of person — you can plug into anything. Great intention and great learning capacity.</Bubble>
          <Bubble from="system" color="#86efac" delay={6}>✦ Evaluated on: curiosity, judgment, care, adaptability.</Bubble>
        </ChatPhone>
      </Reveal>
    </div>

    <Reveal>
      <div style={{background:"rgba(0,0,0,0.25)",borderLeft:"3px solid var(--gold)",padding:"1.5rem 2rem",maxWidth:"54rem",margin:"0 auto 3rem"}}>
        <p style={{fontSize:"1.15rem",color:"var(--cream)",lineHeight:1.65,fontStyle:"italic"}}>"I <em>don't</em> want to hire someone trained to do one particular task — wait one or two more years, I can use AI to do that, and it'll be <span style={{color:"var(--redl)"}}>way cheaper</span>."</p>
        <p className="rr-mono" style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:"0.8rem"}}>— PO-SHEN LOH, Carnegie Mellon<CiteTip label="Po-Shen Loh - 2025" body="On hiring: great intention + great learning capacity > any specific technical skill." url="https://www.youtube.com/watch?v=BfBGhSqvcu4"/></p>
      </div>
    </Reveal>

    <div className="grid-3" style={{gap:"1.5rem",marginBottom:"3rem"}}>
      <Reveal><div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.06)",padding:"1.75rem",borderTop:"3px solid #86efac"}}><div className="rr-mono" style={{fontSize:"0.75rem",color:"#86efac",letterSpacing:"0.12em",marginBottom:"0.6rem"}}>WHAT THEY LOOK FOR</div><h3 className="rr-display" style={{fontSize:"1.5rem",color:"var(--cream)",marginBottom:"0.8rem"}}>You Care<br/>About People.</h3><p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.72}}>You will <strong style={{color:"var(--goldl)"}}>never get that confidence looking at a robot's eyes</strong>. In a world of AI, genuine care is the rarest signal.</p></div></Reveal>
      <Reveal delay={1}><div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.06)",padding:"1.75rem",borderTop:"3px solid #fbbf24"}}><div className="rr-mono" style={{fontSize:"0.75rem",color:"#fbbf24",letterSpacing:"0.12em",marginBottom:"0.6rem"}}>WHAT THEY TEST</div><h3 className="rr-display" style={{fontSize:"1.5rem",color:"var(--cream)",marginBottom:"0.8rem"}}>You Can Think<br/>on the Spot.</h3><p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.72}}>Not memorized answers. Can you look at a problem you have never seen before and <strong style={{color:"var(--goldl)"}}>figure out a way through it?</strong> That is the test.</p></div></Reveal>
      <Reveal delay={2}><div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.06)",padding:"1.75rem",borderTop:"3px solid #c4b5fd"}}><div className="rr-mono" style={{fontSize:"0.75rem",color:"#c4b5fd",letterSpacing:"0.12em",marginBottom:"0.6rem"}}>WHAT COMPOUNDS</div><h3 className="rr-display" style={{fontSize:"1.5rem",color:"var(--cream)",marginBottom:"0.8rem"}}>You Build<br/>Trust Networks.</h3><p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.72}}>Thoughtful people find each other. They create value together. <strong style={{color:"var(--goldl)"}}>A high-trust network is the 21st century moat.</strong></p></div></Reveal>
    </div>
    <Reveal><div style={{textAlign:"center",maxWidth:"44rem",margin:"0 auto"}}><p style={{fontSize:"1.15rem",color:"var(--cream)",lineHeight:1.72}}>For everyone who wanted a stable life — <strong style={{color:"var(--redl)"}}>good luck, because AI is going to take that</strong>.<CiteTip label="Po-Shen Loh - 2025" body="'For everyone who wanted a stable life, good luck, cuz AI is going to take that.'" url="https://www.youtube.com/watch?v=BfBGhSqvcu4"/> But if you care, think, and build trust — someone will always find a place for you. Not because of what you know. <strong style={{color:"var(--goldl)"}}>Because of who you are.</strong></p></div></Reveal>
  </div>
</section>);}

const JOB_ROWS=[
  [{name:"AI Product Manager",c:"#86efac"},{name:"Context Engineer",c:"#86efac"},{name:"Prompt Strategist",c:"#86efac"},{name:"Machine Learning Engineer",c:"#86efac"},{name:"AI UX Designer",c:"#86efac"},{name:"Data Annotation Lead",c:"#86efac"},{name:"AI Content Supervisor",c:"#86efac"},{name:"RAG Engineer",c:"#86efac"},{name:"AI Security Analyst",c:"#86efac"},{name:"AI Research Assistant",c:"#86efac"},{name:"MLOps Engineer",c:"#86efac"},{name:"AI Solutions Architect",c:"#86efac"}],
  [{name:"Chief AI Revenue Officer",c:"#c4b5fd"},{name:"AI Agent Architect",c:"#c4b5fd"},{name:"AI Ethics & Compliance Officer",c:"#c4b5fd"},{name:"Synthetic Media Producer",c:"#c4b5fd"},{name:"Human-AI Workflow Specialist",c:"#c4b5fd"},{name:"AI Creative Director",c:"#c4b5fd"},{name:"Model Red Team Operator",c:"#c4b5fd"},{name:"Autonomous Systems Monitor",c:"#c4b5fd"},{name:"AI Trainer (Domain Expert)",c:"#c4b5fd"},{name:"AI-Assisted Legal Strategist",c:"#c4b5fd"},{name:"Algorithmic Bias Auditor",c:"#c4b5fd"},{name:"Agentic Platform Engineer",c:"#c4b5fd"}],
  [{name:"AI Music Composer",c:"#fbbf24"},{name:"Virtual Production Director",c:"#fbbf24"},{name:"AI Fashion Designer",c:"#fbbf24"},{name:"Deepfake Detection Specialist",c:"#fbbf24"},{name:"AI Game Narrative Writer",c:"#fbbf24"},{name:"Generative Art Curator",c:"#fbbf24"},{name:"AI Video Editor",c:"#fbbf24"},{name:"Voice Clone Ethics Reviewer",c:"#fbbf24"},{name:"AI Podcast Producer",c:"#fbbf24"},{name:"Brand Voice AI Tuner",c:"#fbbf24"},{name:"AI Storyboard Artist",c:"#fbbf24"},{name:"AI Sound Designer",c:"#fbbf24"}],
  [{name:"BPO-to-AI Transition Specialist",c:"#E8B84B"},{name:"Filipino AI Localization Expert",c:"#E8B84B"},{name:"Jeepney Route Optimizer (AI)",c:"#E8B84B"},{name:"Agri-Tech AI Advisor (Rice/Coconut)",c:"#E8B84B"},{name:"Disaster Response AI Coordinator",c:"#E8B84B"},{name:"AI Tourism Experience Designer",c:"#E8B84B"},{name:"OFW Support AI Systems Builder",c:"#E8B84B"},{name:"Tagalog NLP Specialist",c:"#E8B84B"},{name:"AI Typhoon Early Warning Engineer",c:"#E8B84B"},{name:"Smart Palengke Systems Designer",c:"#E8B84B"},{name:"AI Traffic Flow Optimizer (EDSA)",c:"#E8B84B"},{name:"Coral Reef AI Monitor (Tubbataha)",c:"#E8B84B"}],
  [{name:"Climate AI Modeler",c:"#4ade80"},{name:"AI Carbon Footprint Auditor",c:"#4ade80"},{name:"Smart Grid AI Optimizer",c:"#4ade80"},{name:"AI Waste Reduction Planner",c:"#4ade80"},{name:"Precision Agriculture AI Advisor",c:"#4ade80"},{name:"Ocean Conservation AI Analyst",c:"#4ade80"},{name:"AI Urban Planning Consultant",c:"#4ade80"},{name:"Renewable Energy AI Engineer",c:"#4ade80"},{name:"AI Biodiversity Monitor",c:"#4ade80"},{name:"AI Water Resource Manager",c:"#4ade80"},{name:"Sustainable Supply Chain AI Lead",c:"#4ade80"},{name:"EV Fleet AI Coordinator",c:"#4ade80"}],
  [{name:"AI Relationship Mediator",c:"#f87171"},{name:"Personal AI Fleet Manager",c:"#f87171"},{name:"AI Dream Analyst",c:"#f87171"},{name:"Robot-Human Interaction Therapist",c:"#f87171"},{name:"AI Memory Curator",c:"#f87171"},{name:"Holographic Experience Designer",c:"#f87171"},{name:"AI Grief Counselor Designer",c:"#f87171"},{name:"Digital Twin Life Planner",c:"#f87171"},{name:"AI Taste & Scent Engineer",c:"#f87171"},{name:"Consciousness Interface Designer",c:"#f87171"},{name:"AI Pet Behavior Translator",c:"#f87171"},{name:"Nostalgia Experience Architect",c:"#f87171"}],
];

function MarqueeRow({jobs,direction="left",speed=60}){const doubled=[...jobs,...jobs];return(<div className={`marquee-row marquee-${direction}`} style={{marginBottom:"0.5rem"}}><div className="marquee-track" style={{animationDuration:`${speed}s`}}>{doubled.map((j,i)=>(<span key={i} className="job-pill"><span className="job-pill-dot" style={{background:j.c}}/>{j.name}</span>))}</div></div>);}

function TheUpside(){const[paused,setPaused]=React.useState(false);return(
<section id="upside" className="sec" style={{background:"radial-gradient(ellipse 80% 50% at 50% 30%, rgba(42,107,42,0.18) 0%, transparent 70%), var(--forest)",overflow:"hidden"}}>
  <div className="max" style={{marginBottom:"3rem"}}>
    <Reveal><div style={{textAlign:"center",maxWidth:"48rem",margin:"0 auto"}}>
      <Label>The Other Side</Label>
      <h2 className="rr-display" style={{fontSize:"clamp(3rem,6vw,5.5rem)",marginTop:"0.5rem",marginBottom:"1.5rem"}}>The Jobs That<br/>Don't <span style={{color:"var(--goldl)"}}>Exist Yet.</span></h2>
      <p style={{fontSize:"1.1rem",color:"var(--creamd)",lineHeight:1.75}}>Every technology that displaced jobs also created entirely new categories of work nobody predicted. AI will do the same — but faster. Some of these titles will be invented <em>by you</em>.</p>
    </div></Reveal>
  </div>
  <div className={paused?"marquee-paused":""} style={{marginBottom:"3rem"}}>
    <div style={{textAlign:"center",marginBottom:"1.2rem"}}><div style={{display:"inline-flex",gap:"1.5rem",flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
      {[{color:"#86efac",label:"Hiring now"},{color:"#c4b5fd",label:"Emerging 2026"},{color:"#fbbf24",label:"Creative & media"},{color:"#E8B84B",label:"Philippines-specific"},{color:"#4ade80",label:"Green & sustainability"},{color:"#f87171",label:"Future / speculative"}].map((l,i)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:"0.35rem",fontSize:"0.75rem",fontFamily:"'Space Mono',monospace",color:"var(--muted)"}}><span style={{width:7,height:7,borderRadius:"50%",background:l.color,display:"inline-block"}}/> {l.label}</span>))}
      <button className="marquee-pause-btn" onClick={()=>setPaused(!paused)} aria-label={paused?"Play":"Pause"}><span style={{width:12,height:12,position:"relative"}}>{paused?<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polygon points="2,0 12,6 2,12" fill="currentColor"/></svg>:<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="0" width="3.5" height="12" fill="currentColor"/><rect x="7.5" y="0" width="3.5" height="12" fill="currentColor"/></svg>}</span>{paused?"PLAY":"PAUSE"}</button>
    </div></div>
    <MarqueeRow jobs={JOB_ROWS[0]} direction="left" speed={70}/>
    <MarqueeRow jobs={JOB_ROWS[1]} direction="right" speed={65}/>
    <MarqueeRow jobs={JOB_ROWS[2]} direction="left" speed={75}/>
    <MarqueeRow jobs={JOB_ROWS[3]} direction="right" speed={63}/>
    <MarqueeRow jobs={JOB_ROWS[4]} direction="left" speed={74}/>
    <MarqueeRow jobs={JOB_ROWS[5]} direction="right" speed={71}/>
  </div>
</section>);}

/* ── Philippines Bulletin Board ── */
const PH_JOBS = [
  { label: "Metro Manila / EDSA", job: "AI Traffic Flow Optimizer", desc: "Real-time route intelligence for 400k daily commuters", color: "#FDE68A", rot: -3 },
  { label: "Cebu City", job: "BPO-to-AI Transition Specialist", desc: "Reskilling the 1.3M Filipino BPO workforce", color: "#A7F3D0", rot: 2 },
  { label: "Davao", job: "Agri-Tech AI Advisor", desc: "Rice & coconut yield optimization for 10M farmers", color: "#FCA5A5", rot: -1.5 },
  { label: "Palawan / Tubbataha", job: "Coral Reef AI Monitor", desc: "Protecting 97k hectares of marine biodiversity", color: "#93C5FD", rot: 4 },
  { label: "Eastern Visayas", job: "AI Typhoon Early Warning Engineer", desc: "20+ typhoons/year — every minute of warning saves lives", color: "#FDBA74", rot: -2.5 },
  { label: "Nationwide / Remote", job: "Tagalog NLP Specialist", desc: "Building Filipino-first AI language models", color: "#DDD6FE", rot: 1.5 },
  { label: "Palengke Districts", job: "Smart Palengke Systems Designer", desc: "Digital inventory for 1.1M micro-retailers", color: "#FDE68A", rot: -4 },
  { label: "NAIA / OFW Hubs", job: "OFW Support AI Systems Builder", desc: "Serving 1.96M overseas Filipino workers", color: "#A7F3D0", rot: 3 },
];

function DraggableNote({ job, index, bringToFront, zIndex }) {
  const noteRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });

  const onDown = (clientX, clientY) => {
    setDragging(true);
    bringToFront(index);
    dragStart.current = { x: clientX - posRef.current.x, y: clientY - posRef.current.y };
  };
  const onMove = (clientX, clientY) => {
    if (!dragging) return;
    const nx = clientX - dragStart.current.x;
    const ny = clientY - dragStart.current.y;
    posRef.current = { x: nx, y: ny };
    setPos({ x: nx, y: ny });
  };
  const onUp = () => setDragging(false);

  useEffect(() => {
    const mMove = (e) => onMove(e.clientX, e.clientY);
    const mUp = () => onUp();
    const tMove = (e) => { if (dragging) { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); } };
    const tUp = () => onUp();
    if (dragging) {
      window.addEventListener("mousemove", mMove);
      window.addEventListener("mouseup", mUp);
      window.addEventListener("touchmove", tMove, { passive: false });
      window.addEventListener("touchend", tUp);
    }
    return () => {
      window.removeEventListener("mousemove", mMove);
      window.removeEventListener("mouseup", mUp);
      window.removeEventListener("touchmove", tMove);
      window.removeEventListener("touchend", tUp);
    };
  }, [dragging]);

  return (
    <div
      ref={noteRef}
      onMouseDown={(e) => onDown(e.clientX, e.clientY)}
      onTouchStart={(e) => onDown(e.touches[0].clientX, e.touches[0].clientY)}
      style={{
        position: "relative",
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${dragging ? 0 : job.rot}deg)`,
        transition: dragging ? "none" : "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s",
        zIndex,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Pin */}
      <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 14, height: 14, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #e74c3c, #a93226)", boxShadow: "0 2px 4px rgba(0,0,0,0.4)", zIndex: 2 }} />
      {/* Card */}
      <div style={{
        background: job.color,
        padding: "1.25rem 1.1rem 1rem",
        width: "100%",
        minHeight: 140,
        boxShadow: dragging
          ? "8px 12px 28px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.05)"
          : "3px 4px 12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
      }}>
        {/* Location tag */}
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "rgba(0,0,0,0.4)", textTransform: "uppercase" }}>📍 {job.label}</div>
        {/* Job title */}
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "rgba(0,0,0,0.85)", lineHeight: 1.2, textTransform: "uppercase" }}>{job.job}</div>
        {/* Description */}
        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: "0.82rem", color: "rgba(0,0,0,0.55)", lineHeight: 1.45, marginTop: "auto" }}>{job.desc}</div>
      </div>
    </div>
  );
}

function PhMapSection() {
  const [zStack, setZStack] = useState(PH_JOBS.map((_, i) => i));
  const bringToFront = (idx) => {
    setZStack(prev => {
      const max = Math.max(...prev);
      const next = [...prev];
      next[idx] = max + 1;
      return next;
    });
  };

  return (
    <section className="sec" style={{ background: "linear-gradient(to bottom, var(--forest), var(--darkgreen))" }}>
      <div className="max">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <Label>Built for Here</Label>
            <h2 className="rr-display" style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", marginTop: "0.5rem" }}>
              These Jobs Are<br />for <span style={{ color: "var(--goldl)" }}>the Philippines.</span>
            </h2>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "var(--muted)", marginTop: "1rem", letterSpacing: "0.08em" }}>DRAG THE NOTES AROUND · 8 ROLES ONLY AI + FILIPINOS CAN FILL</p>
          </div>
        </Reveal>
        <Reveal delay={1}>
          {/* Corkboard */}
          <div style={{
            position: "relative",
            background: "linear-gradient(145deg, #b8956a 0%, #c9a472 25%, #a3804f 50%, #b8956a 75%, #c9a472 100%)",
            backgroundSize: "200px 200px",
            border: "12px solid #5c3d1e",
            borderRadius: "4px",
            boxShadow: "inset 0 2px 12px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4)",
            padding: "2rem 1.5rem",
            minHeight: 500,
          }}>
            {/* Cork texture overlay */}
            <div style={{ position: "absolute", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.06'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='12' r='1.5'/%3E%3Ccircle cx='52' cy='8' r='1'/%3E%3Ccircle cx='15' cy='32' r='1'/%3E%3Ccircle cx='42' cy='28' r='1.5'/%3E%3Ccircle cx='8' cy='52' r='1'/%3E%3Ccircle cx='35' cy='48' r='1'/%3E%3Ccircle cx='55' cy='45' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")", pointerEvents: "none", borderRadius: "2px" }} />
            {/* Notes grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1.5rem",
              position: "relative",
            }}>
              {PH_JOBS.map((job, i) => (
                <DraggableNote key={i} job={job} index={i} bringToFront={bringToFront} zIndex={zStack[i]} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhatMattersNow(){return(
<section className="sec" style={{background:"var(--forest)"}}>
  <div className="max">
    <Reveal><div style={{textAlign:"center",marginBottom:"3rem"}}><Label>The Takeaway</Label><h2 className="rr-display" style={{fontSize:"clamp(2.5rem,5vw,4.5rem)",marginTop:"0.5rem"}}>What <span style={{color:"var(--goldl)"}}>Matters</span> Now.</h2></div></Reveal>
    <div className="grid-3" style={{gap:"1.5rem",marginBottom:"3rem"}}>
      <Reveal><div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.06)",padding:"1.75rem",borderTop:"3px solid var(--goldl)"}}><h3 className="rr-display" style={{fontSize:"1.6rem",color:"var(--cream)",marginBottom:"0.8rem"}}>Street Smarts<br/>Over Book Smarts.</h3><p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.72}}>AI can pass the bar exam and ace medical boards. It cannot read the room or know when a client is lying about their budget. <strong style={{color:"var(--goldl)"}}>The skills no textbook teaches are the ones that matter most.</strong></p></div></Reveal>
      <Reveal delay={1}><div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.06)",padding:"1.75rem",borderTop:"3px solid var(--goldl)"}}><h3 className="rr-display" style={{fontSize:"1.6rem",color:"var(--cream)",marginBottom:"0.8rem"}}>Flexibility<br/>Over Mastery.</h3><p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.72}}>The most valuable skill is not knowing one thing deeply — it is <strong style={{color:"var(--goldl)"}}>learning new things quickly</strong>. The people who thrive will be the ones who adapt, not the ones who memorized.</p></div></Reveal>
      <Reveal delay={2}><div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.06)",padding:"1.75rem",borderTop:"3px solid var(--goldl)"}}><h3 className="rr-display" style={{fontSize:"1.6rem",color:"var(--cream)",marginBottom:"0.8rem"}}>Relationships<br/>Over Resumes.</h3><p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.72}}>When AI handles execution, your network becomes your moat. The ability to communicate, collaborate, and build trust is the <strong style={{color:"var(--goldl)"}}>last unfakeable advantage</strong>. Invest in people. That compounds forever.</p></div></Reveal>
    </div>
    <Reveal>
      <div style={{background:"rgba(201,146,26,0.05)",border:"1px solid rgba(201,146,26,0.15)",padding:"2.2rem",maxWidth:"54rem",margin:"0 auto"}}>
        <div className="grid-2" style={{gap:"2.5rem",alignItems:"center"}}>
          <div>
            <h3 className="rr-display" style={{fontSize:"1.8rem",color:"var(--cream)",marginBottom:"0.8rem",lineHeight:1.15}}>Maybe Your Job Is to <span style={{color:"var(--goldl)"}}>Create Your Job.</span></h3>
            <p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.72}}>Entrepreneurship is finding pain points in other people and solving them.<CiteTip label="Po-Shen Loh - Entrepreneurship" body="'The heart of entrepreneurship is finding pain points in other people and solving them.'" url="https://www.youtube.com/watch?v=BfBGhSqvcu4"/> You cannot solve a problem for someone unless you can visualize the world through their eyes. That is empathy. That is a <strong style={{color:"var(--goldl)"}}>hard survival skill</strong>.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
            {[{step:"01",text:"Observe a real person with a real problem"},{step:"02",text:"Understand why the problem exists"},{step:"03",text:"Prototype the smallest possible fix"},{step:"04",text:"Test it on the person — not yourself"},{step:"05",text:"Iterate until someone pays for it"}].map((s,i)=>(<div key={i} style={{display:"flex",gap:"0.75rem",alignItems:"baseline"}}><span className="rr-mono" style={{fontSize:"0.75rem",color:"var(--goldd)",flexShrink:0}}>{s.step}</span><span style={{fontSize:"1rem",color:"var(--creamd)"}}>{s.text}</span></div>))}
          </div>
        </div>
      </div>
    </Reveal>
  </div>
</section>);}

function PracticalStep(){return(
<section className="sec" style={{background:"var(--forest)",textAlign:"center"}}>
  <div className="max" style={{maxWidth:"48rem"}}>
    <Reveal><Label>Start Here. Today.</Label></Reveal>
    <Reveal delay={1}><h2 className="rr-display" style={{fontSize:"clamp(2.5rem,5vw,4rem)",marginTop:"1rem",marginBottom:"2rem"}}>Do Not Start With All Three.<br/><span style={{color:"var(--goldl)"}}>Start With One Question.</span></h2></Reveal>
    <Reveal delay={2}>
      <div className="grid-3" style={{gap:"1rem",textAlign:"left"}}>
        {[{q:"Don't know what you're worth?",a:"Start with Roots.",link:"#roots",color:"rgba(30,77,30,0.3)"},{q:"AI makes you nervous?",a:"Start with Graft.",link:"#graft",color:"rgba(30,58,95,0.3)"},{q:"Employed but stuck?",a:"Start with Harvest.",link:"#harvest",color:"rgba(91,58,0,0.3)"}].map((item,i)=>(<a key={i} href={item.link} style={{background:item.color,border:"1px solid rgba(201,146,26,0.15)",padding:"1.5rem",textDecoration:"none",transition:"border-color 0.3s, transform 0.3s",display:"block"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(201,146,26,0.4)";e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,146,26,0.15)";e.currentTarget.style.transform="translateY(0)";}}><p style={{fontSize:"1rem",color:"var(--creamd)",marginBottom:"0.5rem"}}>{item.q}</p><p className="rr-display" style={{fontSize:"1.8rem",color:"var(--goldl)"}}>{item.a}</p></a>))}
      </div>
    </Reveal>
  </div>
</section>);}

function CoursesSection(){return(
<section id="courses" className="sec" style={{background:"linear-gradient(to bottom, var(--darkgreen), var(--forest))"}}>
  <div className="max">
    <Reveal><Label>Free Tools to Start Now</Label><h2 className="rr-display" style={{fontSize:"clamp(2.5rem,5vw,4.5rem)",marginTop:"0.8rem",marginBottom:"1rem"}}>Free AI Courses<br/>From the <span style={{color:"var(--goldl)"}}>Source.</span></h2><p style={{fontSize:"1.05rem",color:"var(--creamd)",lineHeight:1.7,maxWidth:"44rem",marginBottom:"2.5rem"}}>The companies building AI are giving away the education. Start this week.</p></Reveal>
    <div className="grid-3" style={{gap:"1rem"}}>{COURSES.map((c,i)=>(<Reveal key={i} delay={i%3+1}><div className="course-card"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}><div className="course-card-provider">{c.provider}</div><span style={{fontSize:"0.75rem",fontFamily:"'Space Mono',monospace",color:"var(--goldd)",background:"rgba(201,146,26,0.1)",padding:"0.2rem 0.5rem",borderRadius:"2px"}}>{c.tag}</span></div><h3 className="course-card-name">{c.name}</h3><p className="course-card-desc">{c.desc}</p><a className="course-card-link" href={c.url} target="_blank" rel="noopener noreferrer">Enroll free &#8599;</a></div></Reveal>))}</div>
  </div>
</section>);}

function YouTubeSection(){
  const videos = [
    { id: "4uzGDAoNOZc", title: "OpenClaw Creator: Why 80% Of Apps Will Disappear", duration: "15 min", tag: "DISRUPTION", color: "#86efac", desc: "The creator economy meets AI — why most software is about to be rebuilt from scratch." },
    { id: "ivVPJhYM8Ng", title: "Po-Shen Loh: EO Talk — Entrepreneurship After AI", duration: "45 min", tag: "STRATEGY", color: "#fbbf24", desc: "The matchstick puzzle, grading vs doing, and building networks of thoughtful people." },
    { id: "SfOaZIGJ_gs", title: "Sam Altman × Nikhil Kamath: How to Win When AI Changes Everything", duration: "52 min", tag: "FUTURE", color: "#c4b5fd", desc: "\"A 25-year-old in Manila can probably do more than any previous 25-year-old in history.\"" },
    { id: "68ylaeBbdsg", title: "Dario Amodei (Anthropic CEO) on People by WTF", duration: "1 hr", tag: "AI TSUNAMI", color: "#FCA5A5", desc: "\"Coding is going away first.\" Critical thinking is our last real edge. The AI tsunami society is ignoring." },
    { id: "9V6tWC4CdFQ", title: "Sundar Pichai (Google CEO) on Lex Fridman", duration: "2 hr", tag: "BIG PICTURE", color: "#93C5FD", desc: "From a 2-room apartment in Chennai to leading a $2T company. AI as \"more profound than fire or electricity.\"" },
    { id: "eqpkLUUDvNg", title: "Jensen Huang × Larry Fink: Future of AI & Global Economy", duration: "1 hr", tag: "VIRAL", color: "#FDBA74", desc: "NVIDIA's CEO and BlackRock's CEO on how AI reshapes every industry — and every career path." },
  ];

  return(
<section className="sec" style={{background:"var(--forest)"}}>
  <div className="max">
    <Reveal>
      <div style={{marginBottom:"2.5rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.75rem"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#EF4444"}}/>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.72rem",color:"#FCA5A5",letterSpacing:"0.08em"}}>HEAR IT FROM THE PEOPLE BUILDING AI</p>
        </div>
        <h2 className="rr-display" style={{fontSize:"clamp(2rem,4vw,3.5rem)"}}>Prefer to <span style={{color:"var(--goldl)"}}>Watch?</span></h2>
        <p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.7,marginTop:"0.5rem",maxWidth:"38rem"}}>The CEOs building AI — Anthropic, Google, NVIDIA, OpenAI — talking about what it means for your career. Straight from the source.</p>
      </div>
    </Reveal>
    <div className="grid-3" style={{gap:"1rem"}}>
      {videos.map((v, i) => (
        <Reveal key={i} delay={(i % 3) + 1}>
          <a href={"https://www.youtube.com/watch?v=" + v.id} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}>
            <div style={{
              background:"rgba(0,0,0,0.35)",
              border:"1px solid rgba(255,255,255,0.06)",
              overflow:"hidden",
              transition:"all 0.25s",
              cursor:"pointer",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = v.color + "40"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {/* Thumbnail */}
              <div style={{position:"relative",paddingBottom:"56.25%",background:"#000",overflow:"hidden"}}>
                <img
                  src={"https://img.youtube.com/vi/" + v.id + "/mqdefault.jpg"}
                  alt={v.title}
                  style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.85}}
                  loading="lazy"
                />
                {/* Play button overlay */}
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(255,255,255,0.3)"}}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="3,0 16,8 3,16" fill="#fff"/></svg>
                  </div>
                </div>
                {/* Duration */}
                <div style={{position:"absolute",bottom:6,right:6,background:"rgba(0,0,0,0.8)",padding:"0.15rem 0.4rem",fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"#fff"}}>{v.duration}</div>
              </div>
              {/* Info */}
              <div style={{padding:"0.85rem 1rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.4rem"}}>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",letterSpacing:"0.1em",color:v.color}}>{v.tag}</span>
                </div>
                <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.05rem",color:"var(--cream)",lineHeight:1.25,marginBottom:"0.35rem"}}>{v.title}</p>
                <p style={{fontSize:"0.8rem",color:"var(--muted)",lineHeight:1.45}}>{v.desc}</p>
              </div>
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  </div>
</section>);
}

function BooksSection(){
  const [filter, setFilter] = useState("all");
  const cats = [
    { key: "all", label: "All" },
    { key: "macro", label: "AI & Economy" },
    { key: "practical", label: "Practical Skills" },
    { key: "career", label: "Career Strategy" },
    { key: "ethics", label: "Ethics & Society" },
  ];
  const books = [
    { cat: "macro", title: "The Coming Wave", author: "Mustafa Suleyman", year: "2023", color: "#FCA5A5", emoji: "🌊", desc: "How AI and biotech will drive costs of intelligence and energy toward zero.", for: "Everyone" },
    { cat: "macro", title: "Coming Into View", author: "Joseph H. Davis (Vanguard)", year: "2025", color: "#FDBA74", emoji: "📊", desc: "How AI and demographic shifts are in a tug-of-war redefining global investment and growth.", for: "Business / Econ Major" },
    { cat: "macro", title: "The Intelligence Age", author: "Sam Altman", year: "2024", color: "#c4b5fd", emoji: "✦", desc: "Essential reading — his vision of near-zero cost intelligence. Short but paradigm-shifting.", for: "Everyone" },
    { cat: "practical", title: "Co-Intelligence", author: "Ethan Mollick", year: "2024", color: "#86efac", emoji: "🤝", desc: "Best for learning to use LLMs as a co-pilot for study and work. Start here if overwhelmed.", for: "Overwhelmed Student" },
    { cat: "practical", title: "Zero to GenAI Product Leader", author: "Saumil Shrivastava", year: "2025", color: "#FDE68A", emoji: "🚀", desc: "A specialized playbook for leading in the era of Agentic AI.", for: "Developer / Tech Major" },
    { cat: "practical", title: "Deep Work", author: "Cal Newport", year: "2016", color: "#93C5FD", emoji: "🎯", desc: "As AI handles easy tasks, your value lies in your ability to concentrate on hard ones.", for: "Everyone" },
    { cat: "practical", title: "Slow Productivity", author: "Cal Newport", year: "2024", color: "#DDD6FE", emoji: "🐢", desc: "Produce high-quality work without burning out in a 24/7 digital world.", for: "Everyone" },
    { cat: "career", title: "Range", author: "David Epstein", year: "2019", color: "#86efac", emoji: "🌐", desc: "Why being a generalist is safer in an AI world than being a hyper-specialist.", for: "Creative / Humanities" },
    { cat: "career", title: "The Start-Up of You", author: "Reid Hoffman", year: "2012", color: "#fbbf24", emoji: "♟️", desc: "Treat your career as a business in permanent beta. From LinkedIn's co-founder.", for: "Everyone" },
    { cat: "career", title: "Job Moves", author: "Bernstein & Horn", year: "2025", color: "#FDBA74", emoji: "🔄", desc: "Fresh framework for navigating career transitions in a fast-moving economy.", for: "Everyone" },
    { cat: "career", title: "The Squiggly Career", author: "Tupper & Ellis", year: "2020", color: "#FCA5A5", emoji: "〰️", desc: "Ditch the corporate ladder for a flexible, opportunistic career path.", for: "Everyone" },
    { cat: "ethics", title: "Empire of AI", author: "Karen Hao", year: "2025", color: "#c4b5fd", emoji: "🏛️", desc: "A critical look at the geopolitical and environmental costs of the AI boom.", for: "Everyone" },
    { cat: "ethics", title: "Humans Are Underrated", author: "Geoff Colvin", year: "2015", color: "#93C5FD", emoji: "💛", desc: "Why empathy and social interaction are the only things AI cannot yet automate.", for: "Everyone" },
    { cat: "ethics", title: "The 100-Year Life", author: "Gratton & Scott", year: "2016", color: "#86efac", emoji: "♾️", desc: "Prepare for a multi-stage career that might last 60+ years.", for: "Everyone" },
  ];
  const filtered = filter === "all" ? books : books.filter(b => b.cat === filter);

  return(
<section className="sec" style={{background:"linear-gradient(to bottom, var(--forest), var(--darkgreen))"}}>
  <div className="max">
    <Reveal>
      <div style={{marginBottom:"2rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.75rem"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"var(--goldd)"}}/>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.72rem",color:"var(--goldd)",letterSpacing:"0.08em"}}>GO DEEPER</p>
        </div>
        <h2 className="rr-display" style={{fontSize:"clamp(2rem,4vw,3.5rem)"}}>The <span style={{color:"var(--goldl)"}}>Reading List.</span></h2>
        <p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.7,marginTop:"0.5rem",maxWidth:"42rem"}}>Curated for the landscape of 2026 and beyond — from the macro-economy to daily habits that keep you competitive.</p>
      </div>
    </Reveal>

    {/* Filter tabs */}
    <Reveal delay={1}>
      <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"2rem"}}>
        {cats.map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)} style={{
            fontFamily:"'Space Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.06em",
            padding:"0.4rem 0.85rem", cursor:"pointer", border:"1px solid",
            borderColor: filter === c.key ? "var(--goldd)" : "rgba(255,255,255,0.1)",
            background: filter === c.key ? "rgba(201,146,26,0.15)" : "rgba(0,0,0,0.2)",
            color: filter === c.key ? "var(--goldl)" : "var(--muted)",
            transition:"all 0.2s"
          }}>{c.label}</button>
        ))}
      </div>
    </Reveal>

    {/* Book grid */}
    <div className="grid-2" style={{gap:"0.85rem"}}>
      {filtered.map((b, i) => (
        <Reveal key={b.title} delay={(i % 4) + 1}>
          <div style={{
            background:"rgba(0,0,0,0.3)",
            border:"1px solid rgba(255,255,255,0.06)",
            padding:"1.1rem 1.2rem",
            display:"flex",gap:"0.85rem",alignItems:"flex-start",
            transition:"all 0.25s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = b.color + "40"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            {/* Emoji spine */}
            <div style={{
              width:42, minWidth:42, height:56, display:"flex", alignItems:"center", justifyContent:"center",
              background: b.color + "15", border:"1px solid " + b.color + "30",
              fontSize:"1.3rem", flexShrink:0,
            }}>{b.emoji}</div>
            {/* Info */}
            <div style={{flex:1, minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem",marginBottom:"0.2rem"}}>
                <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1rem",color:"var(--cream)",lineHeight:1.25,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.title}</p>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.55rem",color:"var(--muted)",flexShrink:0}}>{b.year}</span>
              </div>
              <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:b.color,marginBottom:"0.35rem"}}>{b.author}</p>
              <p style={{fontSize:"0.8rem",color:"var(--muted)",lineHeight:1.45}}>{b.desc}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>

    {/* Quick guide */}
    <Reveal delay={2}>
      <div style={{marginTop:"2rem",background:"rgba(0,0,0,0.35)",border:"1px solid rgba(201,146,26,0.12)",padding:"1.2rem 1.5rem"}}>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:"var(--goldd)",letterSpacing:"0.08em",marginBottom:"0.75rem"}}>⚡ QUICK START GUIDE</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"0.6rem"}}>
          {[
            { who: "Developer / Tech", book: "Zero to GenAI Product Leader", color: "#FDE68A" },
            { who: "Business / Econ", book: "Coming Into View", color: "#FDBA74" },
            { who: "Creative / Humanities", book: "Range", color: "#86efac" },
            { who: "Overwhelmed? Start here", book: "Co-Intelligence", color: "#c4b5fd" },
          ].map((g, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:g.color,flexShrink:0}}/>
              <p style={{fontSize:"0.78rem",color:"var(--creamd)"}}><strong style={{color:g.color}}>{g.who}:</strong> {g.book}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  </div>
</section>);
}

function StudentCreditsSection(){
  const offers = [
    { platform: "Google Gemini AI Pro", logo: "G", color: "#4285F4", bgTint: "#4285F418", what: "Gemini Advanced + NotebookLM Plus + 2TB storage", how: "Verify via SheerID with student email", cost: "FREE · 1 full year", deadline: "Sign up by Apr 30, 2026", url: "https://gemini.google/students/", hot: true },
    { platform: "ChatGPT (OpenAI)", logo: "◉", color: "#10A37F", bgTint: "#10A37F18", what: "ChatGPT Plus — GPT-5, deep research, image gen, agents", how: "Free tier always available · Watch for student promos", cost: "FREE tier · Promos return periodically", deadline: "Check chatgpt.com/students", url: "https://chatgpt.com/students" },
    { platform: "Claude (Anthropic)", logo: "C", color: "#D4A574", bgTint: "#D4A57418", what: "Claude free tier — massive context window, great for essays & research", how: "Sign up at claude.ai · No verification needed", cost: "FREE tier · generous limits", deadline: "Always available", url: "https://claude.ai" },
    { platform: "GitHub Copilot", logo: "⌥", color: "#F0883E", bgTint: "#F0883E18", what: "AI pair programmer in VS Code — code autocomplete & chat", how: "GitHub Student Developer Pack (free with .edu)", cost: "FREE for verified students", deadline: "While enrolled", url: "https://education.github.com/pack" },
    { platform: "Microsoft Copilot", logo: "M", color: "#00A4EF", bgTint: "#00A4EF18", what: "GPT-powered assistant — web, Windows, mobile. No sign-up wall.", how: "Just open copilot.microsoft.com", cost: "FREE · no student verification", deadline: "Always available", url: "https://copilot.microsoft.com" },
    { platform: "Perplexity AI", logo: "P", color: "#20B2AA", bgTint: "#20B2AA18", what: "AI-powered research engine — cited sources, academic papers", how: "Sign up free · student Pro discounts available", cost: "FREE tier · Pro $20/mo", deadline: "Always available", url: "https://perplexity.ai" },
    { platform: "NotebookLM (Google)", logo: "N", color: "#FBBC04", bgTint: "#FBBC0418", what: "Upload PDFs, notes, lectures → AI study guides & audio summaries", how: "Free with any Google account", cost: "FREE · completely free", deadline: "Always available", url: "https://notebooklm.google.com" },
    { platform: "Canva for Education", logo: "✦", color: "#7B68EE", bgTint: "#7B68EE18", what: "Design + AI image gen + Magic Write + presentations", how: "Verify student status on canva.com", cost: "FREE · full Pro features", deadline: "While enrolled", url: "https://www.canva.com/education/" },
  ];

  return(
<section className="sec" style={{background:"var(--darkgreen)"}}>
  <div className="max">
    <Reveal>
      <div style={{marginBottom:"2rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.75rem"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#86efac"}}/>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.72rem",color:"#86efac",letterSpacing:"0.08em"}}>₱0.00 · ZERO PESOS TO START</p>
        </div>
        <h2 className="rr-display" style={{fontSize:"clamp(2rem,4vw,3.5rem)"}}>Free AI <span style={{color:"var(--goldl)"}}>Credits & Tools</span><br/>for Students.</h2>
        <p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.7,marginTop:"0.5rem",maxWidth:"42rem"}}>The companies building AI are literally giving it away to students. These aren't trials with a catch — they're real tools, full-featured, designed to get you hooked before you graduate. <strong style={{color:"#86efac"}}>Use that to your advantage.</strong></p>
      </div>
    </Reveal>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(min(100%, 320px), 1fr))",gap:"0.75rem"}}>
      {offers.map((o, i) => (
        <Reveal key={i} delay={(i % 4) + 1}>
          <a href={o.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}>
            <div style={{
              background:"rgba(0,0,0,0.3)",
              border: o.hot ? "1px solid " + o.color + "40" : "1px solid rgba(255,255,255,0.06)",
              padding:"1rem 1.1rem",
              transition:"all 0.25s",
              position:"relative",
              overflow:"hidden",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = o.color + "60"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = o.hot ? o.color + "40" : "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {o.hot && <div style={{position:"absolute",top:0,right:0,background:o.color,color:"#000",fontFamily:"'Space Mono',monospace",fontSize:"0.5rem",fontWeight:700,padding:"0.15rem 0.5rem",letterSpacing:"0.05em"}}>CLAIM NOW</div>}
              {/* Header */}
              <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.5rem"}}>
                <div style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",background:o.bgTint,border:"1px solid " + o.color + "30",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"0.9rem",color:o.color,flexShrink:0}}>{o.logo}</div>
                <div>
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1rem",color:"var(--cream)",lineHeight:1.2}}>{o.platform}</p>
                </div>
              </div>
              {/* What */}
              <p style={{fontSize:"0.8rem",color:"var(--creamd)",lineHeight:1.4,marginBottom:"0.5rem"}}>{o.what}</p>
              {/* Cost badge */}
              <div style={{display:"inline-block",background:"rgba(134,239,172,0.1)",border:"1px solid rgba(134,239,172,0.2)",padding:"0.15rem 0.5rem",marginBottom:"0.35rem"}}>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"#86efac",letterSpacing:"0.04em"}}>{o.cost}</span>
              </div>
              {/* How + deadline */}
              <p style={{fontSize:"0.7rem",color:"var(--muted)",lineHeight:1.4,marginTop:"0.2rem"}}>{o.how}</p>
              {o.deadline !== "Always available" && <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:o.color,marginTop:"0.25rem"}}>⏰ {o.deadline}</p>}
            </div>
          </a>
        </Reveal>
      ))}
    </div>

    {/* Bottom tip */}
    <Reveal delay={2}>
      <div style={{marginTop:"1.5rem",padding:"1rem 1.2rem",background:"rgba(134,239,172,0.06)",borderLeft:"3px solid #86efac"}}>
        <p style={{fontSize:"0.9rem",color:"var(--creamd)",lineHeight:1.6}}><strong style={{color:"#86efac"}}>Pro tip:</strong> You don't need to pick one. Use <strong>Gemini</strong> for study guides, <strong>Claude</strong> for long essays, <strong>ChatGPT</strong> for brainstorming, <strong>Copilot</strong> for code, and <strong>Perplexity</strong> for research. They're all free. Stack them.</p>
      </div>
    </Reveal>
  </div>
</section>);
}

function AnxietyToAction(){return(
<section className="sec" style={{background:"var(--forest)",textAlign:"center",paddingTop:"6rem",paddingBottom:"6rem"}}>
  <div className="max" style={{maxWidth:"42rem"}}>
    <Reveal><p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.75rem",letterSpacing:"0.15em",color:"var(--goldd)",marginBottom:"2rem"}}>ONE LAST THING</p></Reveal>
    <Reveal delay={1}><h2 className="rr-display" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)",lineHeight:1.15,marginBottom:"2rem"}}>The anxiety is real.<br/><span style={{color:"var(--goldl)"}}>Let it move you,<br/>not freeze you.</span></h2></Reveal>
    <Reveal delay={2}><p style={{fontSize:"1.1rem",color:"var(--creamd)",lineHeight:1.8,maxWidth:"34rem",margin:"0 auto"}}>If you're scared — good. It means you're paying attention. The job market is shifting under everyone's feet and no one handed you a map. That feeling is not weakness. <strong style={{color:"var(--goldl)"}}>But fear that stays still becomes paralysis. Fear that moves becomes preparation.</strong> You don't have to have it all figured out. You just have to start.</p></Reveal>
  </div>
</section>);}

const GROWTH_OPTIONS=[
  {label:"15 min",pct:1.04,mins:15,vibe:"1 ML game",emoji:"🎮"},
  {label:"30 min",pct:2.08,mins:30,vibe:"1 K-drama episode",emoji:"📺"},
  {label:"1 hour",pct:4.17,mins:60,vibe:"1 Netflix binge",emoji:"🍿"},
  {label:"2 hours",pct:8.33,mins:120,vibe:"1 study session",emoji:"📚"},
];
function OnePercentGraph(){
  const canvasRef=useRef(null);
  const[visible,setVisible]=useState(false);
  const[animProgress,setAnimProgress]=useState(0);
  const[activeIdx,setActiveIdx]=useState(0);
  const opt=GROWTH_OPTIONS[activeIdx];
  const dailyRate=1+opt.pct/100;
  const yearVal=Math.pow(dailyRate,365);
  useEffect(()=>{
    const el=canvasRef.current;if(!el)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVisible(true);obs.disconnect();}},{threshold:0.3});
    obs.observe(el);return()=>obs.disconnect();
  },[]);
  useEffect(()=>{
    if(!visible)return;
    setAnimProgress(0);
    let start=null;const duration=1800;
    const tick=(ts)=>{if(!start)start=ts;const p=Math.min((ts-start)/duration,1);setAnimProgress(p);if(p<1)requestAnimationFrame(tick);};
    requestAnimationFrame(tick);
  },[visible,activeIdx]);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    const dpr=window.devicePixelRatio||1;
    const w=canvas.clientWidth;const h=canvas.clientHeight;
    canvas.width=w*dpr;canvas.height=h*dpr;
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,w,h);
    const pad={top:60,right:90,bottom:50,left:65};
    const gw=w-pad.left-pad.right;const gh=h-pad.top-pad.bottom;
    const maxVal=Math.max(yearVal*1.1,40);
    // grid
    ctx.strokeStyle="rgba(255,255,255,0.06)";ctx.lineWidth=1;
    const gridSteps=4;
    for(let i=0;i<=gridSteps;i++){const y=pad.top+gh*(1-i/gridSteps);ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(pad.left+gw,y);ctx.stroke();}
    // y-axis labels
    ctx.fillStyle="rgba(248,237,216,0.4)";ctx.font="11px 'Space Mono',monospace";ctx.textAlign="right";
    for(let i=0;i<=gridSteps;i++){
      const v=maxVal*(i/gridSteps);
      const label=v<10?v.toFixed(1)+"x":Math.round(v)+"x";
      ctx.fillText(label,pad.left-8,pad.top+gh*(1-i/gridSteps)+4);
    }
    // x-axis labels
    ctx.textAlign="center";ctx.fillStyle="rgba(248,237,216,0.4)";
    ["Day 1","","","3 mo","","","6 mo","","","9 mo","","","1 yr"].forEach((l,i)=>{
      if(l){const x=pad.left+(i/12)*gw;ctx.fillText(l,x,h-pad.bottom+20);}
    });
    // main curve (animated)
    const maxDay=Math.floor(365*animProgress);
    if(maxDay>0){
      ctx.shadowColor="rgba(232,184,75,0.4)";ctx.shadowBlur=12;
      ctx.strokeStyle="#E8B84B";ctx.lineWidth=2.5;ctx.beginPath();
      for(let d=0;d<=maxDay;d++){
        const x=pad.left+(d/365)*gw;
        const val=Math.pow(dailyRate,d);
        const y=pad.top+gh*(1-val/maxVal);
        if(d===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.stroke();ctx.shadowBlur=0;
      // fill
      const lastX=pad.left+(maxDay/365)*gw;
      const lastVal=Math.pow(dailyRate,maxDay);
      const lastY=pad.top+gh*(1-lastVal/maxVal);
      ctx.lineTo(lastX,pad.top+gh);ctx.lineTo(pad.left,pad.top+gh);ctx.closePath();
      const grad=ctx.createLinearGradient(0,pad.top,0,pad.top+gh);
      grad.addColorStop(0,"rgba(232,184,75,0.15)");grad.addColorStop(1,"rgba(232,184,75,0)");
      ctx.fillStyle=grad;ctx.fill();
      // dot
      ctx.beginPath();ctx.arc(lastX,lastY,5,0,Math.PI*2);ctx.fillStyle="#E8B84B";ctx.fill();
      ctx.beginPath();ctx.arc(lastX,lastY,2.5,0,Math.PI*2);ctx.fillStyle="#0A130A";ctx.fill();
      // label
      if(animProgress>0.3){
        ctx.fillStyle="#E8B84B";ctx.font="bold 13px 'Space Mono',monospace";ctx.textAlign="left";
        ctx.fillText(lastVal.toFixed(1)+"x",lastX+14,lastY-14);
      }
    }
    // ghost lines for other options (dimmed)
    GROWTH_OPTIONS.forEach((g,gi)=>{
      if(gi===activeIdx)return;
      const r=1+g.pct/100;
      ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();
      for(let d=0;d<=Math.floor(365*animProgress);d++){
        const x=pad.left+(d/365)*gw;const val=Math.pow(r,d);const y=pad.top+gh*(1-Math.min(val,maxVal)/maxVal);
        if(d===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.stroke();ctx.setLineDash([]);
    });
    // flat line
    ctx.setLineDash([4,4]);ctx.strokeStyle="rgba(248,113,113,0.4)";ctx.lineWidth=1.5;ctx.beginPath();
    const flatY=pad.top+gh*(1-1/maxVal);
    ctx.moveTo(pad.left,flatY);ctx.lineTo(pad.left+gw*animProgress,flatY);ctx.stroke();ctx.setLineDash([]);
    if(animProgress>0.5){ctx.fillStyle="rgba(248,113,113,0.5)";ctx.font="11px 'Space Mono',monospace";ctx.textAlign="right";ctx.fillText("0% daily = 1x forever",pad.left+gw-5,flatY-8);}
  },[animProgress,activeIdx]);
  return(
<section className="sec" style={{background:"linear-gradient(to bottom, var(--forest), var(--darkgreen))",textAlign:"center",paddingTop:"5rem",paddingBottom:"5rem"}}>
  <div className="max" style={{maxWidth:"48rem"}}>
    <Reveal><p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.75rem",letterSpacing:"0.15em",color:"var(--goldd)",marginBottom:"1rem"}}>THE MATH OF SHOWING UP</p></Reveal>
    <Reveal delay={1}><h2 className="rr-display" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)",lineHeight:1.1,marginBottom:"0.5rem"}}>
      <span style={{color:"var(--goldl)"}}>{opt.mins} minutes</span> a day.<br/><span style={{color:"var(--goldl)"}}>{yearVal.toFixed(1)}x</span> in one year.
    </h2></Reveal>
    <Reveal delay={2}><p style={{fontSize:"1rem",color:"var(--creamd)",lineHeight:1.7,maxWidth:"36rem",margin:"0 auto 1.5rem"}}>
      That's {opt.emoji} {opt.vibe}. Replace just one with an AI experiment. Compounding isn't magic — it's math.
    </p></Reveal>
    <Reveal delay={2}>
      <div style={{display:"flex",justifyContent:"center",gap:"0.5rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
        {GROWTH_OPTIONS.map((g,i)=>(
          <button key={i} onClick={()=>setActiveIdx(i)} style={{
            fontFamily:"'Space Mono',monospace",fontSize:"0.8rem",letterSpacing:"0.05em",
            padding:"0.5rem 1.2rem",cursor:"pointer",border:"1px solid",borderRadius:"6px",
            transition:"all 0.25s",
            background:i===activeIdx?"var(--gold)":"transparent",
            color:i===activeIdx?"var(--forest)":"var(--creamd)",
            borderColor:i===activeIdx?"var(--gold)":"rgba(255,255,255,0.12)",
            fontWeight:i===activeIdx?700:400,
          }}>{g.emoji} {g.label}</button>
        ))}
      </div>
      <canvas ref={canvasRef} style={{width:"100%",height:"320px",maxWidth:"48rem",borderRadius:"12px",background:"rgba(10,19,10,0.6)",border:"1px solid rgba(255,255,255,0.06)"}}/>
      <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:"var(--muted)",marginTop:"1rem",letterSpacing:"0.05em"}}>
        {(dailyRate).toFixed(4)}³⁶⁵ = {yearVal.toFixed(2)} · · · {opt.pct.toFixed(1)}% of your day, compounded.
      </p>
    </Reveal>
  </div>
</section>);}

function Close(){return(
<section className="act-break" style={{minHeight:"100vh",background:"radial-gradient(ellipse 65% 65% at 50% 85%,rgba(201,146,26,0.07) 0%,transparent 70%), var(--forest)"}}>
  <Reveal><Label>The Rice Race Starts Today</Label></Reveal>
  <Reveal delay={1}><h2 className="rr-display" style={{fontSize:"clamp(3.5rem,9vw,8.5rem)",marginTop:"1rem",lineHeight:0.95}}>Escape the race.<span style={{color:"var(--goldl)",display:"block"}}>Cultivate the rice.</span></h2></Reveal>
  <Reveal delay={2}><p style={{marginTop:"3rem",fontSize:"clamp(1.1rem,2.2vw,1.5rem)",color:"var(--creamd)",lineHeight:1.6,maxWidth:"34rem",margin:"3rem auto 0",fontFamily:"'Barlow',sans-serif",fontWeight:300,fontStyle:"italic"}}>You were never meant to run faster.<br/>You were meant to grow what only you can grow.</p></Reveal>
  <Reveal delay={2}><p className="rr-display" style={{marginTop:"4rem",fontSize:"1.1rem",letterSpacing:"0.08em",color:"var(--muted)"}}><span style={{color:"var(--goldd)"}}>Develop Expertise</span>{" \u2192 "}<span style={{color:"var(--goldd)"}}>Apply AI</span>{" \u2192 "}<span style={{color:"var(--goldd)"}}>Market Your Value</span></p></Reveal>
</section>);}

function Footer(){return(<footer style={{background:"#0A0D0A",borderTop:"1px solid rgba(255,255,255,0.05)",padding:"1.5rem 2.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}><p className="rr-mono" style={{fontSize:"0.8rem",color:"var(--muted)"}}>Rice Race / Uplifting Filipinos Through AI</p><div style={{display:"flex",alignItems:"center",gap:"1.5rem",flexWrap:"wrap"}}><p className="rr-mono" style={{fontSize:"0.75rem",color:"var(--goldd)"}}>Anthropic / OpenAI / WEF / Ramp / TransUnion PH / PSA / Po-Shen Loh / Sam Altman</p><a href="https://www.linkedin.com/in/jpthedio/" target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"0.75rem",fontFamily:"'Space Mono',monospace",color:"var(--goldl)",textDecoration:"none",padding:"0.3rem 0.7rem",border:"1px solid rgba(201,146,26,0.3)",transition:"all 0.2s"}}><span style={{fontWeight:700}}>in</span> jpthedio</a><a href="https://dionisio.jp/" target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"0.75rem",fontFamily:"'Space Mono',monospace",color:"var(--goldl)",textDecoration:"none",padding:"0.3rem 0.7rem",border:"1px solid rgba(201,146,26,0.3)",transition:"all 0.2s"}}>✦ dionisio.jp</a></div></footer>);}

// ─── APP ──────────────────────────────────────────────────────────
export default function App(){
  useEffect(() => {
    console.log(
      "%c🍚 THE RICE RACE %c\n\n" +
      "Built with Claude ✦ AI-powered storytelling\n\n" +
      "%c🎁 EASTER EGG: Only 3 people can use this.%c\n\n" +
      "Get a FREE week of Claude Code — the AI tool that built this entire presentation.\n\n" +
      "👉 https://claude.ai/referral/xAOatMhs6w\n\n" +
      "⚡ Only 3 referral slots. First come, first served.\n" +
      "Terms apply.",
      "color:#E8B84B;font-size:24px;font-weight:900;font-family:'Barlow Condensed',sans-serif;",
      "color:#F2EDD8;font-size:12px;font-family:'Space Mono',monospace;",
      "color:#86efac;font-size:14px;font-weight:900;font-family:'Space Mono',monospace;background:#0a1a0a;padding:4px 8px;border-radius:4px;",
      "color:#F2EDD8;font-size:12px;font-family:'Space Mono',monospace;"
    );
  }, []);
  const[activeSection,setActiveSection]=useState("");
  useEffect(()=>{const sections=document.querySelectorAll("section[id]");const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setActiveSection(e.target.id);}),{threshold:0.3});sections.forEach(s=>obs.observe(s));return()=>obs.disconnect();},[]);
  // Inline confetti implementation
  useEffect(()=>{
    if(window.confetti)return;
    window.confetti = (opts={}) => {
      const c = document.createElement("canvas");
      c.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999";
      document.body.appendChild(c);
      c.width=window.innerWidth;c.height=window.innerHeight;
      const ctx=c.getContext("2d");
      const colors=opts.colors||["#86efac","#22c55e","#C9921A","#E8B84B","#fff"];
      const ox=(opts.origin?.x||0.5)*c.width, oy=(opts.origin?.y||0.5)*c.height;
      const gravity=opts.gravity||0.8;
      const particles=Array.from({length:opts.particleCount||60},()=>({
        x:ox,y:oy,
        vx:(Math.random()-0.5)*(opts.spread||70)*0.3,
        vy:-(Math.random()*4+2),
        r:Math.random()*5+2,
        color:colors[Math.floor(Math.random()*colors.length)],
        rot:Math.random()*6.28,
        rv:(Math.random()-0.5)*0.3,
        life:1,decay:0.008+Math.random()*0.006,
        shape:Math.random()>0.5?"rect":"circle",
        w:Math.random()*6+3,h:Math.random()*3+1,
      }));
      let frame;
      const draw=()=>{
        ctx.clearRect(0,0,c.width,c.height);
        let alive=false;
        particles.forEach(p=>{
          if(p.life<=0)return;alive=true;
          p.x+=p.vx;p.y+=p.vy;p.vy+=gravity*0.12;p.vx*=0.99;
          p.rot+=p.rv;p.life-=p.decay;
          ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
          ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;
          if(p.shape==="rect"){ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);}
          else{ctx.beginPath();ctx.arc(0,0,p.r,0,6.28);ctx.fill();}
          ctx.restore();
        });
        if(alive)frame=requestAnimationFrame(draw);
        else{cancelAnimationFrame(frame);c.remove();}
      };
      draw();
    };
  },[]);
  return(
    <ToastProvider>
    <style>{STYLES}</style>
    <div className="noise">
      <Nav activeSection={activeSection}/>
      <Hero/>
      <div className="divider"/>
      <Intro/>
      <AIShowcase/>
      <div className="divider"/>
      <Problem/>
      <div className="divider"/>
      <RaceGrind/>
      <RaceDisruption/>
      <RacePlateau/>
      <ActBreak text="So. What do you do?" bg="linear-gradient(to bottom, #090404, var(--forest))"/>
      <div className="divider"/>
      <DataSection/>
      <div className="divider"/>
      <Reframe/>
      <div className="divider"/>
      <QuoteSection/>
      <div className="divider"/>
      <FormulaOverview/>
      <div className="divider"/>
      <Roots/>
      <div className="divider"/>
      <Graft/>
      <div className="divider"/>
      <Harvest/>
      <div className="divider"/>
      <SkillsOverview/>
      <Diagnose/>
      <Strategize/>
      <Execute/>
      <ActBreak text={<>What if they don't hire you<br/>for what you <span style={{color:"var(--goldl)"}}>know?</span></>} bg="var(--darkgreen)"/>
      <div className="divider"/>
      <HowHiringChanges/>
      <div className="divider"/>
      <TheUpside/>
      <PhMapSection/>
      <WhatMattersNow/>
      <div className="divider"/>
      <PracticalStep/>
      <div className="divider"/>
      <CoursesSection/>
      <YouTubeSection/>
      <BooksSection/>
      <StudentCreditsSection/>
      <AIReveal/>
      <AnxietyToAction/>
      <OnePercentGraph/>
      <Close/>
      <Footer/>
    </div>
    </ToastProvider>  );
}
