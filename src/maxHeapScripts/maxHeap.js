import InputHandler from "./inputHandler.js"
import Node from "../node.js"
import ContextFunctions from "../contextFunctions.js"


export default class MaxHeap {
  constructor(position, nodeSize) {

    //////////////NECESSARY FOR ALL TREES////////////
    this.actionHistroy = new Array(0) // for undo

    this.root = undefined
    this.nodeSize = nodeSize

    // these states can differ by tree
    this.STATES = {
      NOACTION: 0,
      //insert() // add it to the end of the array and mark it blue, switch to SIFT_UP state
      SIFT_UP: 2, // heapify, traverse up, switch to NOACTION state

      //extract() // mark root red, switch to FIND_REPLACEMENT state
      FIND_REPLACEMENT: 4, // finds replacement of the marked root at the leaf with blue color, and replace the value/colors of the leaf and the root, then switch to DELETING
      //DELETING: 6, // remove the red node, switch to SIFT_DOWN state
      //SIFT_DOWN: 7 // sift the blue node down, switch to NOACTION
    }

    this.state = this.STATES.NOACTION

    // below used by Node ////

    this.position = position // position of the bottom left leaf node

    // defnies the distance between nodes
    //distance from parent to child
    this.levelHeight = this.nodeSize * 2
    // distance from sibling to sibling
    this.levelWidth = this.nodeSize * 3

    // above used by Node ////

    ////////////////////////////////////////////////////////////////


    this.array = new Array(0) // root at array[0]
    this.size = 0


    this.doNotUpdate = false


     // for sifting
     this.blueNode = undefined
     this.blueIndex = undefined

    this.redNode = undefined
    this.redIndex = undefined
  }

  // this is called from Game class
  // event listener must only be called ONCE
  initEventHandler() {
    new InputHandler(this)
  }

  update(deltaTime) {

    if(this.state === this.STATES.INSERT) {
      if(this.doNotUpdate === false) {

      } else {
        this.doNotUpdate = false
      }
    } else if(this.state === this.STATES.SIFT_UP) {
      if(this.doNotUpdate === false) {
        this.siftUp()
      } else {
        this.doNotUpdate = false
      }
    } else if(this.state === this.STATES.FIND_REPLACEMENT) {
      if(this.doNotUpdate === false) {
        this.siftDown()
      } else {
        this.doNotUpdate = false
      }
    }

  }

  draw(ctx) {
    if(this.root != undefined) {
      this.root.draw(ctx)
    }
    let maxCharLength = 3

    if(this.blueNode !== undefined) {
      let node = this.blueNode
      let color = "blue"
      ContextFunctions.drawNode(node.value, maxCharLength, ctx, node.position.x, node.position.y, this.nodeSize/2,  color, "black", 3)
    }
    if(this.redNode !== undefined) {
      let node = this.redNode
      let color = "red"
      ContextFunctions.drawNode(node.value, maxCharLength, ctx, node.position.x, node.position.y, this.nodeSize/2,  color, "black", 3)
    }
    ContextFunctions.drawNodeArray(ctx, "#e9f0e9", "#0b780b", 2, this.blueIndex, this.redIndex, this.array, this.position.x + 50, this.position.y - this.nodeSize * 2, this.nodeSize)
  }

  isNOACTION() {
    return this.state === this.STATES.NOACTION
  }

  undo() {

    if(this.actionHistroy.length > 0) {
      let prevTree = this.actionHistroy.pop()
      this.updateAttributes(prevTree)
    }
  }

  // runs whenever we press a button, othr than undoButton
  pushActionHistory() {
    this.actionHistroy.push(this.deepCopy())
  }

  // returns a deep copied version of this tree
  deepCopy() {
    let newPos = {
      x: this.position.x,
      y: this.position.y
    }
    let newTree = new MaxHeap(newPos, this.nodeSize)

    newTree.size = this.size

    if(this.root !== undefined) {
      newTree.root = this.root.deepCopy(newTree)

      newTree.array = MaxHeap.buildArray(newTree.root, newTree.size)
    }


    // this is only run when isNOACTION
    // so there is no defined red/blue nodes, no need to copy them

    return newTree
  }

  static buildArray(root, size) {
    let array = new Array(size)
    MaxHeap.buildArrayAux(root, array, 0)
    return array
  }

  // recursive
  static buildArrayAux(node, array, index) {
    array[index] = node
    if(node.left !== undefined) {
      MaxHeap.buildArrayAux(node.left, array, 2 * index + 1)
    }
    if(node.right !== undefined) {
      MaxHeap.buildArrayAux(node.right, array, 2 * index + 2)
    }
  }

  // sets the current entries of this tree into those of the deep copied tree
  updateAttributes(prevTree) {
    this.position = prevTree.position
    this.size = prevTree.size
    this.root = prevTree.root
    this.array = prevTree.array
  }


  insert(value) {
    if(this.size === 0) {
      let newNode = new Node(value, {x: this.position.x, y: this.position.y}, this.nodeSize, this)

      this.array.push(newNode)
      this.root = newNode
      this.size += 1
      this.setBlue(newNode, this.size - 1)


    } else {

      let newNode = new Node(value, {x: undefined, y:undefined}, this.nodeSize, this)

      // 2i + 1 left child ,,,,,2i + 2 right child
      let index = this.size
      this.array[index] = newNode

      if(index % 2 === 0) { // inserting as right child
        let parentIndex = (index - 2) / 2
        let parentNode = this.array[parentIndex]
        parentNode.setRight(newNode)

      } else { // inserting as left child
        let parentIndex = (index - 1) / 2
        let parentNode = this.array[parentIndex]
        parentNode.setLeft(newNode)
      }

      this.size += 1
      this.setBlue(newNode, this.size - 1)
      this.root.setPositions()
    }
    this.doNotUpdate = true
    this.state = this.STATES.SIFT_UP
  }

  siftUp() {
    let index = this.blueIndex

    if(index === 0) { // reached root
      this.setBlue(undefined, undefined)
      this.state = this.STATES.NOACTION

    } else {

      let parentNode = undefined
      let parentIndex = undefined

      if(index % 2 === 0) { // inserting as right child
        parentIndex = (index - 2) / 2
        parentNode = this.array[parentIndex]

      } else { // inserting as left child
        parentIndex = (index - 1) / 2
        parentNode = this.array[parentIndex]
      }

      // go up if > parent
      if(parentNode.value < this.blueNode.value) {
        // swap values
        let temp = parentNode.value
        parentNode.setValue(this.blueNode.value)
        this.blueNode.setValue(temp)
        // make the parent the blue node
        this.setBlue(parentNode, parentIndex)

      } else { // stop
        this.setBlue(undefined, undefined)
        this.state = this.STATES.NOACTION
      }
    }

  }


  extract() {
    if(this.size > 0) {
      this.setRed(this.root, 0)
      this.state = this.STATES.FIND_REPLACEMENT
      this.doNotUpdate = true
    }
  }


  siftDown() {
    if(this.size === 1) { // removing the root
      this.size -= 1
      this.root = undefined
      this.setRed(undefined, undefined)
      this.state = this.STATES.NOACTION
      this.array.pop()
    } else { // mark the last node blue

      if(this.blueNode === undefined) {
        // just mark it at this frame

        this.setBlue(this.array[this.size - 1], this.size - 1)

      } else { // marked in prev frame
        if(this.redIndex === 0) { // if have not swapped yet
          // swap values
          let tempVal = this.redNode.value
          this.redNode.value = this.blueNode.value
          this.blueNode.value = tempVal

          // swap colors: blue & red
          let tempNode = this.redNode
          let tempIndex = this.redIndex
          this.setRed(this.blueNode, this.blueIndex)
          this.setBlue(tempNode, tempIndex)



        } else { // if already swapped
          if(this.redNode !== undefined) { // remove the red

            // remove it from its parentNode
            let parentNode = undefined
            let parentIndex = undefined
            let index = this.redIndex

            if(index % 2 === 0) { // deleting right child
              parentIndex = (index - 2) / 2
              parentNode = this.array[parentIndex]
              parentNode.setRight(undefined)
            } else { // deleting left child
              parentIndex = (index - 1) / 2
              parentNode = this.array[parentIndex]
              parentNode.setLeft(undefined)
            }


            // remove from end of array & clear red
            this.setRed(undefined, undefined)
            this.array.pop()

          } else { // now move down
            let child = this.blueNode.left
            if(child !== undefined && child.value > this.blueNode.value) {
               // swapp w left child
                // replace value
                let tempVal = child.value
                child.value = this.blueNode.value
                this.blueNode.value = tempVal
                // reset blue
                let childIndex = 2 * this.blueIndex + 1
                this.setBlue(child, childIndex)

            } else {
              child = this.blueNode.right
              if(child !== undefined && child.value > this.blueNode.value) {
                 // swapp w right child
                 // replace value
                 let tempVal = child.value
                 child.value = this.blueNode.value
                 this.blueNode.value = tempVal
                 // reset blue
                 let childIndex = 2 * this.blueIndex + 2
                 this.setBlue(child, childIndex)

              } else {
                // stop sifting
                this.size -= 1
                this.setBlue(undefined, undefined)
                this.state = this.STATES.NOACTION
              }


          }



          }
        }
      }

    }
  }

  setRed(node, index) {
    this.redNode = node
    this.redIndex = index
  }

  setBlue(node, index) {
    this.blueNode = node
    this.blueIndex = index
  }



}
