import Node from "./node.js"
import ContextFunctions from "./contextFunctions.js"

// height == 0 when we have one node
export default class BST {
  constructor(position, nodeSize) {
    this.root = undefined
    this.position = position
    this.nodeSize = nodeSize
    this.height = 0

    this.STATES = {
      NOACTION: 0,
      INSERT: 1,
    }
    this.state = this.STATES.NOACTION

    this.shadedNode = undefined // shade node to visualize insertion/deletion
    this.currInsertVal = undefined

    this.doNotUpdate = false


    // defnies the distance between nodes

    //parent to child
    this.levelHeight = this.nodeSize * 1.2
    // sibling to sibling
    this.levelWidth = this.nodeSize * 1.2

  }

  update(deltaTime) {
    if(this.state === this.STATES.INSERT) {
      if(this.doNotUpdate === false) {
        this.insert(this.currInsertVal)
      } else {
        this.doNotUpdate = false
      }
    }
  }


  draw(ctx) {
    if(this.root !== undefined) {

      this.root.draw(ctx)

      if(this.shadedNode !== undefined) {
        let maxCharLength = 3
        ContextFunctions.drawNode(this.shadedNode.value, maxCharLength, ctx, this.shadedNode.position.x, this.shadedNode.position.y, this.nodeSize/2,  "green", "black", 3)
      }


    }


  }

  // takes: int
  // returns: void
  insert(value) {
    if(this.root === undefined) {
      this.height = 1
      this.root = new Node(value, {x: this.position.x, y: this.position.y}, this.nodeSize, this)
    } else {
      if(this.shadedNode === undefined) {
        this.shadedNode = this.root
        this.currInsertVal = value
        this.state = this.STATES.INSERT
        this.doNotUpdate = true // we do not want to call insert again in update() at this frame
      } else {
        if(value < this.shadedNode.value) {
          if(this.shadedNode.left === undefined) {
            this.shadedNode = undefined
            this.currInsertVal = undefined
            this.state = this.STATES.NOACTION
            this.root.bstInsert(value)
          } else {
            this.shadedNode = this.shadedNode.left
          }
        } else {
          if(this.shadedNode.right === undefined) {
            this.shadedNode = undefined
            this.currInsertVal = undefined
            this.state = this.STATES.NOACTION
            this.root.bstInsert(value)
          } else {
            this.shadedNode = this.shadedNode.right
          }
        }
      }




    }
  }


  setHeight(k) {
    this.height = k
  }

  moveLeftDown() {
    this.position.x -= (Math.pow(2, this.height - 3)) * this.levelWidth
    this.position.y += this.levelHeight
  }

}
