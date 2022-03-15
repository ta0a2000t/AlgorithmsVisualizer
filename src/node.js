import ContextFunctions from "./contextFunctions.js"

export default class Node {
  constructor(value, position, nodeSize, tree) {
    this.value = value
    this.left = undefined
    this.right = undefined
    this.position = position
    this.nodeSize = nodeSize
    this.tree = tree
    this.count = 1; // number of nodes in subtree
  }

  update(deltaTime) {

  }

  draw(ctx) {
    if(this.left !== undefined) {
      // draw a line from this node to the child
      ctx.beginPath();
      ctx.lineWidth="2";
      ctx.strokeStyle="rgba(255, 0, 0, 1)"; // red
      ctx.moveTo(this.position.x,this.position.y + this.nodeSize/2); // start from below the node circle
      ctx.lineTo(this.left.position.x + this.nodeSize/10, this.left.position.y - this.nodeSize/2); // end above the child circle
      ctx.stroke();

      this.left.draw(ctx)
    }
    if(this.right !== undefined) {
      // draw a line from this node to the child
      ctx.beginPath();
      ctx.lineWidth="2";
      ctx.strokeStyle="rgba(0, 0, 255, 1)"; // blue
      ctx.moveTo(this.position.x, this.position.y + this.nodeSize/2); // start from below the node circle
      ctx.lineTo(this.right.position.x  - this.nodeSize/10, this.right.position.y - this.nodeSize/2); // end above the child circle
      ctx.stroke();

      this.right.draw(ctx)
    }

    let maxCharLength = 3
    ContextFunctions.drawNode(this.value, maxCharLength, ctx, this.position.x, this.position.y, this.nodeSize/2,  undefined, "black", 2)
  }

  setLeft(newNode) {
    this.left = newNode
  }

  setRight(newNode) {
    this.right = newNode
  }

  // returns max height of this subtree
  getHeight() {
    let leftHeight = 0
    let rightHeight = 0

    if(this.left !== undefined) {
      leftHeight = this.left.getHeight()
    }
    if(this.right !== undefined) {
      rightHeight = this.right.getHeight()
    }
    return 1 + Math.max(leftHeight, rightHeight)
  }

  bstInsert(value) {
    let curr = this
    let prev = curr
    let insertLeft = false

    while(curr !== undefined) {
      curr.count += 1 // since we will insert this below this node

      prev = curr
      if(value < curr.value) {
        insertLeft = true

        curr = curr.left

      } else {
        insertLeft = false

        curr = curr.right
      }
    }

    let newNode = new Node(value, {x:undefined, y: undefined} ,this.nodeSize, this.tree)
    if(insertLeft === true) {

      prev.setLeft(newNode)
    } else {
      prev.setRight(newNode)
    }

    this.setPositions()
  }

  setPositions() {
    let allLevels = new Array(0)
    // store all levels in allLevels as a complete/full tree
    // breadth first search
    let q = new Array(0) // curr level
    q.push(this)
    while(q.length > 0) {
      const belowLevel = new Array(0)
      let levelHasANode = false
      q.forEach((node) => {
        if(node.value !== undefined) {
          levelHasANode = true
        }
        if(node.left !== undefined) {
          belowLevel.push(node.left)
        } else {
          belowLevel.push(new Node(undefined, {x: undefined, y: undefined}, this.nodeSize, this.tree))
        }
        if(node.right !== undefined) {
          belowLevel.push(node.right)
        } else {
          belowLevel.push(new Node(undefined, {x: undefined, y: undefined}, this.nodeSize, this.tree))
        }

      })



      if(levelHasANode !== true) { // stop and dont add to allLevels, when all nodes in the level are empty
        break;
      }

      allLevels.push(q)

      q = belowLevel
    }
    // allLevels = [[root], [root.left, root.right], ....[leafs]]

    // start from leftmost leaf
    const treeHeight = allLevels.length
    if(treeHeight > this.tree.height) { // when level increases
      this.tree.setHeight(treeHeight)
      this.tree.moveLeftDown()
    } else if(treeHeight < this.tree.height) { // when level decreases
      this.tree.setHeight(treeHeight)
      this.tree.moveRightUp()
    }

    // set the positions of the leafs
    let leafLevel = allLevels[allLevels.length - 1]
    for(let i = 0; i < leafLevel.length; i += 1) {
      const node = leafLevel[i]
      node.position.x = this.tree.position.x + (i * this.tree.levelWidth)
      node.position.y = this.tree.position.y
    }



    // let each parent have the average of pos.x of both children
    // start from the level above the leaf level
    for(let level = allLevels.length - 2; level >= 0; level -= 1) {
      let currLevel = allLevels[level]

      for(let i = 0; i < currLevel.length; i += 1) {
        let node = currLevel[i]
        const leftChild = allLevels[level + 1][2*i]
        const rightChild = allLevels[level + 1][2*i + 1]
        node.position.y = leftChild.position.y - this.tree.levelHeight

        node.position.x = (leftChild.position.x + rightChild.position.x) /2
      }
    }


  }





}
