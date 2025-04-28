const canvas = document.getElementById('table');
    const ctx = canvas.getContext('2d');
    class ball{
    
        constructor(x, y, color, suit){
            this.x = x;
            this.y = y;
            this.color = color;
            this.suit = suit;
            this.vx = 0;
            this.vy = 0;
            this.radius = 10;
        }
    
    }
    let balls = [
      new ball(200, 200, "white", "cue"),
      new ball(600, 200, "red", "solid"),
      new ball(200, 400, "orange", "solid"),
      new ball(700, 500, "blue", "solid"),

    ];

    let aiming = false;
    let startX, startY;

    function drawBall(ball) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();
    }

    function drawTable() {
      ctx.fillStyle = '#0a5c1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
      drawTable();
      balls.forEach(drawBall);
      if (aiming) {
        ctx.beginPath();
        ctx.moveTo(balls[0].x, balls[0].y);
        ctx.lineTo(startX, startY);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();
      }
    }

    function checkCollision(ball1, ball2) {
      let dx = ball2.x - ball1.x;
      let dy = ball2.y - ball1.y;
      let distance = Math.hypot(dx, dy);
      if (distance < ball1.radius + ball2.radius) {
        // Simple elastic collision
        let angle = Math.atan2(dy, dx);
        let speed1 = Math.hypot(ball1.vx, ball1.vy);
        let speed2 = Math.hypot(ball2.vx, ball2.vy);
        let direction1 = Math.atan2(ball1.vy, ball1.vx);
        let direction2 = Math.atan2(ball2.vy, ball2.vx);

        let vx1 = speed1 * Math.cos(direction1 - angle);
        let vy1 = speed1 * Math.sin(direction1 - angle);
        let vx2 = speed2 * Math.cos(direction2 - angle);
        let vy2 = speed2 * Math.sin(direction2 - angle);

        let final_vx1 = vx2;
        let final_vx2 = vx1;

        ball1.vx = Math.cos(angle) * final_vx1 + Math.cos(angle + Math.PI/2) * vy1;
        ball1.vy = Math.sin(angle) * final_vx1 + Math.sin(angle + Math.PI/2) * vy1;
        ball2.vx = Math.cos(angle) * final_vx2 + Math.cos(angle + Math.PI/2) * vy2;
        ball2.vy = Math.sin(angle) * final_vx2 + Math.sin(angle + Math.PI/2) * vy2;

        // Move balls apart to prevent sticking
        let overlap = (ball1.radius + ball2.radius) - distance;
        ball1.x -= overlap / 2 * (dx / distance);
        ball1.y -= overlap / 2 * (dy / distance);
        ball2.x += overlap / 2 * (dx / distance);
        ball2.y += overlap / 2 * (dy / distance);
      }
    }

    function update() {
  balls.forEach(ball => {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Friction
    ball.vx *= .98;
    ball.vy *= .98
    ;

    // Stop very slow balls
    if (Math.abs(ball.vx) < 0.1) ball.vx = 0;
    if (Math.abs(ball.vy) < 0.1) ball.vy = 0;

    // Bounce off walls
    if (ball.x < ball.radius) { ball.x = ball.radius; ball.vx *= -1; }
    if (ball.x > canvas.width - ball.radius) { ball.x = canvas.width - ball.radius; ball.vx *= -1; }
    if (ball.y < ball.radius) { ball.y = ball.radius; ball.vy *= -1; }
    if (ball.y > canvas.height - ball.radius) { ball.y = canvas.height - ball.radius; ball.vy *= -1; }
  });

  // Optimized collision detection
  for (let i = 0; i < balls.length; i++) {
    let ball1 = balls[i];
    if (ball1.vx === 0 && ball1.vy === 0) continue; // Skip stationary ball1
    for (let j = i + 1; j < balls.length; j++) {
      let ball2 = balls[j];
      if (ball2.vx === 0 && ball2.vy === 0 && ball1.vx === 0 && ball1.vy === 0) continue; // Skip two stationary
      // Check only if close enough
      let dx = ball2.x - ball1.x;
      let dy = ball2.y - ball1.y;
      if (Math.abs(dx) < 25 && Math.abs(dy) < 25) { // 25 = small safe range
        checkCollision(ball1, ball2);
      }
    }
  }
}


    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    canvas.addEventListener('mousedown', (e) => {
        if (balls[0].vx == 0 && balls[0].vy == 0){
            aiming = true;
            startX = e.offsetX;
            startY = e.offsetY;
        }
      
    });

    canvas.addEventListener('mouseup', (e) => {
        if (balls[0].vx == 0 && balls[0].vy == 0){
            aiming = false;
            let dx = balls[0].x - e.offsetX;
            let dy = balls[0].y - e.offsetY;
            balls[0].vx = dx * 0.1;
            balls[0].vy = dy * 0.1;
        }
      
    });

    gameLoop();

