import { Storage } from '../storage.js';
import { generateSVG } from '../utils.js';

export function renderBoarding(itinerary) {
  const container = document.getElementById('section-boarding');
  const progress = Storage.getProgress();
  
  // Find current date or last one if all done
  let currentId = progress.currentId;
  let date = itinerary.dates.find(d => d.id === currentId) || itinerary.dates[itinerary.dates.length - 1];
  
  if(!date) return;

  container.innerHTML = `
    <div class="boarding-container">
      <div class="ticket">
        <div class="ticket-main">
          <div class="ticket-header">
            <div class="airline">
              ${generateSVG('plane', 'var(--primary)')} LOVE AIR
            </div>
            <div style="font-weight:700; color:#888;">FIRST CLASS</div>
          </div>
          
          <div class="flight-route">
            <div class="route-point">
              <div class="route-code" style="color: var(--primary);">HRT</div>
              <div class="route-city">Sourav's Heart</div>
            </div>
            <div class="plane-icon">✈️</div>
            <div class="route-point">
              <div class="route-code" style="color: ${date.color};">${date.city.substring(0,3).toUpperCase()}</div>
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
              <div style="font-size: 0.9rem; line-height: 1.2;">${date.dressCode}</div>
            </div>
          </div>
          
          <div style="margin-top: 2rem; padding: 15px; background: rgba(255,94,138,0.1); border-radius: 8px; border-left: 4px solid var(--primary);">
            <strong style="display:block; margin-bottom:5px; font-size:0.8rem; color:var(--primary);">ACTIVITY: ${date.theme}</strong>
            <span style="font-size:0.9rem;">${date.description}</span>
          </div>
          
          <button id="tear-btn" class="btn-primary" style="margin-top:2rem; width:100%;">PRINT TICKET</button>
        </div>
        
        <div class="ticket-stub" id="ticket-stub">
          <div>
            <h3 style="margin-bottom:1rem; font-size:1.2rem; border-bottom:1px solid #ccc; padding-bottom:10px;">BOARDING PASS</h3>
            <div class="detail-box" style="margin-bottom:1rem;">
              <label>TO</label>
              <div style="font-size:1.2rem; color:${date.color};">${date.city}</div>
            </div>
            <div class="detail-box">
              <label>LOVE NOTE</label>
              <div style="font-family:var(--font-romantic); font-size:1.2rem; color:var(--primary); line-height:1.2;">
                ${date.loveNote}
              </div>
            </div>
          </div>
          
          <div class="barcode"></div>
        </div>
      </div>
    </div>
  `;
  
  const tearBtn = document.getElementById('tear-btn');
  if(tearBtn) {
    tearBtn.addEventListener('click', () => {
      document.getElementById('ticket-stub').style.animation = 'fadeOutDown 1s ease forwards';
      tearBtn.innerText = 'PRINTING...';
      tearBtn.style.opacity = 0.5;
      setTimeout(() => {
        tearBtn.innerText = 'TICKET READY!';
      }, 1000);
    });
  }
}
