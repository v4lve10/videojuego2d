// --- CONFIGURACIÓN INICIAL ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const music = document.getElementById('backgroundMusic');

// Ajustar el tamaño del canvas al de su contenedor
canvas.width = canvas.parentElement.clientWidth;
canvas.height = window.innerHeight * 0.7;

let score = 0;
let ghosts = [];
const numGhosts = 10; // Número de fantasmas en pantalla

// Cargar imágenes
const backgroundImage = new Image();
backgroundImage.src = './assets/escenario.jpeg';

const ghostImage = new Image();
ghostImage.src = './assets/fantasma.png';

// --- CLASE PARA LOS FANTASMAS ---
class Ghost {
    constructor() {
        this.radius = 30; // Radio para la detección de clics
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;

        // 1. Asignar una velocidad base aleatoria para cada fantasma
        // Esto hará que algunos fantasmas sean lentos (cerca de 1) y otros rápidos (cerca de 4)
        this.speed = Math.random() * 5 + 1;

        // 2. Calcular la dirección de movimiento de manera aleatoria
        // Se genera un ángulo aleatorio en radianes (un círculo completo)
        const angle = Math.random() * Math.PI * 2;

        // 3. Usar el ángulo y la velocidad para obtener las componentes dx y dy
        // Esto asegura que el fantasma se mueva en una dirección aleatoria
        // pero siempre a la velocidad que le fue asignada en this.speed
        this.dx = Math.cos(angle) * this.speed;
        this.dy = Math.sin(angle) * this.speed;
    }

    // Dibuja el fantasma en el canvas
    draw() {
        ctx.drawImage(ghostImage, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    // Actualiza la posición y maneja los rebotes
    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Rebote en los bordes horizontales
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        // Rebote en los bordes verticales
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.draw();
    }
}


// --- LÓGICA DEL JUEGO ---

// Función para inicializar los fantasmas
function init() {
    ghosts = [];
    for (let i = 0; i < numGhosts; i++) {
        ghosts.push(new Ghost());
    }
    score = 0;
    scoreElement.textContent = score;
}

// Bucle principal de animación
function animate() {
    requestAnimationFrame(animate);
    
    // Dibuja la imagen de fondo
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Actualiza cada fantasma
    ghosts.forEach(ghost => {
        ghost.update();
    });
}

// Función para calcular la distancia entre dos puntos
function getDistance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

// Evento para detectar clics en los fantasmas
canvas.addEventListener('click', (event) => {
    // Inicia la música con la primera interacción del usuario
    music.play().catch(e => console.log("La reproducción automática fue bloqueada"));
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Itera hacia atrás para eliminar elementos de forma segura
    for (let i = ghosts.length - 1; i >= 0; i--) {
        const dist = getDistance(mouseX, mouseY, ghosts[i].x, ghosts[i].y);
        
        // Si el clic está dentro del radio del fantasma
        if (dist < ghosts[i].radius) {
            ghosts.splice(i, 1); // Elimina el fantasma
            score++;
            scoreElement.textContent = score; // Actualiza el contador
            
            // Añade un nuevo fantasma para mantener el número
            ghosts.push(new Ghost());
            break; // Sal del bucle para eliminar solo uno por clic
        }
    }
});

// Inicia el juego cuando las imágenes estén cargadas
backgroundImage.onload = () => {
    init();
    animate();
};