let health = 100;
let food = 50;
let water = 50;
let day = 1;
let gameOver = false;
let gameStarted = false;
let messages = [];

let startButton, foodButton, waterButton, restButton, saveButton;
let backgroundImage, narrationBoxImage;
let bgMusic, clickSound, successSound, gameOverSound;

function preload() {
  backgroundImage = loadImage('rpg.avif');
  narrationBoxImage = loadImage('Dialog Box.png');

  // Load sound files
  //soundFormats('mp3', 'wav');
  bgMusic = loadSound('Music.mp3'); 
  clickSound = loadSound('click.mp3'); 
  successSound = loadSound('yay.mp3'); 
  gameOverSound = loadSound('game-over.mp3');
}

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  loadGame();
  createUIButtons();

  // Play background music in a loop
  if (bgMusic) {
    bgMusic.loop();
    bgMusic.setVolume(0.5); // Adjust volume as needed
  }
}

function draw() {
  if (backgroundImage) {
    background(backgroundImage);
  }
  else {
    background(30);
  }

  fill(255);

  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  if (gameOver) {
    if (gameOverSound && !gameOverSound.isPlaying()) {
      gameOverSound.play();
    }
    textSize(32);
    text('Game Over! You survived '+ day + 'days', width / 2, height / 2);
    return;
  }

  textSize(24);
  text('Day:'+ day, width / 2, 30);
  text('Health' + health, width / 2, 80);
  text('Food:'+food, width / 2, 130);
  text('Water:'+ water, width / 2, 180);

  textSize(20);
  text("Choose an action:", width / 2, 220);

  drawNarrationBox();
}

function createUIButtons() {
  startButton = createButton("Start");
  startButton.position(width / 2 - 40, height / 2 + 80);
  startButton.mousePressed(() => {
    if (clickSound) {
      clickSound.play();
    }
    gameStarted = true;
    startButton.hide();
    showActionButtons();
  });

  foodButton = createButton("Search for Food");
  foodButton.position(width / 3 - 75, 260);
  foodButton.mousePressed(() => {
    if (clickSound) {
      clickSound.play();
    }
    searchForFood();
    nextDay();
  });

  waterButton = createButton("Search for Water");
  waterButton.position(2 * width / 3 - 75, 260);
  waterButton.mousePressed(() => {
    if (clickSound) {
      clickSound.play();
    }
    searchForWater();
    nextDay();
  });

  restButton = createButton("Rest");
  restButton.position(width / 2 - 75, 320);
  restButton.mousePressed(() => {
    if (clickSound) {
      clickSound.play();
    }
    rest();
    nextDay();
  });

  saveButton = createButton("Save Game");
  saveButton.position(width - 120, 20);
  saveButton.mousePressed(() => {
    if (clickSound) {
      clickSound.play();
    }
    saveGame();
  });

  hideActionButtons();
}

function hideActionButtons() {
  foodButton.hide();
  waterButton.hide();
  restButton.hide();
  saveButton.hide();
}

function showActionButtons() {
  foodButton.show();
  waterButton.show();
  restButton.show();
  saveButton.show();
}

function drawStartScreen() {
  textSize(32);
  text("Welcome to Survival Game", width / 2, height / 2 - 40);
  textSize(20);
  text("Press 'Start' to begin your journey.", width / 2, height / 2);
  textSize(18);
  text("Your goal is to survive as many days as possible by managing resources.", width / 2, height / 2 + 40);
}

function drawNarrationBox() {
  if (narrationBoxImage) {
    image(narrationBoxImage, 50, height - 120, width - 100, 100); // Adjust position and size as needed
  }
  else {
    fill(0, 150);
    rect(50, height - 120, width - 100, 100, 10); // Fallback rectangle if image fails to load
  }

  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  let y = height - 110;
  for (let i = 0; i < messages.length; i++) {
    text(messages[i], 60, y); // Adjust text position to fit inside the box
    y += 20;
  }
  textAlign(CENTER, CENTER);
}

function searchForFood() {
  let foodFound = int(random(10, 30));
  food += foodFound;
  water -= 10;
  health -= 5;
  logMessage('You found' + foodFound + 'food, but used water and lost some health.');
  if (successSound) {
    successSound.play();
  }
}

function searchForWater() {
  let waterFound = int(random(10, 30));
  water += waterFound;
  food -= 10;
  health -= 5;
  logMessage('You found ' + waterFound + 'water, but used food and lost some health.');
  if (successSound) {
    successSound.play();
  }
}

function rest() {
  let healthRecovered = int(random(10, 20));
  health += healthRecovered;
  food -= 15;
  water -= 15;
  logMessage('You rested and regained' + healthRecovered + 'health, but used food and water.');
  if (successSound) {
    successSound.play();
  }
}

function nextDay() {
  day++;
  food -= 10;
  water -= 10;

  if (food <= 0 || water <= 0) {
    health -= 20;
    logMessage("You are running out of food or water, losing health!");
  }

  if (health <= 0) {
    gameOver = true;
    hideActionButtons();
  }
}

function logMessage(message) {
  messages.push(message);
  if (messages.length > 5) {
    messages.shift();
  }
}

function saveGame() {
  let gameState = {
    health: health,
    food: food,
    water: water,
    day: day
  };
  localStorage.setItem("survivalGameSave", JSON.stringify(gameState));
  logMessage("Game saved successfully!");
  if (successSound) {
    successSound.play();
  }
}

function loadGame() {
  let savedState = localStorage.getItem("survivalGameSave");
  if (savedState) {
    let gameState = JSON.parse(savedState);
    health = gameState.health;
    food = gameState.food;
    water = gameState.water;
    day = gameState.day;
    logMessage("Game loaded successfully!");
  }
}
