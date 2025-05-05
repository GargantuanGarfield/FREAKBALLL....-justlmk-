import {balls, effectManager} from "./physics.js"
import {pocketed} from "./physics.js"
import {Player} from "./player.js"

let REMAINING_SOLIDS = 7
let REMAINING_STRIPES =  7

let playAgain = false;

let validPocket = false;
let cueBallScratched = false;

let h1 = document.getElementById("peenar1")
let h12 = document.getElementById("peenar2")

let player1 = new Player(1, "N/A", "[none]", "[none]", "[none]")
let player2 = new Player(2, "N/A", "[none]", "[none]", "[none]")

function updatePlayerHighlight(currentPlayer) {
    const avatar1 = document.querySelector('.player1');
    const avatar2 = document.querySelector('.player2');

    avatar1.classList.remove('active-turn');
    avatar2.classList.remove('active-turn');

    if (currentPlayer.number === 1) {
        avatar1.classList.add('active-turn');
    } else {
        avatar2.classList.add('active-turn');
    }
}

document.addEventListener("STOP", playTurn)

let currentPlayer = player1;
let otherPlayer = player2;

function switchPlayers() {
    [currentPlayer, otherPlayer] = [otherPlayer, currentPlayer];
}


function playTurn() {
    setTimeout(() => {
        player(currentPlayer);

        if (playAgain) {
            console.log(`Player ${currentPlayer.number} continues...`);
        } else {
            switchPlayers();
            console.log(`Switched to Player ${currentPlayer.number}`);
            
            // Roll for a random effect at the start of the next player's turn
            effectManager.rollForEffect();
        }
    }, 100); // Delay ensures pocketed[] is up-to-date
}




function player(player){
    playAgain = false;

    updatePlayerHighlight(player);

    if (player.isSolid === "N/A" && pocketed.length > 0){
        let safe = (pocketed.length === 1 && pocketed[0] !== "cue")

        for (let ball of pocketed){
            if (ball == "stripe"){
                REMAINING_STRIPES--
            } else if (ball == "solid"){
                REMAINING_SOLIDS--
            }
        }

        if (safe) {
            player.setSuit(pocketed[0]);
            otherPlayer.isSolid = !(player.isSolid);
            h1.textContent = (player1.isSolid) ? "Yellow" : "Red"
            h12.textContent = (player2.isSolid) ? "Yellow" : "Red"
        }
    }

    pocketed.forEach(ball => {
        let div = document.getElementById("win")
        let h1 = div.querySelector("h1")
        let video = div.querySelector("video")
        if (ball === "8-ball") {
            if (player.finalBall) {
                h1.textContent = `PLAYER ${otherPlayer.number} WINS !!!! AYAYAYYAYYYYY`;
            } else {
                h1.textContent = `PLAYER ${player.number} WINS !!!! AYAYAYYAYYYYY`;
            }
            video.playbackRate = 4;
            div.classList.remove("hidden")
        }
    });

    for (let ball of pocketed) {
        if (ball === "solid") {
            REMAINING_SOLIDS--;
        } else if (ball === "stripe") {
            REMAINING_STRIPES--;
        }
    }

    for (let ball of pocketed) {
        if (ball === "cue") cueBallScratched = true;
        if (player.isSolid && ball === "solid") validPocket = true;
        if (!player.isSolid && ball === "stripe") validPocket = true;
    }


    // If cue ball scratched, switch turn regardless of valid pocket
    if (cueBallScratched) {
        playAgain = false;
    }

    if (player.isSolid){
        player.checkFinal(REMAINING_SOLIDS);
    } else {
        player.checkFinal(REMAINING_STRIPES);
    }

    pocketed.length = 0;
}