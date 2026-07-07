import { Storage } from '../storage.js';

export function renderMap(itinerary) {
  const container = document.getElementById('section-map');
  const progress = Storage.getProgress();

  // Coordinates mapped to a 1000×560 viewBox (matches % math: x/10, y/5.6)
  const coords = {
    1:  { x: 320, y: 390 }, // Rio
    2:  { x: 520, y: 210 }, // Rome
    3:  { x: 480, y: 185 }, // Paris
    4:  { x: 820, y: 225 }, // Tokyo
    5:  { x: 780, y: 205 }, // Seoul
    6:  { x: 720, y: 315 }, // Bangkok
    7:  { x: 195, y: 275 }, // Mexico City
    8:  { x: 450, y: 225 }, // Seville
    9:  { x: 545, y: 248 }, // Santorini
    10: { x: 500, y: 195 }, // Zurich
    11: { x: 855, y: 470 }, // Sydney
    12: { x: 650, y: 285 }, // Mumbai
    13: { x: 100, y: 145 }, // Fantasy 1
    14: { x: 250, y:  95 }, // Fantasy 2
    15: { x: 900, y: 145 }, // Fantasy 3
    16: { x: 150, y: 445 }, // Fantasy 4
    17: { x: 880, y: 345 }, // Fantasy 5
    18: { x: 600, y: 445 }, // Fantasy 6
    19: { x: 400, y: 495 }, // Fantasy 7
    20: { x: 500, y:  45 }, // Moon (top-centre)
  };

  let markersHtml = '';
  let pathPoints = [];

  itinerary.dates.forEach(date => {
    const pos = coords[date.id];
    if (!pos) return;

    const isCompleted = progress.completedIds.includes(date.id);
    const isCurrent   = date.id === progress.currentId;
    let stateClass = 'locked';
    if (isCompleted) stateClass = 'completed';
    else if (isCurrent) stateClass = 'current';

    // Collect path points for completed + current
    if (isCompleted || isCurrent) pathPoints.push(pos);

    const left = (pos.x / 10).toFixed(1);
    const top  = (pos.y / 5.6).toFixed(1);

    markersHtml += `
      <div class="map-marker ${stateClass}"
           style="left:${left}%; top:${top}%;"
           title="${date.city}"
           data-city="${date.city}"
           data-flag="${date.flag}"
           data-id="${date.id}"
           onclick="window.location.hash='#boarding'">
        <div class="marker-label">${date.flag} ${date.city}</div>
      </div>
    `;
  });

  // Build SVG path
  let pathD = '';
  if (pathPoints.length >= 2) {
    pathD = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      const prev = pathPoints[i - 1];
      const cur  = pathPoints[i];
      const cx   = (prev.x + cur.x) / 2;
      const cy   = Math.min(prev.y, cur.y) - 40;
      pathD += ` Q ${cx} ${cy} ${cur.x} ${cur.y}`;
    }
  }

  container.innerHTML = `
    <div class="map-container">
      <div style="width:100%; max-width:960px; padding:1rem;">
        <div style="text-align:center; margin-bottom:1rem;">
          <h2 style="font-family:var(--font-ui); color:var(--light); font-size:1.4rem; letter-spacing:3px; font-weight:300;">LOVE JOURNEY MAP</h2>
          <p style="color:rgba(255,255,255,0.5); font-size:0.8rem;">Click any destination to view its boarding pass</p>
        </div>

        <!-- Map canvas -->
        <div id="map-canvas" style="position:relative; width:100%; aspect-ratio:10/5.6; background:rgba(15,25,50,0.7); border-radius:20px; border:1px solid rgba(255,255,255,0.12); overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.5);">

          <!-- Abstract continents SVG -->
          <svg viewBox="0 0 1000 560" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none;">
            <!-- Americas -->
            <path d="M150,180 Q200,140 255,195 T305,295 Q258,445 355,498 T402,348 Q302,248 150,180" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
            <!-- Europe/Africa -->
            <path d="M445,148 Q548,98 602,195 T652,348 Q552,448 502,398 T398,248 Q445,195 445,148" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
            <!-- Asia/Oceania -->
            <path d="M698,195 Q798,148 852,248 T902,398 Q802,498 752,448 T698,298 Q748,248 698,195" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
            <!-- Grid lines -->
            <line x1="0" y1="280" x2="1000" y2="280" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4,8"/>
            <line x1="500" y1="0" x2="500" y2="560" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4,8"/>

            <!-- Flight path -->
            ${pathD ? `<path d="${pathD}" fill="none" stroke="rgba(255,94,138,0.6)" stroke-width="2" stroke-dasharray="6,4" class="flight-path"/>` : ''}
          </svg>

          <!-- Destination markers -->
          ${markersHtml}
        </div>

        <!-- Legend -->
        <div style="display:flex; justify-content:center; gap:24px; margin-top:1rem; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:rgba(255,255,255,0.7);">
            <div style="width:14px; height:14px; background:var(--accent); border-radius:50%; border:2px solid white;"></div> Visited
          </div>
          <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:rgba(255,255,255,0.7);">
            <div style="width:14px; height:14px; background:var(--secondary); border-radius:50%; border:2px solid white; box-shadow:0 0 8px var(--secondary);"></div> Next Stop
          </div>
          <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:rgba(255,255,255,0.7);">
            <div style="width:14px; height:14px; background:rgba(255,255,255,0.2); border-radius:50%; border:2px solid rgba(255,255,255,0.4);"></div> Coming Soon
          </div>
        </div>

        <!-- Destination list -->
        <div style="margin-top:1.5rem; display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:0.75rem;">
          ${itinerary.dates.map(date => {
            const isCompleted = progress.completedIds.includes(date.id);
            const isCurrent   = date.id === progress.currentId;
            const bg = isCompleted ? 'rgba(6,214,160,0.15)' : isCurrent ? 'rgba(255,209,102,0.15)' : 'rgba(255,255,255,0.04)';
            const border = isCompleted ? 'rgba(6,214,160,0.4)' : isCurrent ? 'rgba(255,209,102,0.4)' : 'rgba(255,255,255,0.08)';
            const icon = isCompleted ? '✅' : isCurrent ? '📍' : '🔒';
            return `
              <div onclick="window.location.hash='#boarding'" style="cursor:pointer; background:${bg}; border:1px solid ${border}; border-radius:12px; padding:10px 12px; transition:transform 0.2s; display:flex; align-items:center; gap:8px;"
                   onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                <span style="font-size:1.3rem;">${date.flag}</span>
                <div>
                  <div style="font-size:0.8rem; font-weight:600; color:rgba(255,255,255,0.9);">${date.city}</div>
                  <div style="font-size:0.65rem; color:rgba(255,255,255,0.4);">${icon} ${date.theme}</div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
