import {balls} from "./physics.js"
import {pocketed} from "./physics.js"
import {Player} from "./player.js"

let REMAINING_SOLIDS = 7
let REMAINING_STRIPES =  7


let player1 = new Player(1, "bals", false, "[none]", "[none]", "[none]")
let player2 = new Player(2, "bals", false, "[none]", "[none]", "[none]")

document.addEventListener("STOP", playTurn)

let turnNum = 0
let playAgain = false;

function playTurn() {
    do {
        turnNum++;
        const currentPlayer = (turnNum % 2 === 0) ? player2 : player1;
        player(currentPlayer, turnNum);
        // playAgain should be set by `player()` or other logic
    } while (playAgain);
}

function player(player, turnNum){
    playAgain = false;

    if (turnNum == 1 && pocketed.length > 0){
        // if there one ball then assaign suit otherwi uhh then dont,, ig
        
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
        console.log("PLAYER" + player.number + " TURN")
    } else {
        console.log("PLAYER" + player.number + " TURN")
        pocketed.forEach(ball => {
            if (ball == "8-ball" && player.finalBall){
                //game endn sequence i guess idek breh 👅👅👅👅👅👅
            }
        })


        if (player.isSolid == "bals" && pocketed.length > 0){
            let safe = true
            for (let ball in pocketed){
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
            if (safe && player.number == 1) {
                player.setSuit(pocketed[0])
                player2.isSolid = !(player.isSolid)
            } else if (safe) {
                player.setSuit(pocketed[0])
                player1.isSolid = !(player.isSolid)
            }
        }

        pocketed.forEach(ball => {
            if (ball == "solid"){
                REMAINING_SOLIDS--
            } else if (ball == "stripe"){
                REMAINING_STRIPES--
            }

            if (ball == "cue"){
                playAgain = false;
            } else if (player.isSolid && ball == "stripe"){
                playAgain = false;
            } else if (!player.isSolid && ball == "solid"){
                playAgain = false;
            } else if (pocketed.length == 0){
                playAgain == false;
            } else {
                playAgain = true;
            }
        })

        
    }


    pocketed.length = 0
}