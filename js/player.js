// ========== PLAYER MODULE ==========
// Manages player name entry and persistence via localStorage.

const PLAYER_NAME_KEY = 'mathAdventure_playerName';

const Player = {
  name: '',

  /** Check if a player name is already saved */
  hasSavedName() {
    return !!localStorage.getItem(PLAYER_NAME_KEY);
  },

  /** Get saved player name */
  getSavedName() {
    return localStorage.getItem(PLAYER_NAME_KEY) || '';
  },

  /** Save player name */
  saveName(name) {
    this.name = name.trim();
    localStorage.setItem(PLAYER_NAME_KEY, this.name);
  },

  /** Set name without saving (for session use) */
  setName(name) {
    this.name = name.trim();
  },

  /** Update the page title with player name */
  updateTitle() {
    const titleEl = document.getElementById('gameTitle');
    if (titleEl && this.name) {
      titleEl.innerHTML = `${this.name}'s <br> Math Adventure!`;
    }
  },

  /** Show the welcome screen */
  showWelcomeScreen() {
    const screen = document.getElementById('welcomeScreen');
    const input = document.getElementById('welcomeNameInput');
    const subtitle = document.getElementById('welcomeSubtitle');
    const startBtn = document.getElementById('welcomeStartBtn');
    const gameContainer = document.getElementById('gameContainer');

    // Hide game until name is entered
    gameContainer.style.display = 'none';

    if (this.hasSavedName()) {
      const savedName = this.getSavedName();
      input.value = savedName;
      subtitle.textContent = `Welcome back, ${savedName}!`;
      startBtn.textContent = 'Continue';
      startBtn.disabled = false;
    } else {
      input.value = '';
      subtitle.textContent = 'Enter your name to start playing!';
      startBtn.textContent = 'Start';
      startBtn.disabled = true;
    }

    screen.classList.add('show');
    input.focus();

    // Enable/disable start button based on input
    input.oninput = () => {
      startBtn.disabled = input.value.trim().length === 0;
    };

    // Submit on Enter key
    input.onkeydown = (e) => {
      if (e.key === 'Enter' && input.value.trim().length > 0) {
        this.handleWelcomeSubmit();
      }
    };

    startBtn.onclick = () => this.handleWelcomeSubmit();
  },

  /** Handle welcome form submission */
  handleWelcomeSubmit() {
    const input = document.getElementById('welcomeNameInput');
    const name = input.value.trim();
    if (!name) return;

    this.saveName(name);
    this.updateTitle();

    // Hide welcome, show game
    document.getElementById('welcomeScreen').classList.remove('show');
    document.getElementById('gameContainer').style.display = 'flex';

    // Initialize scores for this player
    Scores.initPlayer(name);

    // Start the game
    if (typeof initGame === 'function') {
      initGame();
    }
  }
};
