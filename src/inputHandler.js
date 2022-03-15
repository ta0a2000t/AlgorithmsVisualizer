export default class InputHandler {
  constructor(game) {
    this.game = game

    this.insertInputEl = document.getElementById("insertInputEl")
    document.getElementById("insertButton").addEventListener("click", insertBST)
    document.getElementById("deleteButton").addEventListener("click", deleteBST)


    function insertBST() {
      let value = Number(document.getElementById("insertInputEl").value) //parseInt((document.getElementById("insertInputEl")).value)
      if(isNaN(value)) {
        alert("Invalid Input! \nEnter a number")
      } else {

        game.bst.insert(value)
      }

    }

    function deleteBST() {
      let value = Number(document.getElementById("insertInputEl").value) //parseInt((document.getElementById("insertInputEl")).value)
      if(isNaN(value)) {
        alert("Invalid Input! \nEnter a number")
      } else {

        game.bst.delete(value)
      }
    }
  }

}
