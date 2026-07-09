import { Router } from './router.js';
import { Storage } from './storage.js';

// Import section renderers
import { renderLanding } from './sections/landing.js';
import { renderPassport } from './sections/passport.js';
import { renderBoarding } from './sections/boarding.js';
import { renderMap } from './sections/map.js';
import { renderGallery } from './sections/gallery.js';
import { renderAdmin } from './sections/admin.js';
import { renderAchievements } from './sections/achievements.js';
import { renderScratch } from './sections/scratch.js';
import { renderTimeline } from './sections/timeline.js';
import { renderLetters } from './sections/letters.js';
// We'll put Final logic inline here or load dynamically

let itineraryData = null;
let achievementsData = null;

async function init() {
  // Ask the browser to treat our storage as persistent instead of
  // "best-effort" — on Android Chrome, sites that aren't installed/bookmarked
  // can have their localStorage silently evicted under storage pressure,
  // which is the most common cause of progress "disappearing after refresh".
  if (navigator.storage && navigator.storage.persist) {
    try {
      const granted = await navigator.storage.persist();
      console.log('[Storage] persistent storage granted:', granted);
    } catch (err) {
      console.warn('[Storage] persist() request failed', err);
    }
  }

  // Fetch user data from backend API
  await Storage.initFromApi();

  // Load data
  try {
    const customItinerary = Storage.getItinerary();
    if (customItinerary) {
      itineraryData = customItinerary;
    } else {
      const res1 = await fetch('/data/itinerary.json');
      itineraryData = await res1.json();
    }
    
    const res2 = await fetch('/data/achievements.json');
    achievementsData = await res2.json();
  } catch (err) {
    console.error("Failed to load data:", err);
    // fallback empty state
    itineraryData = { dates: [] };
    achievementsData = { badges: [] };
  }
  
  // Set up Router
  const router = new Router();
  
  router
    .on('#landing', () => renderLanding(itineraryData))
    .on('#passport', () => renderPassport(itineraryData))
    .on('#boarding', () => renderBoarding(itineraryData))
    .on('#map', () => renderMap(itineraryData))
    .on('#gallery', () => renderGallery(itineraryData))
    .on('#timeline', () => renderTimeline(itineraryData))
    .on('#love-letter', () => renderLetters())
    .on('#achievements', () => renderAchievements(achievementsData))
    .on('#scratch', () => renderScratch())
    .on('#admin', () => renderAdmin(itineraryData, achievementsData))
    .on('#final', renderFinal);
    
  router.start();
  
  // Check if everything complete
  const p = Storage.getProgress();
  if (p.completedIds.length === 20 && !document.querySelector('.final-btn')) {
    // Inject button to final
    const nav = document.querySelector('.nav-actions');
    if(nav) {
      const btn = document.createElement('a');
      btn.href = '#final';
      btn.className = 'nav-link final-btn';
      btn.style.color = '#FFD700';
      btn.innerHTML = '✨ FINALE ✨';
      nav.insertBefore(btn, nav.firstChild);
    }
  }
}

function renderFinal() {
  const container = document.getElementById('section-final');
  
  container.innerHTML = `
    <div style="position:absolute; inset:0; z-index:0; overflow:hidden;" id="final-bg"></div>
    <div style="z-index:10; text-align:center; max-width:800px; padding:2rem;">
      <div style="font-size:5rem; margin-bottom:1rem; animation:float 6s infinite;">🌕</div>
      <h1 class="final-title" style="opacity:0; animation:fadeInUp 2s forwards 1s;">FINAL DESTINATION: THE MOON</h1>
      
      <div style="background:rgba(255,255,255,0.1); padding:2rem; border-radius:16px; backdrop-filter:blur(10px); margin:3rem 0; opacity:0; animation:fadeInUp 2s forwards 3s; border:1px solid rgba(255,255,255,0.2);">
        <p style="font-family:var(--font-romantic); font-size:2rem; color:var(--light); line-height:1.5;">
          And so our greatest adventure begins...<br>
          Happy Birthday, Parchiti ❤️
        </p>
      </div>
      
      <div style="opacity:0; animation:fadeInUp 2s forwards 5s;">
        <p style="color:#aaa; font-size:0.9rem; margin-bottom:2rem; letter-spacing:2px; text-transform:uppercase;">CREDITS</p>
        <p style="color:var(--primary); font-weight:bold; margin-bottom:0.5rem;">Directed by: Sourav</p>
        <p style="color:var(--secondary);">Starring: The most beautiful girl in the world — Parchiti</p>
      </div>
      
      <button class="btn-primary" style="margin-top:4rem; opacity:0; animation:fadeInUp 2s forwards 7s;" onclick="window.location.hash='#gallery'">View Our Memories</button>
    </div>
  `;
  
  // Firework effect
  import('./animations.js').then(({createStars, launchConfetti}) => {
    createStars(document.getElementById('final-bg'), 150);
    setTimeout(launchConfetti, 4000);
    setTimeout(launchConfetti, 6000);
    setTimeout(launchConfetti, 8000);
  });
}

// Start app
document.addEventListener('DOMContentLoaded', init);
