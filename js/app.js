// ========== APP MODULE ==========
// Main game loop, screen navigation, level selection.

let level = 1;
let score = 0;
let streak = 0;
let questionNum = 0;
let currentAnswer = 0;
let answering = false;

function setLevel(l) {
  level = l;
  document.getElementById('btnL1').classList.toggle('selected', l === 1);
  document.getElementById('btnL2').classList.toggle('selected', l === 2);
  document.getElementById('btnL3').classList.toggle('selected', l === 3);
  startGame();
}

function startGame() {
  score = 0;
  streak = 0;
  questionNum = 0;
  updateScoreDisplay(score, streak);
  updateTotalScoreDisplay(Scores.getPlayerTotal(Player.name));
  nextQuestion();
}

function nextQuestion() {
  if (questionNum >= QUESTIONS_PER_ROUND) {
    endRound();
    return;
  }
  questionNum++;
  answering = false;

  const q = generateQuestion(level);
  currentAnswer = q.answer;

  // Update animal buddy
  document.getElementById('animalBuddy').src = randomAnimal();

  // Display problem
  const problemEl = document.getElementById('problemDisplay');
  if (q.wordText) {
    problemEl.className = 'problem word-problem';
    problemEl.textContent = q.wordText;
  } else {
    problemEl.className = 'problem';
    problemEl.innerHTML =
      `${q.a} <span class="operator">${q.opSymbol}</span> ${q.b} <span class="equals">=</span> <span class="blank">?</span>`;
  }

  // Generate and display choices
  const choices = generateChoices(q.answer, level);
  const grid = document.getElementById('choicesGrid');
  grid.innerHTML = '';
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice;
    btn.onclick = () => handleAnswer(btn, choice);
    grid.appendChild(btn);
  });

  // Spawn bonus fly (random chance)
  maybeSpawnFly();

  // Clear feedback
  const fb = document.getElementById('feedbackMsg');
  fb.textContent = '';
  fb.className = 'feedback';

  // Reset card state
  document.getElementById('questionCard').className = 'question-card';

  // Update progress
  updateProgress(questionNum, QUESTIONS_PER_ROUND);
}

function handleAnswer(btn, chosen) {
  if (answering) return;
  answering = true;
  removeFly(); // remove fly when answering

  const isCorrect = chosen === currentAnswer;
  const card = document.getElementById('questionCard');
  const fb = document.getElementById('feedbackMsg');
  const allBtns = document.querySelectorAll('.choice-btn');

  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    Audio_.playCorrect();
    score++;
    streak++;
    btn.classList.add('correct-answer');
    card.className = 'question-card correct';
    const msg = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
    fb.textContent = msg;
    fb.className = 'feedback show-correct';
    spawnFloatPoint(btn);
    if (streak >= 3) launchConfetti(4);
    else launchConfetti(2);

    // Update running total display
    const currentTotal = Scores.getPlayerTotal(Player.name) + score + (score === QUESTIONS_PER_ROUND ? 5 : 0);
    updateTotalScoreDisplay(Scores.getPlayerTotal(Player.name) + score);
  } else {
    Audio_.playWrong();
    streak = 0;
    card.className = 'question-card wrong';
    const msg = negativeMessages[Math.floor(Math.random() * negativeMessages.length)];
    fb.textContent = msg;
    fb.className = 'feedback show-wrong';
    allBtns.forEach(b => {
      if (parseInt(b.textContent) === currentAnswer) b.classList.add('correct-answer');
      else if (b === btn) b.classList.add('wrong-answer');
    });
  }

  updateScoreDisplay(score, streak);

  setTimeout(nextQuestion, isCorrect ? 900 : 1400);
}

function endRound() {
  const isPerfect = score === QUESTIONS_PER_ROUND;
  const roundPoints = Scores.calculateRoundScore(score, QUESTIONS_PER_ROUND);

  // Save score to leaderboard
  Scores.addRoundScore(Player.name, roundPoints);

  // Update total display
  updateTotalScoreDisplay(Scores.getPlayerTotal(Player.name));

  // Show celebration
  showCelebration(score, QUESTIONS_PER_ROUND, roundPoints, isPerfect);
}

/** Called after welcome screen submit — starts everything */
function initGame() {
  loadQuestions().then(() => startGame());
}

// ========== BOOT ==========
document.addEventListener('DOMContentLoaded', () => {
  Audio_.init();
  seedSplatters();
  seedLeaves();
  Player.showWelcomeScreen();
});
