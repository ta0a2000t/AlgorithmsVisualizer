import Game from "./game.js"

let canvas = document.querySelector("#gameScreen");

let ctx = canvas.getContext("2d");

const FPS = 1;
const GAME_WIDTH = 1300;
const GAME_HEIGHT = 600;
const NODE_SIZE = 40 // radius of node

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
ctx.font = '17px serif';

let game = new Game(GAME_WIDTH, GAME_HEIGHT, NODE_SIZE);

game.start();

let lastTime = 0;

function gameLoop(timeStamp) {
  //console.log("new")
  //console.log("newww")
  let deltaTime = timeStamp - lastTime;

  lastTime = timeStamp;
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  game.update(deltaTime);

  game.draw(ctx);
  //console.log("-------------------------------------------")

  setTimeout(() => {
window.requestAnimationFrame(gameLoop);
  }, 1000 / FPS);
}

window.requestAnimationFrame(gameLoop);
