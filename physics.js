import { EffectManager } from './effects.js';

const canvas = document.getElementById('table');
const ctx = canvas.getContext('2d');
const playArea = document.getElementById('playArea');
const event = new Event("STOP");

// take this code before updating will's changes
const collisionSounds = [
  new Audio("/sounds/BallHit.mp3"),
  new Audio('/sounds/BallHit2.mp3'),
  new Audio('/sounds/BallHit3.mp3'),
  new Audio('/sounds/BallHit4.mp3'),
  new Audio('/sounds/BallHit5.mp3')
];



// take this code before updating will's changes
collisionSounds[0].volume = 0.5;
collisionSounds[4].volume = 0.5;

// take this code before updating will's changes
let edgeSounds;
let pocketHit;

class ball {
    constructor(x, y, color, suit, id) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.suit = suit;
        this.id = id;
        this.vx = 0;
        this.vy = 0;
        this.radius = 10;
    }

    drawBall() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }

    collision(ball2) {
        let dx = ball2.x - this.x;
        let dy = ball2.y - this.y;
        let distance = Math.hypot(dx, dy);
        if (distance < this.radius + ball2.radius) {
          let angle = Math.atan2(dy, dx);
          let speed1 = Math.hypot(this.vx, this.vy);
          let speed2 = Math.hypot(ball2.vx, ball2.vy);
          let direction1 = Math.atan2(this.vy, this.vx);
          let direction2 = Math.atan2(ball2.vy, ball2.vx);
      
          let vx1 = speed1 * Math.cos(direction1 - angle);
          let vy1 = speed1 * Math.sin(direction1 - angle);
          let vx2 = speed2 * Math.cos(direction2 - angle);
          let vy2 = speed2 * Math.sin(direction2 - angle);
      
          let final_vx1 = vx2;
          let final_vx2 = vx1;
      
          this.vx = Math.cos(angle) * final_vx1 + Math.cos(angle + Math.PI/2) * vy1;
          this.vy = Math.sin(angle) * final_vx1 + Math.sin(angle + Math.PI/2) * vy1;
          ball2.vx = Math.cos(angle) * final_vx2 + Math.cos(angle + Math.PI/2) * vy2;
          ball2.vy = Math.sin(angle) * final_vx2 + Math.sin(angle + Math.PI/2) * vy2;
      
          let overlap = (this.radius + ball2.radius) - distance;
          this.x -= overlap / 2 * (dx / distance);
          this.y -= overlap / 2 * (dy / distance);
          ball2.x += overlap / 2 * (dx / distance);
          ball2.y += overlap / 2 * (dy / distance);

          // take this code before updating will's changes
          collisionSound();
        }
      }
}

let pocketed = [];

class pocket{

    constructor(x, y){
        this.x = x;
        this.y = y;
        this.radius = 35;
    }

    pocketDraw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
    resetCueBall(){
      balls[0].x = 318;
      balls[0].y = 200;
      balls[0].vx = 0;
      balls[0].vy = 0;
    }
    pocketed(ball){
        let distance = Math.sqrt(Math.pow(ball.x - this.x, 2) + Math.pow(ball.y - this.y, 2))
        if (distance < (ball.radius + this.radius)){
          if (ball.suit == "cue"){
            pocketSound();
            this.resetCueBall();
          } else {
            for (let i = 0; i < balls.length; i++){
                if (balls[i].id == ball.id){
                    pocketSound();
                    console.log("Got it")
                    pocketed.push(ball.suit)
                    balls.splice(i, 1)
                    }
                }
            }}
            }

     
        }

  

let pockets = [
    // Top left
    new pocket(5, 5),
    // Top right
    new pocket(630, 5),
    // Middle left
    new pocket(0, 475),
    // middle right,
    new pocket(635, 475),
    // Bottom left
    new pocket(5, 945),
    // Bottom right
    new pocket(630, 945)
]

class Powerup {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 30; // size of the block
  }

  draw() {
      ctx.fillStyle = "purple"; // PURPLE like you want!
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }}
  
// take this code before updating will's changes
function collisionSound() {
  let randomIndex = Math.floor(Math.random() * collisionSounds.length);
  let sound = collisionSounds[randomIndex];
  sound.currentTime = 0;
  sound.play();
}

// take this code before updating will's changes
function edgeSound() {
  edgeSounds = new Audio('/sounds/BallHitEdge.mp3');
  edgeSounds.volume = 0.3;
  edgeSounds.play();
}

function pocketSound() {
  pocketHit = new Audio('/sounds/PocketHit.mp3');
  pocketHit.volume = 0.5;
  pocketHit.play();
}

export let balls = [
// Cue ball - placed left of the rack
new ball(318, 200, "white", "cue", 0),

// Row 1 (tip)
new ball(318, 600, "red", "solid", 1),

// Row 2
new ball(303, 630, "yellow", "stripe", 9),
new ball(333, 630, "red", "solid", 2),

// Row 3
new ball(288, 660, "red", "solid", 3),
new ball(318, 660, "black", "8-ball", 8),
new ball(348, 660, "yellow", "stripe", 10),


// Row 4
new ball(273, 690, "yellow", "stripe", 11),
new ball(303, 690, "red", "solid", 4),
new ball(333, 690, "yellow", "stripe", 12),
new ball(363, 690, "red", "solid", 5),

// Row 5 (base)
new ball(258, 720, "red", "solid", 6),
new ball(288, 720, "yellow", "stripe", 13),
new ball(318, 720, "red", "solid", 7),
new ball(348, 720, "yellow", "stripe", 14),
new ball(378, 720, "yellow", "stripe", 15)

];
export const effectManager = new EffectManager();

let aiming = false;
let powerups = []; // Array to store spawned powerups
let startX, startY;


function drawTable() {
  ctx.fillStyle = '#0a5c1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  pockets.forEach(pocket =>{
    pocket.pocketDraw();
  })
}

function simulateProjection(ball, steps = 30) {
  // Don't show projection in hard mode
  if (!effectManager.shouldShowPath()) {
    return [];
  }
  
  let tempX = ball.x;
  let tempY = ball.y;
  let vx = ball.vx;
  let vy = ball.vy;
  const path = [];

  const cushionMargin = 20;

  for (let i = 0; i < steps; i++) {
    tempX += vx;
    tempY += vy;
    vx *= effectManager.getFrictionFactor(); // Use dynamic friction
    vy *= effectManager.getFrictionFactor();

    if (tempX < ball.radius + cushionMargin) {
      tempX = ball.radius + cushionMargin;
      vx *= -1;
    }
    if (tempX > canvas.width - ball.radius - cushionMargin) {
      tempX = canvas.width - ball.radius - cushionMargin;
      vx *= -1;
    }

    // Bounce off top/bottom cushions
    if (tempY < ball.radius + cushionMargin) {
      tempY = ball.radius + cushionMargin;
      vy *= -1;
    }
    if (tempY > canvas.height - ball.radius - cushionMargin) {
      tempY = ball.height - ball.radius - cushionMargin;
      vy *= -1;
    }

    path.push({ x: tempX, y: tempY });
  }
  return path;
}

function drawProjectionLine(path, color) {
  if (path.length < 2) return;
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.closePath();
}

function spawnPowerup() {
  let margin = 50; // Keeps it away from walls
  let x = Math.random() * (canvas.width - 2 * margin) + margin;
  let y = Math.random() * (canvas.height - 2 * margin) + margin;
  powerups.push(new Powerup(x, y));
}

function draw() {
  drawTable();
  powerups.forEach(p => p.draw());
  balls.forEach(ball =>{
    ball.drawBall()
  });


  if (aiming) {
    if (aiming) {

      const dx = startX - balls[0].x;
      const dy = startY - balls[0].y;
      const angle = Math.atan2(dy, dx);
      const cueLength = 300;
      const tipLength = 10;
      const offset = 20; // Pull back from the ball
      
      // ✅ TIP: first segment (closer to cue ball)
      ctx.beginPath();
      ctx.moveTo(
        balls[0].x + Math.cos(angle) * offset,
        balls[0].y + Math.sin(angle) * offset
      );
      ctx.lineTo(
        balls[0].x + Math.cos(angle) * (offset + tipLength),
        balls[0].y + Math.sin(angle) * (offset + tipLength)
      );
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#2F4F4F';
      ctx.stroke();
      ctx.closePath();
      
      // ✅ SHAFT: continues after the tip
      ctx.beginPath();
      ctx.moveTo(
        balls[0].x + Math.cos(angle) * (offset + tipLength),
        balls[0].y + Math.sin(angle) * (offset + tipLength)
      );
      ctx.lineTo(
        balls[0].x + Math.cos(angle) * (cueLength + offset),
        balls[0].y + Math.sin(angle) * (cueLength + offset)
      );
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#A0522D';
      ctx.stroke();
      ctx.closePath();
      
      

  
    }
    

    let dx = balls[0].x - startX;
    let dy = balls[0].y - startY;
    let tempBall = new ball(balls[0].x, balls[0].y, "white", "cue", -1);
    tempBall.vx = dx * 0.1;
    tempBall.vy = dy * 0.1;

    let cuePath = simulateProjection(tempBall);
    drawProjectionLine(cuePath, "rgba(255,255,255,0.6)");

    for (let i = 1; i < balls.length; i++) {
      let target = balls[i];
      let dist = Math.hypot(target.x - balls[0].x, target.y - balls[0].y);
      if (dist <= balls[0].radius * 2 + 2) {
        let impactAngle = Math.atan2(target.y - balls[0].y, target.x - balls[0].x);
        let secondBall = new ball(target.x, target.y, target.color, target.suit, -1);
        secondBall.vx = Math.cos(impactAngle) * 1.5;
        secondBall.vy = Math.sin(impactAngle) * 1.5;
        let secondPath = simulateProjection(secondBall, 20);
        drawProjectionLine(secondPath, "rgba(255, 255, 255, 0.6)");
        break;
      }
    }
  }
}



function update() {
  const substeps = 4; // increase this for better accuracy
  for (let step = 0; step < substeps; step++) {
    balls.forEach(ball => {
      ball.x += ball.vx / substeps;
      ball.y += ball.vy / substeps;
      ball.vx *= effectManager.getFrictionFactor() ** (1 / substeps);
      ball.vy *= effectManager.getFrictionFactor() ** (1 / substeps);

      if (Math.abs(ball.vx) < 0.1) ball.vx = 0;
      if (Math.abs(ball.vy) < 0.1) ball.vy = 0;

      const r = ball.radius;

      // Top cushion (skip corners where pockets are)
      if (ball.y - r < 20 && ball.x > 60 && ball.x < 575) {
          ball.y = 20 + r;
          ball.vy *= -1;
          edgeSound();
          if (effectManager.isBumperWallsActive()) {
              effectManager.registerBumperHit(ball);
          }
      }
      
      // Bottom cushion (skip corners where pockets are)
      if (ball.y + r > 930 && ball.x > 60 && ball.x < 575) {
          ball.y = 930 - r;
          ball.vy *= -1;
          edgeSound();
          if (effectManager.isBumperWallsActive()) {
              effectManager.registerBumperHit(ball);
          }
      }
      
      // Left top cushion
      if (ball.x - r < 20 && ball.y > 30 && ball.y < 455) {
          ball.x = 20 + r;
          ball.vx *= -1;
          edgeSound();
          if (effectManager.isBumperWallsActive()) {
              effectManager.registerBumperHit(ball);
          }
      }
      
      // Left bottom cushion
      if (ball.x - r < 20 && ball.y > 495 && ball.y < 925) {
          ball.x = 20 + r;
          ball.vx *= -1;
          edgeSound();
          if (effectManager.isBumperWallsActive()) {
              effectManager.registerBumperHit(ball);
          }
      }
      
      // Right top cushion
      if (ball.x + r > 615 && ball.y > 30 && ball.y < 455) {
          ball.x = 615 - r;
          ball.vx *= -1;
          edgeSound();
          if (effectManager.isBumperWallsActive()) {
              effectManager.registerBumperHit(ball);
          }
      }
      
      // Right bottom cushion
      if (ball.x + r > 615 && ball.y > 495 && ball.y < 925) {
          ball.x = 615 - r;
          ball.vx *= -1;
          edgeSound();
          if (effectManager.isBumperWallsActive()) {
              effectManager.registerBumperHit(ball);
          }
      }
    });

    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        balls[i].collision(balls[j]);
      }
      
      for (let i = 0; i < pockets.length; i++){
          for (let j = 0; j < balls.length; j++){
              pockets[i].pocketed(balls[j]);
          }
      }
    }
  }
}
  // I will blow up

let hittable = true;

function gameLoop() {
  update();
  draw();
  if (balls[0].vx == 0 && balls[0].vy == 0 && hittable){
    hittable = false;
    document.dispatchEvent(event);
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener('mousedown', (e) => {
  if (balls[0].vx == 0 && balls[0].vy == 0){
    aiming = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  }
});
 
document.addEventListener('mousemove', (e) => {
    if (aiming) {
      const rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
    }
  });
 
  document.addEventListener('mouseup', (e) => {
  if (balls[0].vx == 0 && balls[0].vy == 0){
    aiming = false;
    const rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
   
    let dx = balls[0].x - mouseX;
    let dy = balls[0].y - mouseY;
 
    balls[0].vx = dx * 0.1;
    balls[0].vy = dy * 0.1;
    hittable = true;
  }
});


gameLoop();

export {pocketed}