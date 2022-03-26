import ContextFunctions from "./contextFunctions.js"

export default class Node {
  constructor(value, position, nodeSize, tree) {
    this.value = value
    this.left = undefined
    this.right = undefined
    this.position = position
    this.nodeSize = nodeSize
    this.tree = tree

    this.parent = undefined
  }

  update(deltaTime) {

  }

  draw(ctx) {
    if(this.left !== undefined) {
      // draw a line from this node to the child
      ctx.beginPath();
      ctx.lineWidth="3";
      ctx.strokeStyle="rgba(255, 0, 0, 1)"; // red
      ctx.moveTo(this.position.x,this.position.y + this.nodeSize/2); // start from below the node circle
      ctx.lineTo(this.left.position.x, this.left.position.y - this.nodeSize/2); // end above the child circle
      ctx.stroke();

      this.left.draw(ctx)
    }
    if(this.right !== undefined) {
      // draw a line from this node to the child
      ctx.beginPath();
      ctx.lineWidth="3";
      ctx.strokeStyle="rgba(0, 0, 255, 1)"; // blue
      ctx.moveTo(this.position.x, this.position.y + this.nodeSize/2); // start from below the node circle
      ctx.lineTo(this.right.position.x, this.right.position.y - this.nodeSize/2); // end above the child circle
      ctx.stroke();

      this.right.draw(ctx)
    }

    let maxCharLength = 3
    ContextFunctions.drawNode(this.value, maxCharLength, ctx, this.position.x, this.position.y, this.nodeSize/2,  undefined, "black", 2)
  }

  // returns a deep copied reference to this node
  deepCopy(newTree) {
    let newPos = undefined
    if(this.position !== undefined) {
      newPos = {
        x: this.position.x,
        y: this.position.y
      }
    }

    let newNode = new Node(this.value, newPos, this.nodeSize, newTree)
    if(this.left !== undefined) {
      newNode.left = this.left.deepCopy(newTree)
    }
    if(this.right !== undefined) {
      newNode.right = this.right.deepCopy(newTree)
    }
    return newNode
  }

  setLeft(newNode) {
    this.left = newNode
  }

  setRight(newNode) {
    this.right = newNode
  }

  setValue(value) {
    this.value = value
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


  // must be called from the root
  // fixes the positions of the tree
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
          //belowLevel.push(new Node(undefined, {x: undefined, y: undefined}, this.nodeSize, this.tree))
        }
        if(node.right !== undefined) {
          belowLevel.push(node.right)
        } else {
          //belowLevel.push(new Node(undefined, {x: undefined, y: undefined}, this.nodeSize, this.tree))
        }

      })



      if(levelHasANode !== true) { // stop and dont add to allLevels, when all nodes in the level are empty
        break;
      }

      allLevels.push(q)

      q = belowLevel
    }
    // allLevels = [[root], [root.left, root.right], ....[leafs]]



    this.position.x = this.tree.position.x // for root

    // start from the root level
    for(let level = 0; level < allLevels.length; level += 1) {
      let currLevel = allLevels[level]
      const levelPosMap = new Map();

      for(let i = 0; i < currLevel.length; i += 1) {
        let node = currLevel[i]

        node.position.y = this.tree.position.y + this.tree.levelHeight * (level)
        //node.position.x = this.tree.position.x //this.tree.position.x + i * this.tree.levelWidth
        let leftNodeX = this.tree.position.x
        while(levelPosMap.get(leftNodeX) !== undefined) {
          leftNodeX += this.tree.levelWidth
        }

        if(node.left !== undefined) {
          node.left.position.x = leftNodeX
          levelPosMap.set(node.left.position.x, 123)
        }

        if(node.right !== undefined) {
          node.right.position.x = leftNodeX + this.tree.levelWidth
          levelPosMap.set(node.right.position.x, 123)
        }

      }
    }


    let adjusting = true
    while(adjusting === true) {
      // let each parent have the average of pos.x of both children
      // start from the level above the leaf level
      adjusting = false

      for(let level = allLevels.length - 2; level >= 0; level -= 1) {
        let currLevel = allLevels[level]

        for(let i = 0; i < currLevel.length; i += 1) {
          let node = currLevel[i]
          if(node.left !== undefined || node.right !== undefined) {
            if(node.left !== undefined && node.right !== undefined) {
              node.position.x = (node.left.position.x + node.right.position.x) / 2
            } else if(node.left !== undefined) {
              node.position.x = node.left.position.x + this.tree.levelWidth * 0.52 //Math.cos(Math.PI/4)
            } else if(node.right !== undefined) {
              node.position.x = node.right.position.x - this.tree.levelWidth * 0.52 //Math.cos(Math.PI/4)
            }
          }
        }
      }

      // start from the root level
      for(let level = 0; level < allLevels.length; level += 1) {
        let currLevel = allLevels[level]
        for(let i = 0; i < currLevel.length; i += 1) {
          let node = currLevel[i]

          // detect too close nodes and move them
          for(let j = 0; j < i; j += 1) { // move if close to prev nodes
            let prevNode = currLevel[j]

            if(Math.abs(prevNode.position.x - node.position.x) < this.tree.levelWidth) {
              adjusting = true
              let newXPos = this.tree.levelWidth + prevNode.position.x
              let nodeXAdjust = newXPos - node.position.x
              node.moveSubTree(nodeXAdjust)
            }
          }

        }
      }


    }



  }

  //moves subtree by nodeXAdjust horizontal
  moveSubTree(nodeXAdjust) {
    this.position.x += nodeXAdjust
    if(this.left !== undefined) {
      this.left.moveSubTree(nodeXAdjust)
    }
    if(this.right !== undefined) {
      this.right.moveSubTree(nodeXAdjust)
    }
  }



}
