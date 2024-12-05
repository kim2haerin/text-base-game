// Game State Variables
let gameState = {
  player: {
    name: 'Hero',
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
    weapon: 'Fists',
  },
  quests: {
    main: { active: false, completed: false },
    side: { active: false, completed: false },
  },
  storeItems: {
    potion: { price: 10, effect: { hp: 20 } },
    sword: { price: 50, effect: { weapon: 'Sword' } },
    shield: { price: 40, effect: { armor: 'Shield' } },
    magicPotion: { price: 100, effect: { xp: 50 } },
  },
  enemies: {
    goblin: { hp: 30, damage: 5, reward: 20 },
    bandit: { hp: 50, damage: 10, reward: 30 },
  },
  map: ['Village', 'Forest', 'Castle'],
  storyProgress: {
    waitingForResponse: false,
  },
  achievements: {
    monsterSlayer: { description: 'Defeat 10 enemies.', progress: 0, goal: 10, reward: 50 },
    explorer: { description: 'Visit all locations.', progress: 0, goal: 3, reward: 30 },
    questMaster: { description: 'Complete 3 quests.', progress: 0, goal: 3, reward: 100 },
  },
};

// Functions for Game Actions
const logMessage = (message) => {
  document.getElementById('log').innerHTML += `<br>${message}`;
  document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight; // Auto-scroll
};

const updateHealthBar = () => {
  document.getElementById('log').innerHTML += `<br>Health: ${gameState.player.hp}/${gameState.player.maxHp}`;
};

function startGame() {
  logMessage('Welcome to the RPG! Choose an action to begin.');
  showButton('quest-button');
  showButton('save-button');
  showButton('load-button');
}

function showButton(buttonId) {
  document.getElementById(buttonId).classList.remove('hidden');
}

function hideButton(buttonId) {
  document.getElementById(buttonId).classList.add('hidden');
}

function startQuest() {
  if (gameState.quests.main.active) {
    logMessage('You are already on a quest!');
    return;
  }

  logMessage('A villager approaches you with a task: "Please help us! A monster has been terrorizing our town. Will you help?"');
  showButton('yes-button');
  showButton('no-button');
  gameState.storyProgress.waitingForResponse = true;
}

function handleQuestResponse(response) {
  if (!gameState.storyProgress.waitingForResponse) {
    return;
  }

  if (response === 'yes') {
    logMessage('Villager: "Thank you, brave hero! The monster is in the Forest."');
    gameState.quests.main.active = true;
    gameState.storyProgress.waitingForResponse = false;
    hideButton('yes-button');
    hideButton('no-button');
  }
  else if (response === 'no') {
    logMessage('Villager: "I understand. Please reconsider if you can."');
    gameState.storyProgress.waitingForResponse = false;
    hideButton('yes-button');
    hideButton('no-button');
  }
  else {
    logMessage('Villager: "Please answer yes or no."');
  }
}

function saveGame() {
  localStorage.setItem('gameState', JSON.stringify(gameState));
  logMessage('Game Saved!');
}

function loadGame() {
  const savedGame = localStorage.getItem('gameState');
  if (savedGame) {
    gameState = JSON.parse(savedGame);
    logMessage('Game Loaded!');
    updateHealthBar();
  }
  else {
    logMessage('No saved game found.');
  }
}

function showAchievements() {
  for (const [key, achievement] of Object.entries(gameState.achievements)) {
    logMessage(`${achievement.description} (${achievement.progress}/${achievement.goal})`);
  }
}

// Combat Functions
function attackEnemy() {
  logMessage('You attack the enemy!');
  // Add enemy interaction here
}

// Store Functionality
function openStore() {
  logMessage('Welcome to the store! What would you like to buy?');
  for (let item in gameState.storeItems) {
    logMessage(`${item}: ${gameState.storeItems[item].price} gold`);
  }
}

// Start the game
startGame();
