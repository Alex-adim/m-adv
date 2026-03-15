// ========== AUDIO MODULE ==========
// Sound effects and background music manager.

const Audio_ = {
  correctSound: new Audio('Assets/Sounds/Soundfx-Completions-Melodic-Success.mp3'),
  wrongSound: new Audio('Assets/Sounds/Tink.aiff'),
  bgMusic: new Audio('Assets/Sounds/music-ES_Adventure Time - Rocket Jr.mp3'),
  musicStarted: false,

  init() {
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.4;

    // Start background music on first user interaction
    document.addEventListener('click', () => {
      if (!this.musicStarted) {
        this.bgMusic.play();
        this.musicStarted = true;
      }
    });
  },

  playCorrect() {
    this.correctSound.currentTime = 0;
    this.correctSound.play();
  },

  playWrong() {
    this.wrongSound.currentTime = 0;
    this.wrongSound.play();
  },

  pauseMusic() {
    this.bgMusic.pause();
  },

  resumeMusic() {
    this.bgMusic.play();
  }
};
