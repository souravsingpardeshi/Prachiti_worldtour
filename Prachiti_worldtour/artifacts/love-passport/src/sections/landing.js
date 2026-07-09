import { Storage } from '../storage.js';
import { generateSVG } from '../utils.js';

export function renderLanding(itinerary) {
  const container = document.getElementById('section-landing');
  
  const quotes = [
    "Every love story is beautiful, but ours is my favourite.",
    "You are my today and all of my tomorrows.",
    "In all the world, there is no heart for me like yours.",
    "With you, every day is a new adventure.",
    "You are my sun, my moon, and all my stars."
  ];
  
  let currentQuote = 0;
  
  container.innerHTML = `
    <div class="stars-layer" id="landing-stars"></div>
    <div class="clouds-layer">
      <!-- Dreamy, fluffy radial-gradient clouds -->
      <div class="cloud-fluffy" style="position: absolute; top: 10%; width: 220px; height: 100px; left: -250px; animation: cloud-drift-fluffy 55s linear infinite; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%); filter: blur(12px);"></div>
      <div class="cloud-fluffy" style="position: absolute; top: 45%; width: 350px; height: 160px; left: -380px; animation: cloud-drift-fluffy 75s linear infinite 10s; background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%); filter: blur(20px); opacity: 0.8;"></div>
      <div class="cloud-fluffy" style="position: absolute; top: 75%; width: 260px; height: 120px; left: -290px; animation: cloud-drift-fluffy 65s linear infinite 25s; background: radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%); filter: blur(15px);"></div>
    </div>
    
    <div class="plane-animation">
      <!-- Elegant paper plane SVG -->
      <svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%; color: rgba(255,255,255,0.85); filter: drop-shadow(0 4px 12px rgba(255,94,138,0.4));">
        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
      </svg>
    </div>
    
    <div class="landing-card glass-panel">
      <div class="passport-icon">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.11 3.89,21 5,21H19C20.11,21 21,20.11 21,19V5C21,3.89 20.11,3 19,3M19,19H5V5H19V19M12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/></svg>
      </div>
      
      <h1 class="landing-title">LOVE PASSPORT</h1>
      <h2 class="landing-subtitle">Around the World with Sourav</h2>
      <p style="margin-bottom: 2rem; color: #ccc;">A birthday adventure for Parchiti ❤️</p>
      
      <div class="countdown-container">
        <div class="count-box"><span class="count-num" id="cd-days">00</span><span class="count-label">Days</span></div>
        <div class="count-box"><span class="count-num" id="cd-hours">00</span><span class="count-label">Hours</span></div>
        <div class="count-box"><span class="count-num" id="cd-mins">00</span><span class="count-label">Mins</span></div>
        <div class="count-box"><span class="count-num" id="cd-secs">00</span><span class="count-label">Secs</span></div>
      </div>
      
      <div class="quote-container">
        <p class="quote-text" id="landing-quote">"${quotes[0]}"</p>
      </div>
      
      <a href="#passport" class="btn-primary" style="display: inline-block;">✈️ BEGIN JOURNEY</a>
      
      <div class="departure-board">
        DEPARTING... LOVE FLIGHT ❤️
      </div>
    </div>
  `;
  
  // Create stars
  import('../animations.js').then(({createStars}) => {
    const starsLayer = document.getElementById('landing-stars');
    if (starsLayer) createStars(starsLayer, 100);
  });
  
  // Setup countdown to July 11, 2026 (Parchiti's birthday)
  const targetDate = new Date('July 11, 2026 00:00:00').getTime();
  
  const updateCountdown = () => {
    const now = new Date().getTime();
    const dist = targetDate - now;
    
    if (dist < 0) {
      document.getElementById('cd-days').innerText = "00";
      return;
    }
    
    document.getElementById('cd-days').innerText = String(Math.floor(dist / (1000 * 60 * 60 * 24))).padStart(2, '0');
    document.getElementById('cd-hours').innerText = String(Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    document.getElementById('cd-mins').innerText = String(Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    document.getElementById('cd-secs').innerText = String(Math.floor((dist % (1000 * 60)) / 1000)).padStart(2, '0');
  };
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  // Rotate quotes
  setInterval(() => {
    const qt = document.getElementById('landing-quote');
    if(qt) {
      qt.style.opacity = 0;
      setTimeout(() => {
        currentQuote = (currentQuote + 1) % quotes.length;
        qt.innerText = `"${quotes[currentQuote]}"`;
        qt.style.opacity = 1;
      }, 500);
    }
  }, 5000);
}
