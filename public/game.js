/*
<header>
<h1>Sam Kazemi</h1>
<p>Student ID: 923763214</p>
<p>GitHub: youngsassanid</p>
</header>
*/

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let isGameRunning = false;
let player;
let enemy;
let enemies = [];
let score = 0;
let gameOver = false;
let gameState = "start"; // Track the game state
let fatalityMessage = ''; // Variable to hold the fatality message
let showFatality = false; // Flag to determine if the message should be shown
let fatalityTimeout; // Variable to hold the timeout reference
let shurikens = []; //Array to hold shurikens

// Start Screen Elements
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// Player object
player = {
    x: 100,
    y: canvas.height - 200, // Adjusted for leg height
    width: 160, // Character width (doubled)
    height: 160, // Character height (doubled)
    color: 'green',
    health: 100,
    score: 0,
    jumping: false,
    jumpHeight: 100, // Maximum jump height
    jumpCount: 0, // Current jump progress
};

// Enemy object constructor
function Enemy(x, y) {
    this.x = x;
    this.y = canvas.height - 200; // Align enemy with player (doubled)
    this.width = 160; // Enemy width (doubled)
    this.height = 160; // Enemy height (doubled)
    this.health = 100;
    this.velocityX = 0; // Horizontal speed
    this.velocityY = -100; // Vertical speed (for jumping)
    this.jumpHeight = 100; // Maximum jump height
    this.jumping = false;
}

class Shuriken {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 5;
    }

    move() {
        this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Add event listener to start the game
startButton.addEventListener('click', function() {
    startScreen.style.display = 'none'; // Hide start screen
    displayInstructions(); // Show instructions after start
});

// Listen for the "space bar" to throw a shuriken
document.addEventListener('keydown', function(event) {
    if (event.key === " ") {
        throwShuriken();
    }
});

function throwShuriken() {
    // Create a new shuriken at the player's position
    const shuriken = new Shuriken(player.x + player.width, player.y + player.height / 2);
    shurikens.push(shuriken);
}

// Function to randomly move the enemy
function randomEnemyMovement(enemy) {
    // Randomly choose an action every 1 second (adjust as needed)
    if (Math.random() < 0.03) { 
        let action = Math.floor(Math.random() * 3); // 0: move left, 1: move right, 2: jump

        switch (action) {
            case 0: // Move left
                enemy.velocityX = -5; // Move left at speed 
                enemy.velocityX = -5; // Move left at speed
                enemy.velocityX = -5; // Move left at speed
                enemy.velocityX = -10; // Move left at speed 
                enemy.velocityX = -10; // Move left at speed 
                enemy.velocityX = -15; // Move left at speed 
                enemy.velocityX = -15; // Move left at speed 
                break;
            case 1: // Move left
                enemy.velocityX = -5; // Move left at speed 
                enemy.velocityX = -5; // Move left at speed
                enemy.velocityX = -5; // Move left at speed
                enemy.velocityX = -10; // Move left at speed 
                enemy.velocityX = -10; // Move left at speed 
                enemy.velocityX = -15; // Move left at speed 
                enemy.velocityX = -15; // Move left at speed 
                break;
            case 2: // Jump
                if (!enemy.jumping) { // Only allow jumping if not already jumping
                    enemy.velocityY = -15; // Set jump speed
                    enemy.jumping = true;
                }
                break;
        }
    }

    // Apply gravity for jumping
    if (enemy.jumping) {
        enemy.y += enemy.velocityY;
        enemy.velocityY += 1; // Gravity effect

        // Stop jumping when hitting the ground
        if (enemy.y >= canvas.height - 200) {
            enemy.y = canvas.height - 200;
            enemy.jumping = false;
            enemy.velocityY = 0;
        }
    }

    // Move the enemy horizontally
    enemy.x += enemy.velocityX;

    // Stop horizontal movement after the frame
    enemy.velocityX = 0;

    // Prevent enemy from moving off-screen
    if (enemy.x < 0) enemy.x = 0;
    if (enemy.x + enemy.width > canvas.width) enemy.x = canvas.width - enemy.width;
}

// Function to display instructions
function displayInstructions() {
    const instructionDiv = document.createElement('div');
    instructionDiv.style.textAlign = 'center';
    instructionDiv.style.position = 'absolute';
    instructionDiv.style.top = '50%';
    instructionDiv.style.left = '50%';
    instructionDiv.style.transform = 'translate(-50%, -50%)';
    
    instructionDiv.innerHTML = `
    <h2>Instructions:</h2>
    <p>Use the LEFT and RIGHT arrow keys to move.</p>
    <p>Press the UP arrow key to jump.</p>
    <p>Press the SPACE BAR to throw shurikens.</p>
    <p>You are the Green Ninja! Defeat the skeleton!</p>
    <button id="startGameButton">Start Game</button>
`;
    
    document.body.appendChild(instructionDiv);
    
    // Event listener for Start Game button
    document.getElementById('startGameButton').addEventListener('click', function() {
        isGameRunning = true; // Set game running flag
        initGame(); // Initialize game
        gameLoop(); // Start game loop
        document.body.removeChild(instructionDiv); // Remove instruction screen
        canvas.style.display = 'block'; // Show canvas
    });
}

// Initialize game
function initGame() {
    enemies.push(new Enemy(canvas.width - 260, Math.random() * (canvas.height - 300))); // Adjusted position for visibility
}

// Update shurikens and check for collisions
function updateShurikens() {
    for (let i = 0; i < shurikens.length; i++) {
        shurikens[i].move();
        shurikens[i].draw();

        // Remove shurikens that go off screen
        if (shurikens[i].x > canvas.width) {
            shurikens.splice(i, 1);
            i--;
        }
    }
}

// Main game loop
function gameLoop() {
    if (!isGameRunning) return; // Exit if the game isn't running

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateShurikens();

    checkShurikenCollision();

    // Draw player and enemies
    drawCharacter(player);
    enemies.forEach((enemy) => {
        randomEnemyMovement(enemy); // Add random movement to each enemy
        drawEnemy(enemy);
    });

// Check for collisions and update health
enemies.forEach((enemy, index) => {
    if (collision(player, enemy)) {
        player.health -= 3; // Player loses health on collision
        if (enemy.health <= 0) {
            enemies.splice(index, 1); // Remove enemy if health is zero or less
            score += 10; // Increase score
            showFatality = true; //Set flag to show fatality message after enemy death
            // Set a timeout to hide the fatality message after 5 seconds
            clearTimeout(fatalityTimeout); // Clear any existing timeout
            fatalityTimeout = setTimeout(() => {
                showFatality = false; // Hide the fatality message
            }, 5000 ); // 5000 milliseconds = 5 seconds
        }
    }
});

function checkShurikenCollision() {
    for (let i = 0; i < shurikens.length; i++) {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                shurikens[i].x < enemy.x + enemy.width &&
                shurikens[i].x + shurikens[i].width > enemy.x &&
                shurikens[i].y < enemy.y + enemy.height &&
                shurikens[i].y + shurikens[i].height > enemy.y
            ) {
                enemy.health -= 10;
                shurikens.splice(i, 1);
                i--; // Adjust index after removing shuriken
            }
            // Check if enemy health has dropped to zero or less
            if (enemy.health <= 0) {
                enemies.splice(enemyIndex, 1); // Correctly remove the enemy
                score += 10; // Increase score
                showFatality = true; // Set flag to show fatality message

                // Set a timeout to hide the fatality message after 5 seconds
                clearTimeout(fatalityTimeout); // Clear any existing timeout
                fatalityTimeout = setTimeout(() => {
                    showFatality = false; // Hide the fatality message
                    victory();
                }, 5000); // 5000 milliseconds = 5 seconds
            }
        });
    }
}

// Draw score and health
ctx.fillStyle = 'red';
ctx.font = '20px Arial';
ctx.fillText('Health: ' + player.health, 10, 20);
ctx.fillText('Score: ' + score, 10, 50);

// Draw the fatality message if the flag is set
if (showFatality) {
    ctx.fillStyle = 'red'; // Set color for the fatality message
    ctx.font = '60px Times New Roman'; // Set font size and family for the message
    ctx.fillText('FATALITY!', canvas.width / 2 - 100, canvas.height / 2); // Center the message
    //showFatality = false; // Reset the flag after displaying the message
}

// Draw remaining health for each enemy
enemies.forEach((enemy, index) => {
    ctx.fillText('Enemy Health: ' + enemy.health, 610, 20 + (index * 30)); // Adjust position for each enemy
});

    // Check for game over
    if (player.health <= 0) {
        endGame(); // End the game if health reaches 0
    }

    // Call the game loop again
    requestAnimationFrame(gameLoop);
}

// Function to end the game
function endGame() {
    isGameRunning = false; // Stop game
    gameOver = true; // Set game over flag
    startScreen.style.display = 'none'; // Hide start screen
    canvas.style.display = 'none'; // Hide canvas

    // Create the game over screen
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'gameOverScreen';
    gameOverScreen.style.position = 'absolute';
    gameOverScreen.style.top = '50%';
    gameOverScreen.style.left = '50%';
    gameOverScreen.style.transform = 'translate(-50%, -50%)';
    gameOverScreen.style.textAlign = 'center';
    gameOverScreen.style.padding = '30px';
    gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Dark background
    gameOverScreen.style.color = '#fff'; // White text
    gameOverScreen.style.fontFamily = 'Times New Roman, Charcoal, sans-serif'; // Similar font to the "Instructions!" screen
    gameOverScreen.style.fontSize = '36px'; // Adjust as needed

    // Add "Game Over!" title
    const defeatTitle = document.createElement('h1');
    defeatTitle.style.marginTop = '200px'; // Add spacing above the text
    defeatTitle.textContent = 'GAME OVER!';
    defeatTitle.style.fontSize = '48px'; // Larger size similar to "Instructions!"
    defeatTitle.style.marginBottom = '20px'; // Spacing
    gameOverScreen.appendChild(defeatTitle);

    // Add score display
    const scoreDisplay = document.createElement('p');
    scoreDisplay.textContent = 'Your score: ' + score;
    scoreDisplay.style.fontSize = '24px'; // Smaller size for the score text
    scoreDisplay.style.marginBottom = '30px'; // Spacing
    gameOverScreen.appendChild(scoreDisplay);

    // Corrected variable declaration here
    const defeatImage = document.createElement('img');
    defeatImage.src = 'defeat.png'; 
    defeatImage.alt = 'Game Over';
    defeatImage.style.width = '300px';
    defeatImage.style.height = 'auto';
    defeatImage.style.marginTop = '10px';

    gameOverScreen.appendChild(defeatImage);

    // Add Quit button
    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    quitButton.style.fontSize = '20px'; // Adjust size as needed
    quitButton.style.padding = '10px 20px';
    quitButton.style.cursor = 'pointer';
    quitButton.style.backgroundColor = '#ff0000'; // Red button
    quitButton.style.color = '#fff'; // White text
    quitButton.style.border = 'none';
    quitButton.style.borderRadius = '5px'; // Rounded corners
    quitButton.style.display = 'block'; // Ensure the button is a block element
    quitButton.style.margin = '20px auto 0'; // Center the button and add spacing
    quitButton.onclick = () => {
        location.reload(); // Refresh the page to quit the game
    };
    gameOverScreen.appendChild(quitButton);

    // Append game over screen to the body
    document.body.appendChild(gameOverScreen);
}

// Function to end the game
function victory() {
    isGameRunning = false; // Stop game
    gameOver = true; // Set game over flag
    startScreen.style.display = 'none'; // Hide start screen
    canvas.style.display = 'none'; // Hide canvas

    // Create the game over screen
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'gameOverScreen';
    gameOverScreen.style.position = 'absolute';
    gameOverScreen.style.top = '50%';
    gameOverScreen.style.left = '50%';
    gameOverScreen.style.transform = 'translate(-50%, -50%)';
    gameOverScreen.style.textAlign = 'center';
    gameOverScreen.style.padding = '30px';
    gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Dark background
    gameOverScreen.style.color = '#fff'; // White text
    gameOverScreen.style.fontFamily = 'Times New Roman, Charcoal, sans-serif'; // Similar font to the "Instructions!" screen
    gameOverScreen.style.fontSize = '36px'; // Adjust as needed

    // Add "Victory!" title
    const defeatTitle = document.createElement('h1');
    defeatTitle.style.marginTop = '200px'; // Add spacing above the text
    defeatTitle.textContent = 'YOU WIN!';
    defeatTitle.style.fontSize = '48px'; // Larger size similar to "Instructions!"
    defeatTitle.style.marginBottom = '20px'; // Spacing
    gameOverScreen.appendChild(defeatTitle);

    // Add an image below the "VICTORY!" text
    const victoryImage = document.createElement('img');
    victoryImage.src = 'victory.png'; // Replace with the path to your image
    victoryImage.alt = 'Victory Image'; // Optional: set alt text for the image
    victoryImage.style.width = '300px'; // Set the width (adjust as needed)
    victoryImage.style.height = 'auto'; // Maintain aspect ratio
    victoryImage.style.marginTop = '10px'; // Add spacing above the image
    
    gameOverScreen.appendChild(victoryImage);

    // Add score display
    const scoreDisplay = document.createElement('p');
    scoreDisplay.textContent = 'Your score: ' + score;
    scoreDisplay.style.fontSize = '24px'; // Smaller size for the score text
    scoreDisplay.style.marginBottom = '30px'; // Spacing
    gameOverScreen.appendChild(scoreDisplay);

    // Add Quit button
    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    quitButton.style.fontSize = '20px'; // Adjust size as needed
    quitButton.style.padding = '10px 20px';
    quitButton.style.cursor = 'pointer';
    quitButton.style.backgroundColor = '#ff0000'; // Red button
    quitButton.style.color = '#fff'; // White text
    quitButton.style.border = 'none';
    quitButton.style.borderRadius = '5px'; // Rounded corners
    quitButton.onclick = () => {
        location.reload(); // Refresh the page to quit the game
    };
    gameOverScreen.appendChild(quitButton);

    // Append game over screen to the body
    document.body.appendChild(gameOverScreen);
}

// Green Ninja drawing function (Our protagonist/player character)
function drawCharacter(character) {
    // Draw head
    ctx.fillStyle = 'green'; // Head color
    ctx.fillRect(character.x + 40, character.y - 80, 80, 80); // Head (doubled)

    // Draw body (green ninja gi)
    ctx.fillStyle = 'green'; // Color for the gi
    ctx.fillRect(character.x, character.y - 40, character.width, character.height); // Body (doubled)

    // Add gi details (diagonal belt line)
    ctx.strokeStyle = 'black'; // Color for gi details (like a belt)
    ctx.lineWidth = 10; // Line width for visibility
    ctx.beginPath(); // Start a new path
    ctx.moveTo(character.x + 40, character.y - 80 + 40); // Starting point of the diagonal line
    ctx.lineTo(character.x + character.width - 40, character.y - 40 + 110); // End point of the diagonal line
    ctx.stroke(); // Draw the line

    // Draw the mirrored diagonal line to create an "X"
    ctx.beginPath(); // Start a new path
    ctx.moveTo(character.x + character.width - 40, character.y - 80 + 40); // Starting point of the mirrored diagonal line
    ctx.lineTo(character.x + 40, character.y - 40 + 110); // End point of the mirrored diagonal line
    ctx.stroke(); // Draw the line

    // Draw arms (adjusted position to avoid overlap)
    ctx.fillStyle = 'green'; // Arms color
    ctx.fillRect(character.x - 20, character.y - 20, 20, 120); // Left arm (above body)
    ctx.fillRect(character.x + character.width, character.y - 20, 20, 120); // Right arm (above body)

    // Draw legs (green ninja gi)
    ctx.fillStyle = 'green'; // Color for gi on legs
    ctx.fillRect(character.x + 40, character.y + 120, 40, 80); // Left leg (doubled)
    ctx.fillRect(character.x + 80, character.y + 120, 40, 80); // Right leg (doubled)

    // Draw pants details
    ctx.fillStyle = 'black'; // Color for shoes
    ctx.fillRect(character.x + 40, character.y + 120 + 70, 40, 10); // Left leg cuff
    ctx.fillRect(character.x + 80, character.y + 120 + 70, 40, 10); // Right leg cuff

    // Draw ninja mask (light flesh color)
    ctx.fillStyle = '#F5CBA0'; // Light flesh color
    ctx.fillRect(character.x + 40, character.y - 60, 80, 10); // Mask (doubled)

    // Draw eyes over the mask
    ctx.fillStyle = 'lightgreen'; // Eyes color
    ctx.fillRect(character.x + 55, character.y - 60, 10, 10); // Left eye (above mask)
    ctx.fillRect(character.x + 75, character.y - 60, 10, 10); // Right eye (above mask)

    // Draw black bandana
    ctx.fillStyle = 'black'; // Bandana color
    ctx.fillRect(character.x + 40, character.y - 70, 80, 10); // Bandana (doubled)

    // Draw belt
    ctx.fillStyle = 'black'; // Belt color
    ctx.fillRect(character.x, character.y - 40 + 110, 160, 10); // Belt

    // Draw silver shoulder pads
    ctx.fillStyle = 'black'; // Shoulder pad color
    ctx.fillRect(character.x - 10, character.y - 50, 40, 20); // Left shoulder pad (slightly above arm)
    ctx.fillRect(character.x + character.width - 30, character.y - 50, 40, 20); // Right shoulder pad (slightly above arm)

    // Draw gold dragon emblem on the torso
    ctx.fillStyle = 'gray'; // Dragon color
    // Adjust the x position to center the emblem
    const emblemWidth = 30; // Width of the emblem
    const emblemX = character.x + (character.width / 2) - (emblemWidth / 2); // Centered on torso
    
    ctx.fillRect(emblemX, character.y + 1, emblemWidth, 30); // Draw the emblem
}

// Enemy drawing function (Whiplash)
function drawEnemy(enemy) {
    // Draw head (skull)
    ctx.fillStyle = 'white'; // Skull color
    ctx.fillRect(enemy.x + 40, enemy.y - 80, 80, 80); // Skull (doubled)

    // Draw straw hat (brown)
    ctx.fillStyle = 'saddlebrown'; // Hat color
    ctx.fillRect(enemy.x + 20, enemy.y - 90, 120, 20); // Straw hat (doubled)
    ctx.fillRect(enemy.x + 60, enemy.y - 100, 40, 20); // Straw hat (doubled)

    // Draw body
    ctx.fillStyle = 'white'; // Body color
    ctx.fillRect(enemy.x, enemy.y - 40, enemy.width, enemy.height); // Body (doubled)

    // Draw ribs 
    ctx.fillStyle = 'lightgray'; // Rib color
    ctx.fillRect(enemy.x + 20, enemy.y - 40 + 30, 120, 10); // First rib
    ctx.fillRect(enemy.x + 20, enemy.y - 40 + 50, 120, 10); // Second rib
    ctx.fillRect(enemy.x + 20, enemy.y - 40 + 70, 120, 10); // Third rib

    // Draw arms (adjusted position to avoid overlap)
    ctx.fillStyle = 'white'; // Arms color
    ctx.fillRect(enemy.x - 20, enemy.y - 40 + 20, 20, 120); // Left arm (above body)
    ctx.fillRect(enemy.x + enemy.width, enemy.y - 40 + 20, 20, 120); // Right arm (above body)

    // Draw legs
    ctx.fillStyle = 'white'; // Legs color
    ctx.fillRect(enemy.x + 40, enemy.y + 120, 40, 80); // Left leg (doubled)
    ctx.fillRect(enemy.x + 80, enemy.y + 120, 40, 80); // Right leg (doubled)

    // Draw eyes (more skeletal face)
    ctx.fillStyle = 'lightgreen'; // Eyes color
    ctx.fillRect(enemy.x + 55, enemy.y - 70, 10, 10); // Left eye (higher)
    ctx.fillRect(enemy.x + 75, enemy.y - 70, 10, 10); // Right eye (higher)

    // Draw skeletal mouth
    ctx.fillStyle = 'lightgray'; // Mouth color
    ctx.fillRect(enemy.x + 55, enemy.y - 50, 50, 10); // Mouth (higher)

    // Draw belt
    ctx.fillStyle = 'darkred'; // Rib color
    ctx.fillRect(enemy.x, enemy.y - 40 + 110, 160, 10); // Belt

    // Draw silver shoulder pads
    ctx.fillStyle = 'darkred'; // Shoulder pad color
    ctx.fillRect(enemy.x - 10, enemy.y - 50, 40, 20); // Left shoulder pad (slightly above arm)
    ctx.fillRect(enemy.x + enemy.width - 30, enemy.y - 50, 40, 20); // Right shoulder pad (slightly above arm)

}

// Collision detection function
function collision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Character movement (for player)
document.addEventListener('keydown', function(event) {
    if (isGameRunning) {
        switch (event.key) {
            case 'ArrowUp':
                if (!player.jumping) {
                    player.jumping = true; // Start jumping
                    jump(); // Execute jump
                }
                break;
            case 'ArrowLeft':
                if (player.x > 0) player.x -= 10; // Move character left
                break;
            case 'ArrowRight':
                if (player.x < canvas.width - player.width) player.x += 10; // Move character right
                break;
            case 'Escape':
                endGame(); // End the game on Escape key
                break;
        }
    }
});

// Function to fire a shuriken
function fireShuriken() {
    // Logic to create and fire a shuriken
    const shuriken = {
        x: player.x + player.width / 2, // Start from player's position
        y: player.y,
        speed: 500 // Adjust speed as needed
    };
    shurikens.push(shuriken); // Add shuriken to array for rendering
}

// Function to execute jump
function jump() {
    player.jumpCount = 0; // Reset jump progress

    // Animation for jumping
    const jumpInterval = setInterval(() => {
        if (player.jumpCount < player.jumpHeight) {
            player.y -= 5; // Move up
            player.jumpCount += 5; // Increase jump count
        } else {
            clearInterval(jumpInterval);
            fall(); // Start falling
        }
    }, 20);
}

// Function to handle falling
function fall() {
    const fallSpeed = 5; // Speed of falling
    const fallInterval = setInterval(() => {
        if (player.y < canvas.height - player.height) { // Ensure character doesn't go below ground
            player.y += fallSpeed; // Move down
        } else {
            clearInterval(fallInterval);
            player.jumping = false; // Reset jumping state
            player.y = canvas.height - 200; // Ensure player lands correctly
        }
    }, 20);
}

// Start the game
gameLoop();
