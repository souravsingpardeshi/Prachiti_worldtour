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

async function showLoadingScreen(msg) {
  // Show a full-screen loading overlay during API wake-up
  let overlay = document.getElementById('api-loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'api-loading-overlay';
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:99999;
      background: linear-gradient(135deg, #1F2A44 0%, #2d1b4e 50%, #1a2a3a 100%);
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:1.5rem; font-family:var(--font-ui, 'Poppins', sans-serif);
    `;
    overlay.innerHTML = `
      <div style="font-size:3.5rem; animation: float 3s ease-in-out infinite;">✈️</div>
      <h2 style="color:white; font-size:1.4rem; font-weight:600; margin:0;">Love Passport</h2>
      <div style="color:rgba(255,255,255,0.7); font-size:0.9rem; text-align:center; max-width:280px; line-height:1.5;" id="api-loading-msg">
        Connecting to server...
      </div>
      <div style="width:200px; height:3px; background:rgba(255,255,255,0.15); border-radius:999px; overflow:hidden; margin-top:0.5rem;">
        <div id="api-loading-bar" style="height:100%; width:0%; background:linear-gradient(90deg,#FF5E8A,#FFD166); border-radius:999px; transition:width 1s ease;"></div>
      </div>
      <p style="color:rgba(255,255,255,0.4); font-size:0.75rem; margin-top:0.5rem;">First load may take ~30s ☕</p>
    `;
    document.body.appendChild(overlay);
  }
  document.getElementById('api-loading-msg').textContent = msg;
  return overlay;
}

function updateLoadingProgress(pct) {
  const bar = document.getElementById('api-loading-bar');
  if (bar) bar.style.width = pct + '%';
}

function hideLoadingScreen() {
  const overlay = document.getElementById('api-loading-overlay');
  if (overlay) {
    overlay.style.transition = 'opacity 0.5s';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 500);
  }
}

async function init() {
  if (navigator.storage && navigator.storage.persist) {
    try { await navigator.storage.persist(); } catch (_) {}
  }

  // Show loading screen immediately
  await showLoadingScreen('Connecting to server...');
  updateLoadingProgress(15);

  // Fetch user data from backend API with retry + progress
  const apiOk = await Storage.initFromApi((retryMsg) => {
    showLoadingScreen(retryMsg);
    updateLoadingProgress(50);
  });

  updateLoadingProgress(80);

  // Load itinerary data
  try {
    const customItinerary = Storage.getItinerary();
    if (customItinerary && customItinerary.dates && customItinerary.dates.length > 0) {
      itineraryData = customItinerary;
    } else {
      // Fall back to the static bundled itinerary
      const res1 = await fetch('/data/itinerary.json');
      itineraryData = await res1.json();
    }
    
    const res2 = await fetch('/data/achievements.json');
    achievementsData = await res2.json();
  } catch (err) {
    console.error("Failed to load data:", err);
    itineraryData = { dates: [] };
    achievementsData = { badges: [] };
  }
  
  updateLoadingProgress(100);

  // Show a warning if API failed
  if (!apiOk) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = "⚠️ Server offline — showing cached data. Some features may not sync.";
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 8000);
    }
  }

  // Short delay so the progress bar reaches 100% visually
  await new Promise(r => setTimeout(r, 300));
  hideLoadingScreen();
  
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
