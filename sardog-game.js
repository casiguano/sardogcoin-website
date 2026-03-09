window.addEventListener("load", () => {

const canvas = document.getElementById("gameCanvas");
if (!canvas) return;

const ctx = canvas.getContext("2d");

let score = 0;
let gravity = 0.6;

const player = {
x:80,
y:300,
width:50,
height:50,
velocityY:0
};

let obstacles = [];

document.addEventListener("keydown", e => {
if(e.code === "Space" && player.y >= 300){
player.velocityY = -12;
}
});

function update(){

player.velocityY += gravity;
player.y += player.velocityY;

if(player.y > 300){
player.y = 300;
player.velocityY = 0;
}

if(Math.random() < 0.02){
obstacles.push({x:900,y:320,width:30,height:40});
}

obstacles.forEach(o => o.x -= 6);

obstacles.forEach(o => {

if(
player.x < o.x + o.width &&
player.x + player.width > o.x &&
player.y < o.y + o.height &&
player.y + player.height > o.y
){
alert("Game Over! Score: " + score);
location.reload();
}

});

obstacles = obstacles.filter(o => o.x > -40);

score++;
document.getElementById("score").innerText = score;

}

function draw(){

ctx.clearRect(0,0,900,420);

ctx.fillStyle="white";
ctx.fillRect(player.x,player.y,player.width,player.height);

ctx.fillStyle="red";

obstacles.forEach(o=>{
ctx.fillRect(o.x,o.y,o.width,o.height);
});

}

function gameLoop(){
update();
draw();
requestAnimationFrame(gameLoop);
}

gameLoop();

});
