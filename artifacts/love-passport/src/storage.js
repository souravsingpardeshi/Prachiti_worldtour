// LocalStorage wrapper
export const Storage = {
  get: (key) => JSON.parse(localStorage.getItem('lp_' + key) || 'null'),
  set: (key, val) => localStorage.setItem('lp_' + key, JSON.stringify(val)),
  
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
