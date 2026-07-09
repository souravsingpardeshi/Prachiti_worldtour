export function createStars(container, count = 200) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${star.style.width};
      animation-delay: ${Math.random() * 3}s;
      animation-duration: ${Math.random() * 2 + 1}s;
    `;
    container.appendChild(star);
  }
}

export function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#FF5E8A', '#FFD166', '#A8E6CF', '#FFF'];
  
  for(let i=0; i<150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 10 + 5,
      c: colors[Math.floor(Math.random() * colors.length)],
      v: Math.random() * 3 + 2,
      r: Math.random() * 360,
      rs: (Math.random() - 0.5) * 10,
      xs: (Math.random() - 0.5) * 5
    });
  }
  
  let animationFrame;
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    particles.forEach(p => {
      p.y += p.v;
      p.x += p.xs;
      p.r += p.rs;
      if (p.y < canvas.height) active = true;
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r * Math.PI / 180);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    
    if(active) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  cancelAnimationFrame(animationFrame);
  render();
}

export function createSparkles(x, y, container) {
  for(let i=0; i<15; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.innerHTML = '✨';
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 50 + 20;
    
    sparkle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      font-size: ${Math.random() * 10 + 10}px;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      opacity: 1;
    `;
    
    container.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`;
      sparkle.style.opacity = '0';
    }, 50);
    
    setTimeout(() => sparkle.remove(), 650);
  }
}
