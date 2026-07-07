import { Storage } from '../storage.js';
import { generateSVG } from '../utils.js';

export function renderGallery(itinerary) {
  const container = document.getElementById('section-gallery');
  const progress = Storage.getProgress();
  
  let galleryHtml = '';
  
  itinerary.dates.forEach(date => {
    if(progress.completedIds.includes(date.id)) {
      const photo = Storage.getPhoto(date.id);
      const isLiked = progress.hearts[date.id];
      const heartClass = isLiked ? 'liked' : '';
      const heartIcon = isLiked ? generateSVG('heart', 'currentColor') : generateSVG('heartOutline', 'currentColor');
      
      const photoContent = photo 
        ? `<img src="${photo}" style="width:100%; height:100%; object-fit:cover;" />`
        : `<div style="text-align:center; padding:20px;">
            ${generateSVG('camera', '#ccc')}
            <div style="margin-top:10px; font-size:0.8rem;">Memory not uploaded yet.<br/>Go to Admin to add.</div>
           </div>`;

      galleryHtml += `
        <div class="polaroid" style="transform: rotate(${Math.random()*6 - 3}deg)">
          <div class="polaroid-img">
            ${photoContent}
          </div>
          <div class="polaroid-caption">${date.city}</div>
          <div style="font-size:0.8rem; color:#888; text-align:center; margin-top:5px;">${date.theme}</div>
          <button class="heart-btn ${heartClass}" data-id="${date.id}" style="width:24px; height:24px;">
            ${heartIcon}
          </button>
        </div>
      `;
    }
  });
  
  if(!galleryHtml) {
    galleryHtml = `
      <div style="text-align:center; padding:4rem; color:rgba(255,255,255,0.6); grid-column: 1 / -1;">
        <div style="font-size:4rem; margin-bottom:1rem;">📷</div>
        <h3 style="font-size:1.5rem; margin-bottom:1rem;">No memories yet!</h3>
        <p>Complete destinations and upload photos in the Admin panel to see them here.</p>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="padding-top:2rem; text-align:center;">
      <h2 style="font-size:2.5rem; font-family:var(--font-romantic); color:var(--light);">Our Memories</h2>
      <p style="color:var(--secondary); font-size:0.9rem;">Every moment with you is perfectly captured.</p>
    </div>
    <div class="gallery-grid">
      ${galleryHtml}
    </div>
  `;

  // Attach heart events
  container.querySelectorAll('.heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const p = Storage.getProgress();
      if(!p.hearts) p.hearts = {};
      
      if(p.hearts[id]) {
        delete p.hearts[id];
        btn.classList.remove('liked');
        btn.innerHTML = generateSVG('heartOutline', 'currentColor');
      } else {
        p.hearts[id] = true;
        btn.classList.add('liked');
        btn.innerHTML = generateSVG('heart', 'currentColor');
        // trigger animation
        btn.style.animation = 'none';
        setTimeout(() => btn.style.animation = 'heartbeat 0.5s', 10);
      }
      
      Storage.saveProgress(p);
    });
  });
}
