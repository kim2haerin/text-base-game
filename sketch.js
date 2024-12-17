// Game State Variables
let gameState = {
  player: {
    name: "Hero",
    hp: 100,
    maxHp: 100,
    gold: 0,
    level: 1,
    xp: 100,
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
  { name: "Magic Potion", price: 100, effect: { xp: 50 }, description: "Grants 50 XP." },
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
  quest= document.getElementById("Quests");
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

  renderQuestLog();  // Render the initial quest log
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
    PlayerStats();
    meetMerchant(); // Trigger Merchant Encounter
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
      
      completeQuest(1); // Mark the "Defeat the Goblin" quest as complete
    });
    meetMerchant();
  });
}

// Meet the Merchant
function meetMerchant() {
  StoryText("You meet a friendly merchant. He offers you items for sale. What would you like to buy?", () => {
    displayMerchantItems();
    completeQuest(3); // Complete "Meet the Merchant" quest
  });
};



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
    if (item.effect.xp) {
      gameState.player.xp += item.effect.xp;
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
  document.getElementById("playerXp").textContent = `XP: ${gameState.player.xp}`;
}
// the quest list
gameState.quest = [
  {id : 1, name: "meet the merchant", complete: false, reward:{gold: 10}},
  {id:2, name:"try to reach level 5", complete: false, reward:{gold: 20}},
  {id:3, name:"try to collect 100 Gold", complete:false, reward:"magic potion"},
  {id : 4, name: "save emporio", complete:false, reward:"food"},
];

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

function questLog(){
  const questList = document.getElementById("questList");
  questList.innerHTML = ""; // Clear previous quests

  gameState.quests.forEach((quest) => {
    let questItem = document.createElement("li");
    questItem.innerHTML = `
      ${quest.name} - ${quest.description}
      ${quest.completed ? "<span style='color:green'>✔</span>" : "<span style='color:red'>✘</span>"}
    `;
    questList.appendChild(questItem);
  });
}

function completeQuest(questId) {
  const quest = gameState.quests.find(q => q.id === questId);

  if (quest && !quest.completed) {
    quest.completed = true;

    // Apply the rewards
    if (quest.reward.gold) {
      gameState.player.gold += quest.reward.gold;
    }
    if (quest.reward.xp) {
      gameState.player.xp += quest.reward.xp;
    }

    GameLog(`Quest completed: ${quest.name}! You earned ${quest.reward.gold ? quest.reward.gold + " gold" : ""} ${quest.reward.xp ? quest.reward.xp + " XP" : ""}`);
    
    PlayerStats();  // Update stats UI
    renderQuestLog();  // Update quest log UI
  }
}






