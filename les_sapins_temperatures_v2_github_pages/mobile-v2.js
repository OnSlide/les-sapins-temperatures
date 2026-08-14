
(() => {
'use strict';
const $=s=>document.querySelector(s);
const api=window.LesSapinsTempApp;
if(!api)return;
const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function openForPeriod(eqId,period){
 api.openLog(eqId);
 const p=$('#logPeriod');if(p)p.value=period;
 setTimeout(()=>$('#logTemperature')?.focus(),80);
}
function renderQueue(){
 const s=api.getState(),eqs=(s.equipments||[]).filter(e=>e.active!==false),today=todayKey();
 const logs=(s.logs||[]).filter(l=>l.date===today);
 const keys=new Set(logs.filter(l=>['matin','soir'].includes(l.period)).map(l=>`${l.equipmentId}-${l.period}`));
 const required=eqs.length*2,completed=keys.size;
 const badge=$('#todayProgressBadge'),bar=$('#todayProgressBar'),box=$('#todayQueue');
 if(badge){badge.textContent=`${completed}/${required}`;badge.className=`badge ${required&&completed>=required?'good':completed?'warn':'neutral'}`}
 if(bar)bar.style.width=required?`${Math.min(100,completed/required*100)}%`:'0%';
 if(!box)return;
 if(!eqs.length){box.innerHTML='<div class="tiny">Ajoutez un équipement pour commencer les relevés.</div>';return}
 box.innerHTML=eqs.map(eq=>{
   const morning=keys.has(`${eq.id}-matin`),evening=keys.has(`${eq.id}-soir`);
   const latest=logs.filter(l=>l.equipmentId===eq.id).sort((a,b)=>new Date(b.recordedAt)-new Date(a.recordedAt))[0];
   const photo=eq.photo?`<img src="${eq.photo}" alt="">`:'❄';
   return `<article class="today-task">
    <div class="today-task-photo">${photo}</div>
    <div class="today-task-main"><div class="today-task-title">${esc(eq.name)}</div>
    <div class="today-task-meta">${esc(eq.type)} · ${esc(api.limitLabel(eq))}${latest?` · dernier ${Number(latest.temperature).toFixed(1).replace('.',',')} °C`:''}</div></div>
    <div class="period-actions">
      <button class="period-btn ${morning?'done':'todo'}" data-mobile-log="${eq.id}" data-period="matin">${morning?'✓ Matin':'☀ Matin'}</button>
      <button class="period-btn ${evening?'done':'todo'}" data-mobile-log="${eq.id}" data-period="soir">${evening?'✓ Soir':'☾ Soir'}</button>
    </div></article>`;
 }).join('');
 box.querySelectorAll('[data-mobile-log]').forEach(b=>b.addEventListener('click',()=>openForPeriod(b.dataset.mobileLog,b.dataset.period)));
}
function updateNetwork(){
 let el=$('#networkStatusV2');
 if(!el){el=document.createElement('span');el.id='networkStatusV2';document.querySelector('.top-actions')?.prepend(el)}
 if(!el)return;const on=navigator.onLine;el.textContent=on?'En ligne':'Hors ligne';el.className=`network-dot ${on?'':'offline'}`
}
function updateInstallUI(){
 const card=$('#mobileInstallCard'),hint=$('#mobileInstallHint'),status=$('#pwaStatusText');
 if(standalone()){card?.classList.add('hidden');if(status)status.textContent='Application installée sur cet appareil.';return}
 card?.classList.remove('hidden');
 if(location.protocol==='file:'){if(hint)hint.textContent='La V2 mobile est prête. Pour l’installer, publiez-la d’abord sur une adresse HTTPS.';if(status)status.textContent='Mode fichier local : installation PWA indisponible.';return}
 if(isIOS()){if(hint)hint.textContent='Sur iPhone/iPad : Partager → Ajouter à l’écran d’accueil.';if(status)status.textContent='Safari : Partager → Ajouter à l’écran d’accueil.'}
 else{if(hint)hint.textContent='Installez l’application pour un accès plein écran depuis l’écran d’accueil.';if(status)status.textContent='Le navigateur proposera l’installation lorsque les conditions PWA sont réunies.'}
}
function triggerInstall(){
 if(standalone())return;
 const original=$('#installBtn');
 if(original&&!original.classList.contains('hidden')){original.click();return}
 if(isIOS())alert('Sur iPhone/iPad : touchez le bouton Partager de Safari, puis « Ajouter à l’écran d’accueil ».');
 else if(location.protocol==='file:')alert('Pour installer l’application, publiez d’abord ce dossier sur une adresse HTTPS.');
 else alert('Dans Chrome/Edge : ouvrez le menu du navigateur puis choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».');
}
window.renderMobileV2=()=>{renderQueue();updateNetwork();updateInstallUI()};
$('#mobileInstallAction')?.addEventListener('click',triggerInstall);
$('#settingsInstallBtn')?.addEventListener('click',triggerInstall);
window.addEventListener('online',updateNetwork);window.addEventListener('offline',updateNetwork);
window.addEventListener('appinstalled',updateInstallUI);
window.renderMobileV2();
})();
