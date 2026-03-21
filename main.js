let ax,gn,ainit=0;
function ia(){
if(ainit)return;ainit=1;
const AC=window.AudioContext||window.webkitAudioContext;ax=new AC();
let o1=ax.createOscillator(),o2=ax.createOscillator();gn=ax.createGain();let f=ax.createBiquadFilter();
o1.frequency.value=80;o2.frequency.value=160;f.type='lowpass';f.frequency.value=200;gn.gain.value=0.05;
o1.connect(gn);o2.connect(gn);gn.connect(f);f.connect(ax.destination);o1.start();o2.start();
let l=ax.createOscillator(),lg=ax.createGain();l.frequency.value=0.1;lg.gain.value=0.02;
l.connect(lg);lg.connect(gn.gain);l.start();
}
function bp(){
if(!ax)return;let o=ax.createOscillator(),g=ax.createGain();
o.frequency.setValueAtTime(600,ax.currentTime);o.frequency.exponentialRampToValueAtTime(300,ax.currentTime+.1);
g.gain.setValueAtTime(.1,ax.currentTime);g.gain.exponentialRampToValueAtTime(.001,ax.currentTime+.1);
o.connect(g);g.connect(ax.destination);o.start();o.stop(ax.currentTime+.1);
}
['click','mousemove','scroll'].forEach(e=>document.body.addEventListener(e,()=>{
    ia();
},{once:1}));

// Audio toggle functionality
const bg = document.getElementById('bgMusic');
const audioBtn = document.getElementById('audio-btn');
let isPlaying = false;

if(audioBtn && bg) {
    audioBtn.addEventListener('click', () => {
        if(isPlaying) {
            bg.pause();
            audioBtn.innerHTML = '🔇';
        } else {
            bg.volume = 0.3;
            bg.play().catch(e => console.error("Audio playback failed:", e));
            audioBtn.innerHTML = '🔊';
        }
        isPlaying = !isPlaying;
    });
}

document.querySelectorAll('.clk').forEach(e=>e.addEventListener('click',function(v){
bp();let r=document.createElement('span');r.className='ripple';
let c=this.getBoundingClientRect();r.style.left=v.clientX-c.left+'px';r.style.top=v.clientY-c.top+'px';
this.appendChild(r);setTimeout(()=>r.remove(),600);
}));

const dt=document.getElementById('dot'),tr=document.getElementById('trail');
let mx=0,my=0,tx=0,ty=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dt.style.transform=`translate(${mx-4}px,${my-4}px)`;});
function cA(){tx+=(mx-tx)*.15;ty+=(my-ty)*.15;tr.style.left=tx+'px';tr.style.top=ty+'px';requestAnimationFrame(cA);}cA();
document.querySelectorAll('a,.btn,.int').forEach(e=>{
e.addEventListener('mouseenter',()=>{tr.style.transform='translate(-50%,-50%) scale(1.5)';tr.style.borderColor='var(--c)';});
e.addEventListener('mouseleave',()=>{tr.style.transform='translate(-50%,-50%) scale(1)';tr.style.borderColor='var(--p)';});
});

window.addEventListener('scroll',()=>{
let s=document.body.scrollTop||document.documentElement.scrollTop,h=document.documentElement.scrollHeight-document.documentElement.clientHeight;
document.getElementById('progress').style.width=(s/h*100)+'%';
});

const cv=document.getElementById('cvs'),cx=cv.getContext('2d');
let w,h,pts=[];
function rs(){w=cv.width=window.innerWidth;h=cv.height=window.innerHeight;}
window.addEventListener('resize',rs);rs();
for(let i=0;i<80;i++)pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5});
function pA(){
cx.clearRect(0,0,w,h);
for(let i=0;i<pts.length;i++){
let p=pts[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
for(let j=i+1;j<pts.length;j++){
let d=Math.hypot(p.x-pts[j].x,p.y-pts[j].y);
if(d<150){cx.beginPath();cx.strokeStyle=`rgba(157,0,255,${1-d/150})`;cx.lineWidth=.5;cx.moveTo(p.x,p.y);cx.lineTo(pts[j].x,pts[j].y);cx.stroke();}
}
cx.beginPath();cx.arc(p.x,p.y,1,0,Math.PI*2);cx.fillStyle='rgba(0,243,255,.5)';cx.fill();
} requestAnimationFrame(pA);
} pA();

const ob=new IntersectionObserver(e=>{
e.forEach(n=>{if(n.isIntersecting){
n.target.classList.add('act');
let c=n.target.querySelectorAll('.cnt');
if(c.length&&!n.target.dataset.d){
n.target.dataset.d=1;c.forEach(x=>{
let t=+x.getAttribute('data-t'),s=x.getAttribute('data-s'),cv=0;
let u=()=>{if(cv<t){cv+=t/40;x.innerText=Math.ceil(cv)+s;setTimeout(u,40);}else x.innerText=t+s;};u();
});}}});},{threshold:.1,rootMargin:"0px 0px -50px 0px"});
document.querySelectorAll('.rev').forEach(e=>ob.observe(e));

window.addEventListener('load',()=>{
let t="We Build Digital Experiences",el=document.getElementById('tw'),i=0;
el.style.borderRightColor='var(--c)';
function tw(){if(i<t.length){el.innerHTML+=t.charAt(i++);setTimeout(tw,80);}else{
document.querySelectorAll('.intro').forEach((e,x)=>{e.style.transition='all .8s ease '+(x*.2)+'s';e.style.opacity=1;e.style.transform='translateY(0)';});
setTimeout(()=>el.style.borderRightColor='transparent',2000);
}} setTimeout(tw,500);
});
document.addEventListener('mousemove',e=>{
document.querySelector('.shapes').style.transform=`translate(${(window.innerWidth-e.pageX*2)/90}px,${(window.innerHeight-e.pageY*2)/90}px)`;
});
