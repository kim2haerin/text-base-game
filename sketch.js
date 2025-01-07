// Game State Variables
let gameState = {
  player: {
    name: "Hero",
    hp: 100,
    maxHp: 500,
    gold: 10,
    level: 1,
    maxLevel: 20,
    weapon: "fist"
  },
  stats:{
    strenght: 10,
    agility: 8,
    speed: 7,
    charisma: 9,
  },

  inventory:{
    manaCore: 0,
    food:0,
    water:0,
    luminusCrystal:5,
    manaPotion: 2,
  },
  enemies: {
    goblin: { hp: 100, maxHp: 100, damage: 5, reward: 30 },
    demonDog: { hp: 150, maxHp: 150, damage: 5, reward: 45 },
    slime: { hp: 50, maxHp: 50, damage: 5, reward: 20 },
    Golem: { hp: 100, maxHp: 70, damage: 3, reward: 50 },
    Minataur: { hp: 150, maxHp: 150, damage: 3, reward: 100 },
  },
};


// Merchant's Items
const merchantItems = [
  { name: "Health Potion", price: 20, effect: { hp: 20 }, description: "Restores 20 HP." },
  { name: "Water", price: 5, effect: { hp: 5 }, description: "Restores 5 HP." },
  { name: "Food", price: 10, effect: { hp: 10 }, description: "Restores 10 HP." },
];

// quest list
const quests = [
  {
    name: "Find the Magic Crystal",
    description: "Search the ancient cave for the magical crystal to save your village.",
    reward: "100 Gold",
  },
  {
    name: "Rescue the child",
    description: "Help the child escape from goblins.",
    reward: "Potion of Strength",
  },
  {
    name: "Defeat the Goblin King",
    description: "Defeat the Goblin King.",
    reward: "Rare Sword",
  },
];

function statusLevelUp(){
  if(weapon==="sword"){
    strenght: 15;
  }
  else if(weapon==="rare sword"){
    strenght: 30;
  }
}

// HTML Elements
let storyTextElement, gameLog, playerHpElement, input;


// Initial Setup
function setup() {
  // Connect HTML elements
  storyTextElement = document.getElementById("storyText");
  gameLog = document.getElementById("output1");
  input = document.getElementById("output2");
  playerHpElement = document.getElementById("playerHp");
  PlayerStats();
}

// Play Background Music
function playBackgroundMusic() {
  const music = document.getElementById("backgroundMusic");
  if (music) {
    music.volume = 0.5;
    music.play();
  }
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

// Story Text with Typewriter Effect
//i got the idea from https://www.youtube.com/watch?time_continue=168&v=MiTJnYHX3iA&embeds_referring_euri=https%3A%2F%2Fchatgpt.com%2F&source_ve_path=MzY4NDIsMjM4NTE and https://www.youtube.com/watch?time_continue=142&v=kz_vwAF4NHI&embeds_referring_euri=https%3A%2F%2Fchatgpt.com%2F&source_ve_path=MzY4NDIsMzY4NDIsMzY4NDIsMzY4NDIsMTI3Mjk5LDIzODUx
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
      }
    }
  }, 50);
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
  }
  else {
    GameLog(`You don't have enough gold to buy ${item.name}.`);
  }
}

function QuestList(){
  const output2 = document.getElementById("output2");
  output2.innerHTML = "";

  quests.forEach((quest)=>{
    const questDiv = document.createElement("div");
    questDiv.classList.add("quest");

    questDiv.innerHTML = `
      <h4>${quest.name}</h4>
      <p>${quest.description}</p>
      <p><strong>Status:</strong> ${quest.status}</p>
      <p><strong>Reward:</strong> ${quest.reward}</p>
    `;

    output2.appendChild(questDiv); 
  });
}
document.getElementById("QuestList").onclick = QuestList;

function inventory(){
}



function character(){
  const output2 = document.getElementById("output2");
  output2.innerHTML = "";
}
document.getElementById("character").onclick = character;

// Start the Game
function startGame() {
  playBackgroundMusic();
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

// Enter the Cave
function enterCave() {
  StoryText("You enter the cave and see two paths. Which way will you go?", () => {
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

// Continue Journey
function continueJourney() {
  StoryText("As you continue, you hear strange noises. A goblin is attacking a child. Will you help him?", () => {
    addChoiceButtons(["Save him", "Abandon him"], (choice) => {
      if (choice === "Save him") {
        saveChild();
      }
      else{
        abandonChild();
      }
    });
  });
}

function saveChild() {
  StoryText("You run to the goblin to save the boy.", () => {
    startBattle(gameState.enemies.goblin, () => {
      StoryText("You defeated the goblin. the kid was so greatful of your help he gave you some food.", () => {
        gameState.player.hp += 10;
        GameLog("You earned some food!");
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
  StoryText("you are in a room with a lot of coloful crystal and at the end of the room you see a key",()=>{
    addChoiceButtons(["Next"], ()=>{
      miniGame();
    });
  });
}

function miniGame(){
  StoryText("to get the key you need to find four good answers to my riddle challenge, are you ready?",()=>{
    addChoiceButtons(["Next"], ()=>{
      riddle1();
    });
  });
}

function riddle1() {
  StoryText("I’m light as a feather, yet the strongest person can’t hold me for five minutes. What am I?", () => {
    addChoiceButtons(["Breath", "Shadow", "Air", "Thought"], (choice) => {
      if (choice.toLowerCase() === "breath") { // Case-insensitive check
        GameLog("Correct! Moving on to the next riddle.");
        riddle2();
      } 
      else {
        GameLog("Wrong answer! Try again.");
        riddle1(); // Reload the question
      }
    });
  });
}

function riddle2() {
  StoryText("the next question is What has keys but can’t open locks?", () => {
    addChoiceButtons(["Safe", "Piano", "Keyboard", "Treasure Chest"], (choice) => {
      if (choice.toLowerCase() === "keyboard") { // Case-insensitive check
        GameLog("Correct! Moving on to the next riddle.");
        riddle3();
      } 
      else {
        GameLog("Wrong answer! Try again.");
        riddle2(); // Reload the question
      }
    });
  });
}

function riddle3() {
  StoryText("the next question is The more you take from me, the bigger I get. What am I?", () => {
    addChoiceButtons(["Memory", "Hole", "Mountain", "Puzzle"], (choice) => {
      if (choice.toLowerCase() === "hole") { // Case-insensitive check
        GameLog("Correct! Moving on to the next riddle.");
        riddle4();
      } 
      else {
        GameLog("Wrong answer! Try again.");
        riddle3(); // Reload the question
      }
    });
  });
}

function riddle4() {
  StoryText("good job you did well so far, the last question is What has one eye but can’t see?", () => {
    addChoiceButtons(["Cyclops", "Storm", "Mirror", "Needle"], (choice) => {
      if (choice.toLowerCase() === "needle") { // Case-insensitive check
        GameLog("Correct! Moving on to the next riddle.");
        gotTheKey();
      } 
      else {
        GameLog("Wrong answer! Try again.");
        riddle4(); // Reload the question
      }
    });
  });
}

function gotTheKey(){
  StoryText("You finally got the key, good job, now let see if it's the key to open the door", () => {
    addChoiceButtons(["Next"], ()=>{
      toTheDoor();
    });
  });
}

function toTheDoor(){
  StoryText("You try the key on the door and it worked Hooray!!!", () => {
    addChoiceButtons(["Next"], ()=>{
      demonDog();
    });
  });
}

function demonDog(){
  StoryText("As you enter There was a demon wolf in front of you", () => {
    startBattle(gameState.enemies.goblin, () => {
      StoryText("You defeated the the demon dog. you see something shining in the stomach of it.", () => {
        addChoiceButtons(["Collect it", "Next"], (choice) => {
          if (choice.toLowerCase() === "Next") { // Case-insensitive check
            GameLog("You have collected a mana core.");
            riddle2();
          } 
          else {
            GameLog("Wrong answer! Try again.");
            riddle1(); // Reload the question
          }
        });
        gameState.player.hp += 10;
        GameLog("You earned some food!");
        PlayerStats();
        addChoiceButtons(["Next"], ()=>{
          demonDog();
        });
      });
    });
  });
}

