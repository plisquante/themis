// Wiki pages: the same drifting 0/1 background as the landing page (calmer), the sidebar built
// from PAGES, previous/next links, copy buttons on code blocks. Content lives in each page's HTML.
const PAGES=[
 ["BAŞLANGIÇ",[["index","Wiki ana sayfası"],["kurulum","Kurulum"],["proxy","Velocity ve BungeeCord"],["sss","Sık sorulanlar"]]],
 ["KULLANIM",[["komutlar","Komutlar"],["yetkiler","Yetkiler"],["sablonlar","Ceza merdivenleri"],["koruma","Kanıt ve koruma"],["raporlar","Oyuncu raporları"],["aktarma","Başka eklentiden geçiş"]]],
 ["AYARLAR",[["yapilandirma","config.yml"],["depolama","Veritabanı ve ağ senkronu"],["mesajlar","Mesajlar ve diller"]]],
 ["GELİŞTİRİCİ",[["rest-api","REST API"],["webhooklar","Webhook'lar"],["java-api","Java API"],["placeholderapi","PlaceholderAPI"]]],
 ["THEMIS",[["surumler","Sürüm notları"],["lisans","Lisans"]]]];
const REDUCED=matchMedia("(prefers-reduced-motion: reduce)").matches;
const here=document.body.dataset.page;
const href=k=>k==="index"?"./":k+".html";

// sidebar
const side=document.getElementById("side");
if(side){
  side.innerHTML=`<button class="toggle" aria-expanded="false" aria-controls="wiki-menu">İçindekiler <span>+</span></button>`+
    `<div class="menu" id="wiki-menu">`+PAGES.map(([g,items])=>`<h5>// ${g}</h5><ul>`+items.map(([k,t])=>
      `<li><a href="${href(k)}"${k===here?' aria-current="page"':""}>${t}</a></li>`).join("")+`</ul>`).join("")+`</div>`;
  const b=side.querySelector(".toggle");
  b.addEventListener("click",()=>{const o=side.classList.toggle("open");b.setAttribute("aria-expanded",o);b.querySelector("span").textContent=o?"−":"+"});
}
// previous / next
const flat=PAGES.flatMap(([,items])=>items),i=flat.findIndex(([k])=>k===here),pager=document.getElementById("pager");
if(pager&&i>=0){
  const p=flat[i-1],n=flat[i+1];
  pager.innerHTML=(p?`<a class="prev" href="${href(p[0])}">← ${p[1]}</a>`:"")+(n?`<a class="next" href="${href(n[0])}">${n[1]} →</a>`:"");
}
// copy buttons
document.querySelectorAll(".doc pre").forEach(pre=>{
  const btn=document.createElement("button");btn.type="button";btn.textContent="kopyala";
  btn.addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(pre.querySelector("code")?.innerText??pre.innerText);btn.textContent="kopyalandı"}
    catch{btn.textContent="seçip kopyala"}
    setTimeout(()=>btn.textContent="kopyala",1800)});
  pre.appendChild(btn);
});

// background: same grid and rhythm as js/main.js, lower contrast so text stays readable
const cv=document.getElementById("bits"),ctx=cv.getContext("2d");
function hash(a,b){let h=(a*374761393+b*668265263)^0x5bd1e995;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295}
const smooth=x=>x<=0?0:x>=1?1:x*x*(3-2*x);
function drawBits(t,scrollY){
  const W=innerWidth,H=innerHeight,dpr=devicePixelRatio||1;
  if(cv.width!==W*dpr||cv.height!==H*dpr){cv.width=W*dpr;cv.height=H*dpr}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-28*Math.PI/180);
  const cw=24,ch=32,R=Math.hypot(W,H)/2+60,flow=(REDUCED?0:t*10)+scrollY*0.15,drift=flow%ch,rowOff=Math.floor(flow/ch);
  ctx.font="20px Unifont, 'DejaVu Sans Mono', monospace";ctx.textAlign="center";ctx.textBaseline="middle";
  for(let y=-R;y<R;y+=ch){
    const j=Math.round((y+R)/ch)-rowOff;
    for(let x=-R;x<R;x+=cw){
      const i=Math.round((x+R)/cw),blk=hash(Math.floor(i/5),Math.floor(j/3)),sp=0.1+blk*0.55,ph=hash(i,j)*10;
      const c=t*sp+ph+blk*3,k=Math.floor(c),bit=(k+Math.floor(hash(i,k)*2))&1,prev=(k-1+Math.floor(hash(i,k-1)*2))&1;
      const since=(c-k)/sp,base=0.03+hash(j,i)*0.08,glow=since<1.0?Math.pow(1-since/1.0,2)*0.14:0,mix=REDUCED?1:smooth(since/0.5);
      if(mix<1&&prev!==bit){ctx.fillStyle=`rgba(217,197,143,${base*(1-mix)})`;ctx.fillText(prev,x,y+drift)}
      ctx.fillStyle=`rgba(${bit?"217,197,143":"239,227,189"},${(base+glow)*(prev!==bit?mix:1)})`;ctx.fillText(bit,x,y+drift);
    }
  }
  ctx.restore();
}
const start=performance.now();
(function frame(){drawBits((performance.now()-start)/1000,scrollY);requestAnimationFrame(frame)})();
