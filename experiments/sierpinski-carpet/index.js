const LVL = 10; // How many levels of carpet to render.
const DELAY = 50; // Animation delay.
const W = 600; // Canvas width
const H = 600; // Canvas height
const BEST_SMOOTHING_ENABLED = true; // Enable smoothing on best mode.

document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
	const canvases = [
		document.getElementById("best"),
		document.getElementById("fast"),
		document.getElementById("slow"),
	];

	canvases.forEach((c) => {
		const button = document.getElementById(`${c.id}-button`);
		c.width = W;
		c.height = H;
		button.addEventListener("click", async function onButtonClick() {
			button.disabled = true;
			switch (c.id) {
				case "slow":
					await drawCarpetSlow(slow, LVL);
					break;
				case "fast":
					await drawCarpetFast(fast, LVL, 1);
					break;
				case "best":
					await drawCarpetBest(best, LVL, BEST_SMOOTHING_ENABLED);
					break;
			}
			button.disabled = false;
		});
	});
}

async function drawCarpetSlow(canvas, levels) {
	const start = performance.now();
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let w = canvas.width / 3;
	let h = canvas.height / 3;
	let x = w;
	let y = h;
	ctx.fillStyle = "white";
	if (DELAY) {
		await delay();
	}
	ctx.fillRect(x, y, w, h);

	for (let lvl = 1; lvl < levels; lvl++) {
		w /= 3;
		h /= 3;
		if (w < 0.1 && h < 0.1) continue;
		for (let i = 0; i < 3 ** lvl; i++) {
			for (let j = 0; j < 3 ** lvl; j++) {
				if (DELAY) {
					await delay();
				}
				x = w + i * w * 3;
				y = h + j * h * 3;
				ctx.fillStyle = "white";
				ctx.fillRect(x, y, w, h);
			}
		}
	}

	const end = performance.now();
	console.log(`drawCarpetSlow(${levels}): Done in ${end - start} ms.`);
}

async function drawCarpetFast(canvas, levels, superSample) {
	const start = performance.now();

	const oCtx = canvas.getContext("2d");

	if (!superSample) {
		superSample = 1;
	}

	const virtualCanvas = document.createElement("canvas");
	virtualCanvas.width = canvas.width * superSample;
	virtualCanvas.height = canvas.height * superSample;

	let ctx = virtualCanvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let w, h;
	ctx.fillStyle = "white";

	for (let lvl = 1; lvl <= levels; lvl++) {
		if (DELAY) {
			await delay();
			oCtx.drawImage(virtualCanvas, 0, 0, canvas.width, canvas.height);
		}
		w = virtualCanvas.width * 3 ** -lvl;
		h = virtualCanvas.height * 3 ** -lvl;
		ctx.fillRect(w, h, w, h);
	}

	for (let lvl = levels; lvl > 0; lvl--) {
		w = virtualCanvas.width * 3 ** -lvl;
		h = virtualCanvas.height * 3 ** -lvl;
		if (w < 1 || h < 1) continue;
		const cell = ctx.getImageData(0, 0, w, h);
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (i | j && !(i & (j === 1))) {
					if (DELAY) {
						await delay();
						oCtx.drawImage(virtualCanvas, 0, 0, canvas.width, canvas.height);
					}
					let x = i * w;
					let y = j * h;
					ctx.putImageData(cell, x, y);
				}
			}
		}
	}
	oCtx.drawImage(virtualCanvas, 0, 0, canvas.width, canvas.height);

	const end = performance.now();
	console.log(`drawCarpetFast(${levels}) Done in ${end - start} ms.`);
}

async function drawCarpetBest(canvas, levels, enableSmoothing) {
	const start = performance.now();

	enableSmoothing = enableSmoothing ? 1 : 0;

	const ctx = canvas.getContext("2d");
	const vCanvas = Array(2)
		.fill()
		.map((_) => document.createElement("canvas"));

	const vCtx = vCanvas.map((vc) => {
		vc.width = canvas.width;
		vc.height = canvas.height;
		const ctx = vc.getContext("2d");
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, vc.width, vc.height);
		ctx.fillStyle = "white";
		ctx.imageSmoothingEnabled = true;
		return ctx;
	});

	let w = canvas.width / 3;
	let h = canvas.height / 3;

	for (let lvl = 1; lvl <= levels; lvl++) {
		const src = lvl % 2;
		const dest = (lvl + 1) % 2;

		if (enableSmoothing) {
			vCtx[src].filter = `blur(0.9px)`;
		}
		vCtx[src].drawImage(vCanvas[src], 0, 0);
		vCtx[dest].fillRect(w, h, w, h);

		if (DELAY) {
			await delay();
			ctx.drawImage(vCanvas[dest], 0, 0, canvas.width, canvas.height);
		}

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (!(i & (j === 1))) {
					let x = i * w;
					let y = j * h;
					vCtx[dest].drawImage(vCanvas[src], x, y, w, h);
					if (DELAY) {
						await delay();
						ctx.drawImage(vCanvas[dest], 0, 0, canvas.width, canvas.height);
					}
				}
			}
		}
		vCtx[src].filter = "none";
	}

	const final = vCanvas[(levels + 1) % 2];
	ctx.drawImage(final, 0, 0, canvas.width, canvas.height);

	const end = performance.now();
	console.log(`drawCarpetBest(${levels}) Done in ${end - start} ms.`);
}

function delay() {
	if (!DELAY) return;
	return new Promise((resolve) => {
		setTimeout(resolve, DELAY);
	});
}
