let stepX = 10;
let stepY = 30;
let MoveDivje = document.getElementById("moveDiv");
let blokje = document.getElementById("scoreblokje");
let container = document.getElementById("container");
let Leftpos = MoveDivje.offsetLeft;
let hitBox = document.getElementById("hitBox");
let hitDivWidth = 200;
let right = document.getElementById("scoreblokje").style.right;
let Coords = document.getElementById("Coords");
let moving = false
let score =  document.getElementById("Score");
score = 0;
let minuspoints = 10;
let pluspoints = 0;
hitBox.onmousedown = mouseClick;
container.onmousemove = showCoords;

function move() {
  console.log("wow");
  let Leftpos = MoveDivje.offsetLeft;
  let Ypos = MoveDivje.offsetTop;
  
 // score = score + pluspoints;
  if (Ypos + stepY >= 600) {
    stepY = -stepY;
    setscore()
    setLevels()
  }
  if (Ypos + stepY <= -20) {
    stepY = -stepY;
  }
  if (Leftpos + stepX >= 785) {
    stepX = -stepX;
  }
  if (Leftpos + stepX <= 0) {
    stepX = -stepX;
  }
  MoveDivje.style.left = Leftpos + stepX + "px";
  MoveDivje.style.top = Ypos + stepY + "px";

  showScore()
}
function automatisch() {
  if (moving == false) {
  myInterval = setInterval(move, 60);
  moving = true;
  }
  
}
function stop() {
  clearInterval(myInterval);
  moving = false;
}
function reset() {
  location.reload();
}
function showCoords(event) {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
  Coords.innerHTML = '(' + mouseX + ', ' + mouseY + ')';
}
function showScore() {
  document.getElementById("Score").innerHTML = "score:" + score;
}


function mouseClick(event) {
  console.log("mouseX + hitDivWidth  = " + (mouseX + hitDivWidth));
  hitDivLeft = 0;
  if (event.button == 0) {
      hitDivLeft = mouseX - Math.round(0.5*hitDivWidth);
      if(hitDivLeft+hitDivWidth > 780){
        hitDivLeft = 800 - hitDivWidth;
      }
      if(hitDivLeft < 0){
        hitDivLeft = 0;
      }
      blokje.style.left = hitDivLeft + "px";
      
  }
}


function setscore() {
  let MoveDivLinks = MoveDivje.offsetLeft;
  let MoveDivRechts = MoveDivje.offsetLeft + MoveDivje.offsetWidth;
  let HitDivLinks = blokje.offsetLeft;
  let HitDivRechts = blokje.offsetLeft + blokje.offsetWidth;
  if (MoveDivLinks >= HitDivLinks && MoveDivRechts <= HitDivRechts) {
    console.log("hit");
    score = score + pluspoints;
  } else {
  score = score - minuspoints;
  }
}
function setLevels() {
  let scoreshow = blokje.innerHTML = pluspoints;
  if (score < 0) {
    pluspoints = 5;
    blokje.style.width = "200px"
    scoreshow;
  }
  if (score >= 0 && score < 100) {
    pluspoints = 10;
    blokje.style.width = "200px"
    scoreshow;
  }
  if (score >= 100 && score < 200) {
    pluspoints = 15;
    blokje.style.width = "175px"
    scoreshow;
  }
}
  if (score >= 200 && score < 300) {
    pluspoints = 20;
    blokje.style.width = "125px"
    scoreshow;
  }
  if (score >= 300 && score < 400) {
    pluspoints = 25;
    blokje.style.width = "100px"
    scoreshow;
  }
