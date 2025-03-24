const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#D8BFD8";

let circles = [];
let circlesDeleted = 0; // Contador de círculos eliminados
const totalCircles = 10; // Número total de círculos

class Circle {
    constructor(x, y, radius, color, speedY) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.speedY = speedY; // Velocidad en el eje Y
    }

    draw(context) {
        context.beginPath();
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
    }

    update(context) {
        // Actualizar posición en Y
        this.posY += this.speedY;

        // Rebotar en los bordes superior e inferior del canvas
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.speedY = -this.speedY; // Invertir dirección en Y
        }

        this.draw(context);
    }

    isPointInside(x, y) {
        // Verifica si el punto (x, y) está dentro del círculo
        return Math.sqrt((x - this.posX) ** 2 + (y - this.posY) ** 2) < this.radius;
    }
}

function generateCircle() {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    let speedY = (Math.random() - 0.5) * 4; // Velocidad aleatoria en Y

    return new Circle(x, y, radius, color, speedY);
}

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        circles.push(generateCircle());
    }
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);

    // Dibuja el contador de círculos eliminados
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Círculos eliminados: ${circlesDeleted}`, window_width - 20, 30);

    // Actualiza y dibuja los círculos
    circles.forEach(circle => circle.update(ctx));
    requestAnimationFrame(animate);
}

// Detectar clics del mouse
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Verificar si se hizo clic en algún círculo
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].isPointInside(mouseX, mouseY)) {
            circles.splice(i, 1); // Eliminar el círculo
            circlesDeleted++; // Incrementar el contador
            circles.push(generateCircle()); // Generar un nuevo círculo
            break;
        }
    }
});

// Generar círculos y comenzar la animación
generateCircles(totalCircles);
animate();