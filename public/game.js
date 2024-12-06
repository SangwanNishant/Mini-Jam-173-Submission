const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");

// Set canvas size to the full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const PLAYER_SPEED = 5; // Normal movement speed
const JUMP_SPEED_MULTIPLIER = 2; // Speed multiplier for moving while jumping
const GRAVITY = 2; // Gravity for falling down
const JUMP_FORCE = -30; // Force applied when jumping
const BULLET_SPEED = 10; // Speed of bullets
const MONSTER_SPEED = 2; // Speed of monsters

let playerHealth = 100; // Player health
let level = 1; // Current game level
let totalMonsters = 40; // Total monsters for the current level
let monstersKilled = 0; // Number of monsters killed
let gameOver = false; // Game over state
let bullets = []; // Bullets array
let maxBullets = 5; // Max number of bullets per magazine
let currentBullets = 0; // Number of bullets currently fired
let bulletReloading = false; // Bullet reload state
let reloadTime = 500; // Reload time in ms
let reloadTimer = 0; // Timer for reloading bullets

// Player object
const player = {
    x: 300, // Horizontal position
    y: 485, // Initial vertical position
    width: 110,
    height: 110,
    velocityY: 0, // Vertical velocity (for jumping and falling)
    jumping: false, // Whether the player is currently jumping
    originalY: 485, // The ground level position
    facing: "right", // Direction the player is facing ("right" or "left")
    image: new Image(),
};

// Player image loading
player.image.src = "Assets/player 1.png";

// Background image loading
const bgImg = new Image();
bgImg.src = "Assets/bg1.png";

let bgLoaded = false;
bgImg.onload = function () {
    bgLoaded = true;
    if (player.image.complete) {
        gameloop(); // Start the game loop once the player image is loaded
    }
};

// Monster image
const monsterImage = new Image();
monsterImage.src = "Assets/blue-monster.png";

// Monsters array
const monsters = [];

// Keyboard controls
let keys = {}; // Object to track key presses
document.addEventListener('keydown', function (e) {
    keys[e.key] = true;

    // Trigger jump when either "ArrowUp" or "W" is pressed, and the player is not already jumping
    if ((e.key === "ArrowUp" || e.key === "w") && !player.jumping) {
        player.velocityY = JUMP_FORCE; // Apply upward force
        player.jumping = true; // Mark the player as jumping
    }

    // Shoot bullet on pressing space if not reloading
    if (e.key === " " && !bulletReloading && currentBullets < maxBullets) {
        shootBullet();
    }
});

document.addEventListener('keyup', function (e) {
    keys[e.key] = false;
});

// Game loop function
function gameloop() {
    if (gameOver) {
        displayGameOver();
        return; // Stop the game loop
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the background
    if (bgLoaded) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }

    // Handle horizontal movement with boundaries, allow movement while jumping
    let moveSpeed = PLAYER_SPEED; // Default movement speed

    // If the player is jumping, double the movement speed
    if (player.jumping) {
        moveSpeed = PLAYER_SPEED * JUMP_SPEED_MULTIPLIER;
    }

    if ((keys["ArrowLeft"] || keys["a"]) && player.x > 190) {
        player.x -= moveSpeed; // Move left with increased speed while jumping
        player.facing = "left";
    }
    if ((keys["ArrowRight"] || keys["d"]) && player.x + player.width < canvas.width - 150) {
        player.x += moveSpeed; // Move right with increased speed while jumping
        player.facing = "right";
    }

    // Handle jumping (gravity effect)
    if (player.jumping) {
        player.velocityY += GRAVITY; // Apply gravity
        player.y += player.velocityY; // Update vertical position

        // Check if the player has landed back on the ground
        if (player.y >= player.originalY) {
            player.y = player.originalY; // Reset to ground level
            player.velocityY = 0; // Stop vertical movement
            player.jumping = false; // Allow jumping again
        }
    }

    // Draw the player with flipping logic
    ctx.save();
    if (player.facing === "left") {
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.scale(-1, 1);
        ctx.drawImage(player.image, -player.width / 2, -player.height / 2, player.width, player.height);
    } else {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    }
    ctx.restore();

    // Update and draw bullets
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.direction === "right" ? BULLET_SPEED : -BULLET_SPEED;

        // Remove bullet if it goes off-screen
        if (bullet.x < 0 || bullet.x > canvas.width) {
            bullets.splice(index, 1);
        }

        // Draw bullet
        ctx.fillStyle = "red";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Update and draw monsters
    monsters.forEach((monster, index) => {
        // Increase monster speed as level increases
        const monsterSpeed = MONSTER_SPEED + (level - 1) * 0.5;

        // Move monster toward the player
        monster.x += monster.x < player.x ? monsterSpeed : -monsterSpeed;

        // Check collision with player (initial damage on contact, then small continuous damage)
        if (
            monster.x < player.x + player.width &&
            monster.x + monster.width > player.x &&
            monster.y < player.y + player.height &&
            monster.y + monster.height > player.y
        ) {
            if (!monsterCollision) {
                // First contact - reduce health more
                playerHealth -= 10;
                monsterCollision = true; // Mark that collision has occurred
                collisionStartTime = Date.now(); // Record the time of collision
            } else {
                // Continuous damage after first contact
                const currentTime = Date.now();
                if (currentTime - collisionStartTime >= 500) { // Apply damage every 500ms
                    playerHealth -= 2; // Reduced continuous damage
                    collisionStartTime = currentTime; // Update the collision time
                }
            }
        }

        // Check collision with bullets (monster dies after one bullet)
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < monster.x + monster.width &&
                bullet.x + bullet.width > monster.x &&
                bullet.y < monster.y + monster.height &&
                bullet.y + bullet.height > monster.y
            ) {
                monsters.splice(index, 1); // Remove monster
                bullets.splice(bulletIndex, 1); // Remove bullet
                monstersKilled++;
            }
        });

        // Draw monster
        ctx.drawImage(monsterImage, monster.x, monster.y, monster.width, monster.height);
    });

    // Display player health
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Health: ${playerHealth}`, 20, 30);

    // Display level and monsters left
    ctx.fillText(`Level: ${level}`, 20, 60);
    ctx.fillText(`Monsters Left: ${totalMonsters - monstersKilled}`, 20, 90);

    // Spawn monsters if needed
    if (monsters.length < totalMonsters - monstersKilled && Math.random() < 0.02) {
        spawnMonster();
    }

    // Check for game over
    if (playerHealth <= 0) {
        gameOver = true;
    }

    // Check for level progression
    if (monstersKilled === totalMonsters) {
        nextLevel();
    }

    // Continue the game loop
    requestAnimationFrame(gameloop);
}

// Function to spawn a monster
function spawnMonster() {
    const spawnX = Math.random() < 0.5 ? 0 : canvas.width; // Spawn on left or right edge
    const monster = {
        x: spawnX,
        y: player.originalY + 30,
        width: 50,
        height: 50,
        health: 1, // Monster health is 1 for level 1
    };
    monsters.push(monster);
}

// Function to shoot a bullet
function shootBullet() {
    if (bulletReloading || currentBullets >= maxBullets) return;

    const bullet = {
        x: player.facing === "right" ? player.x + player.width : player.x,
        y: player.y + player.height / 2,
        width: 10,
        height: 5,
        direction: player.facing,
    };

    bullets.push(bullet);
    currentBullets++; // Increment the number of bullets fired

    // Start reload timer after shooting the magazine
    if (currentBullets >= maxBullets) {
        bulletReloading = true;
        setTimeout(() => {
            bulletReloading = false; // Allow shooting again after reload
            currentBullets = 0; // Reset bullet count for the next magazine
        }, reloadTime);
    }
}

// Function to progress to the next level
function nextLevel() {
    level++;
    totalMonsters += 20; // Increase monster count
    monstersKilled = 0; // Reset kill count
    playerHealth = 100; // Restore health
    // Show level transition message
    displayLevelTransition();
}

// Function to display level transition message
function displayLevelTransition() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Level ${level} Starting!`, canvas.width / 2, canvas.height / 2);
    setTimeout(() => {
        gameloop(); // Resume the game after a short pause
    }, 2000); // 2-second pause before continuing
}

// Function to display game over and restart button
function displayGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

    // Draw Restart Button
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Click to Restart", canvas.width / 2, canvas.height / 2 + 60);

    // Restart game on click
    canvas.addEventListener("click", restartGame);
}

// Function to restart the game
function restartGame() {
    playerHealth = 100;
    level = 1;
    totalMonsters = 40;
    monstersKilled = 0;
    monsters.length = 0; // Clear monsters
    bullets.length = 0; // Clear bullets
    currentBullets = 0; // Reset bullet count
    gameOver = false; // Reset game over state
    gameloop(); // Restart the game loop
}
