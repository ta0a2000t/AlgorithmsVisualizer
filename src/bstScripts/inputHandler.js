export default class InputHandler {
  constructor(bst) {

    this.insertInputEl = document.getElementById("insertInputEl")
    document.querySelector("#insertButton").addEventListener("click", insertBST)
    document.querySelector("#deleteButton").addEventListener("click", deleteBST)


    function insertBST() {
      let value = Number(document.getElementById("insertInputEl").value) //parseInt((document.getElementById("insertInputEl")).value)
      if(isNaN(value)) {
        alert("Invalid Input! \nEnter a number")
      } else {

        bst.insert(value)
      }
    }

    function deleteBST() {
      let value = Number(document.getElementById("insertInputEl").value) //parseInt((document.getElementById("insertInputEl")).value)
      if(isNaN(value)) {
        alert("Invalid Input! \nEnter a number")
      } else {

        bst.delete(value)
      }
    }
  }

}
