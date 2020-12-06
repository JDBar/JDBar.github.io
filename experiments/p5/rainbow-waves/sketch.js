p5.disableFriendlyErrors = true;

let width;
let height;
let spacing;
let spacing_shift_amt = 2.5;
let x_amt = 25;
let y_amt = 25;
let render_offset = 0;
let stroke_weight = 15;
let tick_spd = 0.5;
let wiggle_spd = 0.1;
let wiggle_amt = 25;
let hue_speed = 2;
let hue_shift_amt = 0.1;
let x_lag = 0.5;
let y_lag = 0.5;

let tick = 0;
let wave = 0;
let add = 1;

function initParameters() {
	width = document.body.clientWidth;
	height = document.body.clientHeight;
	spacing = Math.max(Math.ceil(width / x_amt), Math.ceil(height / y_amt));
	spacing_shift_amt = spacing * 0.05;
	stroke_weight = spacing * 0.3;
	wiggle_amt = spacing / 2;
}

function setup() {
	initParameters();
	console.log(width, height);
	createCanvas(document.body.clientWidth, document.body.clientHeight);
	frameRate(60);
	background(0);
}

function windowResized() {
	initParameters();
	console.log(width, height);
	resizeCanvas(document.body.clientWidth, document.body.clientHeight);
}

function draw() {
	background(`rgba(0, 0, 0, 0.033)`);
	colorMode(HSB);

	tick += tick_spd;
	add = Math.abs(Math.sin(tick * 0.005)) + 0.25;
	wave += add;

	let spacingX = spacing + Math.sin(tick * 0.02) * spacing_shift_amt;
	let spacingY = spacing + Math.cos(tick * 0.05) * spacing_shift_amt;

	for (let i = 0; i < x_amt; i++) {
		for (let j = 0; j < y_amt; j++) {
			let x =
				i * spacingX +
				Math.sin(wave * wiggle_spd - j * x_lag) * wiggle_amt +
				render_offset;
			let y =
				j * spacingY +
				Math.sin(wave * wiggle_spd + i * y_lag) * wiggle_amt +
				render_offset;

			x -= width / 2;
			y -= height / 2;
			let rotX = x * Math.cos(tick * 0.012) - y * Math.sin(wave * 0.002);
			let rotY = x * Math.sin(wave * 0.003) + y * Math.cos(tick * 0.01);
			x = rotX + width / 2;
			y = rotY + height / 2;

			strokeWeight(
				stroke_weight * Math.abs(Math.sin((wave * 10 - x + y) * 0.001)) + 2
			);
			stroke((wave * hue_speed + (x + y) * hue_shift_amt) % 360, 100, 100);
			point(x, y);
		}
	}
}
