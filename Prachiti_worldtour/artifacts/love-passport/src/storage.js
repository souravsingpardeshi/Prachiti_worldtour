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

export const Storage = {
  initFromApi: async () => {
    try {
      const res = await fetch('/api/passport');
      if (res.ok) {
        const data = await res.json();
        memoryFallback.progress = data.progress;
        memoryFallback.itinerary = data.itinerary;
        memoryFallback.scratched = data.scratched;
      }
    } catch (err) {
      console.error('[Storage] failed to load from API', err);
    }
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
  
  set: (key, val) => {
    memoryFallback[key] = val;
    
    // Save to local storage for offline fallback
    try {
      localStorage.setItem('lp_' + key, JSON.stringify(val));
    } catch (err) {
      console.warn('[Storage] local write failed', err);
    }

    // Save to API asynchronously
    fetch('/api/passport/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: val })
    }).catch(err => {
      console.error('[Storage] API write failed', err);
      Storage._notifyPersistFailure();
    });

    return true;
  },

  _warnedPersistFailure: false,
  _notifyPersistFailure: () => {
    if (Storage._warnedPersistFailure) return;
    Storage._warnedPersistFailure = true;
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = "⚠️ Could not save progress to the server.";
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
  getPhoto: async (id) => {
    // Try to get from API first
    try {
      const res = await fetch(`/api/passport/photo/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.base64) {
          // Cache in IndexedDB
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
      const res = await fetch('/api/passport/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, base64 })
      });
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
