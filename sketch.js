// Game State Variables
let gameState = {
  player: {
    name: "Hero",
    hp: 150,
    maxHp: 500,
    gold: 20,
    weapon: "fist"
  },
  stats:{
    strenght: 10,
    agility: 8,
    speed: 7,
    charisma: 9,
  },
  enemies: {
    goblin: { hp: 100, maxHp: 100, damage: 5, reward: 30 },
    demonDog: { hp: 150, maxHp: 150, damage: 5, reward: 45 },
    slime: { hp: 50, maxHp: 50, damage: 5, reward: 20 },
    Golem: { hp: 100, maxHp: 70, damage: 3, reward: 50 },
    Minataur: { hp: 150, maxHp: 150, damage: 3, reward: 100 },
  },
  inventory: {
    HealthPotion: 0,
    manaCore:0,
  },
};


// Merchant's Items
const merchantItems = [
  { name: "Health Potion", price: 20, effect: { hp: 20 }, description: "Restores 20 HP." },
  { name: "Water", price: 5, effect: { hp: 5 }, description: "Restores 5 HP." },
  { name: "Food", price: 10, effect: { hp: 10 }, description: "Restores 10 HP." },
  { name: "Exchange", price: 1, effect: { manaCore: 1 }, description: "Exchange 1 Mana core for 100 Gold." },
];

// HTML Elements
let storyTextElement, gameLog, playerHpElement, input;


// Initial Setup
function setup() {
  // Connect HTML elements
  storyTextElement = document.getElementById("storyText");
  gameLog = document.getElementById("output1");
  playerHpElement = document.getElementById("playerHp");
  PlayerStats();
}

// Play Background Music
function playBackgroundMusic() {
  const music = document.getElementById("backgroundMusic");
  if (music) {
    music.volume = 0.3;
    music.play();
  }
}

function clapForHim(){
  const effect = document.getElementById("bravo");
  if (effect) {
    effect.volume = 0.5;
    effect.play();
  }
}

function buttonClicking(){
  const click = document.getElementById("click");
  if (click) {
    click.volume = 0.5;
    click.play();
  }
}

function gameOverSoundEffect(){
  const lost = document.getElementById("gameOver");
  if (lost) {
    lost.volume = 0.5;
    lost.play();
  }
}

function yaySoundEffect(){
  const lost = document.getElementById("yay");
  if (lost) {
    lost.volume = 0.5;
    lost.play();
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
      gameOverSoundEffect();
      StoryText("You were defeated. Game over.");
    }
  }, 1000);
}

// Display Player Stats
function PlayerStats() {
  playerHpElement.textContent = `HP: ${gameState.player.hp}/${gameState.player.maxHp}`;
  document.getElementById("playerGold").textContent = `Gold: ${gameState.player.gold}`;
  //document.getElementById("healthPotion").textContent = `Health Potion: ${gameState.inventory.HealthPotion}`;
  //document.getElementById("manaCore").textContent = `Mana core: ${gameState.inventory.manaCore}`;
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
    GameLog(`You bought ${item.name}. ${item.description}`);
    PlayerStats();
  }
  else {
    GameLog(`You don't have enough gold to buy ${item.name}.`);
  }
}

// Inventory Management
function inventory() {
  const playerState = document.getElementById("playerState");

  // Check if inventory is already open
  if (playerState.innerHTML.trim() !== "") {
    playerState.innerHTML = ""; // Close inventory if already open
    return;
  }

  // Display inventory
  playerState.innerHTML = "<h3>Inventory</h3>";

  Object.keys(gameState.inventory).forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.textContent = `${item.charAt(0).toUpperCase() + item.slice(1)}: ${gameState.inventory[item]}`;
    output2.appendChild(itemDiv);
  });

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close Inventory";
  closeButton.onclick = () => output2.innerHTML = "";
  output2.appendChild(closeButton);
}

// Bind the "Inventory" button to the inventory function
//document.getElementById("inventory").onclick = inventory;

function character(){
  const playerState = document.getElementById("playerState");
  playerState.innerHTML = "";
}
//document.getElementById("character").onclick = character;

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
    gameState.player.gold += 100;
    GameLog("You earned 100 gold!");
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
        gameState.player.hp += 50;
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
  StoryText("You have no choose put to go in the portal",()=>{
    addChoiceButtons(["Next"], ()=>{
      theRoom();
    });
  });
}

function theRoom(){
  StoryText("You are in a room with a lot of coloful crystal and at the end of the room you see a key",()=>{
    addChoiceButtons(["Next"], ()=>{
      miniGame();
    });
  });
}

function miniGame(){
  StoryText("To get the key you need to find four good answers to my riddle challenge, are you ready?",()=>{
    addChoiceButtons(["Next"], ()=>{
      riddle1();
    });
  });
}

function riddle1() {
  StoryText("I’m light as a feather, yet the strongest person can’t hold me for five minutes. What am I?", () => {
    addChoiceButtons(["Breath", "Shadow", "Air", "Thought"], (choice) => {
      if (choice.toLowerCase() === "breath") { // Case-insensitive check
        yaySoundEffect();
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
  StoryText("The next question is What has keys but can’t open locks?", () => {
    addChoiceButtons(["Safe", "Piano", "Keyboard", "Treasure Chest"], (choice) => {
      if (choice.toLowerCase() === "keyboard") { // Case-insensitive check
        yaySoundEffect();
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
  StoryText("The next question is The more you take from me, the bigger I get. What am I?", () => {
    addChoiceButtons(["Memory", "Hole", "Mountain", "Puzzle"], (choice) => {
      if (choice.toLowerCase() === "hole") { // Case-insensitive check
        yaySoundEffect();
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
  StoryText("Good job you did well so far, the last question is What has one eye but can’t see?", () => {
    addChoiceButtons(["Cyclops", "Storm", "Mirror", "Needle"], (choice) => {
      if (choice.toLowerCase() === "needle") { // Case-insensitive check
        yaySoundEffect();
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
  clapForHim();
  StoryText("You try the key on the door and it worked Hooray!!!", () => {
    addChoiceButtons(["Next"], ()=>{
      demonDog();
    });
  });
}

function demonDog(){
  StoryText("As you enter There was a demon wolf in front of you", () => {
    startBattle(gameState.enemies.goblin, () => {
      gameState.player.gold += 10;
      StoryText("You defeated the the demon dog. you see something shining in the stomach of it.", () => {
        addChoiceButtons(["Collect it", "Next"], (choice) => {
          if (choice.toLowerCase() === "collect it") { // Case-insensitive check
            gameState.player.gold += 100;
            GameLog("You have collected a mana core, you can sell it for 35 Gold coins.");
            Knight();
          } 
          else {
            GameLog("Let's continue then");
            addChoiceButtons(["Next"], ()=>{
              Knight();
            });
          }
        });
      });
    });
  });
}

function Knight() {
  StoryText("As you continue further, you see a knight on the ground. He looks injured.", () => {
    addChoiceButtons(["Next"], () => {
      StoryText("Knight: Help, please...", () => {
        addChoiceButtons(["Next"], () => {
          StoryText("You get close to him and ask what happened.", () => {
            addChoiceButtons(["Next"], () => {
              StoryText("Knight: This cave... something is wrong with it. The monsters have become stronger all of a sudden. (you want to help him but you have no Health potion)",() => {
                if (gameState.inventory.HealthPotion > 0) {
                  // Player has a potion
                  addChoiceButtons(["Give Health potion"], () => {
                    gameState.inventory.HealthPotion -= 1; // Deduct potion
                    GameLog("You gave the knight a health potion.");
                    StoryText(
                      "The knight drinks the Health potion and recovers some strength. 'Thank you,' he says, 'take this as a token of my gratitude.' He hands you a mysterious amulet.",
                      () => {
                        gameState.player.gold += 50; // Reward player
                        GameLog("You received 50 gold and a mysterious amulet.");
                        PlayerStats();
                      }
                    );
                  });
                  addChoiceButtons(["Next"], ()=>{
                    Knight();
                  });
                }
                else {
                  // Player needs to find ingredients
                  addChoiceButtons(["Look for ingredients"], () => {
                    StoryText(
                      "You decided to search for ingredients to make a Health potion.",
                      findIngredients
                    );
                  });
                }
              });
            });
          });
        });
      });
    });
  });
}
  
function findIngredients() {
  StoryText("You venture deeper into the cave to look for the ingredients. Suddenly, a monster appears!",
    () => {
      // Start a battle with a random monster
      const randomMonster = {
        name: "Cave Beast",
        hp: 60,
        damage: 15,
        reward: 10,
      };
  
      startBattle(randomMonster, () => {
        StoryText("You defeated the Cave Beast and found some herbs nearby. These could be used to make a Health potion.",
          () => {
            GameLog("You obtained potion ingredients.");
            craftPotion();
          }
        );
      });
    }
  );
}
  
function craftPotion() {
  StoryText("You successfully craft a Health potion using the ingredients you found.", () => {
    gameState.inventory.HealthPotion += 1; // Add crafted potion
    GameLog("You crafted a Health potion.");
    addChoiceButtons(["Return to the knight"], () => {
      returnToKnight();
    });
  });
}
  
function returnToKnight() {
  StoryText(
    "You return to the knight with the Health potion. He drinks it and recovers some strength.",
    () => {
      GameLog("You gave the knight a Health potion.");
      StoryText(
        "'Thank you,' he says. 'Take this as a token of my gratitude.' He hands you a mysterious amulet.",
        () => {
          gameState.player.gold += 50; // Reward player
          GameLog("You received 50 gold and a mysterious amulet.");
          PlayerStats();
          addChoiceButtons(["Next"], () => {
            goHelp();
          });
        }
      );
    }
  );
}
  
function goHelp(){
  StoryText("I didn't came here alone, there are two peoples that continued ahead, please bring them back here, it's to dagerouse to continue.", () => {
    addChoiceButtons(["Next"], () => {
      secondMerchant();
    });
  });
}

function secondMerchant() {
  StoryText("Merchand: Hello dear adventure, What would you like to buy?", () => {
    displayMerchantItems();
    addChoiceButtons(["Next"], () => {
      fithingTheGolem();
    });
  });
}

function fithingTheGolem(){
  StoryText("You venture deeper into the cave to look for the ingredients. Suddenly, a monster appears!",
    () => {
      // Start a battle with a crystal golem
      const crystalGolem = {
        name: "crystal Golem",
        hp: 100,
        damage: 10,
      };
  
      startBattle(crystalGolem, () => {
        StoryText("You see a crystal Golem in front of you and there's someone bleeding and in terrible shape on the ground, help him.",
          () => {
            GameLog("You obtained 100 gold.");
            
          }
        );
      });
    }
  );
}








