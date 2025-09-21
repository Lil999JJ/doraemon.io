class DoraemonTamagotchi {
  constructor() {
    this.doraemon = document.querySelector('.doraemon');
    this.gameContainer = null;
    
    // Estados vitales (0-100)
    this.stats = {
      hunger: 80,      // Hambre (0 = muy hambriento, 100 = lleno)
      sleep: 70,       // Sueño (0 = muy cansado, 100 = descansado)
      happiness: 85,   // Felicidad (0 = triste, 100 = muy feliz)
      health: 90       // Salud (0 = enfermo, 100 = saludable)
    };
    
    // Sistema de tiempo
    this.lastUpdate = Date.now();
    this.gameStartTime = Date.now();
    
    // Logros
    this.achievements = {
      firstFeed: false,
      firstSleep: false,
      firstPlay: false,
      perfectDay: false,
      weekSurvival: false,
      happyWeek: false
    };
    
    // Estados del juego
    this.gameRunning = true;
    this.currentMood = 'normal';
    this.level = 1;
    this.experience = 0;
    
    // Frases específicas del Tamagotchi
    this.careMessages = {
      hungry: [
        "¡Tengo hambre! ¿Tienes dorayakis?",
        "Mi estómago está rugiendo...",
        "¡Hora de comer algo delicioso!"
      ],
      sleepy: [
        "Tengo mucho sueño...",
        "Necesito una siesta",
        "Mis ojos se están cerrando..."
      ],
      sad: [
        "Me siento un poco triste",
        "¿Puedes jugar conmigo?",
        "Necesito un poco de diversión"
      ],
      sick: [
        "No me siento muy bien...",
        "Creo que necesito medicina",
        "¡Ay, mi estómago!"
      ],
      happy: [
        "¡Me siento genial!",
        "¡Gracias por cuidarme tan bien!",
        "¡Estoy súper feliz contigo!"
      ]
    };
    
    this.init();
  }
  
  init() {
    this.createGameUI();
    this.loadProgress();
    this.setupGameDoraemon();
    this.startGameLoop();
    this.bindEvents();
    this.updateDisplay();
    this.updateDoraemonExpression();
  }
  
  setupGameDoraemon() {
    // Obtener el Doraemon del juego
    this.gameDoraemon = document.getElementById('gameDoraemon');
    this.gameEyes = this.gameDoraemon.querySelectorAll('.eyeball');
    this.gameMouth = this.gameDoraemon.querySelector('.mouth');
    this.gameSpeechBubble = document.getElementById('gameSpeechBubble');
    this.gameSpeechText = document.getElementById('gameSpeechText');
    
    // Inicializar el sistema de parpadeo para el Doraemon del juego
    this.startGameBlinking();
  }
  
  createGameUI() {
    // Crear contenedor principal del juego
    this.gameContainer = document.createElement('div');
    this.gameContainer.className = 'tamagotchi-game';
    this.gameContainer.innerHTML = `
      <div class="game-layout">
        <!-- Panel Izquierdo - Stats y Controles -->
        <div class="left-panel">
          <div class="game-header-compact">
            <button class="close-game-btn" id="closeGame">❌</button>
            <h3>Cuida a Doraemon</h3>
            <div class="level-info-compact">
              <span>Nv.<span id="level">${this.level}</span></span>
              <span>EXP: <span id="experience">${this.experience}</span>/100</span>
            </div>
          </div>
          
          <div class="stats-compact">
            <div class="stat-item">
              <span class="stat-icon">🍽️</span>
              <div class="stat-progress">
                <div class="progress-mini hunger" style="width: ${this.stats.hunger}%"></div>
              </div>
              <span class="stat-num">${Math.round(this.stats.hunger)}%</span>
            </div>
            
            <div class="stat-item">
              <span class="stat-icon">😴</span>
              <div class="stat-progress">
                <div class="progress-mini sleep" style="width: ${this.stats.sleep}%"></div>
              </div>
              <span class="stat-num">${Math.round(this.stats.sleep)}%</span>
            </div>
            
            <div class="stat-item">
              <span class="stat-icon">😊</span>
              <div class="stat-progress">
                <div class="progress-mini happiness" style="width: ${this.stats.happiness}%"></div>
              </div>
              <span class="stat-num">${Math.round(this.stats.happiness)}%</span>
            </div>
            
            <div class="stat-item">
              <span class="stat-icon">❤️</span>
              <div class="stat-progress">
                <div class="progress-mini health" style="width: ${this.stats.health}%"></div>
              </div>
              <span class="stat-num">${Math.round(this.stats.health)}%</span>
            </div>
          </div>
          
          <div class="action-buttons-compact">
            <button class="action-btn-mini feed-btn" id="feedBtn">
              <span class="btn-icon-mini">🍩</span>
              <span class="btn-text-mini">Alimentar</span>
            </button>
            <button class="action-btn-mini sleep-btn" id="sleepBtn">
              <span class="btn-icon-mini">💤</span>
              <span class="btn-text-mini">Dormir</span>
            </button>
            <button class="action-btn-mini play-btn" id="playBtn">
              <span class="btn-icon-mini">🎮</span>
              <span class="btn-text-mini">Jugar</span>
            </button>
            <button class="action-btn-mini medicine-btn" id="medicineBtn">
              <span class="btn-icon-mini">💊</span>
              <span class="btn-text-mini">Medicina</span>
            </button>
          </div>
        </div>

        <!-- Panel Central - Doraemon -->
        <div class="center-panel">
          <div class="game-doraemon-container-compact">
            <div class="doraemon game-doraemon" id="gameDoraemon">
              <div class="head">
                <div class="face">
                  <div class="eyes">
                    <div class="eye eye-left">
                      <div class="eyeball"></div>
                    </div>
                    <div class="eye eye-right">
                      <div class="eyeball"></div>
                    </div>
                  </div>

                  <div class="mouth">
                    <div class="mouth-top">
                      <div class="mouth-top-right-round">
                        <div class="mouth-top-right-round-fixer"></div>
                      </div>
                    </div>
                    <div class="mouth-bottom">
                      <div class="mouth-bottom-ui">
                        <div class="tongue-container">
                          <div class="tongue"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="nose"></div>
                  <div class="mustache">
                    <div class="mustache-hair mustache-left-hair"></div>
                    <div class="mustache-hair mustache-left-hair"></div>
                    <div class="mustache-hair mustache-left-hair"></div>
                    <div class="mustache-hair mustache-right-hair"></div>
                    <div class="mustache-hair mustache-right-hair"></div>
                    <div class="mustache-hair mustache-right-hair"></div>
                  </div>
                </div>
              </div>
              <div class="belt">
                <div class="bell-ring">
                  <div class="bell-ring-strip"></div>
                  <div class="bell-ring-strip"></div>
                </div>
              </div>

              <div class="body-part">
                <div class="left-body-part">
                  <div class="leg left-leg"></div>
                </div>
                <div class="right-body-part">
                  <div class="leg right-leg"></div>
                </div>
                <div class="left-hand"></div>
                <div class="right-hand"></div>
                <div class="dress">
                  <div class="pocket"></div>
                </div>
                <div class="leg-gap"></div>
              </div>
            </div>
            
            <!-- Globo de diálogo compacto -->
            <div class="game-speech-bubble-compact" id="gameSpeechBubble">
              <div class="speech-text-compact" id="gameSpeechText">¡Hola! Cuídame bien.</div>
            </div>
          </div>
        </div>

        <!-- Panel Derecho - Logros y Estado -->
        <div class="right-panel">
          <div class="achievements-compact">
            <h4>🏆 Logros</h4>
            <div class="achievements-mini" id="achievementsGrid">
              <!-- Los logros se generarán dinámicamente -->
            </div>
          </div>
          
          <div class="game-status-compact">
            <div class="game-time-compact">
              <span class="time-icon">⏰</span>
              <span id="gameTime">0 min</span>
            </div>
            <div class="mood-indicator">
              <span class="mood-label">Estado:</span>
              <span class="mood-emoji" id="moodEmoji">😊</span>
              <span class="mood-text" id="moodText">Normal</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Insertar en el DOM
    const container = document.querySelector('.container');
    container.appendChild(this.gameContainer);
    
    this.createAchievementsBadges();
  }
  
  createAchievementsBadges() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    const achievementsList = [
      { id: 'firstFeed', name: 'Comida', icon: '🍩', desc: 'Primera vez' },
      { id: 'firstSleep', name: 'Siesta', icon: '💤', desc: 'Primera vez' },
      { id: 'firstPlay', name: 'Juego', icon: '🎮', desc: 'Primera vez' },
      { id: 'perfectDay', name: 'Día Perfecto', icon: '⭐', desc: 'Stats > 80%' },
      { id: 'weekSurvival', name: 'Supervivencia', icon: '🏆', desc: '7 días' },
      { id: 'happyWeek', name: 'Felicidad', icon: '🌟', desc: 'Semana feliz' }
    ];
    
    achievementsGrid.innerHTML = '';
    achievementsList.forEach(achievement => {
      const badge = document.createElement('div');
      badge.className = `achievement-mini ${this.achievements[achievement.id] ? 'unlocked' : 'locked'}`;
      badge.innerHTML = `
        <div class="achievement-icon-mini">${achievement.icon}</div>
        <div class="achievement-name-mini">${achievement.name}</div>
      `;
      badge.title = achievement.desc; // Tooltip
      achievementsGrid.appendChild(badge);
    });
  }
  
  bindEvents() {
    document.getElementById('feedBtn').addEventListener('click', () => this.feedDoraemon());
    document.getElementById('sleepBtn').addEventListener('click', () => this.putToSleep());
    document.getElementById('playBtn').addEventListener('click', () => this.playWithDoraemon());
    document.getElementById('medicineBtn').addEventListener('click', () => this.giveMedicine());
    document.getElementById('closeGame').addEventListener('click', () => this.closeGame());
  }
  
  feedDoraemon() {
    if (this.stats.hunger >= 95) {
      this.showGameMessage("¡Ya estoy muy lleno! No puedo comer más.");
      return;
    }
    
    this.stats.hunger = Math.min(100, this.stats.hunger + 25);
    this.stats.happiness = Math.min(100, this.stats.happiness + 10);
    this.gainExperience(5);
    
    this.animateGameDoraemonHappy();
    setTimeout(() => this.updateDoraemonExpression(), 2000);
    
    this.showGameMessage("¡Mmm! ¡Delicioso! Gracias por la comida.");
    this.checkAchievement('firstFeed');
    this.updateDisplay();
  }
  
  putToSleep() {
    if (this.stats.sleep >= 95) {
      this.showGameMessage("¡No tengo sueño ahora mismo!");
      return;
    }
    
    this.stats.sleep = Math.min(100, this.stats.sleep + 30);
    this.stats.health = Math.min(100, this.stats.health + 5);
    this.gainExperience(3);
    
    this.animateGameDoraemonSleepy();
    setTimeout(() => this.updateDoraemonExpression(), 3000);
    
    this.showGameMessage("Ahh... una buena siesta me vendrá bien. ZZZ...");
    this.checkAchievement('firstSleep');
    this.updateDisplay();
  }
  
  playWithDoraemon() {
    if (this.stats.happiness >= 95) {
      this.showGameMessage("¡Ya estoy súper feliz!");
      return;
    }
    
    this.stats.happiness = Math.min(100, this.stats.happiness + 20);
    this.stats.hunger = Math.max(0, this.stats.hunger - 5);
    this.stats.sleep = Math.max(0, this.stats.sleep - 3);
    this.gainExperience(8);
    
    this.gameDoraemon.classList.add('excited');
    this.gameDoraemon.style.animation = 'bounce 0.6s ease';
    setTimeout(() => {
      this.gameDoraemon.classList.remove('excited');
      this.updateDoraemonExpression();
    }, 2000);
    
    this.showGameMessage("¡Qué divertido! Me encanta jugar contigo.");
    this.checkAchievement('firstPlay');
    this.updateDisplay();
  }
  
  giveMedicine() {
    if (this.stats.health >= 90) {
      this.showGameMessage("¡Me siento perfecto! No necesito medicina.");
      return;
    }
    
    this.stats.health = Math.min(100, this.stats.health + 25);
    this.stats.happiness = Math.max(0, this.stats.happiness - 5);
    this.gainExperience(3);
    
    this.gameDoraemon.classList.add('surprised');
    this.gameDoraemon.style.animation = 'surprised 0.4s ease';
    setTimeout(() => {
      this.gameDoraemon.classList.remove('surprised');
      this.updateDoraemonExpression();
    }, 1500);
    
    this.showGameMessage("¡Puaj! No me gusta la medicina, pero ya me siento mejor.");
    this.updateDisplay();
  }
  
  startGameLoop() {
    // Sistema de tiempo más interactivo - cada 15 segundos
    this.gameInterval = setInterval(() => {
      if (!this.gameRunning) return;
      
      // Reducir stats automáticamente cada 15 segundos (más dinámico)
      this.stats.hunger = Math.max(0, this.stats.hunger - 3); // Baja más rápido
      this.stats.sleep = Math.max(0, this.stats.sleep - 2);
      this.stats.happiness = Math.max(0, this.stats.happiness - 1.5);
      
      // La salud se reduce más rápido si otros stats están muy bajos
      if (this.stats.hunger < 20 || this.stats.sleep < 20) {
        this.stats.health = Math.max(0, this.stats.health - 2.5);
      } else if (this.stats.hunger < 40 || this.stats.sleep < 40) {
        this.stats.health = Math.max(0, this.stats.health - 1);
      }
      
      this.updateMood();
      this.updateDisplay();
      this.checkCriticalStates();
      this.checkAchievements();
      this.saveProgress();
      
      // Mostrar mensaje de estado cada vez que bajan los stats
      this.showRandomStatusMessage();
      
    }, 15000); // Cada 15 segundos
    
    // Actualizar tiempo de juego cada minuto
    setInterval(() => {
      this.updateGameTime();
    }, 60000);
    
    // Sistema de parpadeo más frecuente para mayor vida
    setInterval(() => {
      if (this.gameEyes && Math.random() > 0.6) { // 40% de probabilidad
        this.blinkAnimation();
      }
    }, 2000); // Cada 2 segundos
    
    // Movimientos aleatorios cada 8-12 segundos
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% probabilidad
        this.randomMovement();
      }
    }, Math.random() * 4000 + 8000); // Entre 8-12 segundos
  }
  
  updateMood() {
    const avgStat = (this.stats.hunger + this.stats.sleep + this.stats.happiness + this.stats.health) / 4;
    
    if (this.stats.health < 30) {
      this.currentMood = 'sick';
    } else if (this.stats.hunger < 30) {
      this.currentMood = 'hungry';
    } else if (this.stats.sleep < 30) {
      this.currentMood = 'sleepy';
    } else if (this.stats.happiness < 40) {
      this.currentMood = 'sad';
    } else if (avgStat > 80) {
      this.currentMood = 'happy';
    } else {
      this.currentMood = 'normal';
    }
    
    this.updateDoraemonExpression();
    this.updateMoodIndicator();
  }
  
  updateMoodIndicator() {
    const moodEmoji = document.getElementById('moodEmoji');
    const moodText = document.getElementById('moodText');
    
    if (moodEmoji && moodText) {
      const moodData = {
        'sick': { emoji: '🤒', text: 'Enfermo' },
        'hungry': { emoji: '🍽️', text: 'Hambriento' },
        'sleepy': { emoji: '😴', text: 'Somnoliento' },
        'sad': { emoji: '😢', text: 'Triste' },
        'happy': { emoji: '😊', text: 'Feliz' },
        'normal': { emoji: '🙂', text: 'Normal' }
      };
      
      const currentMoodData = moodData[this.currentMood] || moodData['normal'];
      moodEmoji.textContent = currentMoodData.emoji;
      moodText.textContent = currentMoodData.text;
    }
  }
  
  updateDoraemonExpression() {
    if (!this.gameDoraemon) return;
    
    // Limpiar TODAS las clases de animaciones anteriores
    this.gameDoraemon.classList.remove(
      'happy', 'excited', 'surprised', 'sleepy', 'sick', 'hungry', 'sad',
      'emotion-happy', 'emotion-sad', 'emotion-excited', 
      'emotion-sick', 'emotion-sleepy', 'emotion-normal'
    );
    
    // Aplicar nueva expresión específica para game-doraemon
    switch(this.currentMood) {
      case 'sick':
        this.gameDoraemon.classList.add('emotion-sick');
        this.showGameMessage(this.getRandomMessage('sick'));
        break;
      case 'hungry':
        this.gameDoraemon.classList.add('emotion-excited'); // Emocionado por comida
        this.showGameMessage(this.getRandomMessage('hungry'));
        break;
      case 'sleepy':
        this.gameDoraemon.classList.add('emotion-sleepy');
        this.showGameMessage(this.getRandomMessage('sleepy'));
        break;
      case 'sad':
        this.gameDoraemon.classList.add('emotion-sad');
        this.showGameMessage(this.getRandomMessage('sad'));
        break;
      case 'happy':
        this.gameDoraemon.classList.add('emotion-happy');
        this.showGameMessage("¡Doraemon se siente genial! 🎉");
        break;
      default:
        this.gameDoraemon.classList.add('emotion-normal');
    }
  }
  
  animateGameDoraemonHappy() {
    this.gameEyes.forEach(eye => {
      eye.style.transform = 'scaleY(0.8)';
      eye.style.transition = 'transform 0.3s ease';
    });
    this.gameDoraemon.style.animation = 'float 2s ease-in-out infinite';
  }
  
  animateGameDoraemonSick() {
    this.gameEyes.forEach(eye => {
      eye.style.transform = 'scaleY(0.5) scaleX(0.9)';
      eye.style.transition = 'transform 0.5s ease';
    });
    this.gameDoraemon.style.animation = 'sickSway 3s ease-in-out infinite';
  }
  
  animateGameDoraemonHungry() {
    this.gameEyes.forEach(eye => {
      eye.style.transform = 'scale(1.1)';
      eye.style.transition = 'transform 0.3s ease';
    });
    this.gameDoraemon.style.animation = 'hungryBob 1.5s ease-in-out infinite';
  }
  
  animateGameDoraemonSleepy() {
    this.gameEyes.forEach(eye => {
      eye.style.transform = 'scaleY(0.3)';
      eye.style.transition = 'transform 0.5s ease';
    });
    this.gameDoraemon.style.animation = 'sleepy 3s ease-in-out infinite';
  }
  
  animateGameDoraemonSad() {
    this.gameEyes.forEach(eye => {
      eye.style.transform = 'scaleY(0.7) scaleX(0.9)';
      eye.style.transition = 'transform 0.4s ease';
    });
    this.gameDoraemon.style.animation = 'sadDroop 2s ease-in-out infinite';
  }
  
  animateGameDoraemonNormal() {
    this.gameEyes.forEach(eye => {
      eye.style.transform = 'scale(1)';
      eye.style.transition = 'transform 0.3s ease';
    });
    this.gameDoraemon.style.animation = '';
  }
  
  startGameBlinking() {
    setInterval(() => {
      if (this.gameEyes && Math.random() > 0.7) {
        this.gameEyes.forEach(eye => {
          const originalTransform = eye.style.transform;
          eye.style.transform = 'scaleY(0.1)';
          setTimeout(() => {
            eye.style.transform = originalTransform;
          }, 150);
        });
      }
    }, 3000);
  }
  
  checkCriticalStates() {
    if (this.stats.health < 20) {
      this.showGameMessage(this.getRandomMessage('sick'));
    } else if (this.stats.hunger < 25) {
      this.showGameMessage(this.getRandomMessage('hungry'));
    } else if (this.stats.sleep < 25) {
      this.showGameMessage(this.getRandomMessage('sleepy'));
    } else if (this.stats.happiness < 30) {
      this.showGameMessage(this.getRandomMessage('sad'));
    }
  }
  
  getRandomMessage(type) {
    const messages = this.careMessages[type];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  showGameMessage(message) {
    if (this.gameSpeechText) {
      this.gameSpeechText.textContent = message;
      this.gameSpeechBubble.style.opacity = '1';
      this.gameSpeechBubble.style.animation = 'pulse 0.5s ease';
      
      setTimeout(() => {
        this.gameSpeechBubble.style.animation = '';
        this.gameSpeechBubble.style.opacity = '0.8';
      }, 500);
    }
  }
  
  showMessage(message) {
    const statusElement = document.getElementById('statusMessage');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.style.animation = 'pulse 0.5s ease';
      setTimeout(() => {
        statusElement.style.animation = '';
      }, 500);
    }
  }
  
  gainExperience(amount) {
    this.experience += amount;
    if (this.experience >= 100) {
      this.levelUp();
    }
  }
  
  levelUp() {
    this.level++;
    this.experience = 0;
    this.showMessage(`¡Felicidades! ¡Subiste al nivel ${this.level}!`);
    
    // Bonus por subir de nivel
    this.stats.happiness = Math.min(100, this.stats.happiness + 20);
    this.stats.health = Math.min(100, this.stats.health + 10);
  }
  
  checkAchievement(achievementId) {
    if (!this.achievements[achievementId]) {
      this.achievements[achievementId] = true;
      this.showAchievementUnlocked(achievementId);
    }
  }
  
  checkAchievements() {
    // Día perfecto
    if (!this.achievements.perfectDay && 
        this.stats.hunger > 80 && this.stats.sleep > 80 && 
        this.stats.happiness > 80 && this.stats.health > 80) {
      this.checkAchievement('perfectDay');
    }
    
    // Supervivencia de una semana
    const playTime = Date.now() - this.gameStartTime;
    if (!this.achievements.weekSurvival && playTime > 7 * 24 * 60 * 60 * 1000) {
      this.checkAchievement('weekSurvival');
    }
  }
  
  showAchievementUnlocked(achievementId) {
    this.showGameMessage("🏆 ¡Nuevo logro desbloqueado!");
    this.createAchievementsBadges(); // Actualizar visualización
  }
  
  updateDisplay() {
    // Actualizar barras de stats compactas
    Object.keys(this.stats).forEach(stat => {
      const progressBar = document.querySelector(`.progress-mini.${stat}`);
      const statValue = document.querySelector(`.stat-item:has(.${stat}) .stat-num`);
      if (progressBar && statValue) {
        progressBar.style.width = `${this.stats[stat]}%`;
        statValue.textContent = `${Math.round(this.stats[stat])}%`;
      }
    });
    
    // Actualizar nivel y experiencia
    const levelEl = document.getElementById('level');
    const expEl = document.getElementById('experience');
    if (levelEl) levelEl.textContent = this.level;
    if (expEl) expEl.textContent = this.experience;
  }
  
  updateGameTime() {
    const playTime = Math.floor((Date.now() - this.gameStartTime) / 60000);
    document.getElementById('gameTime').textContent = `${playTime} min`;
  }
  
  saveProgress() {
    const gameData = {
      stats: this.stats,
      achievements: this.achievements,
      level: this.level,
      experience: this.experience,
      gameStartTime: this.gameStartTime
    };
    localStorage.setItem('doraemonTamagotchi', JSON.stringify(gameData));
  }
  
  loadProgress() {
    const savedData = localStorage.getItem('doraemonTamagotchi');
    if (savedData) {
      const gameData = JSON.parse(savedData);
      this.stats = gameData.stats || this.stats;
      this.achievements = gameData.achievements || this.achievements;
      this.level = gameData.level || this.level;
      this.experience = gameData.experience || this.experience;
      this.gameStartTime = gameData.gameStartTime || this.gameStartTime;
    }
  }
  
  closeGame() {
    this.gameRunning = false;
    this.saveProgress();
    this.gameContainer.remove();
    
    // Mostrar nuevamente el botón de inicio
    const startButton = document.getElementById('startTamagotchi');
    if (startButton) {
      startButton.style.display = 'block';
    }
  }
  
  // Nuevos métodos para mayor interactividad
  showRandomStatusMessage() {
    const statusMessages = [
      "Doraemon necesita atención...",
      "Los stats están bajando...",
      "¡Cuida bien a Doraemon!",
      "El tiempo pasa volando...",
      "Doraemon siente los cambios...",
      "¡Mantén los stats altos!",
      "La vida de Doraemon depende de ti..."
    ];
    
    const randomMessage = statusMessages[Math.floor(Math.random() * statusMessages.length)];
    this.showGameMessage(randomMessage);
  }
  
  blinkAnimation() {
    if (this.gameEyes) {
      this.gameEyes.forEach(eye => {
        const originalTransform = eye.style.transform;
        eye.style.transform = 'scaleY(0.1)';
        eye.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
          eye.style.transform = originalTransform;
          eye.style.transition = 'transform 0.2s ease';
        }, 150);
      });
    }
  }
  
  randomMovement() {
    if (!this.gameDoraemon) return;
    
    const movements = [
      'bounce 0.8s ease-in-out',
      'float 1.2s ease-in-out',
      'wiggle 0.6s ease-in-out',
      'tiltLeft 0.8s ease-in-out',
      'tiltRight 0.8s ease-in-out'
    ];
    
    const randomMovement = movements[Math.floor(Math.random() * movements.length)];
    const originalAnimation = this.gameDoraemon.style.animation;
    
    this.gameDoraemon.style.animation = randomMovement;
    
    setTimeout(() => {
      this.gameDoraemon.style.animation = originalAnimation;
    }, 1000);
  }
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startTamagotchi');
  
  if (startButton) {
    startButton.addEventListener('click', () => {
      // Ocultar el botón de inicio
      startButton.style.display = 'none';
      
      // Inicializar el juego
      setTimeout(() => {
        window.doraemonTamagotchi = new DoraemonTamagotchi();
      }, 500);
    });
  }
});