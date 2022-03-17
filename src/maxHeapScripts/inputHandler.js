export default class InputHandler {
  constructor(maxHeap) {

    document.querySelector("#insertButton").addEventListener("click", insertMaxHeap)
    document.querySelector("#extractButton").addEventListener("click", extractMaxHeap)


    function insertMaxHeap() {
      let value = Number(document.getElementById("insertInputEl").value) //parseInt((document.getElementById("insertInputEl")).value)
      if(isNaN(value)) {
        alert("Invalid Input! \nEnter a number")
      } else {

        maxHeap.insert(value)
      }

    }

    function extractMaxHeap() {
      let value = Number(document.getElementById("insertInputEl").value) //parseInt((document.getElementById("insertInputEl")).value)
      if(isNaN(value)) {
        alert("Invalid Input! \nEnter a number")
      } else {

        maxHeap.extract(value)
      }
    }
  }

}
