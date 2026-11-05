// ---------- pixel icons ----------
const ICONS={
shield:["..XXXXXXX..",".X.......X.",".X..XXX..X.",".X.X...X.X.",".X.X...X.X.",".X..XXX..X.",".X...X...X.","..X..X..X..","...X...X...","....X.X....",".....X....."],
chip:["..X.X.X.X..",".XXXXXXXXX.","XX.......XX",".X.XXXXX.X.","XX.X...X.XX",".X.X.X.X.X.","XX.X...X.XX",".X.XXXXX.X.","XX.......XX",".XXXXXXXXX.","..X.X.X.X.."],
eye:["...........","...XXXXX...","..X.....X..",".X..XXX..X.","X..X.XXX..X","X..X.XXX..X","X..XXXXX..X",".X..XXX..X.","..X.....X..","...XXXXX...","..........."],
lock:["...XXXXX...","..X.....X..","..X.....X..","..X.....X..",".XXXXXXXXX.",".X.......X.",".X...X...X.",".X..XXX..X.",".X...X...X.",".X.......X.",".XXXXXXXXX."],
scales:[".....X.....",".XXXXXXXXX.",".X...X...X.","X.X..X..X.X","X.X..X..X.X","XXX..X..XXX",".....X.....",".....X.....",".....X.....","...XXXXX...","..XXXXXXX.."],
bolt:["......XXX..",".....XXX...","....XXX....","...XXX.....","..XXXXXXX..","......XXX..",".....XXX...","....XXX....","...XXX.....","..XX.......",".X........."]};
function svg(name){let r="";ICONS[name].forEach((row,y)=>[...row].forEach((c,x)=>{if(c==="X")r+=`<rect x="${x}" y="${y}" width="1" height="1"/>`}));
  return `<svg viewBox="-.5 -.5 12 12" fill="#d9c58f">${r}</svg>`}
const CARDS=[
 ["shield","DOSYA KODU","Kayda Geçmeyen Ceza Yok","Her cezanın #7KQ2MX gibi kısa bir dosya kodu vardır. Sebep, süre, veren ve kaldıran kaydedilir; itiraz, /case ve API aynı kodu kullanır.","kod","6 karakter"],
 ["chip","AĞ SENKRONU","Her Sunucuda Tek Sicil","Themis'i yalnızca Velocity ya da BungeeCord proxy'sine kurun ya da her Paper sunucusunu aynı veritabanına bağlayın. Ban, mute ve kick her sunucuda anında geçerli olur.","platform","paper · velocity · bungee"],
 ["eye","KAÇAK HESAP","Alt Hesap Tespiti","IP geçmişi ve bağlı hesaplar takip edilir. Yasaklı bir oyuncunun ikinci hesabı girdiği an yetkililere tıklanabilir bir uyarı düşer.","uyarı","girişte"],
 ["lock","RÜTBE SINIRI","Yetkisini Aşan Olmaz","Helper en fazla iki saat susturur, moderatör otuz gün yasaklar. Kalıcı ceza ayrı bir yetkidir; sınırlar config.yml'de rütbe başına ayarlanır.","helper","≤ 2 saat"],
 ["scales","CEZA MERDİVENİ","Aynı Suça Aynı Ceza","/punish Steve spam yazın; Themis oyuncunun siciline bakar ve şablondaki sıradaki basamağı uygular. Eski suçlar belirlediğiniz süre sonra unutulur.","spam şablonu","uyarı → ban"],
 ["bolt","GELİŞTİRİCİ API","Tamamen Açık API","MIT lisanslı Java API'si, iptal edilebilir olaylar, yetki kapsamlı anahtarlarla REST API, canlı olay akışı ve HMAC imzalı webhook'lar.","rest api","17 uç nokta"]];
document.getElementById("grid").innerHTML=CARDS.map((c,i)=>`<div class="card reveal"><div class="sheen"></div>
 <div class="top">${svg(c[0])}<span class="num">0${i+1}/06</span></div><div class="tag">${c[1]}</div><h3>${c[2]}</h3><p>${c[3]}</p>
 <div class="foot"><span>${c[4]}</span><span>${c[5]}</span></div></div>`).join("");

// ---------- terminal script ----------
const TERM=[
 ['<span class="d">themis@survival:~$</span> <span class="c">themis about</span>',0],
 ['<span class="g">[themis]</span>  v1.0.0 · mysql · senkron redis    <span class="g">OK</span>',.5],
 ['<span class="g">[themis]</span>  REST API :8787/v1 dinliyor        <span class="g">OK</span>',.35],
 ['<span class="g">[themis]</span>  5 ceza şablonu yüklendi           <span class="g">OK</span>',.35],
 ['<span class="d">------------------------------------------------</span>',.3],
 ['<span class="d">themis@survival:~$</span> <span class="c">punish Steve spam</span>',.5],
 ['<span class="g">[terazi]</span>  Steve: spam şablonunda 2 önceki suç',.6],
 ['<span class="g">[terazi]</span>  basamak 3/5 → susturma, 2 saat',.45],
 ['<span class="r">[kılıç]</span>   Steve <span class="r">SUSTURULDU</span> · dosya <span class="c">#Q4TW9K</span>',.55],
 ['<span class="g">[webhook]</span> discord-log ← punishment.issued <span class="g">204</span>',.45],
 ['<span class="g">[senkron]</span> hub, skyblock güncellendi',.4],
 ['<span class="g">[themis]</span>  adalet yerini buldu.',.5]];

// ---------- background bits ----------
const cv=document.getElementById("bits"),ctx=cv.getContext("2d");
const REDUCED=matchMedia("(prefers-reduced-motion: reduce)").matches;
function hash(a,b){let h=(a*374761393+b*668265263)^0x5bd1e995;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295}
const smooth=x=>x<=0?0:x>=1?1:x*x*(3-2*x);
function drawBits(t,scrollY){
  const W=innerWidth,H=innerHeight,dpr=devicePixelRatio||1;
  if(cv.width!==W*dpr){cv.width=W*dpr;cv.height=H*dpr}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-28*Math.PI/180);
  const cw=24,ch=32,R=Math.hypot(W,H)/2+60;
  const flow=(REDUCED?0:t*7)+scrollY*0.25;                // slow, steady drift
  const drift=flow%ch,rowOff=Math.floor(flow/ch);
  ctx.font="20px Unifont, 'DejaVu Sans Mono', monospace";ctx.textAlign="center";ctx.textBaseline="middle";
  const FADE=0.9,GLOW=1.6;                               // seconds: cross-fade of a flip, afterglow
  for(let y=-R;y<R;y+=ch){
    const j=Math.round((y+R)/ch)-rowOff;
    for(let x=-R;x<R;x+=cw){
      const i=Math.round((x+R)/cw);
      const blk=hash(Math.floor(i/5),Math.floor(j/3));      // clustered rhythm
      const sp=0.06+blk*0.32, ph=hash(i,j)*10;
      const c=t*sp+ph+blk*3, k=Math.floor(c);
      const bit=(k+Math.floor(hash(i,k)*2))&1, prev=(k-1+Math.floor(hash(i,k-1)*2))&1;
      const since=(c-k)/sp;                                // seconds since the last flip
      const base=0.05+hash(j,i)*0.16;
      const glow=since<GLOW?Math.pow(1-since/GLOW,2)*0.28:0;
      const mix=REDUCED?1:smooth(since/FADE);
      const color=b=>b?"217,197,143":"239,227,189", k2=b=>b?1:0.8;
      if(mix<1&&prev!==bit){
        ctx.fillStyle=`rgba(${color(prev)},${base*(1-mix)*k2(prev)})`;ctx.fillText(prev,x,y+drift);
      }
      ctx.fillStyle=`rgba(${color(bit)},${(base+glow)*(prev!==bit?mix:1)*k2(bit)})`;
      ctx.fillText(bit,x,y+drift);
    }
  }
  ctx.restore();
}

// ---------- deterministic render ----------
// Everything moves on time, never jumps: soft in-out curves, long durations, lerped hover.
const ease=x=>x<=0?0:x>=1?1:x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;   // in-out cubic
const easeOut=x=>x<=0?0:x>=1?1:1-Math.pow(1-x,4);
const cl=x=>Math.max(0,Math.min(1,x));
function seg(t,a,b,f=ease){return f((t-a)/(b-a))}
const approach=(cur,target,dt,rate)=>cur+(target-cur)*(1-Math.exp(-dt*rate));
let lastT=0,navFill=0;
window.render=function(t){
  if(REDUCED)t=t+60;                                     // reduced motion: start in the final state
  const sy=scrollY,H=innerHeight,dt=Math.min(.1,Math.max(0,t-lastT));lastT=t;
  drawBits(t,sy);
  // hero intro (0 – 3.6 s)
  const L=document.getElementById("logo"),l=seg(t,0.1,2.2);
  L.style.opacity=l;L.style.transform=`scale(${0.94+0.06*l})`;
  document.getElementById("glow").style.opacity=(0.78+0.22*Math.sin(t*0.9))*l;
  document.getElementById("ring1").style.transform=`scale(${1+0.012*Math.sin(t*0.9)})`;
  document.getElementById("ring2").style.transform=`rotate(${t*4}deg)`;
  [["title",.6,2.4],["div",1.0,2.8],["sub",1.25,3.0],["btns",1.5,3.3],["hint",2.0,3.6]].forEach(([id,a,b])=>{
    const e=document.getElementById(id),p=seg(t,a,b);e.style.opacity=p;e.style.transform=`translateY(${(1-p)*14}px)`});
  document.getElementById("div").querySelectorAll("i").forEach(i=>i.style.width=150*seg(t,1.0,2.8)+"px");
  document.getElementById("hint").style.opacity*=0.75+0.25*Math.sin(t*1.2);
  // nav: fill eases toward the scroll position instead of snapping
  navFill=approach(navFill,cl(sy/300),dt,5);
  document.getElementById("navbg").style.opacity=navFill;
  const lis=document.querySelectorAll("#navlinks li"),act=sy<H*0.6?0:sy<document.getElementById("how").offsetTop-H*0.4?1:sy<document.getElementById("faq").offsetTop-H*0.4?2:4;
  lis.forEach((li,i)=>li.classList.toggle("on",i===act));
  // reveals: start once an element enters the view, then play on time (1.4 s), cards staggered
  document.querySelectorAll(".reveal").forEach(e=>{
    const r=e.getBoundingClientRect();
    if(e.__in==null&&r.top<H*0.92){
      const col=e.classList.contains("card")?[...e.parentNode.children].indexOf(e)%3:0;
      e.__in=t+col*0.16;
    }
    const p=e.__in==null?0:REDUCED?1:seg(t,e.__in,e.__in+1.4);
    e.__p=p;
    if(p>0.98&&e.__t0==null)e.__t0=t;
    e.style.opacity=p;e.__y=(1-p)*28;e.style.transform=`translateY(${e.__y}px)`;
  });
  // card hover: every card eases toward its hover state
  const cards=[...document.querySelectorAll(".card")];
  const hv=window.__hover;
  cards.forEach((c,i)=>{
    const on=hv!=null&&hv===i?1:0;
    c.__h=approach(c.__h||0,on,dt,7);const h=c.__h;
    c.style.borderColor=h>0.01?`rgba(217,197,143,${0.16+0.39*h})`:"";
    c.style.background=h>0.01?`rgba(${Math.round(26+10*h)},${Math.round(23+8*h)},${Math.round(18+5*h)},${0.82+0.08*h})`:"";
    const s=c.querySelector(".sheen");
    c.__sx=approach(c.__sx||0,on?((window.__hoverX??0.5)*2-1)*60:0,dt,5);
    s.style.opacity=h;s.style.transform=`translateX(${c.__sx}%)`;
    c.style.transform=`translateY(${(c.__y||0)-6*h}px)`;
  });
  // step bars grow with their step
  document.querySelectorAll(".step .bar").forEach(b=>{b.style.transform=`scaleY(${b.parentNode.__p||0})`});
  // stats count-up (2.6 s)
  document.querySelectorAll(".stat b").forEach(b=>{const card=b.closest(".stats"),t0=card.__t0;
    const to=parseFloat(b.dataset.to),p=t0==null?0:seg(t,t0,t0+2.6,easeOut),v=to*p,sm=b.querySelector("small").outerHTML;
    b.innerHTML=(to%1?v.toFixed(1):Math.round(v))+sm});
  // terminal typing, at a reading pace
  const term=document.querySelector(".term"),t0=term.__t0;let out="",acc=0;
  if(t0!=null){const el=t-t0;for(const [line,d] of TERM){acc+=d*1.5;if(el>=acc)out+=line+"\n";else break}}
  else out=TERM[0][0]+"\n";
  document.getElementById("term").innerHTML=out+'<span class="cursor" style="opacity:'+(0.5+0.5*Math.cos(t*Math.PI*1.4)).toFixed(2)+'"></span>';
};
// animation loop
addEventListener("load",()=>{const s=performance.now();
  addEventListener("mousemove",e=>{const c=e.target.closest&&e.target.closest(".card");
    window.__hover=c?[...document.querySelectorAll(".card")].indexOf(c):null;
    if(c){const r=c.getBoundingClientRect();window.__hoverX=(e.clientX-r.left)/r.width}});
  addEventListener("mouseleave",()=>{window.__hover=null});
  (function f(){render((performance.now()-s)/1000);requestAnimationFrame(f)})()});
