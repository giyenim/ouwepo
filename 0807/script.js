const dvdZone = document.querySelector('.dvd-zone');
const dvdLogoBox = document.querySelector('.dvd-logo-box');
const walls = document.querySelectorAll('.wall');
const topWall = document.querySelector('.wall-top');
const leftTopWall = document.querySelector('.wall-left-top');
const leftBottomWall = document.querySelector('.wall-left-bottom');
const rightWall = document.querySelector('.wall-right');
const bottomWall = document.querySelector('.wall-bottom');

let x = 0;
let y = 0;
let velocityX = 130;
let velocityY = 95;
let previousTime = performance.now();
let isStopped = false;

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 0x1000000)
    .toString(16)
    .padStart(6, '0')}`;
}

function changeWallColor(wall) {
  wall.style.backgroundColor = getRandomHexColor();
}

function getTouchedLeftWall() {
  const logoCenterY = dvdZone.offsetTop + y + dvdLogoBox.offsetHeight / 2;
  const leftTopWallBottom = leftTopWall.offsetTop + leftTopWall.offsetHeight;

  return logoCenterY < leftTopWallBottom ? leftTopWall : leftBottomWall;
}

function stopAtCorner() {
  isStopped = true;
  velocityX = 0;
  velocityY = 0;

  walls.forEach((wall) => {
    wall.style.backgroundColor = '#ffffff';
  });
}

function moveDvdLogo(currentTime) {
  if (isStopped) return;

  const deltaTime = Math.min((currentTime - previousTime) / 1000, 0.05);
  previousTime = currentTime;

  const maxX = Math.max(0, dvdZone.clientWidth - dvdLogoBox.offsetWidth);
  const maxY = Math.max(0, dvdZone.clientHeight - dvdLogoBox.offsetHeight);

  const nextX = x + velocityX * deltaTime;
  const nextY = y + velocityY * deltaTime;
  const hitLeft = nextX <= 0;
  const hitRight = nextX >= maxX;
  const hitTop = nextY <= 0;
  const hitBottom = nextY >= maxY;
  const hitHorizontalWall = hitLeft || hitRight;
  const hitVerticalWall = hitTop || hitBottom;
  const hitCorner = hitHorizontalWall && hitVerticalWall;

  x = Math.max(0, Math.min(nextX, maxX));
  y = Math.max(0, Math.min(nextY, maxY));

  if (hitCorner) {
    dvdLogoBox.style.transform = `translate(${x}px, ${y}px)`;
    stopAtCorner();
    return;
  }

  if (hitHorizontalWall) {
    velocityX *= -1;
    changeWallColor(hitLeft ? getTouchedLeftWall() : rightWall);
  }

  if (hitVerticalWall) {
    velocityY *= -1;
    changeWallColor(hitTop ? topWall : bottomWall);
  }

  dvdLogoBox.style.transform = `translate(${x}px, ${y}px)`;
  requestAnimationFrame(moveDvdLogo);
}

requestAnimationFrame(moveDvdLogo);
