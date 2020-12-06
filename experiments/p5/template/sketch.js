p5.disableFriendlyErrors = true;

function setup() {
	createCanvas(document.body.clientWidth, document.body.clientHeight);
	frameRate(60);
	background(0);
}

function windowResized() {
	resizeCanvas(document.body.clientWidth, document.body.clientHeight);
}

function draw() {}
