export default class InputHandler {
  constructor(maxHeap) {

    document.querySelector("#insertButton").addEventListener("click", insertMaxHeap)
    document.querySelector("#deleteButton").addEventListener("click", deleteMaxHeap)


    function insertMaxHeap(value) {
      let value = Number(document.getElementById("insertInputEl").value) //parseInt((document.getElementById("insertInputEl")).value)
      if(isNaN(value)) {
        alert("Invalid Input! \nEnter a number")
      } else {

        maxHeap.insert(value)
      }

    }

    function deleteMaxHeap() {
      let value = Number(document.getElementById("insertInputEl").value) //parseInt((document.getElementById("insertInputEl")).value)
      if(isNaN(value)) {
        alert("Invalid Input! \nEnter a number")
      } else {

        maxHeap.delete(value)
      }
    }
  }

}
