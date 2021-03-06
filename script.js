function $(_el) {
    return document.getElementById(_el);
}
var cnvs=$('cnvs');

var fireEffectActive=0;

$("fireEffect").addEventListener('change',function(e){
    if(e.target.checked){
        fireEffectActive=1;
    
        ctx.shadowBlur=0;
        ctx.shadowColor="transparent";
        ctx.shadowOffsetX=0;
        ctx.shadowOffsetY=0;
        cnvs.style.filter="blur(8px) contrast(8)";
        return;
    } 
    fireEffectActive=0;
    
    ctx.shadowBlur=0;
    ctx.shadowColor="brown";
    ctx.shadowOffsetX=0;
    ctx.shadowOffsetY=0;
    cnvs.style.filter="none";
});


const ctx=cnvs.getContext('2d');
var w=cnvs.width=innerWidth;
var h=cnvs.height=innerHeight;

const aud=new Audio("./music.mp3");
// aud.crossOrigin='Anonymous';
aud.controls=true;
aud.preload = 'auto';

document.body.appendChild(aud);


cnvs.onclick=function() {
    init();
    aud.play();
    cnvs.onclick=null;
    aud.onplay=null;
};

aud.onplay=function() {
    init();
    aud.play();
    cnvs.onclick=null;
    aud.onplay=null;
};

var audCtx,analyser,audSrc,arr;


function init() {
    
    audCtx=new AudioContext();
    analyser=audCtx.createAnalyser();
    audSrc=audCtx.createMediaElementSource(aud);
    audSrc.connect(analyser);
    analyser.connect(audCtx.destination);
    arr=new Uint8Array(analyser.frequencyBinCount);
    looper();
}

// ctx.shadowColor="aqua";
// ctx.shadowBlur=10;
// ctx.shadowOffsetX=0;
// ctx.shadowOffsetY=0;

var gradient;
function looper() {
    ctx.clearRect(0,0,w,h);
    analyser.getByteFrequencyData(arr);
    var i=100;
    ctx.beginPath();
    var angle_stride=1; //1 degree's stride 
    if(fireEffectActive) angle_stride=10;
    for(var a=0; a < 2*Math.PI ;a+= angle_stride*(Math.PI/180)){
    
        var x=(10+((w/2)+Math.cos(a)*arr[i]));
        var y=(10+((h/2)+Math.sin(a)*arr[i]));
        if(a==0){
            gradient=ctx.createRadialGradient(w/2,h/2,Math.floor(arr[i]/3),w/2,h/2,500);
            gradient.addColorStop(0,"aqua");
            gradient.addColorStop(0.4,"hotpink");
            gradient.addColorStop(1,"red");
            $("poster").style.width=150+(arr[i]/4)+"px";
            ctx.moveTo(x,y);
        
        } else {
        
            ctx.lineTo(x,y);

        }
        
        i++;
    
    }

    ctx.fillStyle=gradient;
    
    ctx.closePath();
    ctx.fill();

    requestAnimationFrame(looper);
}

onresize=function () {
    w=cnvs.width=innerWidth;
    h=cnvs.height=innerHeight;
}