// Game State Variables
let gameState = {
  player: {
    name: "Hero",
    hp: 100,
    maxHp: 100,
    gold: 0,
    level: 1,
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


// Merchant's Items
const merchantItems = [
  { name: "Health Potion", price: 20, effect: { hp: 20 }, description: "Restores 20 HP." },
  { name: "Sword", price: 50, effect: { weapon: "Sword" }, description: "A basic sword to deal more damage." },
  { name: "Food", price: 10, effect: { hp: 10 }, description: "Restores 10 HP." },
  { name: "Shield", price: 40, effect: { armor: "Shield" }, description: "Provides better defense." },
];

// HTML Elements
let storyTextElement, gameLog, playerHpElement;

// Setup Function
function setup() {
  noCanvas();

  // Connect HTML elements
  storyTextElement = document.getElementById("storyText");
  gameLog = document.getElementById("output");
  playerHpElement = document.getElementById("playerHp");
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





// Story Text with a Typewriter Effect
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
  StoryText("You enter the cave and Ahead are two paths. Which way will you go?", () => {
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
    PlayerStats();
    next(); // Trigger Merchant Encounter
  });
}

// Right Path
function rightPath() {
  StoryText("A goblin ambushes you! Prepare for battle!", () => {
    startBattle(gameState.enemies.goblin, () => {
      StoryText("You defeated the goblin and found 20 gold!");
      gameState.player.gold += 20;
      GameLog("You earned 20 gold!");
      PlayerStats();
      //next();
    });
    //next();
  });
  //next();
}

function next(){
  addChoiceButtons(["next =>"], (choice) => {
    meetMerchant();
  });
}

function next2(){
  addChoiceButtons(["next =>"], (choice) => {
    theChild();
  });
}

// Meet the Merchant
function meetMerchant() {
  StoryText("You meet a friendly merchant. He offers you items for sale. What would you like to buy?", () => {
    displayMerchantItems();
  });
  next2();
};

function theChild(){
  StoryText("Ahead you hear some a strange noise, when you follow the song, there was a goblin attacking a child, will you help him");
  addChoiceButtons(["save him", "abandon him"], (choice) => {
    if (choice === "save him"){
      saveHim();
    }
    else {
      abondanHim();
    }
  });
}

function saveHim(){
  StoryText("you run to the goblind to save the boy");
  startBattle(gameState.enemies.goblin, () => {
    StoryText("You defeated the goblin");
    //gameState.player.gold += 20;
    GameLog("You saved the boy, Hip Hip Hooray!");
    PlayerStats();
  });
}
// Display Merchant's Items
function displayMerchantItems() {
  storyTextElement.innerHTML += "<br><br><strong>Items for Sale:</strong><br>";
  merchantItems.forEach((item) => {
    let button = document.createElement("button");
    button.textContent = `${item.name} - ${item.price} gold`;
    button.onclick = () => purchaseItem(item);
    storyTextElement.appendChild(button);
  });

  // Option to Leave the Shop
  let leaveButton = document.createElement("button");
  leaveButton.textContent = "Leave";
  leaveButton.onclick = () => {
    StoryText("You thank the merchant and continue your journey.");
  };
  storyTextElement.appendChild(leaveButton);
}

// Purchase Item Logic
function purchaseItem(item) {
  if (gameState.player.gold >= item.price) {
    gameState.player.gold -= item.price;

    // Apply Item Effect
    if (item.effect.hp) {
      gameState.player.hp = Math.min(gameState.player.hp + item.effect.hp, gameState.player.maxHp);
    }
    if (item.effect.weapon) {
      gameState.player.weapon = item.effect.weapon;
    }

    GameLog(`You bought ${item.name}. ${item.description}`);
    PlayerStats();
  }
  else {
    GameLog(`You don't have enough gold to buy ${item.name}.`);
  }
}

// Start Battle
function startBattle(enemy, onVictory) {
  PlayerStats();
  let battleLog = "";

  const battleInterval = setInterval(() => {
    let playerDamage = Math.floor(Math.random() * 10) + 1;
    let enemyDamage = Math.floor(Math.random() * enemy.damage);

    enemy.hp -= playerDamage;
    gameState.player.hp -= enemyDamage;

    battleLog = `You dealt ${playerDamage} damage. The enemy dealt ${enemyDamage} damage.`;
    GameLog(battleLog);

    PlayerStats();

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

// Player Stats
function PlayerStats() {
  playerHpElement.textContent = `HP: ${gameState.player.hp}/${gameState.player.maxHp}`;
  document.getElementById("playerGold").textContent = `Gold: ${gameState.player.gold}`;
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

function resetGame() {
  localStorage.removeItem("adventureGameSave");
  gameState.player = {
    name: "Hero",
    hp: 100,
    maxHp: 100,
    gold: 0,
    skills: {
      strength: 1,
      agility: 1,
      intelligence: 1,
      points: 0,
    },
    inventory: [],
    weapon: "Fists",
  };
  GameLog("New game started. Previous save cleared.");
  PlayerStats();
}

function saveGame() {
  const saveData = {
    player: gameState.player,
    inventory: gameState.player.inventory,
  };

  localStorage.setItem("adventureGameSave", JSON.stringify(saveData));
  GameLog("Game saved successfully!");
}

function loadGame() {
  const saveData = JSON.parse(localStorage.getItem("adventureGameSave"));

  if (saveData) {
    gameState.player = saveData.player;
    gameState.player.inventory = saveData.inventory || [];
    GameLog("Game loaded successfully!");
    PlayerStats(); // Update the stats on the screen
  } 
  else {
    GameLog("No save data found!");
  }
}









