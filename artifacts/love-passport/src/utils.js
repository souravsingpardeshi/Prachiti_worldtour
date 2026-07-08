export function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

export function generateSVG(type, color = '#FF5E8A') {
  const svgs = {
    plane: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-4 4-2.5-.5L2 16l3.5 1 1 3.5 1.5-.5-.5-2.5 4-4 4 6c.4-.2.7-.6.6-1.1z"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    heartOutline: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    'coffee-cup': `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
    pasta: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="m16 8.5-2.5 1.5-2.5-1.5-2.5 1.5-2.5-1.5"/><path d="M4 22h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2z"/><path d="M12 14v8"/><path d="M8 14v8"/><path d="M16 14v8"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    camera: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    compass: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    stamp: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M3 13v8h18v-8"/><path d="M12 11V3"/><path d="M8 3h8"/><circle cx="12" cy="15" r="4"/></svg>`,
    flamenco: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M12 2v20M8 6h8M6 10h12M4 14h16M8 18h8"/></svg>`, // Abstract representation
    sunset: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M12 10a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4z"/><path d="M3 18h18M12 2v2M4.22 5.22l1.42 1.42M19.78 5.22l-1.42 1.42M2 14h2M20 14h2"/></svg>`,
    lotus: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M12 22C12 22 2 15 2 9C2 5.5 5 3 8 3C10 3 11.5 4.5 12 6C12.5 4.5 14 3 16 3C19 3 22 5.5 22 9C22 15 12 22 12 22Z"/></svg>`,
    bollywood: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
    food: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`
  };
  // Alias custom itinerary stamp names to the closest available icon
  // so admin-added / existing destinations render distinct marks instead
  // of all silently falling back to the heart icon.
  const aliases = {
    'coffee-bean': 'coffee-cup',
    'colosseum': 'compass',
    'eiffel': 'compass',
    'torii': 'compass',
    'gyeongbok': 'compass',
    'lotus-stamp': 'lotus',
    'sombrero': 'sunset',
    'fan': 'flamenco',
    'parthenon': 'compass',
    'mountain': 'sunset',
    'opera-house': 'compass',
    'taj': 'compass',
    'bookmark': 'stamp',
    'wheel': 'compass',
    'brush': 'bollywood',
    'hole-in-one': 'compass',
    'strike': 'stamp',
    'jellyfish': 'moon',
    'planet': 'moon',
    'rocket': 'plane',
  };

  return svgs[type] || svgs[aliases[type]] || svgs.heart;
}

export function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
       .toString()
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}
