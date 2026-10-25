(function(){
  try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch(e){}
  if(!location.hash){var top=function(){window.scrollTo({top:0,left:0,behavior:'instant'})};top();window.addEventListener('load',top);window.addEventListener('pageshow',top);}

  // cursor label (fine pointers only)
  var cur=document.querySelector('.cur'),txt=document.getElementById('curTxt');
  if(cur&&matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    var x=-200,y=-200,tx=x,ty=y,on=false;
    document.addEventListener('mousemove',function(e){
      tx=e.clientX;ty=e.clientY;
      var t=e.target.closest('[data-cur]');
      if(t){txt.textContent=t.getAttribute('data-cur');if(!on){x=tx;y=ty;}on=true;}else on=false;
    },{passive:true});
    document.addEventListener('mouseleave',function(){on=false});
    (function loop(){
      x+=(tx-x)*.22;y+=(ty-y)*.22;
      cur.style.setProperty('--x',x+'px');cur.style.setProperty('--y',y+'px');
      cur.classList.toggle('on',on);cur.classList.toggle('off',!on);
      requestAnimationFrame(loop);
    })();
  }

  // drawing lightbox
  var lb=document.getElementById('lb');
  if(lb){
    var img=document.getElementById('lbImg'),inn=document.getElementById('lbIn'),last=null;
    var close=function(){lb.hidden=true;lb.classList.remove('big');document.body.style.overflow='';if(last)last.focus();};
    document.querySelectorAll('[data-zoom]').forEach(function(b){b.addEventListener('click',function(){
      last=b;img.src=b.getAttribute('data-zoom');img.alt=(b.querySelector('img')||{}).alt||'';
      lb.hidden=false;document.body.style.overflow='hidden';document.getElementById('lbX').focus();
    })});
    document.getElementById('lbX').addEventListener('click',close);
    inn.addEventListener('click',function(e){
      if(e.target===img){
        var r=img.getBoundingClientRect(),fx=(e.clientX-r.left)/r.width,fy=(e.clientY-r.top)/r.height;
        lb.classList.toggle('big');
        if(lb.classList.contains('big')){inn.scrollLeft=fx*inn.scrollWidth-inn.clientWidth/2;inn.scrollTop=fy*inn.scrollHeight-inn.clientHeight/2;}
      } else close();
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)close();});
  }

  // magnifying lens on drawings (fine pointers)
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('[data-mag]').forEach(function(m){
      var img=m.querySelector('img'),lens=m.querySelector('.mag-lens'),Z=parseFloat(m.getAttribute('data-mag'))||2;
      if(!img||!lens)return;
      lens.style.backgroundImage='url("'+img.getAttribute('src')+'")';
      m.classList.add('mag-on');
      var move=function(e){
        var r=img.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
        if(x<0||y<0||x>r.width||y>r.height){lens.classList.remove('show');return;}
        var w=lens.offsetWidth/2;
        lens.classList.add('show');
        lens.style.transform='translate3d('+(x-w)+'px,'+(y-w)+'px,0)';
        lens.style.backgroundSize=(r.width*Z)+'px '+(r.height*Z)+'px';
        lens.style.backgroundPosition=(w-x*Z)+'px '+(w-y*Z)+'px';
      };
      m.addEventListener('pointermove',move);
      m.addEventListener('pointerenter',move);
      m.addEventListener('pointerleave',function(){lens.classList.remove('show')});
    });
  }

  // section sub-nav highlight
  var links=[].slice.call(document.querySelectorAll('.sub a[href^="#"]'));
  if(links.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}
    })},{rootMargin:'-40% 0px -55% 0px'});
    links.forEach(function(l){var t=document.getElementById(l.getAttribute('href').slice(1));if(t)io.observe(t)});
  }

  // landing hero: tin horse gallops on hover (tap on touch screens)
  var hz=document.getElementById('hz'),hh=document.getElementById('hzHorse');
  if(hz&&hh){
    var fr=[],i,tm=null,k=0;
    for(i=0;i<8;i++){var im=new Image();im.src='img/horse/h'+i+'.webp';fr.push(im.src);}
    var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    var start=function(){if(reduce||tm)return;hz.classList.add('run');tm=setInterval(function(){k=(k+1)%8;hh.src=fr[k];},83);};
    var stop=function(){if(!tm)return;clearInterval(tm);tm=null;hz.classList.remove('run');
      var settle=setInterval(function(){if(k===0){clearInterval(settle);return;}k=(k+1)%8;hh.src=fr[k];},83);};
    if(matchMedia('(hover:hover) and (pointer:fine)').matches){
      hz.addEventListener('pointerenter',start);hz.addEventListener('pointerleave',stop);
    } else {
      hz.addEventListener('click',function(e){if(e.target.closest('a'))return;tm?stop():start();});
    }
  }
})();
