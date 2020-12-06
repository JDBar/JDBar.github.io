class Paddle {
  constructor(options) {
    this.x = options.x;
    this.y = H / 2 - Paddle.HEIGHT / 2;
    this.KEY_UP = options.KEY_UP;
    this.KEY_DOWN = options.KEY_DOWN;
  }
  
  draw() {
    push();
    fill("white");
    rect(this.x, this.y, Paddle.WIDTH, Paddle.HEIGHT);
    pop();
  }
  
  follow(ball) {
    if (ball.frozen) {
      return;
    }
    if (this !== ball.lastHit || Math.random() < 0.25) {
      let y = this.y + Paddle.HEIGHT / 2;
      let oy = ball.y + Ball.HEIGHT / 2;
      if (y < oy) {
        this.moveDown();
      } else if (y > oy) {
        this.moveUp();
      }
    } else {
      Math.random() < 0.5 ? this.moveDown() : this.moveUp();
    }
  }
  
  moveUp() {
    for (let i = Paddle.SPEED; i > 0; i--) {
      this.y = Math.max(0, this.y - 1);
      //this.draw();
    }
  }
  
  moveDown() {
    for (let i = Paddle.SPEED; i > 0; i--) {
      this.y = Math.min(H - Paddle.HEIGHT, this.y + 1);
      //this.draw();
    }
  }
}
Paddle.SPEED = 10;
Paddle.WIDTH = 5;
Paddle.HEIGHT = 40;

class Ball {
  constructor() {
    this.frozen = true;
    this.lastHit = null;
    this.x = W / 2 - Ball.WIDTH / 2;
    this.y = H / 2 - Ball.HEIGHT / 2;
    this.xSpeed = (Math.random() < 0.5 ? 1 : -1) * Ball.BASE_SPEED;
    this.setRandomYSpeed();
  }
  
  setRandomYSpeed() {
    this.ySpeed = (Math.random() < 0.5 ? 1 : -1) * 
      (Math.floor(Math.random() * Paddle.SPEED) + 1);
  }
  
  move(paddles) {    
    if (this.frozen) {
      return this.draw();
    }

    // In order to prevent the ball moving through the paddles at
    // high speed, we must check for collisions every pixel traveled.
    for (let i = Math.abs(this.xSpeed); i > 0; i--) {
      let dx = Math.sign(this.xSpeed) * Math.min(i, 1);
      let dy = this.ySpeed * Math.abs(dx / this.xSpeed);
      
      this.x += dx;
      this.y += dy;
      
      // Handle vertical collision first.
      if (this.y <= 0 || (this.y >= H - Ball.HEIGHT)) {
        this.y = Math.max(this.y, 0);
        this.y = Math.min(this.y, H - Ball.HEIGHT);
        this.ySpeed *= -1;
      }
      
      // Then handle paddle collision.
      for (let p of paddles) {
        if (
          this.lastHit !== p &&
          this.x + Ball.WIDTH > p.x &&
          this.x < p.x + Paddle.WIDTH &&
          this.y + Ball.HEIGHT > p.y &&
          this.y < p.y + Paddle.HEIGHT
        ) {
          // Update this.lastHit and change direction.
          this.collide(p);
          break;
        }
      }
      
      this.draw();
    }
    
    if (this.x < 0 - Ball.WIDTH) {
      this.x = 0;
      this.onScore(paddles[1]);
    } else if (this.x > W) {
      this.x = W - Ball.WIDTH;
      this.onScore(paddles[0]);
    }
  }
  
  reset() {
    this.freeze();
    this.lastHit = null;
    this.x = W / 2 - Ball.WIDTH / 2;
    this.y = H / 2 - Ball.HEIGHT / 2;
    this.xSpeed = -Math.sign(this.xSpeed) * Ball.BASE_SPEED;
    this.setRandomYSpeed();
  }
  
  collide(paddle) {
    this.lastHit = paddle;
    const oy = paddle.y + Paddle.HEIGHT / 2;
    const y = this.y + Ball.HEIGHT / 2;
    this.ySpeed = ((y - oy) / Paddle.HEIGHT * Paddle.SPEED * 1.5);
    this.xSpeed *= -1;
    this.xSpeed += 1 * Math.sign(this.xSpeed);
    this.xSpeed = Math.min(
      Math.abs(this.xSpeed),
      Ball.SPEED_LIMIT
    ) * Math.sign(this.xSpeed);
  }
  
  freeze() {
    this.frozen = true;
  }
  
  unfreeze() {
    this.frozen = false;
  }
  
  draw() {
    push();
    fill("white");
    rect(this.x, this.y, Ball.WIDTH, Ball.HEIGHT);
    pop();
  }
  
  onScore(paddle) {}
}
Ball.BASE_SPEED = 3;
Ball.SPEED_LIMIT = 1000;
Ball.WIDTH = 5;
Ball.HEIGHT = 5;

class Game {
  constructor() {
    this.ball = new Ball();
    this.ball.onScore = p => this.onScore(p);
    this.score = [0, 0];
    this.scoreboard = new Scoreboard(this.score);
    this.paddles = [
      new Paddle({
        x: 0 + PADDING,
        KEY_UP: 87,
        KEY_DOWN: 83
      }),
      new Paddle({
        x: W - PADDING - Paddle.WIDTH,
        KEY_UP: 38,
        KEY_DOWN: 40
      }),
    ];
    this.start();
  }
  
  onScore(paddle) {
    const i = this.paddles.indexOf(paddle);
    this.ball.freeze();
    this.score[i]++;
    console.log(this.score);
    
    setTimeout(() => {
      this.ball.reset();
      this.ball.unfreeze();
    }, Game.DELAY);
  }
  
  start() {
    setTimeout(() => {
      this.ball.unfreeze();
    }, Game.DELAY);
  }
  
  draw() {
    push();
    background("rgba(0, 0, 0, 0.25)");
    fill("white");
    strokeWeight(0);
    this.checkIO();
    for (let p of this.paddles) {
      p.follow(this.ball);
      p.draw();
    }
    this.ball.move(this.paddles);
    this.scoreboard.draw();
    
    const dotW = 1;
    const dotPad = 10;
    for (let i = 0; i < H; i += dotW + dotPad) {
      rect(W / 2 - dotW / 2, i, dotW, dotW);
    }
    pop();
  }
  
  checkIO() {
    for (let p of this.paddles) {
      if (keyIsDown(p.KEY_UP)) {
        p.moveUp();
      } else if (keyIsDown(p.KEY_DOWN)) {
        p.moveDown();
      }
    }
  }
}
Game.DELAY = 2000;

class Scoreboard {
  constructor(score) {
    this.score = score;
  }
  
  draw() {
    push();
    textSize(48);
    fill("white");
    textFont(FONT_SCORE);
    textAlign(CENTER, CENTER);
    text(this.score[0], W / 5, 48);
    text(this.score[1], 4 * W / 5, 48);
    pop();
  }
}

const PADDING = 40;
const W = 640;
const H = 480;
let GAME = null;

let FONT_SCORE;
function preload() {
  FONT_SCORE = loadFont('screaming_neon.ttf');
}

function setup() {
  GAME = new Game();
  createCanvas(W, H);
  frameRate(60);
  background(0);
}

function draw() {
  GAME.draw();
}
