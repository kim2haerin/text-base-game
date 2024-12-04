// Project Title
// Your Name

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
let img;
let storyText = ""; 
let userInput = {}; 


const textElement = document.getElementById("storyText");
const gameLog = document.getElementById('game-log');
//const userInput = document.getElementById('user-input');

function setup() {
  createCanvas(windowWidth, windowHeight);
  let theTextElement = select("storyText"); // not working
  storyText="you find yourself in front a dark cave. Do you wanna go in?(Yes/No)";
  theTextElement.html(storyText);

}

function draw() {
  textSize(16);
  textAlign(LEFT);
  fill("white");
  text(storyText, 50, 150, width - 100); 
  console.log(textElement);
}

function startGame(){
  userInput = {};
  storyText="you find yourself in front a dark cave. Do you wanna go in?(Yes/No)";
  // textElement.html(storyText);

  let choice = prompt("Do you wanna go in?(Yes/No)");

  if (choice.toLowerCase() === "yes"){
    enterCave();
  }
  else{
    storyText = "maybe next time";
    gameOver = true;
    storyText.cut();
  }
}

function enterCave(){
  // let theTextElement = select("text");
  storyText = "you are now inside the cave and you hear a strange noise. there are two path in front of you. which way to go?(Left/Right)";
  // theTextElement.html(storyText);
  let choice = prompt("which way to go?(Left/Right)");

  if(choice.toLowerCase() === "right"){
    rightPath();
  }
  else if(choice.toLowerCase()==="left"){
    leftPath();
  }
}

function RightPath(){
  storyText = "you take the right path and on your way you find a small knife";
}



