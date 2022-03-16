export default class MaxHeap {
  constructor(position, nodeSize) {
    new InputHandler(this)

    this.positoin = position
    this.nodeSize = nodeSize
    this.STATES = {
      NOACTION: 0,
      INSERT: 1, // traversing down
      INSERTING: 2, // at the end (aka now add it)
      SIFT_UP: 3, // traverse up after insert  (heapify)

      DELETE: 4, // mark root red
      FIND_REPLACEMENT: 5, // finds replacement of the marked root at the leaf
      DELETING: 6, // replace the value/colors of the leaf and the root
      SIFT_DOWN: 7
    }

    this.state = this.STATES.NOACTION
  }
}
