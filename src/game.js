import BST from "./bst.js"
import InputHandler from "./inputHandler.js"
 
export default class Game {
  constructor(gameWidth, gameHeight, nodeSize) {
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.nodeSize = nodeSize
    let bstPos = {
      x: gameWidth / 2,
      y: 50
    }

    this.bst = new BST(bstPos, this.nodeSize)
  }

  start() {
    new InputHandler(this)
  }

  update(deltaTime) {
    this.bst.update(deltaTime)

  }

  draw(ctx) {
    this.bst.draw(ctx)
  }

}
