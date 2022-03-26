export default class InputHandler {
  constructor(maxHeap) {

    document.querySelector("#insertButton").addEventListener("click", insertMinHeap)
    document.querySelector("#extractButton").addEventListener("click", extractMinHeap)
    document.querySelector("#undoButton").addEventListener("click", undoMinHeap)

    function insertMinHeap() {
      let value = Number(document.getElementById("insertInputEl").value) //parseInt((document.getElementById("insertInputEl")).value)
      if(isNaN(value)) {
        alert("Invalid Input! \nEnter a number")
      } else {
        if(maxHeap.isNOACTION()) {
          maxHeap.pushActionHistory()
          maxHeap.insert(value)
        }
      }

    }

    function extractMinHeap() {
      if(maxHeap.isNOACTION()) {
        maxHeap.pushActionHistory()
        maxHeap.extract()
      }
    }

    function undoMinHeap() {
      if(maxHeap.isNOACTION()) {
        maxHeap.undo()
      }
    }
  }

}
