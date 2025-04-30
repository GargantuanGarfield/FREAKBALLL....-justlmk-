import {balls} from "./physics.js"

let REMAINING_SOLIDS = 0
let REMAINING_STRIPES =  0
for (let ball in balls){
    if (ball.suit == "solid"){
        REMAINING_SOLIDS++
    } else if (ball.suit == "stripe") {
        REMAINING_STRIPES++
    }
}



let player1 = new Player("false", "false", "[none]", "[none]", "[none]")
let player2 = new Player("false", "false", "[none]", "[none]", "[none]")

document.addEventListener("STOP", playTurn)

let turnNum = 0
function playTurn(){
    turnNum++
    let ballsHappened = //call wills method that returns BALLS
    if (turnNum%2==0) { // player 2 shish
        player(player2, ballsHappened)
    } else { // player 1 shish
        player(player1, ballsHappened)
    }
}

function player(player, balls){
    
}