const bar = document.getElementById('bar');
const hell = document.getElementById('hell');
const interim = document.getElementById('interim');

const barAudio = new Audio('/sounds/CoolFNAFMusic.mp3');
const hellAudio = new Audio('/sounds/PitsOfHellMusic.mp3');
const interimAudio = new Audio('/sounds/Bartender.mp3');
let currentPlayingAudio = null;

function playBackgroundAudio() {
    const clickedButton = this.id;

    if (clickedButton === 'bar') {
        if (currentPlayingAudio != null) {
            currentPlayingAudio.pause();
            currentPlayingAudio.currentTime = 0;
        }
        currentPlayingAudio = barAudio;
        barAudio.play();
    }
    else if (clickedButton === 'hell') {
        if (currentPlayingAudio != null) {
            currentPlayingAudio.pause();
            currentPlayingAudio.currentTime = 0;
        }
        currentPlayingAudio = hellAudio;
        hellAudio.play();
    } else if (clickedButton === 'interim') {
        if (currentPlayingAudio != null) {
            currentPlayingAudio.pause();
            currentPlayingAudio.currentTime = 0;
        }
        currentPlayingAudio = interimAudio;
        interimAudio.play();
    }

}

if (bar) bar.addEventListener('click', playBackgroundAudio);
if (hell) hell.addEventListener('click', playBackgroundAudio);
if (interim) interim.addEventListener('click', playBackgroundAudio);