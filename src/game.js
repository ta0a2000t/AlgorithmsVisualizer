import Algorithms from "./algorithms.js"

import BST from "./bstScripts/bst.js"
import MaxHeap from "./maxHeapScripts/maxHeap.js"

export default class Game {
  constructor(gameWidth, gameHeight, nodeSize) {
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.nodeSize = nodeSize

    // left-bottom leaf position
    this.treePos = {
      x: this.nodeSize * 2,
      y: this.nodeSize * 3 // which is the diameter of node
    }

    this.algo = undefined
  }

  start(algo) {
    if(algo === Algorithms.algos.bst) {
      this.algo = new BST(this.treePos, this.nodeSize)
    } else if(algo === Algorithms.algos.maxHeap) {
      this.algo = new MaxHeap(this.treePos, this.nodeSize)
      this.algo.initEventHandler()
    }
  }

  update(deltaTime) {
    this.algo.update(deltaTime)

  }

  draw(ctx) {
    this.algo.draw(ctx)
  }

}
