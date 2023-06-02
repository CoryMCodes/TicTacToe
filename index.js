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
  const playerOne = Player("Player 1", "X");
  const playerTwo = Player("Player 2", "O");
  playerArray.push(playerOne);
  playerArray.push(playerTwo);

  const reset = () => {
    console.log("game board reset")
    spaces = [];
    ViewController.updateView(spaces);
    ViewController.toggleBoardGlow();
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
   const spaceClickLogicHandler = (e) => {
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
  const start = () => {
    console.log("start runs")
    if(!isRunning){
     GameBoard.getPlayerArray()[0].setTurn(true);
     GameBoard.getPlayerArray()[1].setTurn(false);
     isRunning = true;
     winState = false;
    }
    else{
      console.log('game already in progress')
    }
  }

  
  //ends game loop changes isRunning
  const end = () => {
    console.log("Game Ends")
    winState = true;
    isRunning = false;
    GameBoard.reset();
  }

  // Toggles Turns
  const nextTurn = () => {
    console.log("next turn")
    GameBoard.getPlayerArray().forEach(player => {
      player.setTurn(!player.getTurn())
      console.log(player.getName()+  " = " +  player.getTurn())
    })
  }


  //returns game run state;
  const getIsRunning = () => isRunning;

  //returns winState
  const getWinState = () => winState;

  //check win
  // [012] [345] [678] [036] [147] [258] [642] [048]
  const checkWinStatus = () => {
    let spaces = GameBoard.getSpacesArray();
    console.log(spaces)
   
   // X WIN STATES
    if(spaces[0] === "X" && spaces[1] === "X" && spaces[2] === "X"
    || spaces[3] === "X" && spaces[4] === "X" && spaces[5] === "X"
    || spaces[6] === "X" && spaces[7] === "X" && spaces[8] === "X"
    || spaces[0] === "X" && spaces[3] === "X" && spaces[6] === "X"
    || spaces[1] === "X" && spaces[4] === "X" && spaces[7] === "X"
    || spaces[2] === "X" && spaces[5] === "X" && spaces[8] === "X"
    || spaces[6] === "X" && spaces[4] === "X" && spaces[2] === "X"
    || spaces[0] === "X" && spaces[4] === "X" && spaces[8] === "X"){
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
  }

  return{checkWinStatus, start, getIsRunning, nextTurn, getWinState, end}
})();



// VIEW CONTROLLER IFFE instantiates imediately. 
const ViewController = (() => {
  // Get the root element
  const r = document.querySelector(':root');
  //Get game color settings
  const gameSettings = document.getElementById("game-color-select");
  // set inital css game color value
  r.style.setProperty("--gameThemeColor", gameSettings.value);
  // Change game theme
  gameSettings.addEventListener("change", () => {
    r.style.setProperty("--gameThemeColor", gameSettings.value)
  })
  // set player one name placeholder
  const playerOneNameSetting = document.getElementById("playerOne-name-change");
  playerOneNameSetting.placeholder = GameBoard.getPlayerArray()[0].getName();
  
  //set player Two name Placeholder
  const playerTwoNameSetting = document.getElementById("playerTwo-name-change");
  playerTwoNameSetting.placeholder = GameBoard.getPlayerArray()[1].getName();
  
  const playerOneSettings = document.getElementById("playerOne-color-select");
  // set inital css p1 color value
  r.style.setProperty("--playerOneColor", playerOneSettings.value);
  // Change p1 theme
  playerOneSettings.addEventListener("change", () => {
    r.style.setProperty("--playerOneColor", playerOneSettings.value)
  })

  const playerTwoSettings = document.getElementById("playerTwo-color-select");
  // set inital css p1 color value
  r.style.setProperty("--playerTwoColor", playerTwoSettings.value);
  // Change p1 theme
  playerTwoSettings.addEventListener("change", () => {
    r.style.setProperty("--playerTwoColor", playerTwoSettings.value)
  })

  const toggleBoardGlow = () => {
    const gameCells = document.querySelectorAll(".gameCell");
    if(GameController.getIsRunning()){
      gameCells.forEach(cell => {
        cell.classList.add("gameCellGlow")
      })}
    else{
        gameCells.forEach(cell => {
          cell.classList.remove("gameCellGlow");
        })}
  }
  // button starts games
  const startButtonHandler = (e) => {
    if(e.target.id === "start-button"){
      GameController.start();
      toggleBoardGlow();
    }
  }

  const settingsButtonHandler = (e) => {
    if(e.target.id === "settings-button"){
      document.getElementById("settings-modal").classList.remove("hidden")
    }
  }

  const toggleModal = (message) => {
    let gameOverMessage = document.createTextNode(message);
    document.querySelector("#win-modal").classList.toggle("hidden")
    document.querySelector("#win-modal").firstChild.appendChild(gameOverMessage);
  }

  const resetGameBoardView = () => {
    let spaceContainer = document.querySelector("#game-container");
      for (let i = 0; i < spaceContainer.children.length; i++){
        let child = spaceContainer.children[i];
        child.innerText = "";
      }
  }

  const updateGameBoardView = (arr) => {
    arr.forEach((space, index) => {
      let spaceText = document.querySelector(`#space-${index}`);
      if(space){
        spaceText.innerText = space;
        if(space === "X") { spaceText.classList.add("player-one-color") }
        if(space === "O") { spaceText.classList.add("player-two-color") }
      }else{
        spaceText.innerText = "";
      }
    })
  } 

// takes arr of spaces containing "X", "O", or empty index;
  const updateView = (arr) => {
    if(arr.length){
      updateGameBoardView(arr)
    }else{
      resetGameBoardView();
    }
  }

  // add event listeners immediately in IFFE
  const startButton = document.querySelector("#start-button");
  startButton.addEventListener("click", e => startButtonHandler(e))

  //get change name buttons
  const changeNameBtns = document.querySelectorAll(".nameButton"); 
  changeNameBtns.forEach(btn => {
  btn.addEventListener("click", e => changeNameHandler(e))})
  
  const resetButton = document.getElementById("close-win-modal");
  resetButton.addEventListener("click", toggleModal)

  const settingsButton = document.getElementById("settings-button");
  settingsButton.addEventListener("click", settingsButtonHandler);

  const settingsCloseButton = document.getElementById("settings-close");
  settingsCloseButton.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("settings-modal").classList.add("hidden")
    // Player One Name Change
    let newPlayerOneName = document.getElementById("playerOne-name-change").value;
    let playerOneNameEl = document.querySelector(`#player-0`).firstElementChild;
    if(newPlayerOneName){
      GameBoard.getPlayerArray()[0].setName(newPlayerOneName);
      let newPOneNameText = document.createTextNode(`${newPlayerOneName}`);
      playerOneNameEl.innerText = "";
      playerOneNameEl.appendChild(newPOneNameText);
    }

    //Player Two Name Change
    let newPlayerTwoName = document.getElementById("playerTwo-name-change").value;
    let playerTwoNameEl = document.querySelector(`#player-1`).firstElementChild;
    if(newPlayerTwoName){
      GameBoard.getPlayerArray()[1].setName(newPlayerTwoName);
      let newPTwoNameText = document.createTextNode(`${newPlayerTwoName}`);
      playerTwoNameEl.innerText = "";
      playerTwoNameEl.appendChild(newPTwoNameText);
    }
  })

;
  return {updateView, toggleModal, toggleBoardGlow}
})()