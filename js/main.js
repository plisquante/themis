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
 ["chip","AĞ SENKRONU","Her Sunucuda Tek Sicil","Bütün sunucularınız aynı MySQL, MariaDB ya da PostgreSQL sicilini paylaşır. Ban, mute ve kick SQL ya da Redis üzerinden her sunucuda anında geçerli olur.","senkron","sql · redis"],
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
function hash(a,b){let h=(a*374761393+b*668265263)^0x5bd1e995;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295}
function drawBits(t,scrollY){
  const W=innerWidth,H=innerHeight,dpr=devicePixelRatio||1;
  if(cv.width!==W*dpr){cv.width=W*dpr;cv.height=H*dpr}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-28*Math.PI/180);
  const cw=24,ch=32,R=Math.hypot(W,H)/2+60;
  const drift=(t*14+scrollY*0.25)%ch;
  ctx.font="20px Unifont, 'DejaVu Sans Mono', monospace";ctx.textAlign="center";ctx.textBaseline="middle";
  const rowOff=Math.floor((t*14+scrollY*0.25)/ch);
  for(let y=-R;y<R;y+=ch){
    const j=Math.round((y+R)/ch)-rowOff;
    for(let x=-R;x<R;x+=cw){
      const i=Math.round((x+R)/cw);
      const blk=hash(Math.floor(i/5),Math.floor(j/3));      // clustered rhythm
      const sp=0.15+blk*0.9, ph=hash(i,j)*10;
      const k=Math.floor(t*sp+ph+blk*3);
      const bit=(k+Math.floor(hash(i,k)*2))&1;
      const since=(t*sp+ph+blk*3)-k;                       // 0..1 since last flip
      let a=0.05+hash(j,i)*0.16;
      const flash=since<0.12/sp?1-since*sp/0.12:0;
      a+=flash*0.35;
      ctx.fillStyle=bit?`rgba(217,197,143,${a})`:`rgba(239,227,189,${a*0.8})`;
      ctx.fillText(bit,x,y+drift);
    }
  }
  ctx.restore();
}

// ---------- deterministic render ----------
const ease=x=>x<0?0:x>1?1:1-Math.pow(1-x,3);
const cl=x=>Math.max(0,Math.min(1,x));
function seg(t,a,b){return ease((t-a)/(b-a))}
window.render=function(t){
  const sy=scrollY,H=innerHeight;
  drawBits(t,sy);
  // hero intro
  const L=document.getElementById("logo"),l=seg(t,0,1.3);
  L.style.opacity=l;L.style.transform=`scale(${0.9+0.1*l})`;
  document.getElementById("glow").style.opacity=0.75+0.25*Math.sin(t*1.6);
  document.getElementById("ring1").style.transform=`scale(${1+0.015*Math.sin(t*1.6)})`;
  document.getElementById("ring2").style.transform=`rotate(${t*6}deg)`;
  [["title",.35,1.5],["div",.6,1.7],["sub",.75,1.9],["btns",.95,2.1],["hint",1.3,2.3]].forEach(([id,a,b])=>{
    const e=document.getElementById(id),p=seg(t,a,b);e.style.opacity=p;e.style.transform=`translateY(${(1-p)*24}px)`});
  document.getElementById("div").querySelectorAll("i").forEach(i=>i.style.width=150*seg(t,.6,1.7)+"px");
  // nav
  document.getElementById("navbg").style.opacity=cl(sy/300);
  const lis=document.querySelectorAll("#navlinks li"),act=sy<H*0.6?0:sy<document.getElementById("how").offsetTop-H*0.4?1:sy<document.getElementById("faq").offsetTop-H*0.4?2:4;
  lis.forEach((li,i)=>li.classList.toggle("on",i===act));
  // reveals (scroll-driven)
  document.querySelectorAll(".reveal").forEach((e,idx)=>{
    const top=e.getBoundingClientRect().top,col=e.classList.contains("card")?[...e.parentNode.children].indexOf(e)%3:0;
    const p=ease(cl((H-top-20-col*50)/(H*0.24)));
    e.style.opacity=p;e.style.transform=`translateY(${(1-p)*50}px)`;
    if(e.__p===undefined)e.__t0=null;
    if(p>0.98&&e.__t0==null)e.__t0=t; if(p<0.5)e.__t0=null; e.__p=p;
  });
  // card hover sweep
  const cards=[...document.querySelectorAll(".card")];
  const hv=window.__hover; // index or -1
  cards.forEach((c,i)=>{const on=hv!=null&&Math.abs(hv-i)<0.5;
    c.style.borderColor=on?"rgba(217,197,143,.55)":"";c.style.background=on?"rgba(36,31,23,.9)":"";
    const s=c.querySelector(".sheen");s.style.opacity=on?1:0;s.style.transform=on?`translateX(${((hv-i+0.5)*2-1)*60}%)`:"";
    if(on)c.style.transform+=" translateY(-6px)";});
  // step bars
  document.querySelectorAll(".step .bar").forEach(b=>{const p=parseFloat(b.parentNode.style.opacity||0);b.style.transform=`scaleY(${p})`});
  // stats count-up
  document.querySelectorAll(".stat b").forEach(b=>{const card=b.closest(".stats"),t0=card.__t0;
    const to=parseFloat(b.dataset.to),p=t0==null?0:seg(t,t0,t0+1.4),v=to*p,sm=b.querySelector("small").outerHTML;
    b.innerHTML=(to%1?v.toFixed(1):Math.round(v))+sm});
  // terminal typing
  const term=document.querySelector(".term"),t0=term.__t0;let out="",acc=0;
  if(t0!=null){const el=t-t0;for(const [line,d] of TERM){acc+=d;if(el>=acc)out+=line+"\n";else break}}
  else out=TERM[0][0]+"\n";
  document.getElementById("term").innerHTML=out+'<span class="cursor" style="opacity:'+(Math.floor(t*2.2)%2?0:1)+'"></span>';
};
// animation loop
addEventListener("load",()=>{const s=performance.now();
  addEventListener("mousemove",e=>{const c=e.target.closest&&e.target.closest(".card");window.__hover=c?[...document.querySelectorAll(".card")].indexOf(c):null});
  (function f(){render((performance.now()-s)/1000);requestAnimationFrame(f)})()});
