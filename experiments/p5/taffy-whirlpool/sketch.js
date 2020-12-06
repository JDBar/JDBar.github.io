p5.disableFriendlyErrors = true;

let width;
let height;
let cube = new Cube(100, 100, 5, 3, 0.003);

function updateParameters() {
	width = document.body.clientWidth;
	height = document.body.clientHeight;
	cube.x = width / 2;
	cube.y = height / 2;
	cube.isRoot = 1;
}

function setup() {
	updateParameters();
	createCanvas(width, height);
	frameRate(60);
	background(0);
}

function windowResized() {
	updateParameters();
	resizeCanvas(width, height);
}

function draw() {
	// background(0);
	background("rgba(0, 0, 0, 0.01)");
	cube.draw();
}

function drawCube() {}
