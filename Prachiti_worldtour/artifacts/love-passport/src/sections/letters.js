import { Storage } from '../storage.js';

export function renderLetters() {
  const container = document.getElementById('section-love-letter');
  const progress = Storage.getProgress();
  const completedCount = progress.completedIds.length;

  const letters = [
    {
      id: 1, req: 0, title: "The Beginning", emoji: "💌",
      content: `Dear Parchiti,

If the whole world were a map and our love a journey, I would explore every corner just to find my way back to you.

This passport is not just a collection of dates — it's a promise that with every sunrise, there's a new adventure, and with every adventure, there's only you beside me.

Happy birthday, my forever travel buddy.

With all my love, always,
Sourav ❤️`
    },
    {
      id: 2, req: 10, title: "Halfway There", emoji: "✈️",
      content: `My dearest Parchiti,

Somewhere between coffee dates and stolen smiles, between late nights and lazy mornings, I found my favourite place in the world: anywhere that you are.

Ten destinations down. Forever more to go.

Yours, always,
Sourav`
    },
    {
      id: 3, req: 20, title: "The Real Journey", emoji: "🌕",
      content: `My love,

We've circled the world — through pasta nights and flower gardens, through laughter and moonlight, and every single moment has been my favourite memory.

Thank you for being my greatest adventure. This is not the end of the journey. This is where the real one begins.

I love you more than every star in every sky of every country we've visited.

Forever yours,
Sourav ❤️`
    }
  ];

  let lettersHtml = letters.map((l) => {
    const isUnlocked = completedCount >= l.req;

    if (!isUnlocked) {
      return `
        <div class="letter-card locked-letter">
          <div class="letter-lock-icon">${l.emoji}</div>
          <h3 class="letter-title locked-title">${l.title}</h3>
          <p class="letter-unlock-hint">Unlocks after ${l.req} stamps completed<br><span style="color:var(--secondary);">(${completedCount}/${l.req} done)</span></p>
          <div class="letter-seal-bar"></div>
        </div>
      `;
    }

    return `
      <div class="letter-card unlocked-letter" data-letter-id="${l.id}">
        <!-- Envelope face -->
        <div class="letter-envelope-face" id="envelope-face-${l.id}">
          <div class="envelope-wax-seal">${l.emoji}</div>
          <div class="envelope-meta">
            <h3 class="letter-title">${l.title}</h3>
            <p style="color:rgba(255,255,255,0.6); font-size:0.85rem; margin-top:4px;">Tap to open ↓</p>
          </div>
        </div>

        <!-- Letter content (hidden until opened) -->
        <div class="letter-content-panel" id="letter-content-${l.id}" style="display:none;">
          <div class="letter-paper-sheet">
            <div class="letter-paper-header">
              <span style="font-family:var(--font-romantic); font-size:1.6rem; color:var(--primary);">${l.title}</span>
              <span style="float:right; font-size:1.4rem;">${l.emoji}</span>
            </div>
            <div class="letter-body-text">${l.content.replace(/\n/g, '<br>')}</div>
            <div class="letter-paper-footer">
              <div style="border-top:1px solid #e0d5c5; padding-top:12px; font-family:var(--font-romantic); font-size:1.2rem; color:var(--primary);">With love ❤️</div>
            </div>
          </div>
          <button class="letter-close-btn" id="close-letter-${l.id}">✕ Close Letter</button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="padding: 2rem; max-width: 720px; margin: 0 auto;">
      <div style="text-align:center; margin-bottom:3rem;">
        <h2 style="font-size:2.2rem; font-family:var(--font-ui); color:var(--light); letter-spacing:4px; font-weight:300;">LOVE LETTERS</h2>
        <p style="color:var(--secondary); font-family:var(--font-romantic); font-size:1.4rem;">Words written from the heart...</p>
        ${completedCount < 10 ? `<p style="color:rgba(255,255,255,0.4); font-size:0.8rem; margin-top:8px;">Complete more dates to unlock all letters (${completedCount}/10 done for next)</p>` : ''}
      </div>

      <div style="display:flex; flex-direction:column; gap:2.5rem;">
        ${lettersHtml}
      </div>
    </div>
  `;

  // Attach open/close events
  letters.forEach(l => {
    if (completedCount < l.req) return;

    const face    = document.getElementById(`envelope-face-${l.id}`);
    const content = document.getElementById(`letter-content-${l.id}`);
    const closeBtn= document.getElementById(`close-letter-${l.id}`);

    if (face && content) {
      face.addEventListener('click', () => {
        face.style.display = 'none';
        content.style.display = 'block';
        content.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (closeBtn && content && face) {
      closeBtn.addEventListener('click', () => {
        content.style.display = 'none';
        face.style.display = 'flex';
        face.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  });
}
