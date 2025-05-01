import {balls} from "./physics.js"
import {pocketed} from "./physics.js"
import {Player} from "./player.js"

let REMAINING_SOLIDS = 0
let REMAINING_STRIPES =  1


let player1 = new Player(1, "bals", "[none]", "[none]", "[none]")
let player2 = new Player(2, "bals", "[none]", "[none]", "[none]")

document.addEventListener("STOP", playTurn)

let turnNum = 0
let playAgain = false;

function playTurn() {
    turnNum++;
    const currentPlayer = (turnNum % 2 === 0) ? player2 : player1;
    player(currentPlayer, turnNum);
    if (playAgain){
        turnNum--
    }
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
            let div = document.getElementById("win")
            let h1 = div.querySelector("h1")
            let video = div.querySelector("video")
            if (ball == "8-ball" && !player.finalBall){
                if (player.num%2 == 0){
                    h1.textContent = "PLAYER 1 WINS !!!! AYAYAYYAYYYYY"
                } else {
                    h1.textContent = "PLAYER 2 WINS !!!! AYAYAYYAYYYYY"
                }
                video.playbackRate = 4
                div.classList.remove("hidden")
            } else if (ball == "8-ball"){
                h1.textContent = "PLAYER " + player.number + " WINS !!!! AYAYAYYAYYYYY"
                div.classList.remove("hidden")
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
        console.log(REMAINING_SOLIDS)
        console.log(player.isSolid)
        if (player.isSolid){
            player.checkFinal(REMAINING_SOLIDS)
        } else {
            player.checkFinal(REMAINING_STRIPES)
        }
        console.log(player.finalBall)
    }


    pocketed.length = 0
}