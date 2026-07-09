import { Storage } from '../storage.js';
import { generateSVG, escapeHtml, showToast } from '../utils.js';

const STAMP_TYPES = [
  'coffee-bean', 'colosseum', 'eiffel', 'torii', 'gyeongbok', 'lotus-stamp',
  'sombrero', 'fan', 'parthenon', 'mountain', 'opera-house', 'taj',
  'bookmark', 'wheel', 'brush', 'hole-in-one', 'strike', 'jellyfish',
  'planet', 'rocket', 'heart'
];

export function renderAdmin(itinerary, achievementsData) {
  const container = document.getElementById('section-admin');

  // Check auth
  const isAuth = sessionStorage.getItem('lp_auth') === 'true';

  if (!isAuth) {
    container.innerHTML = `
      <div class="admin-container">
        <div class="admin-login glass-panel" style="padding: 2.5rem;">
          <div style="text-align:center; margin-bottom:2rem;">
            <div style="width:60px; height:60px; margin:0 auto 1rem; color:var(--primary);">${generateSVG('lock', 'currentColor')}</div>
            <h2 style="margin-bottom:0.5rem;">Admin Area</h2>
            <p style="font-size:0.85rem; color:#aaa;">Enter the secret code to manage the journey.</p>
          </div>

          <form id="login-form">
            <div class="input-group" style="margin-bottom:1rem;">
              <label style="display:block; font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; color:#aaa; margin-bottom:6px;">Password</label>
              <input type="password" id="admin-pass" placeholder="Enter password" required
                style="width:100%; box-sizing:border-box; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:12px 16px; color:white; font-size:1rem; outline:none; font-family:var(--font-ui);">
            </div>
            <button type="submit" class="btn-primary" style="width:100%; margin-top:0.5rem;">🔓 Unlock</button>
          </form>
        </div>
      </div>
    `;

    // Focus the input
    setTimeout(() => {
      const inp = document.getElementById('admin-pass');
      if (inp) inp.focus();
    }, 100);

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = document.getElementById('admin-pass').value;
      if (pass === 'love2026') {
        sessionStorage.setItem('lp_auth', 'true');
        renderAdmin(itinerary, achievementsData);
        showToast('Access Granted 🔓');
      } else {
        const box = document.querySelector('.admin-login');
        box.style.animation = 'none';
        box.offsetHeight; // reflow
        box.style.animation = 'shake 0.5s';
        setTimeout(() => box.style.animation = '', 600);
        showToast('Incorrect password ❌');
      }
    });
    return;
  }

  const progress = Storage.getProgress();

  // Build these strings BEFORE the template literal to avoid nested backtick issues
  const currentDest = itinerary.dates.find(d => d.id === progress.currentId);
  const currentDestLabel = currentDest ? currentDest.flag + ' ' + escapeHtml(currentDest.city) : 'None set';

  let selectOptions = '';
  itinerary.dates.forEach(d => {
    const isSelected = progress.currentId === d.id;
    selectOptions += '<option value="' + d.id + '"' + (isSelected ? ' selected' : '') + '>'
      + (isSelected ? '📍 ' : '') + d.flag + ' ' + escapeHtml(d.city) + ' — ' + escapeHtml(d.theme)
      + '</option>';
  });

  let tableRows = itinerary.dates.map(date => {
    const isCompleted = progress.completedIds.includes(date.id);
    const isCurrent   = progress.currentId === date.id;

    let statusBadge = `<span style="color:#888; font-size:0.85rem;">🔒 Locked</span>`;
    if (isCompleted) statusBadge = `<span style="color:var(--accent); font-size:0.85rem;">✅ Done</span>`;
    if (isCurrent)   statusBadge = `<span style="color:var(--secondary); font-size:0.85rem;">📍 Current</span>`;

    const completeBtnHtml = !isCompleted
      ? `<button class="action-btn complete" data-id="${date.id}" title="Mark as completed" style="background:rgba(6,214,160,0.2); border:1px solid rgba(6,214,160,0.4);">✓ Done</button>`
      : `<button class="action-btn uncomplete" data-id="${date.id}" title="Undo completion" style="background:rgba(255,100,100,0.2); border:1px solid rgba(255,100,100,0.4);">↩ Undo</button>`;

    const setCurrentHtml = !isCurrent
      ? `<button class="action-btn set-current" data-id="${date.id}" title="Set as current destination" style="background:rgba(255,209,102,0.2); border:1px solid rgba(255,209,102,0.4);">📍 Set Current</button>`
      : `<span style="font-size:0.75rem; color:var(--secondary);">← Active</span>`;

    return `
      <tr style="${isCurrent ? 'background:rgba(255,209,102,0.07);' : ''}">
        <td style="font-weight:600; color:#aaa; font-size:0.9rem;">${date.id}</td>
        <td style="font-size:0.95rem;">${date.flag} <strong>${escapeHtml(date.city)}</strong></td>
        <td style="font-size:0.8rem; color:#aaa;">${escapeHtml(date.theme)}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
            ${completeBtnHtml}
            ${setCurrentHtml}
            <button class="action-btn edit" data-id="${date.id}" title="Upload memory photo" style="background:rgba(255,94,138,0.15); border:1px solid rgba(255,94,138,0.3);">📸 Photo</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="admin-container">
      <!-- Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2 style="color:var(--light); margin-bottom:4px;">Control Centre</h2>
          <p style="color:#aaa; font-size:0.85rem;">Manage Parchiti's Love Journey</p>
        </div>
        <button id="logout-btn" class="action-btn" style="background:rgba(255,80,80,0.2); border:1px solid rgba(255,80,80,0.3); padding:8px 16px;">🔒 Lock</button>
      </div>

      <!-- Stats -->
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-bottom:2rem;">
        <div class="glass-panel" style="padding:1.5rem; text-align:center;">
          <div style="font-size:2rem; font-weight:bold; color:var(--primary);">${progress.completedIds.length}</div>
          <div style="font-size:0.75rem; color:#aaa; text-transform:uppercase; letter-spacing:1px; margin-top:4px;">Completed</div>
        </div>
        <div class="glass-panel" style="padding:1.5rem; text-align:center;">
          <div style="font-size:2rem; font-weight:bold; color:var(--secondary);">${progress.xp}</div>
          <div style="font-size:0.75rem; color:#aaa; text-transform:uppercase; letter-spacing:1px; margin-top:4px;">Total XP</div>
        </div>
        <div class="glass-panel" style="padding:1.5rem; text-align:center;">
          <div style="font-size:2rem; font-weight:bold; color:var(--accent);">${itinerary.dates.length - progress.completedIds.length}</div>
          <div style="font-size:0.75rem; color:#aaa; text-transform:uppercase; letter-spacing:1px; margin-top:4px;">Remaining</div>
        </div>
      </div>

      <!-- Quick controls -->
      <div class="glass-panel" style="padding:1.5rem; margin-bottom:1.5rem;">
        <h3 style="margin-bottom:0.5rem; font-size:1rem; color:rgba(255,255,255,0.7); font-weight:600; letter-spacing:1px; text-transform:uppercase;">Current Destination</h3>
        <p style="color:#aaa; font-size:0.8rem; margin-bottom:1rem;">Choose the active destination — the boarding pass and map will update instantly.</p>
        <select id="quick-current-select" style="width:100%; background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.25); border-radius:10px; padding:12px 16px; font-size:1rem; font-family:var(--font-ui); outline:none; cursor:pointer;">
          ${selectOptions}
        </select>
        <p id="quick-set-status" style="margin-top:8px; font-size:0.8rem; color:var(--accent);">Currently: ${currentDestLabel}</p>
      </div>

      <!-- Itinerary table -->
      <div class="glass-panel" style="padding:1.5rem; overflow-x:auto;">
        <h3 style="margin-bottom:1rem; font-size:1rem; color:rgba(255,255,255,0.7); font-weight:600; letter-spacing:1px; text-transform:uppercase;">Full Itinerary</h3>
        <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
              <th style="padding:8px 12px; text-align:left; color:#aaa; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">#</th>
              <th style="padding:8px 12px; text-align:left; color:#aaa; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">Destination</th>
              <th style="padding:8px 12px; text-align:left; color:#aaa; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">Theme</th>
              <th style="padding:8px 12px; text-align:left; color:#aaa; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">Status</th>
              <th style="padding:8px 12px; text-align:left; color:#aaa; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>

      <!-- Add new destination -->
      <div class="glass-panel" style="padding:1.5rem; margin-top:1.5rem;">
        <h3 style="margin-bottom:1rem; font-size:1rem; color:rgba(255,255,255,0.7); font-weight:600; letter-spacing:1px; text-transform:uppercase;">➕ Add New Destination</h3>
        <form id="add-dest-form" style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
          <div>
            <label style="display:block; font-size:0.75rem; color:#aaa; margin-bottom:4px;">City *</label>
            <input type="text" id="new-city" required placeholder="e.g. Kyoto" style="width:100%; box-sizing:border-box; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:10px 12px; color:white; font-family:var(--font-ui); font-size:0.9rem; outline:none;">
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; color:#aaa; margin-bottom:4px;">Country *</label>
            <input type="text" id="new-country" required placeholder="e.g. Japan" style="width:100%; box-sizing:border-box; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:10px 12px; color:white; font-family:var(--font-ui); font-size:0.9rem; outline:none;">
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; color:#aaa; margin-bottom:4px;">Flag Emoji</label>
            <input type="text" id="new-flag" placeholder="🇯🇵" style="width:100%; box-sizing:border-box; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:10px 12px; color:white; font-family:var(--font-ui); font-size:0.9rem; outline:none;">
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; color:#aaa; margin-bottom:4px;">Theme / Activity *</label>
            <input type="text" id="new-theme" required placeholder="e.g. Temple Walk" style="width:100%; box-sizing:border-box; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:10px 12px; color:white; font-family:var(--font-ui); font-size:0.9rem; outline:none;">
          </div>
          <div style="grid-column:1 / -1;">
            <label style="display:block; font-size:0.75rem; color:#aaa; margin-bottom:4px;">Description</label>
            <textarea id="new-desc" rows="2" placeholder="A short romantic description of this date idea..." style="width:100%; box-sizing:border-box; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:10px 12px; color:white; font-family:var(--font-ui); font-size:0.9rem; outline:none; resize:vertical;"></textarea>
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; color:#aaa; margin-bottom:4px;">Stamp Icon</label>
            <select id="new-stamp" style="width:100%; box-sizing:border-box; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:10px 12px; color:white; font-family:var(--font-ui); font-size:0.9rem; outline:none;">
              ${STAMP_TYPES.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; color:#aaa; margin-bottom:4px;">Accent Color</label>
            <input type="color" id="new-color" value="#FF5E8A" style="width:100%; height:42px; box-sizing:border-box; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:4px; cursor:pointer;">
          </div>
          <div style="grid-column:1 / -1;">
            <button type="submit" class="btn-primary" style="width:100%; margin-top:0.25rem;">➕ Add Destination</button>
          </div>
        </form>
      </div>

      <!-- Danger zone -->
      <div style="margin-top:1.5rem; padding:1.5rem; border:1px solid rgba(255,80,80,0.2); border-radius:12px; background:rgba(255,80,80,0.05);">
        <h3 style="color:rgba(255,120,120,0.9); margin-bottom:0.5rem; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;">⚠ Danger Zone</h3>
        <p style="color:#aaa; font-size:0.8rem; margin-bottom:1rem;">This will erase ALL progress, photos, and stamps.</p>
        <button id="reset-btn" style="background:rgba(255,0,0,0.25); border:1px solid rgba(255,0,0,0.4); color:#ff9090; padding:10px 20px; border-radius:8px; cursor:pointer; font-family:var(--font-ui); font-size:0.9rem; font-weight:600;">💣 Reset Everything</button>
      </div>
    </div>

    <!-- Photo Upload Modal -->
    <div id="photo-modal" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" id="modal-close-btn">&times;</button>
        <h3 style="margin-bottom:0.5rem;">Upload Memory Photo</h3>
        <p style="font-size:0.8rem; color:#aaa; margin-bottom:1.5rem;">Upload a photo for this destination's memory gallery.</p>
        <input type="file" id="photo-upload" accept="image/*" style="margin-bottom:1rem; width:100%; color:white;">
        <div id="photo-preview" style="width:100%; height:180px; background:#222; border-radius:10px; margin-bottom:1rem; background-size:cover; background-position:center; display:flex; align-items:center; justify-content:center; color:#666; font-size:0.85rem;">No image selected</div>
        <input type="hidden" id="photo-dest-id">
        <button id="save-photo-btn" class="btn-primary" style="width:100%;">💾 Save Photo</button>
      </div>
    </div>
  `;

  // ── Events ──

  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('lp_auth');
    renderAdmin(itinerary, achievementsData);
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Are you absolutely sure? All progress, photos, and stamps will be permanently erased.')) {
      localStorage.clear();
      sessionStorage.clear();
      location.reload();
    }
  });

  // Quick set current — saves immediately on dropdown change, no button needed
  document.getElementById('quick-current-select').addEventListener('change', async (e) => {
    const newId = parseInt(e.target.value);
    const p = Storage.getProgress();
    p.currentId = newId;
    await Storage.saveProgress(p);
    const d = itinerary.dates.find(x => x.id === newId);
    const label = d ? d.flag + ' ' + d.city : '#' + newId;
    renderAdmin(itinerary, achievementsData);
    showToast(`📍 Current destination set to ${label}`);
  });

  // Add new destination
  document.getElementById('add-dest-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('new-city').value.trim();
    const country = document.getElementById('new-country').value.trim();
    const theme = document.getElementById('new-theme').value.trim();
    const desc = document.getElementById('new-desc').value.trim();
    const flag = document.getElementById('new-flag').value.trim() || '📍';
    const stamp = document.getElementById('new-stamp').value;
    const color = document.getElementById('new-color').value;

    if (!city || !country || !theme) {
      showToast('Please fill in City, Country and Theme ❌');
      return;
    }

    const nextId = itinerary.dates.length ? Math.max(...itinerary.dates.map(d => d.id)) + 1 : 1;
    const newDate = {
      id: nextId,
      city,
      country,
      flag,
      theme,
      description: desc || `A special date idea in ${city}.`,
      stamp,
      color,
      xp: 100
    };

    itinerary.dates.push(newDate);

    // Disable submit button and show saving state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Saving...'; }

    // Await the save so we know it reached the DB
    await Storage.saveItinerary(itinerary);

    showToast(`✅ Added ${flag} ${city} to the itinerary!`);
    renderAdmin(itinerary, achievementsData);
  });

  // Mark complete
  container.querySelectorAll('.complete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const dateInfo = itinerary.dates.find(d => d.id === id);
      const p = Storage.getProgress();
      if (!p.completedIds.includes(id)) {
        p.completedIds.push(id);
        p.xp += (dateInfo && dateInfo.xp) ? dateInfo.xp : 100;
        // Auto-advance current to next uncompleted
        if (p.currentId === id) {
          const next = itinerary.dates.find(d => d.id > id && !p.completedIds.includes(d.id));
          if (next) p.currentId = next.id;
        }
        await Storage.saveProgress(p);
        showToast(`✅ Stamped: ${dateInfo ? dateInfo.city : '#' + id}!`);
        import('../animations.js').then(({ launchConfetti }) => launchConfetti());
        renderAdmin(itinerary, achievementsData);
      }
    });
  });

  // Undo completion
  container.querySelectorAll('.uncomplete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const dateInfo = itinerary.dates.find(d => d.id === id);
      const p = Storage.getProgress();
      p.completedIds = p.completedIds.filter(x => x !== id);
      p.xp = Math.max(0, p.xp - ((dateInfo && dateInfo.xp) ? dateInfo.xp : 100));
      await Storage.saveProgress(p);
      showToast(`↩ Undid completion for ${dateInfo ? dateInfo.city : '#' + id}`);
      renderAdmin(itinerary, achievementsData);
    });
  });

  // Set current from table row
  container.querySelectorAll('.set-current').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const p = Storage.getProgress();
      p.currentId = id;
      await Storage.saveProgress(p);
      const d = itinerary.dates.find(x => x.id === id);
      showToast(`📍 Current set to ${d ? d.flag + ' ' + d.city : '#' + id}`);
      renderAdmin(itinerary, achievementsData);
    });
  });

  // Photo modal
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('photo-modal').classList.remove('active');
  });

  container.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      document.getElementById('photo-dest-id').value = id;
      const preview  = document.getElementById('photo-preview');
      preview.style.backgroundImage = 'none';
      preview.textContent = 'Loading...';
      document.getElementById('photo-upload').value = '';
      document.getElementById('photo-modal').classList.add('active');
      const existing = await Storage.getPhoto(id);
      if (existing) {
        preview.style.backgroundImage = `url(${existing})`;
        preview.textContent = '';
      } else {
        preview.style.backgroundImage = 'none';
        preview.textContent = 'No image selected';
      }
    });
  });

  document.getElementById('photo-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const preview = document.getElementById('photo-preview');
        preview.textContent = '';
        preview.style.backgroundImage = `url(${ev.target.result})`;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('save-photo-btn').addEventListener('click', () => {
    const id   = document.getElementById('photo-dest-id').value;
    const file = document.getElementById('photo-upload').files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const ok = await Storage.savePhoto(id, ev.target.result);
        showToast(ok ? '📸 Photo saved!' : '❌ Could not save photo — storage may be full');
        document.getElementById('photo-modal').classList.remove('active');
      };
      reader.readAsDataURL(file);
    } else {
      document.getElementById('photo-modal').classList.remove('active');
    }
  });
}
