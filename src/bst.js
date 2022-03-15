import Node from "./node.js"
import ContextFunctions from "./contextFunctions.js"
import ElementsModifier from "./elementsModifier.js"

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
      DELETE_FIND: 2, // finding the item to delete
      FINDINORDER: 3, // finding an in-order-successor of the item to delete
      DELETING: 4 // shade deleted node with red
    }

    this.state = this.STATES.NOACTION

    this.shadedNode = undefined // shade node to visualize insertion/deletion
    this.currInsertVal = undefined
    this.currDeleteVal = undefined

    this.doNotUpdate = false

    this.shadedNodeParent = undefined // to delete the node from its parent

    this.toBeDeletedNode = undefined

    this.parentOfInOrderSuccessor = undefined // parent
    this.toBeDeletedInOrderSuccessor = undefined // in order successor (will be a leaf)
    this.findLeftMostGrandsonNode = undefined // this will be left child (undefined)


    // defnies the distance between nodes

    //parent to child
    this.levelHeight = this.nodeSize * 1.2
    // sibling to sibling
    this.levelWidth = this.nodeSize * 1.2

  }

  update(deltaTime) {
    console.log(this.state)
    if(this.state === this.STATES.INSERT) {
      if(this.doNotUpdate === false) {
        this.insert(this.currInsertVal)
      } else {
        this.doNotUpdate = false
      }
    } else if(this.state === this.STATES.DELETE_FIND) {
        if(this.doNotUpdate === false) {
          this.delete(this.currDeleteVal)
        } else {
          this.doNotUpdate = false
        }
      } else if(this.state === this.STATES.DELETING) {
        if(this.doNotUpdate === false) {
          this.toBeDeletedNode = undefined
          this.toBeDeletedInOrderSuccessor = undefined // for the 2 child case
          this.state = this.STATES.NOACTION
          if(this.root !== undefined) { // does not run when deleted root and now tree is empty
            this.root.setPositions() // fixes the positions
            this.height = this.root.getHeight()
          } else {
            this.height = 0
          }

        } else {
          this.doNotUpdate = false
        }
      } else if(this.state === this.STATES.FINDINORDER) {
        this.findLeftMostGrandson()
      } else if(this.state === this.STATES.NOACTION) {
        ElementsModifier.setActionMessage("No action.")
      }
  }


  draw(ctx) {
    if(this.root !== undefined) {

      this.root.draw(ctx)
    }

    let maxCharLength = 3

    if(this.shadedNode !== undefined) {
      let node = this.shadedNode
      let color = "green"
      ContextFunctions.drawNode(node.value, maxCharLength, ctx, node.position.x, node.position.y, this.nodeSize/2,  color, "black", 3)
    }

    if(this.toBeDeletedNode !== undefined) {
      let node = this.toBeDeletedNode
      let color = "red"
      ContextFunctions.drawNode(node.value, maxCharLength, ctx, node.position.x, node.position.y, this.nodeSize/2,  color, "black", 3)

    }

    if(this.toBeDeletedInOrderSuccessor !== undefined) {
      let node = this.toBeDeletedInOrderSuccessor
      let color = "blue"
      ContextFunctions.drawNode(node.value, maxCharLength, ctx, node.position.x, node.position.y, this.nodeSize/2,  color, "black", 3)
    }


  }

  // takes: int
  // returns: void
  insert(value) {
    if(this.root === undefined) {
      ElementsModifier.setActionMessage("Tree is empty. Let " + value + " be the root.")

      this.height = 1
      this.doNotUpdate = true

      this.root = new Node(value, {x: this.position.x, y: this.position.y}, this.nodeSize, this)
    } else {

      if(this.shadedNode === undefined) {
        ElementsModifier.setActionMessage("Search for " + value + " in the tree...")

        this.shadedNode = this.root
        this.currInsertVal = value
        this.state = this.STATES.INSERT
        this.doNotUpdate = true // we do not want to call insert again in update() at this frame
      } else {
        if(value < this.shadedNode.value) {
          ElementsModifier.setActionMessage(value + " is less than " + this.shadedNode.value)

          if(this.shadedNode.left === undefined) {
            this.shadedNode = undefined
            this.currInsertVal = undefined
            this.state = this.STATES.NOACTION
            this.root.bstInsert(value)
          } else {
            this.shadedNode = this.shadedNode.left
          }
        } else if(value > this.shadedNode.value) {
          ElementsModifier.setActionMessage(value + " is greater than " + this.shadedNode.value)

          if(this.shadedNode.right === undefined) {
            this.shadedNode = undefined
            this.currInsertVal = undefined
            this.state = this.STATES.NOACTION
            this.root.bstInsert(value)
          } else {
            this.shadedNode = this.shadedNode.right
          }
        } else {
          ElementsModifier.setActionMessage(value + " is already here! ")

          this.shadedNode = undefined
          this.currInsertVal = undefined
          this.state = this.STATES.NOACTION

        }
      }

    }
  }


  delete(value) {
    if(this.root === undefined) {
      ElementsModifier.setActionMessage(value + " Not Found")
      return // nothing to delete
    } else if(value == this.root.value) {
      ElementsModifier.setActionMessage("Deleting root...")
      this.toBeDeletedNode = this.root
      BST.deleteRoot(this.root, this)

    } else {

      if(this.shadedNode === undefined) {
        this.shadedNode = this.root
        this.currDeleteVal = value
        this.state = this.STATES.DELETE_FIND
        this.doNotUpdate = true // we do not want to call insert again in update() at this frame
      } else {
        if(value < this.shadedNode.value) {
          ElementsModifier.setActionMessage(value + " is less than " + this.shadedNode.value)
          if(this.shadedNode.left === undefined) {
            ElementsModifier.setActionMessage(value + " Not Found")
            this.state = this.STATES.NOACTION
            this.shadedNode = undefined
            this.shadedNodeParent = undefined
          } else { // go left
            this.shadedNodeParent = this.shadedNode
            this.shadedNode = this.shadedNode.left
          }
        } else if(value > this.shadedNode.value){
          ElementsModifier.setActionMessage(value + " is greater than " + this.shadedNode.value)
          if(this.shadedNode.right === undefined) {
            ElementsModifier.setActionMessage(value + " Not Found")
            this.state = this.STATES.NOACTION
            this.shadedNode = undefined
            this.shadedNodeParent = undefined
          } else { // go right
            this.shadedNodeParent = this.shadedNode
            this.shadedNode = this.shadedNode.right
          }
        } else { // when (value === this.shadedNode.value)
          this.toBeDeletedNode = this.shadedNode

          if(this.shadedNode === this.shadedNodeParent.left) {
            BST.deleteLeft(this.shadedNodeParent, this)
          } else {
            BST.deleteRight(this.shadedNodeParent, this)
          }
          this.shadedNode = undefined
          this.currDeleteVal = undefined
        }
      }

    }
  }


  setHeight(k) {
    this.height = k
  }

  // used to adjust the positioon of the tree since it moves up and right each time we add a new level
  moveLeftDown() {
    this.position.x -= (Math.pow(2, this.height - 3)) * this.levelWidth
    this.position.y += this.levelHeight
  }
  moveRightUp() {
    console.log(this.height)
    this.position.x += (Math.pow(2, this.height - 2)) * this.levelWidth
    this.position.y -= this.levelHeight

  }

  static deleteRoot(root, bstTree) {
    let toDelete = root
    if(toDelete.left === undefined && toDelete.right === undefined) {    // leaf deletion
      bstTree.root = undefined
      bstTree.shadedNodeParent = undefined
      bstTree.state = bstTree.STATES.DELETING
      bstTree.doNotUpdate = true

    } else if(toDelete.left === undefined || toDelete.right === undefined) { // single child case
      let newRoot;

      if(toDelete.left === undefined) {
        newRoot = toDelete.right
      } else { // when (toDelete.right === undefined)
        newRoot = toDelete.left
      }

      //make the root the defined child current root
      bstTree.root = newRoot
      bstTree.shadedNodeParent = undefined
      bstTree.state = bstTree.STATES.DELETING
      bstTree.doNotUpdate = true

    } else { // two child case: node.left has both childs
      bstTree.state = bstTree.STATES.FINDINORDER // red node stays red

      ElementsModifier.setActionMessage("Finding in order successor of  " + toDelete.value + " ...")
      bstTree.toBeDeletedInOrderSuccessor = toDelete.right
    }
  }


  // deletes the left child
  // fixes the tree
  // assumes left is a node (not undefined)
  static deleteLeft(node, bstTree) {
    let toDelete = node.left
    if(toDelete.left === undefined && toDelete.right === undefined) {    // leaf deletion
      node.left = undefined
      bstTree.shadedNodeParent = undefined
      bstTree.state = bstTree.STATES.DELETING

    } else if(toDelete.left === undefined || toDelete.right === undefined) { // single child case
      let definedGrandSon;

      if(toDelete.left === undefined) {
        definedGrandSon = toDelete.right
      } else { // when (toDelete.right === undefined)
        definedGrandSon = toDelete.left
      }

      //make the left child of node be the grandson
      node.left = definedGrandSon
      bstTree.shadedNodeParent = undefined
      bstTree.state = bstTree.STATES.DELETING

    } else { // two child case: node.left has both childs
      bstTree.state = bstTree.STATES.FINDINORDER // red node stays red

      ElementsModifier.setActionMessage("Finding in order successor of  " + toDelete.value + " ...")
      bstTree.toBeDeletedInOrderSuccessor = toDelete.right
    }
  }

  // deletes the right child
  // fixes the tree
  // assumes right is a node (not undefined)
  static deleteRight(node, bstTree) {
    let toDelete = node.right //
    if(toDelete.left === undefined && toDelete.right === undefined) {    // leaf deletion
      node.right = undefined //
      bstTree.shadedNodeParent = undefined
      bstTree.state = bstTree.STATES.DELETING

    } else if(toDelete.left === undefined || toDelete.right === undefined) { // single child case
      let definedGrandSon;

      if(toDelete.left === undefined) {
        definedGrandSon = toDelete.right
      } else { // when (toDelete.right === undefined)
        definedGrandSon = toDelete.left
      }

      //make the right child of node be the grandson
      node.right = definedGrandSon
      bstTree.shadedNodeParent = undefined
      bstTree.state = bstTree.STATES.DELETING

    } else { // two child case: node.left has both childs
      bstTree.state = bstTree.STATES.FINDINORDER // red node stays red

      ElementsModifier.setActionMessage("Finding in order successor of  " + toDelete.value + " ...")
      bstTree.toBeDeletedInOrderSuccessor = toDelete.right
    }
  }

  // note: toDelte is the same as this.toBeDeletedNode
  findLeftMostGrandson(){
    if(this.toBeDeletedInOrderSuccessor.left !== undefined) { // this will always run the first time since toDelete.right is not undefined
      this.parentOfInOrderSuccessor = this.toBeDeletedInOrderSuccessor // will be toDelete.right after first iter
      this.toBeDeletedInOrderSuccessor = this.toBeDeletedInOrderSuccessor.left // will be toDelete.right.left after first iter

    } else { // now we reached the end, deleting...
      ElementsModifier.setActionMessage(this.toBeDeletedInOrderSuccessor.value + " is the in order successor of  " + this.toBeDeletedNode.value + ". Swithing values...")

      if(this.parentOfInOrderSuccessor === undefined) { // when the above never runs, so toBeDeleted.right.left === undefined
        // this.toBeDeletedNode.right is the in order successor
        this.toBeDeletedNode.right = this.toBeDeletedInOrderSuccessor.right // same as this.toBeDeletedNode.right.right
      } else { // delete the left child of the parent
        this.parentOfInOrderSuccessor.left = this.toBeDeletedInOrderSuccessor.right
        this.parentOfInOrderSuccessor = undefined // no longer needed
      }
      // swithing values..
      let temp = this.toBeDeletedNode.value
      this.toBeDeletedNode.value = this.toBeDeletedInOrderSuccessor.value
      this.toBeDeletedInOrderSuccessor.value = temp

      //switching colors...
      let tempNode = this.toBeDeletedInOrderSuccessor
      this.toBeDeletedInOrderSuccessor = this.toBeDeletedNode
      this.toBeDeletedNode = tempNode

      this.doNotUpdate = true
      this.state = this.STATES.DELETING
    }
  }



}
