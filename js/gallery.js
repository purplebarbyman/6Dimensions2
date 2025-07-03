const gallery = document.getElementById('gallery');
const TTL = 30*60*1000;   // 30 minutes

document.getElementById('importFiles').addEventListener('change',e=>{
  [...e.target.files].forEach(f=>{
    const reader = new FileReader();
    reader.onload = evt=>{
      try{
        const hero = JSON.parse(evt.target.result);
        addHero(hero);
      }catch{ alert('File skipped – not a valid hero profile'); }
    };
    reader.readAsText(f);
  });
});

function addHero(h){
  const end = h.created + TTL;
  const card = document.createElement('div');
  card.className = 'heroCard';
  card.innerHTML = `
    <img src="${h.avatar}" alt="${h.name}">
    <h4>${h.name}</h4>
    <p><strong>Strengths</strong><br>${h.strengths.join(', ')}</p>
    <p><strong>Focus</strong><br>${h.focus}</p>
    <span class="timer"></span>`;
  gallery.appendChild(card);

  const tEl = card.querySelector('.timer');
  const int = setInterval(()=>{
    const left = end - Date.now();
    if(left<=0){
      clearInterval(int); card.remove();
    }else{
      const m = String(Math.floor(left/60000)).padStart(2,'0');
      const s = String(Math.floor((left%60000)/1000)).padStart(2,'0');
      tEl.textContent = `⏳ ${m}:${s}`;
    }
  },1000);
}
