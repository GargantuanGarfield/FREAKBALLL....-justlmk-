import {balls} from "./physics.js"
import {pocketed} from "./physics.js"
import {Player} from "./player.js"

let REMAINING_SOLIDS = 0
let REMAINING_STRIPES =  0
for (let ball in balls){
    if (ball.suit == "solid"){
        REMAINING_SOLIDS++
    } else if (ball.suit == "stripe") {
        REMAINING_STRIPES++
    }
}



let player1 = new Player("bals", false, "[none]", "[none]", "[none]")
let player2 = new Player("bals", false, "[none]", "[none]", "[none]")

document.addEventListener("STOP", playTurn)

let turnNum = 0
function playTurn(){
    turnNum++
    if (turnNum%2==0) { // player 2 shish
        player(player2, turnNum)
    } else { // player 1 shish
        player(player1, turnNum)
    }
}

function player(player, turnNum){
    if (turnNum == 1 && pocketed.length > 0){
        // if there one ball then assaign suit otherwi uhh then dont,, ig
        console.log(pocketed)
        let safe = true
        for (let ball in pocketed){
            console.log(ball)
            if (ball == "cue"){
                safe = false
            }
            if (ball == "stripe"){
                REMAINING_STRIPES--
            } else if (ball == "solid"){
                REMAINING_SOLIDS--
            }
            for (let ball2 in pocketed){
                if (ball != ball2){
                    safe = false;
                }
            }
        }
        if (safe) {
            player1.setSuit(pocketed[0]);
            player2.isSolid = !(player.isSolid)
        }
        console.log(player1.isSolid)
    } else {
        
    }

    pocketed.length = 0
}