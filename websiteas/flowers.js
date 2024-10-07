const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');

// Flower properties
const flowerCount = 10;
const flowerRadius = 30;
const flowers = [];
const bees = [];

// Bee object constructor
function Bee(x, y) {
    this.x = x;
    this.y = y;
    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 2 - 1;
    this.target = null;

    // Draw the bee
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
    };

    // Move the bee
    this.move = function() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
    };

}

// Flower object constructor
function Flower(x, y) {
    this.x = x;
    this.y = y;
    this.watered = false;

    // Draw the flower
    this.draw = function() {
        ctx.beginPath();
        // Petals color
        ctx.fillStyle = this.watered ? 'blue' : 'pink'; // Blue if watered
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5;
            const petalX = this.x + Math.cos(angle) * flowerRadius;
            const petalY = this.y + Math.sin(angle) * flowerRadius;
            ctx.moveTo(this.x, this.y);
            ctx.arc(petalX, petalY, flowerRadius / 2, 0, 2 * Math.PI);
        }
        ctx.fill();
        // Draw center of flower
        ctx.beginPath();
        ctx.arc(this.x, this.y, flowerRadius / 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
    };

    // Check if clicked on flower
    this.isClicked = function(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        return Math.sqrt(dx * dx + dy * dy) < flowerRadius;
    };
}

// Generate random flowers on the canvas
function createFlowers() {
    flowers.length = 0; // Clear old flowers
    for (let i = 0; i < flowerCount; i++) {
        const x = Math.random() * (canvas.width - 2 * flowerRadius) + flowerRadius;
        const y = Math.random() * (canvas.height - 2 * flowerRadius) + flowerRadius;
        flowers.push(new Flower(x, y));
    }
}

// Draw all flowers on the canvas
function drawFlowers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    flowers.forEach(flower => flower.draw());
}

// Handle canvas click
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    flowers.forEach(flower => {
        if (flower.isClicked(mouseX, mouseY)) {
            flower.watered = true; // Water the flower
            drawFlowers(); // Redraw flowers with updated state

            // Find closest bee
            let closestBee = null;
            let closestDistance = Infinity;
            bees.forEach(bee => {
                const distance = Math.sqrt((bee.x - flower.x) ** 2 + (bee.y - flower.y) ** 2);
                if (distance < closestDistance && bee.target === null) {
                    closestDistance = distance;
                    closestBee = bee;
                }
            });
            if (closestBee === null) return; // No available bees

            // Set bee target to flower
            closestBee.dx = (flower.x - closestBee.x) / 100;
            closestBee.dy = (flower.y - closestBee.y) / 100;
            closestBee.target = flower;
        }
    });
});


// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    flowers.forEach(flower => flower.draw()); // Draw flowers
    bees.forEach(bee => {
        bee.move();
        bee.draw();
    });
    bees.forEach(bee => {
        flowers.forEach(flower => {
            if (flower.watered && flower.isClicked(bee.x, bee.y)) {
                flower.watered = false;
                bee.target = null;
                bee.dx = Math.random() * 2 - 1;
                bee.dy = Math.random() * 2 - 1;
                const x = Math.random() * (canvas.width - 2 * flowerRadius) + flowerRadius;
                const y = Math.random() * (canvas.height - 2 * flowerRadius) + flowerRadius;
                flowers.push(new Flower(x, y));
            }
        });
    });
    requestAnimationFrame(animate);
}

animate();

// Resize canvas based on window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (flowers.length === 0) createFlowers(); // Create flowers if not already created
    for (let i = 0; i < flowers.length; i++) {
        if (flowers[i].x > canvas.width || flowers[i].y > canvas.height) {
            flowers[i].x = Math.random() * (canvas.width - 2 * flowerRadius) + flowerRadius;
            flowers[i].y = Math.random() * (canvas.height - 2 * flowerRadius) + flowerRadius;
        }
    }
    if (bees.length === 0) {
        for (let i = 0; i < 5; i++) {
            bees.push(new Bee(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }
    for (let i = 0; i < bees.length; i++) {
        if (bees[i].x > canvas.width || bees[i].y > canvas.height) {
            bees[i].x = Math.random() * canvas.width;
            bees[i].y = Math.random() * canvas.height;
        }
    }r
    drawFlowers();  // Redraw flowers
}

// Initialize and set up resize event
window.addEventListener('resize', resizeCanvas);

// First time initialization
resizeCanvas();
