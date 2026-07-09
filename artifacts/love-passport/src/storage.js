// LocalStorage wrapper, hardened against storage being unavailable/evicted
// on some Android Chrome setups (private mode, storage pressure, etc).
// Falls back to an in-memory cache so the app still works within the
// session even if persistence fails, and logs a warning so it's diagnosable.
const memoryFallback = {};

// Memory photos are base64 images and can easily be several MB each —
// storing them as localStorage strings alongside progress/itinerary was
// the actual cause of "added places disappear after refresh": once a
// couple of photos pushed the origin over its ~5-10MB localStorage quota,
// EVERY subsequent write (including the itinerary with admin-added
// destinations) started throwing and silently failed to persist.
// Photos now live in IndexedDB, which has a much larger, separate quota,
// so they can never crowd out the small itinerary/progress data.
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
  
  // Photos — stored in IndexedDB (see note above), not localStorage.
  // Falls back to legacy localStorage keys for photos saved before this
  // change, and migrates them into IndexedDB on first read.
  getPhoto: async (id) => {
    try {
      const fromDb = await idbGet('photo_' + id);
      if (fromDb !== null) return fromDb;
    } catch (err) {
      console.warn('[Storage] IndexedDB photo read failed for', id, err);
    }
    // Legacy fallback: a photo saved by an older version of the app.
    const legacy = Storage.get('photo_' + id);
    if (legacy) {
      idbSet('photo_' + id, legacy).catch(() => {});
    }
    return legacy;
  },
  savePhoto: async (id, base64) => {
    try {
      await idbSet('photo_' + id, base64);
      return true;
    } catch (err) {
      console.warn('[Storage] IndexedDB photo write failed for', id, err);
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
