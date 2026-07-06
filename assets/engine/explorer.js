(function(){
  const $=window.CEN_UI.qs;
  const state={project:null,index:0,imgW:0,imgH:0,scale:1,minScale:1,baseScale:1,maxScale:5,x:0,y:0,ui:true,auto:false,autoTimer:null,hideTimer:null,deferredInstall:null};
  const els={};
  function init(){
    ['home','homeBg','explorer','projectGrid','stage','blurBg','sceneImage','sceneFallback','fade','ui','topBar','bottomSheet','sceneCounter','projectTitle','sceneTitle','descTitle','descText','sceneList','homeBtn','menuBtn','prevBtn','nextBtn','nextIconBtn','autoBtn','closeSheetBtn','toast','progress','installBtn'].forEach(id=>els[id]=$(id));
    renderHome(); bind();
    const first=window.CEN_STORY.getProjects().find(p=>p.enabled&&p.homeImage); if(first) els.homeBg.style.backgroundImage=`url('${first.homeImage}')`;
    history.replaceState({view:'home'},'',location.pathname+location.search);
    if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }
  function renderHome(){
    els.projectGrid.innerHTML='';
    window.CEN_STORY.getProjects().forEach(p=>{
      const b=document.createElement('button');
      b.className='project-card'+(!p.enabled?' disabled':'');
      b.innerHTML=`<small>${p.subtitle||''}</small><strong>${p.title}</strong><small>${p.enabled?'탐험 시작':'준비 중'}</small>`;
      b.onclick=()=>p.enabled&&openProject(p.id);
      els.projectGrid.appendChild(b);
    });
  }
  function openProject(id){
    state.project=window.CEN_TEMPLE_DATA[id]; state.index=0;
    els.home.classList.remove('active'); els.explorer.classList.add('active');
    history.pushState({view:'explorer',project:id},'',`#${id}`);
    loadScene(0,false);
  }
  function goHome(push=true){
    stopAuto(false);
    els.bottomSheet.classList.remove('open');
    els.explorer.classList.remove('active'); els.home.classList.add('active');
    if(push) history.pushState({view:'home'},'',location.pathname+location.search);
  }
  function scene(){return state.project.scenes[state.index];}
  function imgSrc(s){return state.project.basePath+s.file;}
  function thumbSrc(s){return (state.project.thumbPath||state.project.basePath)+s.file;}
  function loadScene(i,transition=true,keepAuto=false){
    if(!keepAuto) stopAuto(false);
    state.index=(i+state.project.scenes.length)%state.project.scenes.length;
    const s=scene(), src=imgSrc(s);
    els.sceneFallback.classList.add('hidden');
    const done=()=>{
      state.imgW=els.sceneImage.naturalWidth||1; state.imgH=els.sceneImage.naturalHeight||1;
      els.blurBg.style.backgroundImage=`url('${src}')`;
      focusScene(); updateText(); renderSceneList(); showUI(true);
      setTimeout(()=>els.fade.classList.remove('show'),70);
      history.replaceState({view:'explorer',project:state.project.id,index:state.index},'',`#${state.project.id}-${s.key||s.id}`);
    };
    els.sceneImage.onerror=()=>els.sceneFallback.classList.remove('hidden');
    if(transition){ els.fade.classList.add('show'); setTimeout(()=>{els.sceneImage.onload=done; els.sceneImage.src=src; if(els.sceneImage.complete)done();},180); }
    else { els.sceneImage.onload=done; els.sceneImage.src=src; if(els.sceneImage.complete)done(); }
  }
  function fitScale(){return Math.min(els.stage.clientWidth/state.imgW,els.stage.clientHeight/state.imgH);}
  function coverScale(){return Math.max(els.stage.clientWidth/state.imgW,els.stage.clientHeight/state.imgH);}
  function focusScene(){
    const s=scene(); state.baseScale=(s.mode==='cover'?coverScale():fitScale()); state.minScale=fitScale(); state.maxScale=Math.max(state.baseScale*5,4);
    state.scale=Math.min(state.maxScale,Math.max(state.minScale,state.baseScale*(s.fit||1)));
    state.x=els.stage.clientWidth/2-(state.imgW*(s.fx??.5)*state.scale);
    state.y=els.stage.clientHeight/2-(state.imgH*(s.fy??.5)*state.scale);
    apply();
  }
  function clamp(){
    const w=state.imgW*state.scale,h=state.imgH*state.scale;
    state.x=w<=els.stage.clientWidth?(els.stage.clientWidth-w)/2:Math.min(0,Math.max(els.stage.clientWidth-w,state.x));
    state.y=h<=els.stage.clientHeight?(els.stage.clientHeight-h)/2:Math.min(0,Math.max(els.stage.clientHeight-h,state.y));
  }
  function apply(){clamp();els.sceneImage.style.width=state.imgW+'px';els.sceneImage.style.height=state.imgH+'px';els.sceneImage.style.transform=`translate3d(${state.x}px,${state.y}px,0) scale(${state.scale})`;}
  function setScale(ns,cx,cy){const old=state.scale;state.scale=Math.min(state.maxScale,Math.max(state.minScale,ns));state.x=cx-(cx-state.x)*(state.scale/old);state.y=cy-(cy-state.y)*(state.scale/old);apply();}
  function updateText(){
    const s=scene(), total=state.project.scenes.length;
    els.sceneTitle.textContent=s.title; els.projectTitle.textContent=`${state.project.title} · ${state.index+1} / ${total}`;
    els.descTitle.textContent=s.title; els.descText.textContent=s.description||''; els.sceneCounter.textContent=`${state.index+1} / ${total}`;
    els.nextBtn.textContent=state.index===total-1?'처음으로':'다음'; els.prevBtn.style.opacity=state.index===0?.35:1; els.nextIconBtn.textContent=state.index===total-1?'↺':'›';
  }
  function renderSceneList(){
    els.sceneList.innerHTML='';
    state.project.scenes.forEach((s,i)=>{const b=document.createElement('button');b.className='scene-item'+(i===state.index?' active':'');b.innerHTML=`<img src="${thumbSrc(s)}" alt=""><div><b>${i+1}. ${s.title}</b><span>${s.description||''}</span></div>`;b.onclick=e=>{e.stopPropagation();els.bottomSheet.classList.remove('open');loadScene(i,true);};els.sceneList.appendChild(b);});
  }
  function next(keepAuto=false){loadScene(state.index===state.project.scenes.length-1?0:state.index+1,true,keepAuto);} function prev(){if(state.index>0)loadScene(state.index-1,true,false);}
  function showUI(short=false){state.ui=true;els.ui.classList.remove('off');clearTimeout(state.hideTimer);if(short!==false)state.hideTimer=setTimeout(()=>{if(!els.bottomSheet.classList.contains('open'))hideUI();},short===true?4200:short);} function hideUI(){state.ui=false;els.ui.classList.add('off');} function toggleUI(){state.ui?hideUI():showUI(true);}
  function toast(msg){els.toast.textContent=msg;els.toast.classList.add('show');setTimeout(()=>els.toast.classList.remove('show'),1500);}
  function stopAuto(notify=true){if(state.autoTimer)clearTimeout(state.autoTimer);state.autoTimer=null;if(state.auto&&notify)toast('자동탐험을 멈췄습니다.');state.auto=false;els.autoBtn.classList.remove('active');els.progress.classList.remove('show','run');}
  function runAuto(){els.bottomSheet.classList.remove('open');hideUI();state.auto=true;els.autoBtn.classList.add('active');els.progress.classList.add('show');loadScene(0,true,true);setTimeout(autoStep,520);} function autoStep(){if(!state.auto)return;els.progress.classList.remove('run');void els.progress.offsetWidth;els.progress.classList.add('run');state.autoTimer=setTimeout(()=>{if(!state.auto)return;if(state.index>=state.project.scenes.length-1){stopAuto(false);showUI(true);return;}next(true);setTimeout(autoStep,520);},2500);}
  function interrupt(){if(state.auto)stopAuto(true);}
  function bind(){
    els.homeBtn.onclick=e=>{e.stopPropagation();goHome();}; els.menuBtn.onclick=e=>{e.stopPropagation();interrupt();els.bottomSheet.classList.add('open');showUI(false);}; els.closeSheetBtn.onclick=e=>{e.stopPropagation();els.bottomSheet.classList.remove('open');showUI(true);};
    els.nextBtn.onclick=e=>{e.stopPropagation();interrupt();next(false);}; els.nextIconBtn.onclick=e=>{e.stopPropagation();interrupt();next(false);}; els.prevBtn.onclick=e=>{e.stopPropagation();interrupt();prev();}; els.autoBtn.onclick=e=>{e.stopPropagation();state.auto?stopAuto(false):runAuto();};
    ['ui','bottomSheet'].forEach(id=>els[id].addEventListener('pointerdown',e=>e.stopPropagation())); ['ui','bottomSheet'].forEach(id=>els[id].addEventListener('click',e=>e.stopPropagation()));
    window.CEN_GESTURE.createGestureLayer(els.stage,{onInterrupt:interrupt,onTap:toggleUI,onDrag:e=>{state.x+=e.dx;state.y+=e.dy;apply();},onPinch:e=>setScale(state.scale*e.scale,e.center.x,e.center.y),onSwipe:dir=>{dir==='left'?next(false):prev();showUI(true);}});
    window.addEventListener('resize',()=>{if(els.explorer.classList.contains('active'))focusScene();});
    window.addEventListener('popstate',()=>{if(els.explorer.classList.contains('active'))goHome(false);});
    window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredInstall=e;els.installBtn.classList.add('show');});
    els.installBtn.onclick=async()=>{if(!state.deferredInstall)return;state.deferredInstall.prompt();await state.deferredInstall.userChoice;state.deferredInstall=null;els.installBtn.classList.remove('show');};
  }
  document.addEventListener('DOMContentLoaded',init);
})();
