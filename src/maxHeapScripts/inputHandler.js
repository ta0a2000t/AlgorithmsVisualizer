export default class InputHandler {
  constructor(maxHeap) {

    document.querySelector("#insertButton").addEventListener("click", insertMaxHeap)
    document.querySelector("#extractButton").addEventListener("click", extractMaxHeap)
    document.querySelector("#undoButton").addEventListener("click", undoMaxHeap)

    function insertMaxHeap() {
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

    function extractMaxHeap() {
      if(maxHeap.isNOACTION()) {
        maxHeap.pushActionHistory()
        maxHeap.extract()
      }
    }

    function undoMaxHeap() {
      if(maxHeap.isNOACTION()) {
        maxHeap.undo()
      }
    }
  }

}
