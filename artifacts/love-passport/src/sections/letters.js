import { Storage } from '../storage.js';

export function renderLetters() {
  const container = document.getElementById('section-love-letter');
  const progress = Storage.getProgress();
  const completedCount = progress.completedIds.length;
  
  const letters = [
    {
      id: 1, req: 0, title: "The Beginning",
      content: `Dear Parchiti,\n\nIf the whole world were a map and our love a journey,\nI would explore every corner just to find my way back to you.\nThis passport is not just a collection of dates —\nit's a promise that with every sunrise, there's a new adventure,\nand with every adventure, there's only you beside me.\n\nHappy birthday, my forever travel buddy.\n\nWith all my love, always,\nSourav ❤️`
    },
    {
      id: 2, req: 10, title: "Halfway There",
      content: `My dearest Parchiti,\n\nSomewhere between coffee dates and stolen smiles,\nbetween late nights and lazy mornings,\nI found my favourite place in the world:\nanywhere that you are.\n\nTen destinations down. Forever more to go.\n\nYours, always,\nSourav`
    },
    {
      id: 3, req: 20, title: "The Real Journey",
      content: `My love,\n\nWe've circled the world —\nthrough pasta nights and flower gardens,\nthrough laughter and moonlight,\nand every single moment has been my favourite memory.\n\nThank you for being my greatest adventure.\nThis is not the end of the journey.\nThis is where the real one begins.\n\nI love you more than every star in every sky of every country we've visited.\n\nForever yours,\nSourav ❤️`
    }
  ];
  
  let lettersHtml = '';
  
  letters.forEach((l, index) => {
    const isUnlocked = completedCount >= l.req;
    
    lettersHtml += `
      <div class="envelope-wrapper ${isUnlocked ? '' : 'locked'}" style="margin-bottom:4rem; position:relative; width:100%; max-width:600px; margin-left:auto; margin-right:auto; perspective:1000px;">
        <div style="text-align:center; margin-bottom:10px;">
          <h3 style="color:${isUnlocked ? 'var(--primary)' : '#666'}; font-family:var(--font-romantic); font-size:2rem;">${l.title}</h3>
          ${!isUnlocked ? `<p style="font-size:0.8rem; color:#888;">Unlocks after ${l.req} stamps (Current: ${completedCount})</p>` : ''}
        </div>
        
        <div class="envelope-body" style="position:relative; width:100%; height:300px; background:#d4c4b7; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.3); transform-style:preserve-3d; transition:transform 0.5s; cursor:${isUnlocked ? 'pointer' : 'default'}; overflow:hidden;">
          <!-- Flap -->
          <div class="flap" style="position:absolute; top:0; left:0; width:100%; height:60%; background:#e3d5ca; clip-path:polygon(0 0, 100% 0, 50% 100%); z-index:10; transform-origin:top; transition:transform 0.8s ease-in-out;"></div>
          
          <!-- Wax Seal -->
          <div class="seal" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:50px; height:50px; background:#8a1c1c; border-radius:50%; z-index:11; box-shadow:inset 0 0 10px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:#d4af37; font-family:serif; font-size:1.5rem; font-weight:bold; transition:opacity 0.3s; opacity:${isUnlocked ? '1' : '0.5'};">S</div>
          
          <!-- Letter paper hidden inside -->
          <div class="letter-paper" style="position:absolute; top:10px; left:5%; width:90%; height:95%; background:#fdfbf7; padding:2rem; box-sizing:border-box; color:#333; font-family:var(--font-romantic); font-size:1.4rem; line-height:1.6; z-index:5; transform:translateY(0); transition:all 1s ease-in-out; border:1px solid #eee;">
            <div style="white-space:pre-wrap;">${l.content}</div>
          </div>
          
          <!-- Envelope front overlay -->
          <div style="position:absolute; bottom:0; left:0; width:100%; height:100%; background:#d4c4b7; clip-path:polygon(0 100%, 50% 40%, 100% 100%); z-index:8;"></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <div style="padding:2rem;">
      <div style="text-align:center; margin-bottom:3rem;">
        <h2 style="font-size:2.5rem; font-family:var(--font-ui); color:var(--light); letter-spacing:4px; font-weight:300;">LETTERS</h2>
        <p style="color:var(--secondary); font-family:var(--font-romantic); font-size:1.5rem;">Words left unspoken...</p>
      </div>
      
      ${lettersHtml}
    </div>
  `;
  
  // Animation logic
  container.querySelectorAll('.envelope-wrapper').forEach(wrapper => {
    if(wrapper.classList.contains('locked')) return;
    
    wrapper.querySelector('.envelope-body').addEventListener('click', function() {
      const flap = this.querySelector('.flap');
      const seal = this.querySelector('.seal');
      const letter = this.querySelector('.letter-paper');
      
      if(flap.style.transform === 'rotateX(180deg)') {
        // close
        letter.style.transform = 'translateY(0) scale(1)';
        letter.style.zIndex = '5';
        setTimeout(() => {
          flap.style.transform = 'rotateX(0deg)';
          seal.style.opacity = '1';
        }, 500);
      } else {
        // open
        seal.style.opacity = '0';
        flap.style.transform = 'rotateX(180deg)';
        setTimeout(() => {
          letter.style.zIndex = '20';
          letter.style.transform = 'translateY(-150px) scale(1.1)';
          letter.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
        }, 800);
      }
    });
  });
}
