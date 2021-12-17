var c = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

window.onresize = function () {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

dots = []; emitRate = 9; minRad = 1; maxRad = 5; color = ""; opc = 0.6; sha = 0; lifeTime = 30; tn = 0; roc = 1; speed = 1;

var controls = new function() {
  this.emitRate = emitRate;
  this.spread = speed;
  this.radiusMin = minRad;
  this.radiusMax = maxRad;
  this.color = "#ffffff";
  this.opacity = opc;
  this.glow = sha;
  this.onChange_redraw = false;
  this.randomColor = true;
  this.lifeTime = lifeTime;
  this.circleShape = true;
  
  this.redraw = function() {
    emitRate = controls.emitRate;
    speed = controls.spread;
    minRad = controls.radiusMin;
    maxRad = controls.radiusMax;
    lifeTime = controls.lifeTime;
    color = controls.color;
    opc = controls.opacity;
    sha = controls.glow;
    if (controls.onChange_redraw) {
      dots.splice(0, dots.length);
    }
    if (controls.circleShape) {
      roc = 1;
    } else {
      roc = 0;
    }
    if(controls.randomColor){
      color = "";
    }
  }
}

var gui = new dat.GUI({resizable : false});
gui.add(controls, "emitRate", 2, 100).step(1).onChange(controls.redraw);
gui.add(controls, "spread", 0.1, 5).onChange(controls.redraw);
gui.add(controls, "lifeTime", 10, 300).onChange(controls.redraw);
gui.add(controls, "radiusMin", 1, 10).step(1).onChange(controls.redraw);
gui.add(controls, "radiusMax", 1, 30).step(1).onChange(controls.redraw);
gui.add(controls, "opacity", 0.1, 1).onChange(controls.redraw);
gui.add(controls, "glow", 0, 30).step(1).onChange(controls.redraw);
gui.addColor(controls, "color").onChange(controls.redraw);
gui.add(controls, "circleShape").onChange(controls.redraw);
gui.add(controls, "randomColor").onChange(controls.redraw);
gui.add(controls, "onChange_redraw").onChange(controls.redraw);

prevx = ctx.canvas.width/2 -250;
prevy = ctx.canvas.height/8;
var prev2 = setInterval(preview, 16.67);
increase = Math.PI * 2 / 40;
counter = 0;
function preview(){
  prevx += 8;
  prevy += (Math.sin( counter ) / 2 + 0.5)*8;
  emitDots(prevx, prevy);
  counter += increase;
}
preview();
setTimeout(function(){clearInterval(prev2)}, 1000);

function emitDots(mx, my){
  for(i=0; i<emitRate; i++){
    rxv = Math.random() * 2 - 1;
    ryv = Math.random() * 2 - 1;
    if(color == ""){
      col = "hsl("+Math.random() * 360+",65%,65%)";
    } else {
      col = color;
    }
    rad = Math.random() * (maxRad-minRad) + minRad;
    dots.push({x:mx,y:my,xv:rxv, yv:ryv, col:col, rad:rad});
  }
}

function animDots(){
  for(i=0; i<dots.length; i++){
    dots[i].x += dots[i].xv * speed;
    dots[i].y += dots[i].yv * speed;
    
    ctx.beginPath();
    ctx.fillStyle = dots[i].col;
    ctx.globalAlpha = opc;
    ctx.shadowColor = dots[i].col;
    ctx.shadowBlur = sha;
    if(roc == 0){
      ctx.rect(dots[i].x, dots[i].y, dots[i].rad, dots[i].rad);
    } else {
      ctx.arc(dots[i].x, dots[i].y, dots[i].rad, 0, 2*Math.PI);
    }
    ctx.fill();
    ctx.closePath();
  }
}

function cleanUp(){
  if(dots.length > 1){
    dots.splice(0, Math.ceil(dots.length/lifeTime));
  }
}

function getFPS(){
  tl = tn;
  tn = Date.now();
  td = tn - tl;
  fps = Math.round(1000/td);
  fps >= 58 ? fps = 60 : fps;
  fpse = document.getElementById("fps");
  fpse.innerHTML = "FPS: "+fps;
  fpse.style="color:hsl("+(fps*2)+",100%,50%)";
}

function loop(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  document.onmousemove = function(e){
    mx = e.clientX;
    my = e.clientY;
    emitDots(mx, my);
  }
  document.ontouchmove = function(e){
    mx = e.changedTouches[0].pageX;
    my = e.changedTouches[0].pageY;
    emitDots(mx, my);
  }
  animDots();
  cleanUp();
  getFPS();
}
loop();
setInterval(loop, 16.67);
 
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Animation for Mouse Play~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var playPause = anime({
  targets: 'div.box',
  translateY: [
    { value: 200, duration: 500 },
    { value: 0, duration: 800 }
  ],
  rotate:{
    value: '1turn',
    easing: 'easeInOutSine'
  },
  delay: function(el, i, l){ return i * 1000},
  autoplay:false,
  loop:true
});

document.querySelector('#boxes .play').onclick = playPause.play;
document.querySelector('#boxes .pause').onclick = playPause.pause;
