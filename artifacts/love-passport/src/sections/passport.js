import { Storage } from '../storage.js';
import { generateSVG, escapeHtml } from '../utils.js';

export function renderPassport(itinerary) {
  const container = document.getElementById('section-passport');
  const progress = Storage.getProgress();
  const completedCount = progress.completedIds.length;
  const totalDestinations = itinerary.dates.length;
  
  let stampsHtml = '';
  for(let i=0; i<12; i++) {
    if(i < completedCount) {
      const date = itinerary.dates[i];
      const stampSvg = generateSVG(date.stamp, date.color);
      stampsHtml += `
        <div class="stamp-slot" title="${escapeHtml(date.city)}, ${escapeHtml(date.country)}">
          <div class="stamp-circle">
            <div class="stamp-mark" style="--rot: ${Math.random()*40 - 20}">
              ${stampSvg}
            </div>
          </div>
          <div class="stamp-label">${escapeHtml(date.city.toUpperCase())}</div>
        </div>
      `;
    } else {
      stampsHtml += `<div class="stamp-slot"><div class="stamp-circle stamp-circle-empty"></div></div>`;
    }
  }

  container.innerHTML = `
    <div class="passport-container">
      <div class="passport-book" id="passport-book">
        
        <div class="passport-cover" onclick="document.getElementById('passport-book').classList.toggle('open')">
          <svg class="passport-emblem" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <h1>LOVE PASSPORT</h1>
          <div style="font-family: var(--font-ui); font-size: 0.8rem; letter-spacing: 2px; opacity: 0.8;">REPUBLIC OF LOVE</div>
          <p style="margin-top: 2rem; font-size: 0.8rem; opacity: 0.6;">Click to open</p>
        </div>
        
        <div class="passport-pages">
          <div class="passport-page-bg"></div>
          <div class="passport-content">
            
            <div class="profile-section">
              <div class="profile-photo">
                ${generateSVG('heart', '#ccc')}
              </div>
              <div class="profile-details">
                <div class="detail-row"><span class="detail-label">TRAVELER:</span> <span class="detail-value">Parchiti</span></div>
                <div class="detail-row"><span class="detail-label">PASSPORT NO:</span> <span class="detail-value">LP-2026-∞</span></div>
                <div class="detail-row"><span class="detail-label">ISSUED:</span> <span class="detail-value">July 25, 2026</span></div>
                <div class="detail-row"><span class="detail-label">VALID:</span> <span class="detail-value">Forever</span></div>
                <div class="detail-row"><span class="detail-label">NATIONALITY:</span> <span class="detail-value">Adventure Lover</span></div>
                <div class="detail-row" style="margin-top:10px;"><span class="detail-label">SIGNATURE:</span> <div style="font-family: var(--font-romantic); font-size: 1.5rem; color: #1a1a1a; margin-top:-5px;">Parchiti</div></div>
              </div>
            </div>
            
            <div style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px; margin-bottom: 1rem; font-family: var(--font-ui);">
              <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span style="font-size:0.8rem; font-weight:bold;">LOVE LEVEL</span>
                <span style="font-size:0.8rem; color:var(--primary); font-weight:bold;">XP: ${progress.xp}</span>
              </div>
              <div style="height:8px; background:#ddd; border-radius:4px; overflow:hidden;">
                <div style="height:100%; width:${(completedCount/totalDestinations)*100}%; background:var(--gradient-main);"></div>
              </div>
              <div style="display:flex; justify-content:space-between; margin-top:5px; font-size:0.7rem; color:#666;">
                <span>Visited: ${completedCount} / ${totalDestinations}</span>
                <span>Stamps: ${completedCount}</span>
              </div>
            </div>
            
            <div class="stamps-grid">
              ${stampsHtml}
            </div>
            
            <button onclick="document.getElementById('passport-book').classList.remove('open')" style="margin-top: 10px; background: none; border: none; color: #888; font-size: 0.8rem; cursor: pointer; align-self: center;">Close Passport</button>
          </div>
        </div>
        
      </div>
    </div>
  `;
}
