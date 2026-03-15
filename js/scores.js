// ========== SCORES MODULE ==========
// Scoring engine + high score leaderboard (localStorage).

const HIGH_SCORES_KEY = 'mathAdventure_highScores';

const Scores = {
  /** Calculate points earned for a round */
  calculateRoundScore(correct, total) {
    const bonus = (correct === total) ? 5 : 0;
    return correct + bonus;
  },

  /** Get all high scores sorted descending */
  getHighScores() {
    try {
      const data = localStorage.getItem(HIGH_SCORES_KEY);
      const scores = data ? JSON.parse(data) : [];
      return scores.sort((a, b) => b.totalScore - a.totalScore);
    } catch {
      return [];
    }
  },

  /** Find a player's entry (case-insensitive) */
  findPlayer(name) {
    const scores = this.getHighScores();
    return scores.find(s => s.name.toLowerCase() === name.toLowerCase());
  },

  /** Initialize a player in the scoreboard if not present */
  initPlayer(name) {
    const existing = this.findPlayer(name);
    if (!existing) {
      const scores = this.getHighScores();
      scores.push({
        name: name,
        totalScore: 0,
        roundsPlayed: 0,
        lastPlayed: new Date().toISOString().slice(0, 10)
      });
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
    }
  },

  /** Update a player's score after a round */
  addRoundScore(name, roundPoints) {
    const scores = this.getHighScores();
    const idx = scores.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
    if (idx >= 0) {
      scores[idx].totalScore += roundPoints;
      scores[idx].roundsPlayed += 1;
      scores[idx].lastPlayed = new Date().toISOString().slice(0, 10);
    } else {
      scores.push({
        name: name,
        totalScore: roundPoints,
        roundsPlayed: 1,
        lastPlayed: new Date().toISOString().slice(0, 10)
      });
    }
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
  },

  /** Get the current player's total score */
  getPlayerTotal(name) {
    const entry = this.findPlayer(name);
    return entry ? entry.totalScore : 0;
  },

  /** Show the high score screen */
  showHighScores(playerName) {
    const screen = document.getElementById('highscoreScreen');
    const tbody = document.getElementById('highscoreBody');
    const scores = this.getHighScores().slice(0, 10); // Top 10

    tbody.innerHTML = '';

    if (scores.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="4" style="text-align:center;color:var(--brown);">No scores yet!</td>';
      tbody.appendChild(tr);
    } else {
      scores.forEach((entry, i) => {
        const tr = document.createElement('tr');
        const isCurrentPlayer = entry.name.toLowerCase() === playerName.toLowerCase();
        if (isCurrentPlayer) tr.classList.add('current-player');

        const rankClass = i < 3 ? ` rank-${i + 1}` : '';
        const rankSymbol = i === 0 ? '\u2B50' : (i + 1);

        tr.innerHTML = `
          <td class="rank-col${rankClass}">${rankSymbol}</td>
          <td>${entry.name}</td>
          <td>${entry.totalScore}</td>
          <td>${entry.roundsPlayed}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    screen.classList.add('show');
  },

  /** Hide the high score screen */
  hideHighScores() {
    document.getElementById('highscoreScreen').classList.remove('show');
  }
};
