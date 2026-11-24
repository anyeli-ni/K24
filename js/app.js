const $=s=>document.querySelector(s);
const lightsButton=$('#lights'),partyButton=$('#party'),card=$('#card'),intro=$('#intro'),envelope=$('#envelope'),invitation=$('#invitation'),yesButton=$('#yes'),noButton=$('#no'),hint=$('#hint'),room=$('.room'),dedications=$('#dedications'),flowers=$('#flowers'),musicBtn=$('#music');

let sayTimer;
function say(text){
  clearTimeout(sayTimer);
  intro.classList.remove('show');
  sayTimer=setTimeout(()=>{intro.textContent=text;intro.classList.add('show')},80);
}
setTimeout(()=>say('\u00a1Hey!'),3000);
setTimeout(()=>say('Est\u00e1 oscuro aqu\u00ed...'),7000);
setTimeout(()=>{say('\u00bfPuedes prender la luz?');lightsButton.hidden=false;hint.hidden=false},9000);

/* Musica alegre sintetizada (sin archivos) */
let ctx,master,playing=false,loopTimer;
const BPM=126,STEP=60/BPM/2;
const BASS=[131,98,110,87];
const CH=[[262,330,392],[247,294,392],[262,330,440],[262,349,440]];
const MEL=[523,0,659,523,784,0,659,523, 494,0,587,494,784,0,587,494, 523,0,659,523,880,0,659,523, 523,0,698,523,880,784,698,659];
function note(f,t,d,type,v){
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0008,t+d);
  o.connect(g).connect(master);o.start(t);o.stop(t+d+.02);
}

function playLoop(){
  if(!playing)return;
  const t0=ctx.currentTime+.08;
  for(let s=0;s<32;s++){
    const t=t0+s*STEP,bar=s>>3,st=s&7;
    if(st%2===0)note(BASS[bar],t,STEP*1.8,'square',.045);
    if(st%2===1)CH[bar].forEach(f=>note(f,t,STEP*.9,'triangle',.035));
    if(MEL[s])note(MEL[s],t,STEP*1.6,'triangle',.09);
    if(st%4===2)note(8000,t,.03,'square',.004);
  }
  loopTimer=setTimeout(playLoop,(32*STEP-.1)*1000);
}
function toggleMusic(on){
  try{
    if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.connect(ctx.destination)}
    if(ctx.state==='suspended')ctx.resume();
    playing=on;clearTimeout(loopTimer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(on?1:0,ctx.currentTime,.05);
    musicBtn.classList.toggle('muted',!on);
    musicBtn.setAttribute('aria-label',on?'Silenciar m\u00fasica':'Activar m\u00fasica');
    if(on)playLoop();
  }catch(e){}
}
musicBtn.addEventListener('click',()=>toggleMusic(!playing));
musicBtn.classList.add('muted');

lightsButton.addEventListener('click',()=>{
  document.body.classList.add('lights-on');
  say('Hola Kamila, soy Traposito.');
  hint.hidden=true;lightsButton.hidden=true;
  if(!playing)toggleMusic(true);
  setTimeout(()=>{say('Hay una carta para ti, \u00bfquieres leerla?');invitation.hidden=false},3000);
});

function moveNoButton(){
  const m=12,mx=Math.max(m,innerWidth-noButton.offsetWidth-m),my=Math.max(m,innerHeight-noButton.offsetHeight-m);
  noButton.style.position='fixed';
  noButton.style.left=`${m+Math.random()*(mx-m)}px`;
  noButton.style.top=`${m+Math.random()*(my-m)}px`;
  noButton.style.zIndex='5';
}
noButton.addEventListener('pointerenter',moveNoButton);
noButton.addEventListener('pointerdown',e=>{e.preventDefault();moveNoButton()});
noButton.addEventListener('click',moveNoButton);
addEventListener('resize',()=>{if(noButton.style.position==='fixed')moveNoButton()});

yesButton.addEventListener('click',()=>{
  clearTimeout(sayTimer);
  invitation.hidden=true;envelope.hidden=false;
  hint.textContent='Toca la carta para abrirla.';hint.hidden=false;
});

function confetti(){
  const colors=['#ffd36b','#ff8eae','#ffe08a','#b8a1ff','#8fd9c8','#fff'];
  for(let i=0;i<48;i++){
    const s=document.createElement('span');s.className='confetti';
    const w=6+Math.random()*8;
    s.style.cssText=`left:${Math.random()*100}vw;width:${w}px;height:${w*1.6}px;background:${colors[i%colors.length]};border-radius:2px;animation-duration:${3+Math.random()*3}s;animation-delay:${Math.random()*1.2}s`;
    document.body.append(s);setTimeout(()=>s.remove(),8000);
  }
}
envelope.addEventListener('click',()=>{
  document.body.classList.add('show-letter');
  clearTimeout(sayTimer);intro.textContent='';intro.classList.remove('show');
  card.classList.add('show');hint.hidden=true;partyButton.hidden=false;confetti();
});

/* Dedicatorias: carrusel + maquina de escribir */
const track=$('#carousel'),cards=[...track.children],dots=$('#dots');
const notes=cards.map(c=>{const p=c.querySelector('p'),text=p.textContent;
  p.innerHTML='<span class="t"></span><span class="r"></span>';p.lastChild.textContent=text;return{p,text,done:false}});
cards.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className='dot';b.setAttribute('aria-label','Tarjeta '+(i+1));
  b.onclick=()=>go(i);dots.append(b)});
let cur=0;
function typewrite(n,speed=38){
  if(n.done)return;n.done=true;const ch=[...n.text],t=n.p.firstChild,r=n.p.lastChild;let i=0;
  (function step(){if(i<ch.length){i++;t.textContent=ch.slice(0,i).join('');r.textContent=ch.slice(i).join('');setTimeout(step,speed)}})();
}
function show(i){
  cur=i;[...dots.children].forEach((d,k)=>d.classList.toggle('on',k===i));
  $('#prev').disabled=i===0;$('#next').disabled=i===cards.length-1;
  cards.forEach((c,k)=>c.classList.toggle('active',k===i));
  setTimeout(()=>typewrite(notes[i]),350);
}
function go(i){i=Math.max(0,Math.min(cards.length-1,i));cards[i].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});show(i)}
let st;track.addEventListener('scroll',()=>{clearTimeout(st);st=setTimeout(()=>{
  const mid=track.scrollLeft+track.clientWidth/2;let best=0,bd=1e9;
  cards.forEach((c,k)=>{const d=Math.abs(c.offsetLeft+c.offsetWidth/2-mid);if(d<bd){bd=d;best=k}});
  if(best!==cur)show(best)},80)});
$('#prev').onclick=()=>go(cur-1);$('#next').onclick=()=>go(cur+1);
partyButton.addEventListener('click',()=>{
  document.body.classList.remove('lights-on','show-letter');
  document.body.classList.add('dedication-mode');
  room.hidden=true;dedications.hidden=false;
  scrollTo({top:0,behavior:'smooth'});track.scrollLeft=0;show(0);
});

$('#flowers-button').addEventListener('click',()=>{
  document.body.classList.remove('dedication-mode');
  document.body.classList.add('flower-mode');
  dedications.hidden=true;flowers.hidden=false;
  scrollTo({top:0,behavior:'smooth'});
  setTimeout(()=>flowers.classList.add('open'),80);
});

