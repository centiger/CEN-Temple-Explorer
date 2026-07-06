(function(){
  function createGestureLayer(el, handlers){
    const pointers=new Map();
    let drag=null,pinch=null,maxPointers=0;
    const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
    const mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
    el.addEventListener('pointerdown',e=>{
      el.setPointerCapture?.(e.pointerId);
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      maxPointers=Math.max(maxPointers,pointers.size);
      handlers.onInterrupt?.();
      if(pointers.size===1) drag={sx:e.clientX,sy:e.clientY,lx:e.clientX,ly:e.clientY,t:Date.now(),moved:false};
      if(pointers.size===2){ const [a,b]=[...pointers.values()]; pinch={d:dist(a,b), center:mid(a,b)}; }
    });
    el.addEventListener('pointermove',e=>{
      if(!pointers.has(e.pointerId))return;
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pointers.size===2&&pinch){ const [a,b]=[...pointers.values()],d=dist(a,b),c=mid(a,b); handlers.onPinch?.({scale:d/pinch.d,center:c}); pinch={d,center:c}; return; }
      if(pointers.size===1&&drag){ const dx=e.clientX-drag.lx,dy=e.clientY-drag.ly,totalX=e.clientX-drag.sx,totalY=e.clientY-drag.sy; if(Math.abs(totalX)+Math.abs(totalY)>6)drag.moved=true; drag.lx=e.clientX;drag.ly=e.clientY; handlers.onDrag?.({dx,dy,totalX,totalY}); }
    });
    function end(e){
      const hadOne=pointers.size===1&&drag;
      const sx=hadOne?e.clientX-drag.sx:0, sy=hadOne?e.clientY-drag.sy:0, dt=hadOne?Date.now()-drag.t:0, moved=hadOne?drag.moved:false;
      pointers.delete(e.pointerId);
      if(hadOne&&maxPointers===1){
        if(moved&&Math.abs(sx)>86&&Math.abs(sx)>Math.abs(sy)*1.7&&dt<700) handlers.onSwipe?.(sx<0?'left':'right');
        else if(!moved&&Math.abs(sx)<8&&Math.abs(sy)<8&&dt<520) handlers.onTap?.();
      }
      if(pointers.size<2)pinch=null;
      if(pointers.size===0){drag=null;maxPointers=0;}
    }
    el.addEventListener('pointerup',end); el.addEventListener('pointercancel',end);
  }
  window.CEN_GESTURE={createGestureLayer};
})();
