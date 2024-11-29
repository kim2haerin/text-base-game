// Project Title
// Your Name

let  gameOver = false;
let playerHealth = 100;
let PlayerInventory = [];
let playerLevel = 1;
let img;

const textElement = document.getElementById("text");

function setup() {
  createCanvas(windowWidth, windowHeight);
}

//function draw() {
// background(220);
//}

function startGame(){
  console.log("welcome to adventure game!");
  console.log("you find yourself in front a dark cave. Do you wanna go in?(Yes/No)");

  let choice = prompt("Do you wanna go in?(Yes/No)");

  if (choice.toLowerCase() === "yes"){
    enterCave();
  }
  else{
    console.log("maybe next time");
    gameOver = true;
  }
}

function enterCave(){
  console.log("you are now inside the cave and you hear a strange noise");
  console.log("there are two path in front of you. which way to go?(Left/Right)");
  let choice = prompt("which way to go?(Left/Right)");

  if(choice.toLowerCase() === "right"){
    rightPath();
  }
  else if(choice.toLowerCase()==="left"){
    leftPath();
  }
}

function RightPath(){
  console.log("you take the right path and on your way you find a small knife");
}
