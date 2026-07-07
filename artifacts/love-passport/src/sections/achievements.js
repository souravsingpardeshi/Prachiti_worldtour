import { Storage } from '../storage.js';
import { generateSVG } from '../utils.js';

export function renderAchievements(achievementsData) {
  const container = document.getElementById('section-achievements');
  const progress = Storage.getProgress();
  const completedIds = progress.completedIds;
  
  // Calculate progress for specific badges
  const foodCount = completedIds.filter(id => [2,3,7,10,12].includes(id)).length; // Manual list based on themes
  const memoryCount = Object.keys(localStorage).filter(k => k.startsWith('lp_photo_')).length;
  
  let gridHtml = '';
  
  achievementsData.badges.forEach(badge => {
    let isUnlocked = false;
    let progressText = '';
    
    if (badge.type === 'food') {
      isUnlocked = foodCount >= badge.target;
      progressText = `${foodCount}/${badge.target}`;
    } else if (badge.type === 'memory') {
      isUnlocked = memoryCount >= badge.target;
      progressText = `${memoryCount}/${badge.target}`;
    } else if (badge.type === 'travel' || badge.type === 'stamp') {
      isUnlocked = completedIds.length >= badge.target;
      progressText = `${completedIds.length}/${badge.target}`;
    } else if (badge.unlock) {
      // Find the ID for the unlock country name (hacky mapping for demo)
      const unlocksMap = {
        'Brazil': 1, 'Italy': 2, 'Spain': 8, 'Greece': 9, 'Thailand': 6, 'India': 12, 'Moon': 20
      };
      const reqId = unlocksMap[badge.unlock];
      isUnlocked = completedIds.includes(reqId);
    }

    const stateClass = isUnlocked ? 'unlocked' : 'locked';
    const color = isUnlocked ? 'var(--primary)' : '#666';
    const bg = isUnlocked ? 'rgba(255,94,138,0.1)' : 'rgba(0,0,0,0.2)';
    
    gridHtml += `
      <div class="glass-panel" style="padding:1.5rem; text-align:center; background:${bg}; opacity: ${isUnlocked ? 1 : 0.6}; transition: transform 0.3s;">
        <div style="width:60px; height:60px; margin:0 auto 1rem; color:${color}; ${!isUnlocked ? 'filter: grayscale(100%);' : 'filter: drop-shadow(0 0 10px rgba(255,94,138,0.5));'}">
          ${generateSVG(badge.icon || 'heart', 'currentColor')}
        </div>
        <h4 style="margin-bottom:0.5rem; font-size:1.1rem; color:${isUnlocked ? 'var(--light)' : '#888'};">${badge.title}</h4>
        <p style="font-size:0.8rem; color:#aaa; margin-bottom:0.5rem;">${badge.desc}</p>
        ${progressText ? `<div style="font-size:0.7rem; font-weight:bold; color:var(--accent);">${progressText}</div>` : ''}
        ${isUnlocked ? `<div style="margin-top:10px; font-size:0.7rem; color:var(--secondary); font-weight:bold;">UNLOCKED! 🎉</div>` : ''}
      </div>
    `;
  });

  container.innerHTML = `
    <div style="padding:2rem; max-width:1000px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:3rem;">
        <h2 style="font-size:2.5rem; font-family:var(--font-romantic); color:var(--light);">Achievements</h2>
        <p style="color:var(--secondary);">Collect badges as we complete our journey together.</p>
        <div style="margin-top:1rem; display:inline-block; padding:10px 20px; background:rgba(0,0,0,0.3); border-radius:30px; border:1px solid rgba(255,255,255,0.1);">
          🏆 Unlocked: <strong style="color:var(--primary);">${achievementsData.badges.filter(b => {
             if (b.type === 'food') return foodCount >= b.target;
             if (b.type === 'memory') return memoryCount >= b.target;
             if (b.type === 'travel' || b.type === 'stamp') return completedIds.length >= b.target;
             if (b.unlock) {
                const map = {'Brazil':1, 'Italy':2, 'Spain':8, 'Greece':9, 'Thailand':6, 'India':12, 'Moon':20};
                return completedIds.includes(map[b.unlock]);
             }
             return false;
          }).length} / ${achievementsData.badges.length}</strong>
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:1.5rem;">
        ${gridHtml}
      </div>
    </div>
  `;
}
