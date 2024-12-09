// Game State Variables
let gameState = {
  player: {
    name: "Hero",
    hp: 100,
    maxHp: 100,
    gold: 50,
    level: 1,
    xp: 0,
    skills: {
      strength: 1,
      agility: 1,
      intelligence: 1,
      points: 0,
    },
    inventory: [],
    weapon: "Fists",
  },
  enemies: {
    goblin: { hp: 30, damage: 5, reward: 20 },
  },
};

// HTML Elements
let storyTextElement, gameLog;

// Setup Function
function setup() {
  noCanvas();

  // Connect storyTextElement and gameLog
  storyTextElement = document.getElementById("storyText");
  gameLog = document.getElementById("output");

  // Start the game
  startGame();
}

// Start the Game
function startGame() {
  updateStoryText("You stand at the entrance of a dark cave. Do you want to enter? (Yes/No)");
  waitForPlayerChoice(["yes", "no"], (choice) => {
    if (choice === "yes") {
      enterCave();
    }
    else {
      updateStoryText("You decide to stay outside. Maybe next time.");
      gameOver();
    }
  });
}

// Update Story Text with a Typewriter Effect
function updateStoryText(text) {
  storyTextElement.innerHTML = ""; // Clear previous text
  let i = 0;

  const interval = setInterval(() => {
    if (i < text.length) {
      storyTextElement.innerHTML += text.charAt(i);
      i++;
    }
    else {
      clearInterval(interval);
    }
  }, 50); // Adjust the speed of text reveal
}

// Enter the Cave
function enterCave() {
  updateStoryText("Inside the cave, you hear strange noises. A goblin appears! Prepare for battle!");
  startBattle(gameState.enemies.goblin, () => {
    updateStoryText("You defeated the goblin and found 20 gold!");
    gameState.player.gold += 20;
    updateGameLog("You earned 20 gold!");
  });
}

// Battle System
function startBattle(enemy, onVictory) {
  let battleLog = "";

  while (enemy.hp > 0 && gameState.player.hp > 0) {
    let playerDamage = Math.floor(Math.random() * 10) + 1;
    let enemyDamage = Math.floor(Math.random() * enemy.damage);

    enemy.hp -= playerDamage;
    gameState.player.hp -= enemyDamage;

    battleLog += `You dealt ${playerDamage} damage. The enemy dealt ${enemyDamage} damage.<br>`;
    updateGameLog(battleLog);

    if (enemy.hp <= 0) {
      onVictory();
      return;
    }

    if (gameState.player.hp <= 0) {
      updateStoryText("You were defeated by the enemy.");
      gameOver();
      return;
    }
  }
}

// Wait for Player Choice
function waitForPlayerChoice(choices, callback) {
  let choice = prompt(`Choose: ${choices.join(" / ")}`).toLowerCase();
  if (choices.includes(choice)) {
    callback(choice);
  }
  else {
    waitForPlayerChoice(choices, callback);
  }
}

// Update Game Log
function updateGameLog(message) {
  gameLog.innerHTML = `${message}<br>${gameLog.innerHTML}`;
}

// Game Over
function gameOver() {
  updateGameLog("Game Over. Restart to try again.");
}
