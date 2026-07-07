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
      <!-- Clouds will be injected here -->
      <svg class="cloud" style="top: 10%; width: 150px; animation-duration: 40s;" viewBox="0 0 24 24" fill="white"><path d="M17.5 19c-2.5 0-4.5-2-4.5-4.5 0-.2.02-.5.06-.7C12.4 13.3 11.5 13 10.5 13c-2.5 0-4.5 2-4.5 4.5S8 22 10.5 22h7c1.9 0 3.5-1.6 3.5-3.5S19.4 15 17.5 15c-.2 0-.4 0-.6.1.3-.6.6-1.3.6-2.1 0-2.8-2.2-5-5-5-2.2 0-4.1 1.4-4.8 3.3.5.4 1 .9 1.4 1.5.3-.8 1-1.3 1.9-1.3 1.1 0 2 .9 2 2 0 1.1-.9 2-2 2h-.4c.7.4 1.2 1 1.4 1.7.3-.2.6-.2 1-.2 1.4 0 2.5 1.1 2.5 2.5z"/></svg>
      <svg class="cloud" style="top: 40%; width: 250px; animation-duration: 60s; opacity: 0.3;" viewBox="0 0 24 24" fill="white"><path d="M17.5 19c-2.5 0-4.5-2-4.5-4.5 0-.2.02-.5.06-.7C12.4 13.3 11.5 13 10.5 13c-2.5 0-4.5 2-4.5 4.5S8 22 10.5 22h7c1.9 0 3.5-1.6 3.5-3.5S19.4 15 17.5 15c-.2 0-.4 0-.6.1.3-.6.6-1.3.6-2.1 0-2.8-2.2-5-5-5-2.2 0-4.1 1.4-4.8 3.3.5.4 1 .9 1.4 1.5.3-.8 1-1.3 1.9-1.3 1.1 0 2 .9 2 2 0 1.1-.9 2-2 2h-.4c.7.4 1.2 1 1.4 1.7.3-.2.6-.2 1-.2 1.4 0 2.5 1.1 2.5 2.5z"/></svg>
      <svg class="cloud" style="top: 70%; width: 100px; animation-duration: 35s;" viewBox="0 0 24 24" fill="white"><path d="M17.5 19c-2.5 0-4.5-2-4.5-4.5 0-.2.02-.5.06-.7C12.4 13.3 11.5 13 10.5 13c-2.5 0-4.5 2-4.5 4.5S8 22 10.5 22h7c1.9 0 3.5-1.6 3.5-3.5S19.4 15 17.5 15c-.2 0-.4 0-.6.1.3-.6.6-1.3.6-2.1 0-2.8-2.2-5-5-5-2.2 0-4.1 1.4-4.8 3.3.5.4 1 .9 1.4 1.5.3-.8 1-1.3 1.9-1.3 1.1 0 2 .9 2 2 0 1.1-.9 2-2 2h-.4c.7.4 1.2 1 1.4 1.7.3-.2.6-.2 1-.2 1.4 0 2.5 1.1 2.5 2.5z"/></svg>
    </div>
    
    <div class="plane-animation">
      ${generateSVG('plane', 'white')}
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
  
  // Setup countdown to July 25, 2026
  const targetDate = new Date('July 25, 2026 00:00:00').getTime();
  
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
