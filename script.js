/**
 * Modes: One player, Two players
 * Levels: Easy, Medium, Hard
 * Cases: [1,2,3,4,5,6,7,8,9]
 * Easy: Soit n la case ou l'adversaire a joué. Je joue dans les cases de [n-3,n-1, n+3, n+1, n+3] si possible au cas où ce n'est pas au milieu. Si c'est au milieu je joue au hasard
 * Medium: Soit n la case ou l'adversaire a joué. Je joue dans les cases differentes de [n-3,n-1, n+3, n+1, n+3] si ce n'est pas au milieu. Si c'est au milieu je joue au hasard
 * Hard :Contriaire de Easy
*/

//Level: 1->Easy, 2->Medium, 3->Hard
//Mode: 1->One Player(with machine), 2->Two players

if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

class Tictatoe {
  constructor(cells) {
    this.remaingAttempts = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.playerAttempts = [
      new Set() /*For player one*/,
      new Set() /*For player two*/,
    ];

    this.cells = cells;

    this.entries = document.querySelectorAll("td");

    this.winningCombinaison = [];
    this.winner = null;
  }

  winPossibilities = [
    [1, 2, 3],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9],
  ];

  addPlayerAttempts(playerNum, attempt) {
    this.playerAttempts[playerNum - 1].add(attempt);
  }

  checkWin(currentPlayer) {
    let currentPlayerAttempts = Array.from(
      this.playerAttempts[currentPlayer - 1].values()
    ).sort();

    console.log(currentPlayerAttempts);
    let possibleCombs = [];
    if (currentPlayerAttempts.length >= 3) {
      for (let i = 0; i < currentPlayerAttempts.length - 2; i++) {
        for (let j = i + 1; j < currentPlayerAttempts.length - 1; j++) {
          for (let k = j + 1; k < currentPlayerAttempts.length; k++) {
            possibleCombs.push([
              currentPlayerAttempts[i],
              currentPlayerAttempts[j],
              currentPlayerAttempts[k],
            ]);
          }
        }
      }
      console.log("possible comb: ", possibleCombs);

      for (let i = 0; i < this.winPossibilities.length; i++) {
        for (let j = 0; j < possibleCombs.length; j++) {
          if (this.winPossibilities[i].equals(possibleCombs[j])) {
            this.winningCombinaison = possibleCombs[j].slice();
            this.winner = this.currentPlayer;
            return this.winner;
          }
        }
      }
    }
  }

  play(attempt) {
    console.log(attempt);
    this.addPlayerAttempts(this.currentPlayer, attempt);
    let winner = this.checkWin(this.currentPlayer);
    let winnerTextContent=  document.querySelector(".winner");
    if (winner) {
      let str = "Le joueur " + newGame.winner + " a gagné";
      winnerTextContent.innerHTML = `<div>${str} <br> <button id="restart" onClick='document.location.reload();' class='btn btn-success'>Recommencer</button></div>`;

      [...this.cells].filter((_, idx)=>{
        return this.winningCombinaison.includes(idx+1);
      }).forEach(ele=>{
        ele.classList.add("bg-green")
      });

      [...this.cells].filter((_, idx)=>{
        return !this.winningCombinaison.includes(idx+1);
      }).forEach(ele=>{
        ele.classList.add("bg-darked")
      })

      
      document.body.classList.add("darked")
      return;
    } else if (this.remaingAttempts.length == 1) {
      document.body.classList.remove("darked");

      //C'etait Derniere tentative
      winnerTextContent.innerHTML =
        "<div> Match nul <br> <button id='restart' onClick='document.location.reload();' class='btn btn-success'>Recommencer<button></div>";
      return null;
    }

    this.currentPlayer = (this.currentPlayer + 1) % 2 == 0 ? 2 : 1;
    this.remaingAttempts.splice(this.remaingAttempts.indexOf(attempt), 1);

    console.log("reamaining attempts:", this.remaingAttempts);
  }
  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  getCurrentPlayer() {
    return this.player;
  }

  setWinner(playerNum) {
    this.winner = playerNum;
  }
  getWinner() {
    return this.winner;
  }

  getWinningCombinaison() {
    return this.winningCombinaison;
  }

  setLevel(level) {
    this.level = level;
  }
  getLevel() {
    return this.level;
  }

  setMode(mode) {
    this.mode = mode;
  }

  getMode() {
    return this.mode;
  }

  findXAxisNumber(n) {
    const r = n % 3;

    if (n < 1 || n > 9) {
      return null;
    }

    if (n <= 3) {
      return 1;
    } else if (n <= 6) {
      return 1;
    }
    return 3;
  }

  findXAxisElements(n) {
    const r = n % 3;
    if (r === 0) {
      return [n - 2, n - 1, n];
    } else if (r === 1) {
      return [n, n + 1, n + 2];
    }
    return [n - 1, n, n + 1];
  }

  findYAxisNumber(n) {
    const r = n % 3;
    if (r === 0) {
      return 3;
    } else if (r === 1) {
      return 1;
    }
    return 2;
  }

  findYAxisElements(n) {
    const r = n % 3;
    if (r === 0) {
      return [n - 3, n - 1, n];
    } else if (r === 1) {
      return [n, n + 1, n + 2];
    }
    return [n - 1, n, n + 1];
  }
}

const cells=document.querySelectorAll("td");
const newGame=new Tictatoe(cells);



newGame.setMode(1);
newGame.setLevel(1);
newGame.setCurrentPlayer(1);

cells.forEach((cell, idx)=>{
  cell.addEventListener("click", (e)=>{
    if (!newGame.winner && newGame.remaingAttempts.includes(idx+1)){
      cell.textContent=newGame.currentPlayer===1? "X": "O";
      if(newGame.currentPlayer===2) cell.classList.add('text-success')
      newGame.play(idx+1);
    }else if(newGame.winner){
      console.log("won cell: ", winningCells);
      // this.winningCombinaison.

     //
    }else{ 
      
    }
 
  })

})

function restart(){
    newGame=new Tictatoe(cells)
}
