import Algorithms from "./algorithms.js"

import BST from "./bstScripts/bst.js"
import MaxHeap from "./maxHeapScripts/maxHeap.js"

export default class Game {
  constructor(gameWidth, gameHeight, nodeSize) {
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.nodeSize = nodeSize

    this.treePos = {
      x: gameWidth / 2,
      y: gameHeight/ 2 // which is the diameter of node
    }

    this.algo = undefined
  }

  start(algo) {
    if(algo === Algorithms.bst) {
      this.algo = new BST(this.treePos, this.nodeSize)
    } else if(algo === Algorithms.maxHeap) {
      this.algo = new MaxHeap(this.treePos, this.nodeSize)
    }
  }

  update(deltaTime) {
    this.algo.update(deltaTime)

  }

  draw(ctx) {
    this.algo.draw(ctx)
  }

}
