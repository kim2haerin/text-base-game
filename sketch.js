// Project Title
// Your Name

let  gameOver = false;
let playerHealth = 100;
let PlayerInventory = [];
let playerLevel = 1;
let img;
let storyText = ""; 
let userInput = {}; 


const textElement = document.getElementById("text");

function setup() {
  createCanvas(windowWidth, windowHeight);
  startGame();
}

function draw() {
  //background(0);
  textSize(16);
  textAlign(LEFT);
  fill("white");
  text(storyText, 50, 150, width - 100);
  
}

function startGame(){
  state = {};
  showTextNode(1);
}

function showTextNode(textNodeIndex){
  const textNode = textNodes.find(textNode => textNode.id === 
    textNodeIndex);
  textElement.innerText = textNode.text;
}



