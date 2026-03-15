// ========== REWARDS MODULE ==========
// Video rewards and celebration overlay logic.

const rewardVideos = [
  'Assets/Videos/Axolotl_Plays_Tennis_Cheers_Loudly.mp4',
  'Assets/Videos/Axolotl_Swims_Plays_with_Dolphin.mp4',
  'Assets/Videos/Baby_Giraffe_Wins_Basketball_Game.mp4',
  'Assets/Videos/Elephant-video.mp4',
  'Assets/Videos/Fawn_Video.mp4',
  'Assets/Videos/Happy_Panda_Jumps_on_Trampoline.mp4',
  'Assets/Videos/Panda_Eats_Bamboo_Video_Generated.mp4'
];

function showCelebration(score, questionsPerRound, roundPoints, isPerfect) {
  const pct = Math.round((score / questionsPerRound) * 100);

  if (pct === 100) {
    // Perfect score: show video overlay
    Audio_.pauseMusic();
    const video = document.getElementById('rewardVideo');
    video.src = rewardVideos[Math.floor(Math.random() * rewardVideos.length)];
    document.getElementById('videoPlayAgainBtn').classList.remove('visible');
    video.play();
    video.onended = function() {
      document.getElementById('videoPlayAgainBtn').classList.add('visible');
    };
    document.getElementById('videoOverlay').classList.add('show');
    launchConfetti(15);
    return;
  }

  let title, sub;
  if (pct >= 80) { title = 'Super Star!'; sub = 'Outstanding work!'; }
  else if (pct >= 60) { title = 'Great Job!'; sub = 'Keep practicing - you\'re doing amazing!'; }
  else { title = 'Keep Going!'; sub = 'Every mistake helps you learn!'; }

  document.getElementById('celebAnimal').src = randomAnimal();
  document.getElementById('celebTitle').textContent = title;
  document.getElementById('celebSub').textContent = sub;
  document.getElementById('celebScore').textContent = `${score} / ${questionsPerRound}`;

  // Show points earned
  const pointsEl = document.getElementById('celebPoints');
  if (isPerfect) {
    pointsEl.innerHTML = `+${score} points <span class="celeb-bonus">+5 bonus!</span> = ${roundPoints} pts`;
  } else {
    pointsEl.textContent = `+${roundPoints} points`;
  }

  document.getElementById('celebrationOverlay').classList.add('show');
  launchConfetti(10);
}

function closeVideoAndPlayAgain() {
  const video = document.getElementById('rewardVideo');
  video.pause();
  video.src = '';
  document.getElementById('videoOverlay').classList.remove('show');
  Audio_.resumeMusic();

  // Show high scores after perfect score video
  const playerName = Player.name;
  Scores.showHighScores(playerName);
}

function playAgain() {
  document.getElementById('celebrationOverlay').classList.remove('show');

  // Show high scores
  const playerName = Player.name;
  Scores.showHighScores(playerName);
}

function dismissHighScoresAndPlay() {
  Scores.hideHighScores();
  startGame();
}
