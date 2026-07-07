export class Router {
  constructor() {
    this.routes = {};
    this.current = null;
  }
  
  on(hash, handler) { 
    this.routes[hash] = handler; 
    return this; 
  }
  
  navigate(hash) {
    if (!hash) hash = '#landing';
    const cleanHash = hash.split('?')[0]; // Handle query params if any
    
    // Animate out current section
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => {
      if (s.classList.contains('active')) {
        s.classList.remove('active');
        s.classList.add('leaving');
      }
    });
    
    setTimeout(() => {
      sections.forEach(s => s.classList.remove('leaving'));
      const target = document.querySelector(cleanHash.replace('#', '#section-'));
      if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
      }
      
      // Update nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === cleanHash) {
          link.classList.add('active');
        }
      });
      
      if (this.routes[cleanHash]) {
        this.routes[cleanHash]();
      }
      
      this.current = cleanHash;
    }, 400);
  }
  
  start() {
    window.addEventListener('hashchange', () => this.navigate(window.location.hash || '#landing'));
    this.navigate(window.location.hash || '#landing');
  }
}
