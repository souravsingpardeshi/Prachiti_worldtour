import { Storage } from '../storage.js';
import { launchConfetti } from '../animations.js';

export function renderScratch() {
  const container = document.getElementById('section-scratch');
  
  const cards = [
    { id: 'c1', title: 'Kiss Coupon 💋', desc: 'Valid for one passionate kiss anywhere, anytime.' },
    { id: 'c2', title: 'Free Hug 🤗', desc: 'Valid for a 5-minute uninterrupted hug.' },
    { id: 'c3', title: 'Movie Night 🎬', desc: 'You pick the movie, the snacks, and the blanket.' },
    { id: 'c4', title: 'Choose Dessert 🍰', desc: 'I will buy or make any dessert you crave right now.' },
    { id: 'c5', title: 'Surprise Gift 💝', desc: 'Redeem this for a small surprise gift within 48 hours.' },
    { id: 'c6', title: 'Moonlight Walk 🌙', desc: 'A 30-minute romantic walk holding hands.' }
  ];
  
  const scratchedIds = Storage.getScratched();
  
  let cardsHtml = '';
  cards.forEach((c, i) => {
    cardsHtml += `
      <div class="scratch-card" data-id="${c.id}">
        <div class="scratch-content">
          <div style="font-size:3rem; margin-bottom:10px;">${c.title.split(' ')[c.title.split(' ').length-1]}</div>
          <h3 style="color:var(--primary); margin-bottom:10px;">${c.title}</h3>
          <p style="font-size:0.9rem;">${c.desc}</p>
        </div>
        ${!scratchedIds.includes(c.id) ? `<canvas class="scratch-canvas" id="canvas-${c.id}"></canvas>` : ''}
      </div>
    `;
  });

  container.innerHTML = `
    <div style="padding:2rem; max-width:1000px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:3rem;">
        <h2 style="font-size:2.5rem; font-family:var(--font-romantic); color:var(--light);">Surprise Cards</h2>
        <p style="color:var(--secondary);">Scratch to reveal special coupons. Use them wisely!</p>
      </div>
      
      <div class="scratch-grid">
        ${cardsHtml}
      </div>
    </div>
  `;

  // Init canvas for each unscratched card
  cards.forEach(c => {
    if(!scratchedIds.includes(c.id)) {
      initScratchCanvas(`canvas-${c.id}`, c.id);
    }
  });
}

function initScratchCanvas(canvasId, cardId) {
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  
  // Set actual size
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  // Fill overlay
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add pattern/text to overlay
  ctx.font = 'bold 20px Poppins';
  ctx.fillStyle = '#999';
  ctx.textAlign = 'center';
  ctx.fillText('SCRATCH ME', canvas.width/2, canvas.height/2);
  
  // Set up erase mode
  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineWidth = 40;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    return {x, y};
  }
  
  function scratch(e) {
    if(!isDrawing) return;
    e.preventDefault();
    const {x, y} = getPos(e);
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Check percentage scratched occasionally
    if(Math.random() > 0.8) {
      checkScratched();
    }
  }
  
  function checkScratched() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for(let i=3; i<pixels.length; i+=4) {
      if(pixels[i] === 0) transparent++;
    }
    const percent = transparent / (pixels.length / 4);
    
    if(percent > 0.6) {
      canvas.style.transition = 'opacity 0.5s';
      canvas.style.opacity = 0;
      Storage.addScratched(cardId);
      setTimeout(() => {
        canvas.remove();
        launchConfetti();
      }, 500);
    }
  }
  
  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const {x, y} = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  });
  
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('mouseup', () => { isDrawing = false; });
  canvas.addEventListener('mouseleave', () => { isDrawing = false; });
  
  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    const {x, y} = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  });
  canvas.addEventListener('touchmove', scratch);
  canvas.addEventListener('touchend', () => { isDrawing = false; });
}
