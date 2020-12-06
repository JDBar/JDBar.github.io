document.addEventListener("DOMContentLoaded", () => {
	const data = {
		experiments: [
			{
				title: "Fun - Image to ANSI Art Converter",
				url: "./ansi",
				description:
					"Locally converts images to grayscale ANSI art using canvas and file APIs, and some janky luminosity function.",
			},
			{
				title: "Fun - Sierpinski Carpet Rendering",
				url: "./sierpinski-carpet",
				description:
					"A student's challenge to render a level-10 Sierpniski carpet using JavaScript led me to write three different methods of differing complexity/speed/quality.",
			},
			{
				title: "P5.js - Dragon Pong Z",
				url: "./p5/dragon-pong-z",
				description:
					"A student asked me how to do collision detection, and I went down this rabbit hole where I ended up writing a very intense self-playing game of Pong.",
			},
			{
				title: "P5.js - Rainbow Waves",
				url: "./p5/rainbow-waves",
				description: '"It\'s all rainbow... and wavy."',
			},
			{
				title: "P5.js - Taffy Whirlpool",
				url: "./p5/taffy-whirlpool",
				description:
					"Taffy is a type of candy invented in the United States, made by stretching or pulling a sticky mass of boiled sugar, butter or vegetable oil, flavorings, and colorings, until it becomes aerated, resulting in a light, fluffy and chewy candy.",
			},
			{
				title: "Security - RTL Reversed HTML Experiment",
				url: "./security/rtl-xss",
				description:
					"Some dumb idea I had while working on bug bounties to see what happens when you feed a browser a reversed HTML payload prefixed by a right-to-left Unicode marker.",
			},
		],
	};

	const listElement = document.getElementById("experiments-list");
	[...data.experiments]
		.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0))
		.forEach((experiment) => {
			listElement.append(
				document.createRange().createContextualFragment(`
				<li>
					<h3 class="experiment-title"><a href="${experiment.url}">${experiment.title}</a></h3>
					<p class="experiment-description">${experiment.description}</p>
				</li>
			`)
			);
		});
});
