import { Storage } from '../storage.js';

export function renderMap(itinerary) {
  const container = document.getElementById('section-map');
  const progress = Storage.getProgress();
  
  // Abstract coordinates mapping for cities to a 1000x600 viewBox
  const coords = {
    1: {x: 320, y: 400}, // Rio
    2: {x: 520, y: 220}, // Rome
    3: {x: 480, y: 190}, // Paris
    4: {x: 820, y: 230}, // Tokyo
    5: {x: 780, y: 210}, // Seoul
    6: {x: 720, y: 320}, // Bangkok
    7: {x: 200, y: 280}, // Mexico City
    8: {x: 450, y: 230}, // Seville
    9: {x: 540, y: 250}, // Santorini
    10: {x: 500, y: 200}, // Zurich
    11: {x: 850, y: 480}, // Sydney
    12: {x: 650, y: 290}, // Mumbai
    // Fantasy lands scattered around
    13: {x: 100, y: 150},
    14: {x: 250, y: 100},
    15: {x: 900, y: 150},
    16: {x: 150, y: 450},
    17: {x: 880, y: 350},
    18: {x: 600, y: 450},
    19: {x: 400, y: 500},
    20: {x: 500, y: 50}   // Moon (top center)
  };

  let markersHtml = '';
  let pathD = '';
  
  let prevPos = null;

  itinerary.dates.forEach(date => {
    const pos = coords[date.id];
    if(!pos) return;
    
    let stateClass = 'locked';
    if(progress.completedIds.includes(date.id)) {
      stateClass = 'completed';
    } else if (date.id === progress.currentId) {
      stateClass = 'current';
    }
    
    markersHtml += `
      <div class="map-marker ${stateClass}" 
           style="left: ${pos.x/10}%; top: ${pos.y/6}%;" 
           title="${date.city}"
           onclick="window.location.hash='#boarding'">
        <span style="position:absolute; top:25px; left:50%; transform:translateX(-50%); font-size:0.7rem; color:white; white-space:nowrap; background:rgba(0,0,0,0.5); padding:2px 6px; border-radius:4px; pointer-events:none;">
          ${date.flag} ${date.city}
        </span>
      </div>
    `;
    
    if(prevPos && (progress.completedIds.includes(date.id) || date.id === progress.currentId)) {
      if(!pathD) pathD = `M ${prevPos.x} ${prevPos.y}`;
      // Draw curved path
      const cx = (prevPos.x + pos.x) / 2;
      const cy = Math.min(prevPos.y, pos.y) - 50;
      pathD += ` Q ${cx} ${cy} ${pos.x} ${pos.y}`;
    }
    
    if(progress.completedIds.includes(date.id) || date.id === progress.currentId) {
      prevPos = pos;
    }
  });

  container.innerHTML = `
    <div class="map-container">
      <div style="position:relative; width:100%; max-width:1000px; aspect-ratio:10/6; background:rgba(255,255,255,0.05); border-radius:24px; border:1px solid rgba(255,255,255,0.1); overflow:hidden; box-shadow:var(--shadow-float);">
        
        <!-- Simplified abstract continents -->
        <svg viewBox="0 0 1000 600" style="position:absolute; inset:0; width:100%; height:100%;">
          <path d="M150,200 Q200,150 250,200 T300,300 Q250,450 350,500 T400,350 Q300,250 150,200" fill="rgba(255,255,255,0.1)"/>
          <path d="M450,150 Q550,100 600,200 T650,350 Q550,450 500,400 T400,250 Q450,200 450,150" fill="rgba(255,255,255,0.1)"/>
          <path d="M700,200 Q800,150 850,250 T900,400 Q800,500 750,450 T700,300 Q750,250 700,200" fill="rgba(255,255,255,0.1)"/>
          
          <path d="${pathD}" class="flight-path"/>
        </svg>
        
        ${markersHtml}
        
      </div>
      
      <div style="position:absolute; bottom:30px; background:var(--glass-bg); backdrop-filter:blur(10px); padding:15px; border-radius:12px; display:flex; gap:20px; font-size:0.8rem; border:1px solid rgba(255,255,255,0.2);">
        <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:var(--accent); border-radius:50%;"></div> Visited</div>
        <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:var(--secondary); border-radius:50%; box-shadow:0 0 10px var(--secondary);"></div> Next Stop</div>
        <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:#666; border-radius:50%;"></div> Locked</div>
      </div>
    </div>
  `;
}
