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
    food: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    // Each of the 20 curated stamp types gets its own distinct silhouette
    // instead of being aliased to a shared icon (previously many of these
    // collapsed onto the same "compass" mark, so most stamps looked identical).
    colosseum: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M2 18h20"/><path d="M4 18v-6a8 8 0 0 1 16 0v6"/><line x1="7" y1="12" x2="7" y2="18"/><line x1="10" y1="10" x2="10" y2="18"/><line x1="14" y1="10" x2="14" y2="18"/><line x1="17" y1="12" x2="17" y2="18"/></svg>`,
    eiffel: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M12 2l5 9h-3l2 5h-3l1 6h-4l1-6H8l2-5H7z"/><line x1="4" y1="22" x2="20" y2="22"/></svg>`,
    torii: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><line x1="4" y1="7" x2="20" y2="7"/><line x1="3" y1="4" x2="21" y2="4"/><line x1="6" y1="7" x2="6" y2="22"/><line x1="18" y1="7" x2="18" y2="22"/><line x1="9" y1="10" x2="15" y2="10"/></svg>`,
    gyeongbok: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M4 21V11l8-6 8 6v10"/><path d="M2 11h20"/><line x1="8" y1="21" x2="8" y2="14"/><line x1="16" y1="21" x2="16" y2="14"/><path d="M9 8l3-2 3 2"/></svg>`,
    parthenon: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M2 6l10-4 10 4"/><line x1="2" y1="6" x2="22" y2="6"/><line x1="4" y1="9" x2="4" y2="19"/><line x1="8" y1="9" x2="8" y2="19"/><line x1="12" y1="9" x2="12" y2="19"/><line x1="16" y1="9" x2="16" y2="19"/><line x1="20" y1="9" x2="20" y2="19"/><line x1="2" y1="19" x2="22" y2="19"/><line x1="2" y1="22" x2="22" y2="22"/></svg>`,
    taj: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M12 2c1.5 2 2.5 3.8 2.5 5.5A2.5 2.5 0 0 1 12 10a2.5 2.5 0 0 1-2.5-2.5C9.5 5.8 10.5 4 12 2z"/><path d="M6 22V14a6 6 0 0 1 12 0v8"/><line x1="3" y1="22" x2="21" y2="22"/><line x1="9" y1="22" x2="9" y2="17"/><line x1="15" y1="22" x2="15" y2="17"/></svg>`,
    wheel: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/><line x1="5.6" y1="5.6" x2="9.9" y2="9.9"/><line x1="14.1" y1="14.1" x2="18.4" y2="18.4"/><line x1="18.4" y1="5.6" x2="14.1" y2="9.9"/><line x1="9.9" y1="14.1" x2="5.6" y2="18.4"/></svg>`,
    'opera-house': `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M2 20c1-6 4-8 4-8s3 2 4 8"/><path d="M8 20c1-8 4-11 4-11s3 3 4 11"/><path d="M14 20c1-6 4-8 4-8s3 2 4 8"/><line x1="1" y1="20" x2="23" y2="20"/></svg>`,
    mountain: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M3 20l6-11 4 6 2-3 6 8z"/><circle cx="17" cy="6" r="2"/></svg>`,
    sombrero: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><ellipse cx="12" cy="16" rx="10" ry="3"/><path d="M8 16a4 4 0 0 1 8 0"/><circle cx="12" cy="10" r="1.5"/></svg>`,
    fan: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M12 12L4 6a8 8 0 0 0 0 12z"/><path d="M12 12l8-6a8 8 0 0 1 0 12z"/><path d="M12 12V2"/></svg>`,
    bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z"/></svg>`,
    brush: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M9.06 11.9 4 22l10.1-5.06"/><path d="M12.5 13.5 20 6a2.5 2.5 0 0 0-3.5-3.5l-7.5 7.5"/><path d="M15 6l3 3"/></svg>`,
    'hole-in-one': `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="9" cy="18" r="3"/><line x1="9" y1="15" x2="9" y2="2"/><path d="M9 2l8 3-8 3"/></svg>`,
    strike: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><ellipse cx="12" cy="19" rx="3" ry="2"/><ellipse cx="8" cy="14" rx="2.2" ry="1.6"/><ellipse cx="16" cy="14" rx="2.2" ry="1.6"/><ellipse cx="6" cy="9" rx="1.8" ry="1.3"/><ellipse cx="12" cy="9" rx="1.8" ry="1.3"/><ellipse cx="18" cy="9" rx="1.8" ry="1.3"/></svg>`,
    jellyfish: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M6 10a6 6 0 0 1 12 0c0 2-1 3-6 3s-6-1-6-3z"/><path d="M8 13c0 3-1 4-1 7M12 13v7M16 13c0 3 1 4 1 7"/></svg>`,
    planet: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-20 12 12)"/></svg>`,
    rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M12 2c3 2 5 6 5 10 0 3-1 5-1 5H8s-1-2-1-5c0-4 2-8 5-10z"/><path d="M8 15l-3 5 5-2M16 15l3 5-5-2"/><circle cx="12" cy="9" r="1.5"/></svg>`,
  };
  // Fallback aliases only for stamp names not covered by a bespoke icon above.
  const aliases = {
    'coffee-bean': 'coffee-cup',
    'lotus-stamp': 'lotus',
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
