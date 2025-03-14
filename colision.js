const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Configurar dimensiones del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "#f3f3f4";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
        this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed;
        this.isColliding = false;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
        
        // Dibujar el texto en el centro
        context.fillStyle = "#FFFFFF";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
    }

    update(context, circles) {
        this.checkCollision(circles);
        this.draw(context);

        // Actualizar posición
        this.posX += this.dx;
        this.posY += this.dy;

        // Rebote en los bordes
        if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    checkCollision(circles) {
        let isCurrentlyColliding = false;

        for (let other of circles) {
            if (this === other) continue;

            let dx = this.posX - other.posX;
            let dy = this.posY - other.posY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + other.radius) {
                isCurrentlyColliding = true;
                this.color = "#0000FF";
                other.color = "#0000FF";

                // Intercambiar velocidades para simular rebote
                let tempDx = this.dx;
                let tempDy = this.dy;
                this.dx = other.dx;
                this.dy = other.dy;
                other.dx = tempDx;
                other.dy = tempDy;
            }
        }

        // Restaurar el color original si no hay colisión
        if (!isCurrentlyColliding) {
            this.color = this.originalColor;
        }
    }
}

// Crear círculos
let circles = [];
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        let speed = Math.random() * 4 + 1;
        let text = `C${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => circle.update(ctx, circles));
    requestAnimationFrame(animate);
}

generateCircles(10);
animate();
