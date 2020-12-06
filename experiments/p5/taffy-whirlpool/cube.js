class Cube {
	constructor(width, height, children, level, rotationSpeed) {
		this.x = 0;
		this.y = 0;
		this.isRoot = 0;
		this.rootAngle = 0;
		this.tick = 0;
		this.width = width;
		this.height = height;
		this.angle = 0;
		this.rotationSpeed = rotationSpeed;
		this.level = level;
		this.index = 0;
		this.children = children;
		this.childrenList = [];
		if (this.level && this.children) {
			this.initChildren();
		}
	}

	initChildren() {
		const angleScalar = (2 * Math.PI) / this.children;
		const shrink = 0.8;
		const childWidth = this.width * shrink;
		const childHeight = this.height * shrink;
		for (let i = 0; i < this.children; i++) {
			const child = new Cube(
				childWidth,
				childHeight,
				this.children,
				this.level - 1,
				this.rotationSpeed * 0.8
			);
			child.index = i;
			child.x =
				Math.cos(angleScalar * i) * (this.width / 2 + childWidth / 2 + 100);
			child.y =
				Math.sin(angleScalar * i) * (this.height / 2 + childHeight / 2 + 100);
			child.rootAngle = angleScalar * i;
			this.childrenList.push(child);
		}
	}

	drawChildren() {
		for (let i = 0; i < this.childrenList.length; i++) {
			const child = this.childrenList[i];
			child.draw();
		}
	}

	draw() {
		push();

		this.tick++;

		let xOff, yOff;

		if (!this.isRoot) {
			xOff = Math.sin(this.tick * 0.005 + this.rootAngle * 2) * this.width * 10;
			yOff =
				Math.cos(this.tick * 0.005 + this.rootAngle * 2) * this.height * 10;
		}

		translate(this.x, this.y);
		rotate(this.angle + this.rootAngle);

		this.drawChildren();

		this.angle += this.rotationSpeed * Math.cos(this.tick * 0.002);

		const hue = (this.tick * (0.1 / (this.level + 1 + this.index))) % 360;
		colorMode(HSB);
		stroke(hue, 100, 100);
		strokeWeight(2);
		fill(hue, 100, 100);

		let widthOff = (Math.sin(this.tick * 0.02 + this.index) * this.width) / 2;
		let heightOff = (Math.cos(this.tick * 0.03 + this.index) * this.height) / 2;
		ellipse(
			this.x + xOff - widthOff / 2,
			this.y + yOff - heightOff / 2,
			this.width + widthOff,
			this.height + heightOff
		);

		pop();
	}
}
