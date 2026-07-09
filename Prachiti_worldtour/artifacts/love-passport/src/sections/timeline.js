import { Storage } from '../storage.js';
import { generateSVG, escapeHtml } from '../utils.js';

export function renderTimeline(itinerary) {
  const container = document.getElementById('section-timeline');
  const progress = Storage.getProgress();
  const completedIds = progress.completedIds;
  
  let itemsHtml = '';
  
  itinerary.dates.forEach((date, index) => {
    if(completedIds.includes(date.id)) {
      itemsHtml += `
        <div class="timeline-item">
          <div class="timeline-marker">✓</div>
          <div class="timeline-content">
            <h3 style="color:${date.color}; margin-bottom:5px;">${escapeHtml(date.city)}</h3>
            <div style="font-size:0.8rem; color:#aaa; margin-bottom:10px;">${escapeHtml(date.theme)}</div>
            <p style="font-size:0.9rem;">${escapeHtml(date.description)}</p>
          </div>
          <div style="width:45%;"></div> <!-- Empty side for staggered layout -->
        </div>
      `;
    }
  });

  if(!itemsHtml) {
    itemsHtml = `
      <div style="text-align:center; padding:3rem; color:#888;">
        Your journey hasn't started yet.<br/>Head to the Map to begin!
      </div>
    `;
  }

  container.innerHTML = `
    <div style="text-align:center; padding-top:2rem;">
      <h2 style="font-size:2.5rem; font-family:var(--font-romantic); color:var(--light);">Our Journey</h2>
      <p style="color:var(--secondary); font-size:0.9rem;">Every step we've taken together.</p>
    </div>
    <div class="timeline-container">
      ${itemsHtml}
    </div>
  `;

  // Intersection Observer for scroll animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  container.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
  });
}
