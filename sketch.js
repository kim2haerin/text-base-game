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
  { name: "Water", price: 5, effect: { hp: 5 }, description: "Restores 5 HP." },
  { name: "Food", price: 10, effect: { hp: 10 }, description: "Restores 10 HP." },
  //{ name: "Lumine", price: 40, effect: { object: "Crystal" }, description: "A crystal that will glow for 10 minutes." },
];

// HTML Elements
let storyTextElement, gameLog, playerHpElement;


// Initial Setup
function setup() {
  //noCanvas();

  // Connect HTML elements
  storyTextElement = document.getElementById("storyText");
  gameLog = document.getElementById("output");
  playerHpElement = document.getElementById("playerHp");
  PlayerStats();
}

// Play Background Music
function playBackgroundMusic() {
  const music = document.getElementById("backgroundMusic");
  if (music) {
    music.volume = 0.5; // Adjust volume (0.0 to 1.0)
    music.play();
  }
}

// Start the Game
function startGame() {
  playBackgroundMusic(); // Start music when the game starts
  StoryText("You stand at the entrance of a dark cave. Do you want to enter?", () => {
    addChoiceButtons(["Yes", "No"], (choice) => {
      if (choice === "Yes") {
        enterCave();
      } else {
        StoryText("Maybe next time then. The adventure ends here.");
      }
    });
  });
}


// Story Text with Typewriter Effect
function StoryText(text, callback) {
  storyTextElement.innerHTML = ""; // Clear previous text
  let i = 0;

  const interval = setInterval(() => {
    if (i < text.length) {
      storyTextElement.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 50);
}



// Enter the Cave
function enterCave() {
  StoryText("You enter the cave and see two paths. Which way will you go?", () => {
    addChoiceButtons(["Left", "Right"], (choice) => {
      if (choice === "Left") leftPath();
      else rightPath();
    });
  });
}

// Left Path
function leftPath() {
  StoryText("You venture down the left path and find a treasure chest! Inside, you find 50 gold!", () => {
    gameState.player.gold += 50;
    GameLog("You earned 50 gold!");
    PlayerStats();
    addChoiceButtons(["Next"], ()=>{
    meetMerchant();
    });
  });
}

// Right Path
function rightPath() {
  StoryText("A goblin ambushes you! Prepare for battle!", () => {
    startBattle(gameState.enemies.goblin, () => {
      StoryText("You defeated the goblin and found 20 gold!", () => {
        gameState.player.gold += 20;
        GameLog("You earned 20 gold!");
        PlayerStats();
        addChoiceButtons(["Next"], ()=>{
        meetMerchant();
      });
      });
    });
  });
}

// Merchant Interaction
function meetMerchant() {
  StoryText("You meet a friendly merchant. He offers you items for sale. What would you like to buy?", () => {
    displayMerchantItems();
  });
}

// Display Merchant's Items
function displayMerchantItems() {
  storyTextElement.innerHTML += "<br><br><strong>Items for Sale:</strong><br>";
  merchantItems.forEach((item) => {
    const button = document.createElement("button");
    button.textContent = `${item.name} - ${item.price} gold`;
    button.onclick = () => purchaseItem(item);
    storyTextElement.appendChild(button);
  });

  const leaveButton = document.createElement("button");
  leaveButton.textContent = "Leave";
  leaveButton.onclick = () => continueJourney();
  storyTextElement.appendChild(leaveButton);
}

// Purchase Items from Merchant
function purchaseItem(item) {
  if (gameState.player.gold >= item.price) {
    gameState.player.gold -= item.price;

    if (item.effect.hp) {
      gameState.player.hp = Math.min(gameState.player.hp + item.effect.hp, gameState.player.maxHp);
    }
    if (item.effect.weapon) {
      gameState.player.weapon = item.effect.weapon;
    }

    GameLog(`You bought ${item.name}. ${item.description}`);
    PlayerStats();
  } else {
    GameLog(`You don't have enough gold to buy ${item.name}.`);
  }
}

// Continue Journey
function continueJourney() {
  StoryText("As you continue, you hear strange noises. A goblin is attacking a child. Will you help him?", () => {
    addChoiceButtons(["Save him", "Abandon him"], (choice) => {
      if (choice === "Save him") {
      saveChild();}
      else{
        abandonChild();}
    });
  });
}

function saveChild() {
  StoryText("You run to the goblin to save the boy.", () => {
    startBattle(gameState.enemies.goblin, () => {
      StoryText("You defeated the goblin. the kid was so greatful of your help he gave you some food.", () => {
        gameState.player.gold += 20;
        GameLog("You earned 20 gold!");
        PlayerStats();
        addChoiceButtons(["Next"], ()=>{
          puzzleNumber();
      });
      });
    });
  });
}


// Abandon the Child
function abandonChild() {
  StoryText("You leave the child to their fate and continue on your way. Was it the right choice?", () => {
    GameLog("You abandoned the child. The road ahead feels lonelier.");
    addChoiceButtons(["Next"], ()=>{
      puzzleNumber();
    });
  });
}

function puzzleNumber(){
  StoryText("After a long walk you are faced with two ways again, there is a portal and a big iron door and this door is lock", ()=>{
  addChoiceButtons(["Next"], ()=>{
    portal();
  });
});
}

function portal(){
  StoryText("you have no choose put to go in the portal",()=>{
  addChoiceButtons(["Next"], ()=>{
    theRoom();
    });
  });
}

function theRoom(){
  StoryText("you have no choose put to go in the portal",()=>{
    addChoiceButtons(["Next"], ()=>{
      theRoom();
      });
    });
}
// Battle Logic
function startBattle(enemy, onVictory) {
  const battleInterval = setInterval(() => {
    const playerDamage = Math.floor(Math.random() * 10) + 1;
    const enemyDamage = Math.floor(Math.random() * enemy.damage);

    enemy.hp = Math.max(0, enemy.hp - playerDamage);
    gameState.player.hp = Math.max(0, gameState.player.hp - enemyDamage);

    GameLog(`You dealt ${playerDamage} damage. The enemy dealt ${enemyDamage} damage.`);
    PlayerStats();

    if (enemy.hp <= 0) {
      clearInterval(battleInterval);
      enemy.hp = enemy.maxHp;
      onVictory();
    }

    if (gameState.player.hp <= 0) {
      clearInterval(battleInterval);
      StoryText("You were defeated. Game over.");
    }
  }, 1000);
}

// Display Player Stats
function PlayerStats() {
  playerHpElement.textContent = `HP: ${gameState.player.hp}/${gameState.player.maxHp}`;
  document.getElementById("playerGold").textContent = `Gold: ${gameState.player.gold}`;
}

// Log Game Events
function GameLog(message) {
  const logEntry = document.createElement("p");
  logEntry.textContent = message;
  gameLog.appendChild(logEntry);

  // Automatically clear the log after 5 seconds (adjust time as needed)
  setTimeout(() => {
    logEntry.remove(); // Removes this specific log entry
  }, 5000);
}

// Add Choice Buttons
function addChoiceButtons(choices, callback) {
  storyTextElement.innerHTML += "<br>";
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice;
    button.onclick = () => {
      storyTextElement.innerHTML = "";
      callback(choice);
    };
    storyTextElement.appendChild(button);
  });
}
