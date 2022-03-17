import Game from "./game.js"
import Algorithms from "./algorithms.js"

let canvas = document.querySelector("#gameScreen");

let ctx = canvas.getContext("2d");

const FPS = 10;
const GAME_WIDTH = 1300;
const GAME_HEIGHT = 600;
const NODE_SIZE = 34 // radius of node

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
ctx.font = '17px serif';

let game = new Game(GAME_WIDTH, GAME_HEIGHT, NODE_SIZE);

let algorithm = undefined
if(document.body.id === "bst") {
  algorithm = Algorithms.algos.bst
} else if(document.body.id === "maxHeap") {
  algorithm = Algorithms.algos.maxHeap
}

game.start(algorithm);

let lastTime = 0;

function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;

  lastTime = timeStamp;
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  game.update(deltaTime);

  game.draw(ctx);

  setTimeout(() => {
window.requestAnimationFrame(gameLoop);
  }, 1000 / FPS);
}

window.requestAnimationFrame(gameLoop);
