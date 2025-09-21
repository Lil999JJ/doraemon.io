class DoraemonAnimator {
  constructor() {
    this.doraemon = document.querySelector('.doraemon');
    this.eyes = document.querySelectorAll('.eyeball');
    this.mouth = document.querySelector('.mouth');
    this.phraseContainer = null;
    this.currentExpression = 'normal';
    this.animationInterval = null;
    
    // Frases características de Doraemon
    this.phrases = [
      "¡Estoy aquí para ayudarte, Nobita!",
      "¡Hola! Soy Doraemon del futuro",
      "¿Necesitas algo de mi bolsillo mágico?",
      "¡Vamos a vivir una aventura!",
      "La amistad es lo más importante",
      "¡No te preocupes, todo saldrá bien!",
      "Los dorayakis son mi comida favorita",
      "¡Recuerda siempre ser valiente!",
      "El futuro está lleno de posibilidades",
      "¡Sonríe, la vida es hermosa!"
    ];
    
    this.expressions = [
      'happy',
      'excited', 
      'surprised',
      'normal',
      'sleepy',
      'sad'
    ];
    
    this.init();
  }
  
  init() {
    this.createPhraseContainer();
    this.startAnimation();
    this.addClickListener();
  }
  
  createPhraseContainer() {
    // Crear contenedor para las frases
    this.phraseContainer = document.createElement('div');
    this.phraseContainer.className = 'doraemon-phrase';
    this.phraseContainer.style.cssText = `
      position: absolute;
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border: 3px solid #298abf;
      border-radius: 20px;
      padding: 15px 20px;
      font-family: 'Arial', sans-serif;
      font-size: 14px;
      font-weight: bold;
      color: #333;
      max-width: 250px;
      text-align: center;
      opacity: 0;
      z-index: 1000;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      transition: opacity 0.3s ease;
    `;
    
    // Crear la cola del globo de diálogo
    const tail = document.createElement('div');
    tail.style.cssText = `
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-top: 15px solid white;
    `;
    
    const tailBorder = document.createElement('div');
    tailBorder.style.cssText = `
      position: absolute;
      bottom: -18px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 18px solid transparent;
      border-right: 18px solid transparent;
      border-top: 18px solid #298abf;
    `;
    
    this.phraseContainer.appendChild(tailBorder);
    this.phraseContainer.appendChild(tail);
    
    // Agregar al contenedor de Doraemon
    const container = document.querySelector('.container');
    container.style.position = 'relative';
    container.appendChild(this.phraseContainer);
  }
  
  showPhrase() {
    const randomPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
    this.phraseContainer.textContent = randomPhrase;
    this.phraseContainer.style.opacity = '1';
    
    // Ocultar frase después de 3 segundos
    setTimeout(() => {
      this.phraseContainer.style.opacity = '0';
    }, 3000);
  }
  
  changeExpression(expression) {
    this.currentExpression = expression;
    
    // Remover clases anteriores de expresiones básicas
    this.doraemon.classList.remove('happy', 'excited', 'surprised', 'normal', 'sleepy');
    
    // Remover clases de emociones corporales completas
    this.doraemon.classList.remove(
      'emotion-happy', 'emotion-sad', 'emotion-excited', 
      'emotion-sick', 'emotion-sleepy', 'emotion-normal'
    );
    
    // Aplicar nueva expresión corporal completa
    switch(expression) {
      case 'happy':
        this.doraemon.classList.add('emotion-happy');
        break;
      case 'excited':
        this.doraemon.classList.add('emotion-excited');
        break;
      case 'surprised':
        this.doraemon.classList.add('emotion-excited'); // Usar excited para surprised
        break;
      case 'sleepy':
        this.doraemon.classList.add('emotion-sleepy');
        break;
      case 'sad':
        this.doraemon.classList.add('emotion-sad');
        break;
      default:
        this.doraemon.classList.add('emotion-normal');
        this.animateNormal();
    }
  }
  
  animateHappy() {
    // Solo animar ojos ligeramente (parpadeo feliz)
    this.eyes.forEach(eye => {
      eye.style.transform = 'scaleY(0.8)';
      eye.style.transition = 'transform 0.3s ease';
    });
    
    // Movimiento flotante suave para todo Doraemon
    this.doraemon.style.animation = 'float 2s ease-in-out infinite';
  }
  
  animateExcited() {
    // Ojos ligeramente más grandes sin exagerar
    this.eyes.forEach(eye => {
      eye.style.transform = 'scale(1.1)';
      eye.style.transition = 'transform 0.3s ease';
    });
    
    // Movimiento de rebote para todo Doraemon
    this.doraemon.style.animation = 'bounce 0.6s ease';
  }
  
  animateSurprised() {
    // Ojos ligeramente más abiertos
    this.eyes.forEach(eye => {
      eye.style.transform = 'scale(1.15)';
      eye.style.transition = 'transform 0.2s ease';
    });
    
    // Movimiento de sorpresa (pequeño salto hacia atrás)
    this.doraemon.style.animation = 'surprised 0.4s ease';
  }
  
  animateSleepy() {
    // Ojos medio cerrados (efecto sueño)
    this.eyes.forEach(eye => {
      eye.style.transform = 'scaleY(0.4)';
      eye.style.transition = 'transform 0.5s ease';
    });
    
    // Movimiento de balanceo suave para simular sueño
    this.doraemon.style.animation = 'sleepy 3s ease-in-out infinite';
  }
  
  animateNormal() {
    // Resetear todos los estilos de los ojos
    this.eyes.forEach(eye => {
      eye.style.transform = 'scale(1)';
      eye.style.transition = 'transform 0.3s ease';
    });
    
    // Detener todas las animaciones del cuerpo
    this.doraemon.style.animation = '';
  }
  
  blinkAnimation() {
    this.eyes.forEach(eye => {
      eye.style.transform = 'scaleY(0.1)';
      setTimeout(() => {
        eye.style.transform = `scaleY(${this.currentExpression === 'sleepy' ? '0.3' : '1'})`;
      }, 150);
    });
  }
  
  startAnimation() {
    // Animación automática cada 5-8 segundos
    this.animationInterval = setInterval(() => {
      // Cambiar expresión aleatoria
      const randomExpression = this.expressions[Math.floor(Math.random() * this.expressions.length)];
      this.changeExpression(randomExpression);
      
      // Mostrar frase aleatoria
      setTimeout(() => {
        this.showPhrase();
      }, 500);
      
      // Volver a normal después de un tiempo
      setTimeout(() => {
        this.changeExpression('normal');
      }, 4000);
      
    }, Math.random() * 3000 + 5000); // Entre 5-8 segundos
    
    // Parpadeo periódico
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% de probabilidad de parpadear
        this.blinkAnimation();
      }
    }, 2000);
  }
  
  addClickListener() {
    // Hacer clic en Doraemon para activar animación
    this.doraemon.addEventListener('click', () => {
      const randomExpression = this.expressions[Math.floor(Math.random() * this.expressions.length)];
      this.changeExpression(randomExpression);
      this.showPhrase();
      
      // Volver a normal después de 3 segundos
      setTimeout(() => {
        this.changeExpression('normal');
      }, 3000);
    });
  }
  
  // Método para detener animaciones
  stopAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar un poco para que Doraemon esté completamente renderizado
  setTimeout(() => {
    window.doraemonAnimator = new DoraemonAnimator();
  }, 500);
});