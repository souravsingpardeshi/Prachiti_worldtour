// In-memory fallback/cache
const memoryFallback = {
  progress: null,
  itinerary: null,
  scratched: null
};

// IndexedDB for Photos cache
const DB_NAME = 'love_passport_photos';
const DB_STORE = 'photos';
let dbPromise = null;

function openPhotoDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('IndexedDB unavailable')); return; }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(DB_STORE)) {
        req.result.createObjectStore(DB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function idbGet(key) {
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, val) {
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(val, key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// Fetch with timeout
function fetchWithTimeout(url, options, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
    fetch(url, options)
      .then(res => { clearTimeout(timer); resolve(res); })
      .catch(err => { clearTimeout(timer); reject(err); });
  });
}

export const Storage = {
  /**
   * Load all data from API.
   * Retries up to 3 times with increasing timeout to handle Render cold starts.
   * Returns true if succeeded, false if all retries failed.
   */
  initFromApi: async (onRetry) => {
    const attempts = [
      { timeout: 15000, label: 'Connecting...' },
      { timeout: 25000, label: 'Waking up server (this can take ~30s on first open)...' },
      { timeout: 35000, label: 'Almost there...' },
    ];

    for (let i = 0; i < attempts.length; i++) {
      try {
        if (i > 0 && onRetry) onRetry(attempts[i].label);
        const res = await fetchWithTimeout('/api/passport', {}, attempts[i].timeout);
        if (res.ok) {
          const data = await res.json();
          memoryFallback.progress = data.progress ?? null;
          memoryFallback.itinerary = data.itinerary ?? null;
          memoryFallback.scratched = data.scratched ?? null;
          console.log('[Storage] loaded from API', data);
          return true;
        }
      } catch (err) {
        console.warn(`[Storage] attempt ${i + 1} failed:`, err.message);
        if (i === attempts.length - 1) {
          console.error('[Storage] all retries failed, using static fallback');
          return false;
        }
        // Short pause before retry
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    return false;
  },

  get: (key) => {
    // If not loaded from API, try localStorage as a last resort
    if (memoryFallback[key] === null) {
      try {
        const raw = localStorage.getItem('lp_' + key);
        if (raw !== null) memoryFallback[key] = JSON.parse(raw);
      } catch (err) {
        console.warn('[Storage] read failed for', key, err);
      }
    }
    return memoryFallback[key];
  },
  
  set: async (key, val) => {
    memoryFallback[key] = val;
    
    // Save to local storage for offline fallback
    try {
      localStorage.setItem('lp_' + key, JSON.stringify(val));
    } catch (err) {
      console.warn('[Storage] local write failed', err);
    }

    // Save to API
    try {
      const res = await fetchWithTimeout('/api/passport/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: val })
      }, 15000);
      if (!res.ok) throw new Error('Server returned ' + res.status);
      console.log('[Storage] saved to API:', key);
    } catch (err) {
      console.error('[Storage] API write failed', err);
      Storage._notifyPersistFailure();
    }

    return true;
  },

  _warnedPersistFailure: false,
  _notifyPersistFailure: () => {
    if (Storage._warnedPersistFailure) return;
    Storage._warnedPersistFailure = true;
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = "⚠️ Could not save to server. Try again in a moment.";
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 8000);
    }
  },
  
  // Game state
  getProgress: () => Storage.get('progress') || { completedIds: [], currentId: 1, xp: 0, hearts: {} },
  saveProgress: (p) => Storage.set('progress', p),
  
  // Admin
  getItinerary: () => Storage.get('itinerary') || null,
  saveItinerary: (it) => Storage.set('itinerary', it),
  
  // Photos
  getPhoto: async (id) => {
    // Try to get from API first
    try {
      const res = await fetchWithTimeout(`/api/passport/photo/${id}`, {}, 10000);
      if (res.ok) {
        const data = await res.json();
        if (data.base64) {
          idbSet('photo_' + id, data.base64).catch(() => {});
          return data.base64;
        }
      }
    } catch (err) {
      console.warn('[Storage] API photo read failed', err);
    }

    // Fallback to IndexedDB
    try {
      const fromDb = await idbGet('photo_' + id);
      if (fromDb !== null) return fromDb;
    } catch (err) {
      console.warn('[Storage] IndexedDB photo read failed', err);
    }

    // Legacy fallback
    const legacy = localStorage.getItem('lp_photo_' + id);
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        idbSet('photo_' + id, parsed).catch(() => {});
        return parsed;
      } catch (e) {}
    }
    return null;
  },
  
  savePhoto: async (id, base64) => {
    // Cache locally first
    try {
      await idbSet('photo_' + id, base64);
    } catch (err) {
      console.warn('[Storage] IndexedDB photo write failed for', id, err);
    }

    // Save to API
    try {
      const res = await fetchWithTimeout('/api/passport/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, base64 })
      }, 15000);
      if (!res.ok) throw new Error('API save failed');
      return true;
    } catch (err) {
      console.error('[Storage] API photo save failed for', id, err);
      Storage._notifyPersistFailure();
      return false;
    }
  },
  
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
