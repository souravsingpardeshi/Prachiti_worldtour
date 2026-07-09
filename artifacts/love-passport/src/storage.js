// LocalStorage wrapper, hardened against storage being unavailable/evicted
// on some Android Chrome setups (private mode, storage pressure, etc).
// Falls back to an in-memory cache so the app still works within the
// session even if persistence fails, and logs a warning so it's diagnosable.
const memoryFallback = {};

export const Storage = {
  get: (key) => {
    try {
      const raw = localStorage.getItem('lp_' + key);
      if (raw !== null) return JSON.parse(raw);
    } catch (err) {
      console.warn('[Storage] read failed for', key, err);
    }
    return Object.prototype.hasOwnProperty.call(memoryFallback, key) ? memoryFallback[key] : null;
  },
  set: (key, val) => {
    memoryFallback[key] = val;
    try {
      localStorage.setItem('lp_' + key, JSON.stringify(val));
      return true;
    } catch (err) {
      console.warn('[Storage] write failed for', key, err);
      Storage._notifyPersistFailure();
      return false;
    }
  },

  // Surfaces a one-time visible warning (not just a console log) the first
  // time a write fails, so a broken/full/blocked storage isn't silently
  // hidden behind the in-memory fallback for the rest of the session.
  _warnedPersistFailure: false,
  _notifyPersistFailure: () => {
    if (Storage._warnedPersistFailure) return;
    Storage._warnedPersistFailure = true;
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = "⚠️ Your browser is blocking saved progress — it may not survive a refresh.";
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 6000);
    }
  },
  
  // Game state
  getProgress: () => Storage.get('progress') || { completedIds: [], currentId: 1, xp: 0, hearts: {} },
  saveProgress: (p) => Storage.set('progress', p),
  
  // Admin
  getItinerary: () => Storage.get('itinerary') || null,
  saveItinerary: (it) => Storage.set('itinerary', it),
  
  // Photos
  getPhoto: (id) => Storage.get('photo_' + id),
  savePhoto: (id, base64) => Storage.set('photo_' + id, base64),
  
  // Scratch cards
  getScratched: () => Storage.get('scratched') || [],
  addScratched: (id) => { 
    const s = Storage.getScratched(); 
    if (!s.includes(id)) { 
      s.push(id); 
      Storage.set('scratched', s); 
    } 
  },
};
