import { Storage } from '../storage.js';
import { generateSVG, escapeHtml, showToast } from '../utils.js';

export function renderAdmin(itinerary, achievementsData) {
  const container = document.getElementById('section-admin');
  
  // Check auth
  const isAuth = sessionStorage.getItem('lp_auth') === 'true';
  
  if(!isAuth) {
    container.innerHTML = `
      <div class="admin-container">
        <div class="admin-login glass-panel" style="padding: 2rem;">
          <div style="text-align:center; margin-bottom:2rem;">
            <div style="width:60px; height:60px; margin:0 auto 1rem; color:var(--primary);">${generateSVG('lock', 'currentColor')}</div>
            <h2>Admin Area</h2>
            <p style="font-size:0.8rem; color:#aaa;">Enter the secret code to manage dates.</p>
          </div>
          
          <form id="login-form">
            <div class="input-group">
              <label>Password</label>
              <input type="password" id="admin-pass" placeholder="Enter password" required>
            </div>
            <button type="submit" class="btn-primary" style="width:100%;">Unlock</button>
          </form>
        </div>
      </div>
    `;
    
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = document.getElementById('admin-pass').value;
      if(pass === 'love2026') {
        sessionStorage.setItem('lp_auth', 'true');
        renderAdmin(itinerary, achievementsData);
        showToast('Access Granted 🔓');
      } else {
        const box = document.querySelector('.admin-login');
        box.style.animation = 'shake 0.5s';
        setTimeout(() => box.style.animation = '', 500);
        showToast('Incorrect password ❌');
      }
    });
    return;
  }
  
  const progress = Storage.getProgress();
  
  let tableHtml = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Destination</th>
            <th>Theme</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  itinerary.dates.forEach(date => {
    const isCompleted = progress.completedIds.includes(date.id);
    const isCurrent = progress.currentId === date.id;
    let statusStr = '<span style="color:#888;">Locked 🔒</span>';
    if(isCompleted) statusStr = '<span style="color:var(--accent);">Completed ✅</span>';
    if(isCurrent) statusStr = '<span style="color:var(--secondary);">Current 📍</span>';
    
    tableHtml += `
      <tr>
        <td>${date.id}</td>
        <td>${date.flag} ${escapeHtml(date.city)}</td>
        <td>${escapeHtml(date.theme)}</td>
        <td>${statusStr}</td>
        <td>
          ${!isCompleted ? `<button class="action-btn complete" data-id="${date.id}" title="Mark Complete">✓</button>` : ''}
          <button class="action-btn edit" data-id="${date.id}" title="Upload Photo">📸</button>
        </td>
      </tr>
    `;
  });
  
  tableHtml += `</tbody></table></div>`;

  container.innerHTML = `
    <div class="admin-container">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <h2 style="color:var(--light);">Control Center</h2>
        <button id="logout-btn" class="action-btn" style="background:rgba(255,0,0,0.2);">Lock</button>
      </div>
      
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-bottom:2rem;">
        <div class="glass-panel" style="padding:1.5rem; text-align:center;">
          <div style="font-size:2rem; font-weight:bold; color:var(--primary);">${progress.completedIds.length}</div>
          <div style="font-size:0.8rem; color:#aaa;">Dates Completed</div>
        </div>
        <div class="glass-panel" style="padding:1.5rem; text-align:center;">
          <div style="font-size:2rem; font-weight:bold; color:var(--secondary);">${progress.xp}</div>
          <div style="font-size:0.8rem; color:#aaa;">Total XP</div>
        </div>
        <div class="glass-panel" style="padding:1.5rem; text-align:center;">
          <div style="font-size:2rem; font-weight:bold; color:var(--accent);">${itinerary.dates.length - progress.completedIds.length}</div>
          <div style="font-size:0.8rem; color:#aaa;">Remaining</div>
        </div>
      </div>
      
      <div class="glass-panel" style="padding:1.5rem;">
        <h3 style="margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">Itinerary</h3>
        ${tableHtml}
      </div>
      
      <div style="margin-top:2rem; text-align:right;">
        <button id="reset-btn" class="action-btn" style="background:#cc0000; padding:10px 20px;">Reset All Progress (Danger)</button>
      </div>
    </div>
    
    <!-- Photo Upload Modal -->
    <div id="photo-modal" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" onclick="document.getElementById('photo-modal').classList.remove('active')">&times;</button>
        <h3 style="margin-bottom:1rem;">Upload Memory</h3>
        <p style="font-size:0.8rem; color:#aaa; margin-bottom:1rem;">Upload a photo for this destination.</p>
        <input type="file" id="photo-upload" accept="image/*" style="margin-bottom:1rem; width:100%;">
        <div id="photo-preview" style="width:100%; height:200px; background:#222; border-radius:8px; margin-bottom:1rem; background-size:cover; background-position:center;"></div>
        <input type="hidden" id="photo-dest-id">
        <button id="save-photo-btn" class="btn-primary" style="width:100%;">Save Photo</button>
      </div>
    </div>
  `;
  
  // Attach events
  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('lp_auth');
    renderAdmin(itinerary, achievementsData);
  });
  
  document.getElementById('reset-btn').addEventListener('click', () => {
    if(confirm('Are you absolutely sure you want to reset EVERYTHING? All progress and photos will be lost.')) {
      localStorage.clear();
      location.reload();
    }
  });
  
  // Handle Mark Complete
  container.querySelectorAll('.complete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const dateInfo = itinerary.dates.find(d => d.id === id);
      
      // Update progress
      const p = Storage.getProgress();
      if(!p.completedIds.includes(id)) {
        p.completedIds.push(id);
        p.xp += dateInfo.xp || 100;
        
        // set next as current
        if(p.currentId === id) {
          const nextDate = itinerary.dates.find(d => d.id > id);
          if(nextDate) p.currentId = nextDate.id;
        }
        
        Storage.saveProgress(p);
        showToast(`Unlocked stamp for ${dateInfo.city}! 🎉`);
        
        // trigger re-render
        renderAdmin(itinerary, achievementsData);
        
        import('../animations.js').then(({launchConfetti}) => {
          launchConfetti();
        });
      }
    });
  });
  
  // Handle Photo Upload Modal
  container.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      document.getElementById('photo-dest-id').value = id;
      
      const existing = Storage.getPhoto(id);
      const preview = document.getElementById('photo-preview');
      if(existing) {
        preview.style.backgroundImage = `url(${existing})`;
      } else {
        preview.style.backgroundImage = 'none';
        preview.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#666;">No image</div>';
      }
      
      document.getElementById('photo-upload').value = '';
      document.getElementById('photo-modal').classList.add('active');
    });
  });
  
  document.getElementById('photo-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('photo-preview');
        preview.innerHTML = '';
        preview.style.backgroundImage = `url(${e.target.result})`;
      };
      reader.readAsDataURL(file);
    }
  });
  
  document.getElementById('save-photo-btn').addEventListener('click', () => {
    const id = document.getElementById('photo-dest-id').value;
    const file = document.getElementById('photo-upload').files[0];
    
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Storage.savePhoto(id, e.target.result);
        showToast('Photo saved! 📸');
        document.getElementById('photo-modal').classList.remove('active');
      };
      reader.readAsDataURL(file);
    } else {
      document.getElementById('photo-modal').classList.remove('active');
    }
  });
}
