// ========== UI MODULE ==========
// DOM updates, progress bar, score display, decorative elements.

const animalImages = [
  'Assets/Images/elephant.jpg',
  'Assets/Images/fawn.jpg',
  'Assets/Images/giraffe.jpg',
  'Assets/Images/koala.jpg',
  'Assets/Images/panda.jpg',
  'Assets/Images/zebra.jpg'
];

const positiveMessages = [
  'Super!', 'Brilliant!', 'Amazing!', 'Great job!', 'Awesome!', 'Perfect!', 'Spot on!', 'Winner!'
];
const negativeMessages = [
  "Oops! Try again!",
  "Not quite - keep going!",
  "Almost! You've got this!",
  "Don't give up!"
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomAnimal() {
  return animalImages[Math.floor(Math.random() * animalImages.length)];
}

function updateScoreDisplay(score, streak) {
  document.getElementById('scoreCorrect').textContent = score;
  const streakEl = document.getElementById('scoreStreak');
  streakEl.innerHTML = streak >= 3
    ? `<span class="streak-fire">\uD83D\uDD25</span>${streak}`
    : streak;
}

function updateTotalScoreDisplay(total) {
  document.getElementById('scoreGrandTotal').textContent = total;
}

function updateProgress(questionNum, total) {
  const pct = ((questionNum - 1) / total) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `Question ${questionNum} of ${total}`;
  document.getElementById('scoreQuestion').textContent = `${questionNum}/${total}`;
}

function launchConfetti(count) {
  const container = document.getElementById('confettiContainer');
  const colors = ['#C4956A', '#8B9E7C', '#C9A44E', '#D4A0A0', '#E8D5C0', '#B5C9A8', '#EDCECE'];
  for (let i = 0; i < count * 5; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = '-20px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (8 + Math.random() * 10) + 'px';
    piece.style.height = (8 + Math.random() * 10) + 'px';
    piece.style.animationDuration = (1 + Math.random() * 2) + 's';
    piece.style.animationDelay = (Math.random() * 0.5) + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

function spawnFloatPoint(btn) {
  const rect = btn.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'float-point';
  el.textContent = '+1';
  el.style.left = (rect.left + rect.width / 2 - 20) + 'px';
  el.style.top = (rect.top - 10) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function seedSplatters() {
  const container = document.getElementById('splatters');
  const colors = ['#C4956A', '#8B9E7C', '#D4A0A0', '#C9A44E', '#E8D5C0'];
  for (let i = 0; i < 15; i++) {
    const dot = document.createElement('div');
    dot.className = 'splatter';
    dot.style.background = colors[Math.floor(Math.random() * colors.length)];
    const size = 4 + Math.random() * 12;
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.left = Math.random() * 100 + 'vw';
    dot.style.top = Math.random() * 100 + 'vh';
    container.appendChild(dot);
  }
}

// ========== BONUS FLY ==========
let activeFly = null;

function maybeSpawnFly() {
  // Remove any existing fly
  if (activeFly) { activeFly.remove(); activeFly = null; }

  // ~30% chance a fly appears on any question
  if (Math.random() > 0.3) return;

  const card = document.getElementById('questionCard');
  const fly = document.createElement('div');
  fly.className = 'bonus-fly';
  fly.textContent = '\uD83E\uDEB0'; // 🪰 fly emoji
  fly.style.setProperty('--fly-duration', (3 + Math.random() * 3) + 's');
  card.style.position = 'relative';
  card.appendChild(fly);
  activeFly = fly;

  fly.addEventListener('click', onFlyTap);
  fly.addEventListener('touchstart', onFlyTap, { passive: true });

  // Auto-remove when animation ends (fly escaped)
  fly.addEventListener('animationend', (e) => {
    if (e.animationName === 'flyPath') {
      fly.remove();
      if (activeFly === fly) activeFly = null;
    }
  });
}

function onFlyTap(e) {
  e.stopPropagation();
  const fly = e.currentTarget;
  if (fly.dataset.caught) return;
  fly.dataset.caught = '1';

  // Award +3 bonus points
  score += 3;
  updateScoreDisplay(score, streak);
  updateTotalScoreDisplay(Scores.getPlayerTotal(Player.name) + score);

  // Play correct sound as reward
  Audio_.playCorrect();

  // Get fly position for effects
  const rect = fly.getBoundingClientRect();
  const card = document.getElementById('questionCard');
  const cardRect = card.getBoundingClientRect();

  // Replace fly with a splat
  const splat = document.createElement('div');
  splat.className = 'fly-splat';
  splat.textContent = '\uD83D\uDCA5'; // 💥
  splat.style.left = (rect.left - cardRect.left) + 'px';
  splat.style.top = (rect.top - cardRect.top) + 'px';
  card.appendChild(splat);

  // Show +3 text
  const bonus = document.createElement('div');
  bonus.className = 'fly-bonus-text';
  bonus.textContent = '+3 Bonus!';
  bonus.style.left = (rect.left - cardRect.left - 10) + 'px';
  bonus.style.top = (rect.top - cardRect.top - 20) + 'px';
  card.appendChild(bonus);

  // Remove fly
  fly.remove();
  activeFly = null;

  // Confetti burst
  launchConfetti(3);

  // Clean up effects
  setTimeout(() => { splat.remove(); bonus.remove(); }, 1200);
}

function removeFly() {
  if (activeFly) { activeFly.remove(); activeFly = null; }
}

function seedLeaves() {
  const leaves = ['\uD83C\uDF3F', '\uD83C\uDF42', '\uD83C\uDF43', '\uD83C\uDF40'];
  for (let i = 0; i < 5; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
    leaf.style.left = Math.random() * 100 + 'vw';
    leaf.style.animationDuration = (15 + Math.random() * 20) + 's';
    leaf.style.animationDelay = (Math.random() * 15) + 's';
    document.body.appendChild(leaf);
  }
}
