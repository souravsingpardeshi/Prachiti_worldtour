import { Storage } from '../storage.js';
import { generateSVG } from '../utils.js';

export function renderBoarding(itinerary) {
  const container = document.getElementById('section-boarding');
  const progress = Storage.getProgress();

  // Build destination selector
  const selectorOptions = itinerary.dates.map(d => {
    const isCompleted = progress.completedIds.includes(d.id);
    const isCurrent  = progress.currentId === d.id;
    const label = `${d.flag} ${d.city}${isCompleted ? ' ✅' : isCurrent ? ' 📍' : ' 🔒'}`;
    return `<option value="${d.id}" ${isCurrent ? 'selected' : ''}>${label}</option>`;
  }).join('');

  // Default: show current or first date
  let selectedId = progress.currentId || 1;
  let date = itinerary.dates.find(d => d.id === selectedId) || itinerary.dates[0];
  if (!date) { container.innerHTML = '<p style="color:white;padding:2rem;">No dates found.</p>'; return; }

  function renderTicket(date) {
    return `
      <div class="ticket">
        <div class="ticket-main">
          <div class="ticket-header">
            <div class="airline">
              <span style="display:inline-flex;width:28px;height:28px;">${generateSVG('plane', 'var(--primary)')}</span>
              LOVE AIR
            </div>
            <div style="font-weight:700; color:#888; font-size:0.9rem;">FIRST CLASS ✦</div>
          </div>

          <div class="flight-route">
            <div class="route-point">
              <div class="route-code" style="color: var(--primary);">HRT</div>
              <div class="route-city">Sourav's Heart</div>
            </div>
            <div class="plane-icon">✈️</div>
            <div class="route-point">
              <div class="route-code" style="color: ${date.color || 'var(--secondary)'};">${date.city.substring(0,3).toUpperCase()}</div>
              <div class="route-city">${date.city}, ${date.country}</div>
            </div>
          </div>

          <div class="ticket-details">
            <div class="detail-box">
              <label>PASSENGER</label>
              <div>Parchiti ❤️</div>
            </div>
            <div class="detail-box">
              <label>FLIGHT</label>
              <div>LOVE-0${date.id}</div>
            </div>
            <div class="detail-box">
              <label>DATE</label>
              <div>Anytime</div>
            </div>
            <div class="detail-box">
              <label>GATE</label>
              <div>Sourav</div>
            </div>
            <div class="detail-box">
              <label>SEAT</label>
              <div>Forever</div>
            </div>
            <div class="detail-box">
              <label>DRESS CODE</label>
              <div style="font-size: 0.85rem; line-height: 1.3;">${date.dressCode || 'Dress to impress'}</div>
            </div>
          </div>

          <div style="margin-top: 1.5rem; padding: 15px; background: rgba(255,94,138,0.08); border-radius: 8px; border-left: 4px solid var(--primary);">
            <strong style="display:block; margin-bottom:5px; font-size:0.75rem; text-transform:uppercase; color:var(--primary); letter-spacing:1px;">✦ ${date.theme}</strong>
            <span style="font-size:0.9rem; color:#555; line-height:1.5;">${date.description || ''}</span>
          </div>

          <button id="tear-btn" class="btn-primary" style="margin-top:1.5rem; width:100%; font-size:0.9rem;">🖨️ PRINT BOARDING PASS</button>
        </div>

        <div class="ticket-stub" id="ticket-stub">
          <div>
            <div style="font-size:0.7rem; font-weight:700; letter-spacing:2px; color:#aaa; border-bottom:1px solid #ddd; padding-bottom:8px; margin-bottom:1rem;">BOARDING PASS</div>
            <div class="detail-box" style="margin-bottom:1.2rem;">
              <label>DESTINATION</label>
              <div style="font-size:1.3rem; font-weight:700; color:${date.color || 'var(--primary)'};">${date.flag} ${date.city}</div>
            </div>
            <div class="detail-box" style="margin-bottom:1.2rem;">
              <label>LOVE NOTE</label>
              <div style="font-family:var(--font-romantic); font-size:1.1rem; color:var(--primary); line-height:1.4;">
                "${date.loveNote || 'Adventure awaits!'}"
              </div>
            </div>
            <div class="detail-box">
              <label>ZONE</label>
              <div style="font-size:1.5rem; font-weight:bold;">💕</div>
            </div>
          </div>
          <div class="barcode"></div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="boarding-container">
      <div style="width:100%; max-width:860px;">
        <!-- Destination selector -->
        <div style="margin-bottom:1.5rem; text-align:center;">
          <label style="color:rgba(255,255,255,0.7); font-size:0.85rem; font-weight:600; letter-spacing:1px; text-transform:uppercase; display:block; margin-bottom:8px;">Select Destination</label>
          <select id="dest-selector" style="background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.2); border-radius:12px; padding:10px 18px; font-size:1rem; font-family:var(--font-ui); backdrop-filter:blur(10px); cursor:pointer; outline:none; max-width:400px; width:100%;">
            ${selectorOptions}
          </select>
        </div>

        <div id="ticket-wrapper">
          ${renderTicket(date)}
        </div>
      </div>
    </div>
  `;

  // Destination change
  document.getElementById('dest-selector').addEventListener('change', (e) => {
    const newId = parseInt(e.target.value);
    const newDate = itinerary.dates.find(d => d.id === newId);
    if (newDate) {
      document.getElementById('ticket-wrapper').innerHTML = renderTicket(newDate);
      attachTearBtn();
    }
  });

  function attachTearBtn() {
    const tearBtn = document.getElementById('tear-btn');
    if (!tearBtn) return;
    tearBtn.addEventListener('click', () => {
      const stub = document.getElementById('ticket-stub');
      if (stub) {
        stub.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
        stub.style.transform = 'translateX(120%)';
        stub.style.opacity = '0';
      }
      tearBtn.textContent = '✅ TICKET PRINTED!';
      tearBtn.style.opacity = '0.7';
      tearBtn.disabled = true;
    });
  }

  attachTearBtn();
}
