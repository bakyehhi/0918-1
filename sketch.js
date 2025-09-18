let player;
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  score = 0;
  gameOver = false;
  enemies = [];
  bullets = [];
}

function draw() {
  background(255,255,0);
  if (gameOver) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text('Game Over\nScore: ' + score, width/2, height/2);
    return;
  }
  player.show();
  player.move();

  // 총알 표시 및 이동
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].move();
    if (bullets[i].offscreen()) {
      bullets.splice(i, 1);
    }
  }

  // 적 생성
  if (frameCount % 60 === 0) {
    enemies.push(new Enemy());
  }

  // 적 표시 및 이동
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].show();
    enemies[i].move();
    if (enemies[i].offscreen()) {
      gameOver = true;
    }
    // 총알과 적 충돌 체크
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (enemies[i].hits(bullets[j])) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        break;
      }
    }
  }

  // 점수 표시
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);
}

function touchStarted() {
  if (!gameOver) {
    bullets.push(new Bullet(player.x, player.y));
  } else {
    setup(); // 게임 재시작
  }
  return false;
}

function touchMoved() {
  if (!gameOver && touches.length > 0) {
    player.x = touches[0].x;
    player.x = constrain(player.x, player.size/2, width - player.size/2);
    // y값은 고정
  }
  return false;
}

function mouseDragged() {
  if (!gameOver) {
    player.x = mouseX;
    player.x = constrain(player.x, player.size/2, width - player.size/2);
    // y값은 고정
  }
  return false;
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 60;
    this.size = 50;
  }
  show() {
    fill(0, 200, 255);
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size/2, 10);
  }
  move() {
    // 모바일/마우스 이동은 이벤트에서 처리
    this.y = height - 60; // 항상 고정
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 8;
    this.speed = 15;
  }
  show() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.r*2);
  }
  move() {
    this.y -= this.speed;
  }
  offscreen() {
    return this.y < -this.r;
  }
}

class Enemy {
  constructor() {
    this.x = random(30, width-30);
    this.y = -30;
    this.r = 25;
    this.speed = random(2, 5);
  }
  show() {
    fill(255, 50, 50);
    ellipse(this.x, this.y, this.r*2);
  }
  move() {
    this.y += this.speed;
  }
  offscreen() {
    return this.y > height + this.r;
  }
  hits(bullet) {
    let d = dist(this.x, this.y, bullet.x, bullet.y);
    return d < this.r + bullet.r;
  }
}