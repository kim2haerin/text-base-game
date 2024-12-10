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
    goblin: { hp: 30, maxHp: 30, damage: 5, reward: 20 },
  },
};

// HTML Elements
let storyTextElement, gameLog, playerHpElement;

// Setup Function
function setup() {
  noCanvas();

  // Connect HTML elements
  storyTextElement = document.getElementById("storyText");
  gameLog = document.getElementById("output");
  playerHpElement = document.getElementById("playerHp");

  // Start the game
  startGame();
}

// Start the Game
function startGame() {
  StoryText("You stand at the entrance of a dark cave. Do you want to enter?", () => {
    addChoiceButtons(["Yes", "No"], (choice) => {
      if (choice === "Yes") {
        enterCave();
      }
      else {
        StoryText("Maybe next time then. The adventure ends here.");
      }
    });
  });
}

// Update Story Text with a Typewriter Effect
function StoryText(text, callback) {
  storyTextElement.innerHTML = ""; // Clear previous text
  let i = 0;

  const interval = setInterval(() => {
    if (i < text.length) {
      storyTextElement.innerHTML += text.charAt(i);
      i++;
    }
    else {
      clearInterval(interval);
      if (callback) {
        callback();
      } // Execute callback after text is fully displayed
    }
  }, 50); // Adjust the speed of text reveal
}

// Enter the Cave
function enterCave() {
  StoryText("You enter the cave and hear strange noises. Ahead are two paths. Which way will you go?", () => {
    addChoiceButtons(["Left", "Right"], (choice) => {
      if (choice === "Left") {
        leftPath();
      }
      else {
        rightPath();
      }
    });
  });
}

// Left Path
function leftPath() {
  StoryText("You venture down the left path and find a treasure chest! Inside, you find 50 gold!", () => {
    gameState.player.gold += 50;
    GameLog("You earned 50 gold!");
  });
}

// Right Path
function rightPath() {
  StoryText("A goblin ambushes you! Prepare for battle!", () => {
    startBattle(gameState.enemies.goblin, () => {
      StoryText("You defeated the goblin and found 20 gold!");
      gameState.player.gold += 20;
      GameLog("You earned 20 gold!");
    });
  });
}

// Battle System
function startBattle(enemy, onVictory) {
  updatePlayerStats();
  let battleLog = "";

  const battleInterval = setInterval(() => {
    let playerDamage = Math.floor(Math.random() * 10) + 1;
    let enemyDamage = Math.floor(Math.random() * enemy.damage);

    enemy.hp -= playerDamage;
    gameState.player.hp -= enemyDamage;

    //battleLog = `You dealt ${playerDamage} damage. The enemy dealt ${enemyDamage} damage.`;
    battleLog = "You dealt" + playerDamage + "damage. The enemy dealt" + enemyDamage + "damage.";
    GameLog(battleLog);

    updatePlayerStats();

    if (enemy.hp <= 0) {
      clearInterval(battleInterval);
      enemy.hp = enemy.maxHp; // Reset enemy HP for next encounter
      onVictory();
    }

    if (gameState.player.hp <= 0) {
      clearInterval(battleInterval);
      StoryText("You were defeated by the enemy. Game over.");
    }
  }, 1000);
}

// Update Player Stats
function updatePlayerStats() {
  playerHpElement.textContent = `HP: ${gameState.player.hp}/${gameState.player.maxHp}`;
  //playerHpElement.textContent = "HP:" +  gameState.player.hp + gameState.player.maxHp;
}

// Log Game Events
function GameLog(message) {
  gameLog.innerHTML += `<p>${message}</p>`;
}

// Add Choice Buttons
function addChoiceButtons(choices, callback) {
  storyTextElement.innerHTML += "<br><br>";
  choices.forEach((choice) => {
    let button = document.createElement("button");
    button.textContent = choice;
    button.onclick = () => {
      storyTextElement.innerHTML = ""; // Clear choices after selection
      callback(choice);
    };
    storyTextElement.appendChild(button);
  });
}
