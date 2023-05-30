//Player Factory Function
const Player = (name, symbol) => {
  let isTurn = false;
 
  const getName = () => name;
  const setName = (newName) => name = newName;  
  const getTurn = () => isTurn;
  const getSymbol = () => symbol;

  const setTurn = (bool) => isTurn = bool;
  
  return {getSymbol, getName, setTurn, getTurn, setName}
}

// GameBoard Module immidiately invoked, gameboard Obj created;
const GameBoard = (() => {
  let spaces = [];
  let playerArray = [];

  // fill default player array 
  const playerOne = Player("player1", "X");
  const playerTwo = Player("Player2", "O");
  playerArray.push(playerOne);
  playerArray.push(playerTwo);

  reset = () => {
    console.log("game board reset")
    spaces = [];
    ViewController.updateView(spaces);
  }

  const getSpace = (num) => spaces[num]
  
  const setSpace = (num, symbol) =>{  
    spaces[num] = symbol;
  }

  const getSpacesArray = () => spaces;

  const getPlayerArray = () => playerArray;

  // returns player object if player.isTurn = true;
  const getCurrentPlayer = () => {
    let currentPlayer;
    playerArray.forEach(player => {
      if(player.getTurn()){
        currentPlayer = player;
      }
    })
    return currentPlayer
  }

   // Game Controller sets board state and checks win status --> RENAME THIS
   spaceClickLogicHandler = (e) => {
    // get index of clicked space
    const spaceIndex = e.target.id.split("-")[1];
    if(GameController.getIsRunning()){
      //check gameboard to see if the space is taken if not run the turn 
      if(!getSpace(spaceIndex)){
        setSpace(spaceIndex, getCurrentPlayer().getSymbol())
        ViewController.updateView(getSpacesArray());
        GameController.checkWinStatus();
        if(!GameController.getWinState()){
         GameController.nextTurn();  
        }
        
      }else{
        alert("Make Another Selection")
      }
    }


  }

  const gameContainer = document.querySelector("#game-container")
  gameContainer.addEventListener("click", e => spaceClickLogicHandler(e))


  return {getCurrentPlayer, getSpacesArray, getSpace, setSpace, reset, getPlayerArray}
})();


// GAME CONTROLLER MODULE
const GameController = (() => {
  let isRunning = false;
  let winState = false;
  
  // starts the game changes isRunning variable
  start = () => {
    console.log("start runs")
    if(!isRunning){
     GameBoard.getPlayerArray()[0].setTurn(true)
     isRunning = true;
     winState = false;
    }
    else{
      console.log('game already in progress')
    }
  }

  
  //ends game loop changes isRunning
  end = () => {
    console.log("Game Ends")
    winState = true;
    isRunning = false;
    GameBoard.reset();
  }

  // Toggles Turns
  nextTurn = () => {
    console.log("next turn")
    GameBoard.getPlayerArray().forEach(player => {
      player.setTurn(!player.getTurn())
      console.log(player.getName()+  " = " +  player.getTurn())
    })
  }


  //returns game run state;
  getIsRunning = () => isRunning;

  //returns winState
  getWinState = () => winState;

  //updates winState
  setWinState = (bool) => {
    winstate = bool;
  }
  //check win
  // [012] [345] [678] [036] [147] [258] [642] [048]
  checkWinStatus = () => {
    let spaces = GameBoard.getSpacesArray();
    console.log(spaces)
   

    // ?? how to refactor
   // X WIN STATES
    if(spaces[0] === "X" && spaces[1] === "X" && spaces[2] === "X"){
      end();
    }

    if(spaces[3] === "X" && spaces[4] === "X" && spaces[5] === "X"){
      end();
    }

    if(spaces[6] === "X" && spaces[7] === "X" && spaces[8] === "X"){
      end();
    }

    if(spaces[0] === "X" && spaces[3] === "X" && spaces[6] === "X"){
      end();
    }

    if(spaces[1] === "X" && spaces[4] === "X" && spaces[7] === "X"){
      end();
    }

    if(spaces[2] === "X" && spaces[5] === "X" && spaces[8] === "X"){
      end();
    }

    if(spaces[6] === "X" && spaces[4] === "X" && spaces[2] === "X"){
      end();
    }

    if(spaces[0] === "X" && spaces[4] === "X" && spaces[8] === "X"){
      end();
    }

    // O WIN STATES

    if(spaces[0] === "O" && spaces[1] === "O" && spaces[2] === "O"
    || spaces[3] === "O" && spaces[4] === "O" && spaces[5] === "O"
    || spaces[6] === "O" && spaces[7] === "O" && spaces[8] === "O"
    || spaces[0] === "O" && spaces[3] === "O" && spaces[6] === "O"
    || spaces[1] === "O" && spaces[4] === "O" && spaces[7] === "O"
    || spaces[2] === "O" && spaces[5] === "O" && spaces[8] === "O"
    || spaces[6] === "O" && spaces[4] === "O" && spaces[2] === "O"
    || spaces[0] === "O" && spaces[4] === "O" && spaces[8] === "O"){
      end();
    }
  /*
    if(spaces[3] === "O" && spaces[4] === "O" && spaces[5] === "O"){
      end();
    }

    if(spaces[6] === "O" && spaces[7] === "O" && spaces[8] === "O"){
      end();
    }

    if(spaces[0] === "O" && spaces[3] === "O" && spaces[6] === "O"){
      end();
    }

    if(spaces[1] === "O" && spaces[4] === "O" && spaces[7] === "O"){
      end();
    }

    if(spaces[2] === "O" && spaces[5] === "O" && spaces[8] === "O"){
      ViewController.toggleWinModal()
    }
    if(spaces[6] === "O" && spaces[4] === "O" && spaces[2] === "O"){
      ViewController.toggleWinModal()
    }
    if(spaces[0] === "O" && spaces[4] === "O" && spaces[8] === "O"){
      ViewController.toggleWinModal();
    } */
  }  
  return{checkWinStatus, start, getIsRunning, nextTurn, getWinState, end}
})();



// VIEW CONTROLLER IFFE instantiates imediately. 
const ViewController = (() => {
  
  // button starts games
  startButtonHandler = (e) => {
    if(e.target.id === "start-button"){
      GameController.start();
    }
  }

  changeNameHandler = (e) => {
    if(GameController.getIsRunning()){return};
    // get the index of player from the button that was click
    let playerIndex = e.target.dataset.player;
    // use that index to get the relevant player from GameBoard object
    let selectedPlayer = GameBoard.getPlayerArray()[playerIndex];
    // get the DOM element that contains the name
    let playerNameEl = document.querySelector(`#player-${playerIndex}`).firstElementChild;
    // get new name from prompt
    let newName = prompt("Enter New Name For " + selectedPlayer.getName().toUpperCase())
    //update the player objects name
    selectedPlayer.setName(newName);
    // create textNode with new name
    let newNameText = document.createTextNode(`${newName}`);
    // reset name DOM element
    playerNameEl.innerText = "";
    // append new name to Name Container El
    playerNameEl.appendChild(newNameText);
  }

  toggleModal = () => {
    document.querySelector("#win-modal").classList.toggle("hidden")
  }

  resetGameBoardView = () => {
    let spaceContainer = document.querySelector("#game-container");
      for (let i = 0; i < spaceContainer.children.length; i++){
        let child = spaceContainer.children[i];
        child.innerText = "";
      }
  }

  updateGameBoardView = (arr) => {
    arr.forEach((space, index) => {
      let spaceText = document.querySelector(`#space-${index}`);
      if(space){
        spaceText.innerText = space; 
      }else{
        spaceText.innerText = "";
      }
    })
  } 

// takes arr of spaces containing "X", "O", or empty index;
  updateView = (arr) => {
    if(arr.length){
      updateGameBoardView(arr)
    }else{
      resetGameBoardView();
    }
  }

  winView = (array) => {

  }

  // add event listeners immediately in IFFE
  const startButton = document.querySelector("#start-button");
  startButton.addEventListener("click", e => startButtonHandler(e))

  //get change name buttons
  const changeNameBtns = document.querySelectorAll(".nameButton"); 
  changeNameBtns.forEach(btn => {
  btn.addEventListener("click", e => changeNameHandler(e))})


  return {updateView}
})()