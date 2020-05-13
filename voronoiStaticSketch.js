const buf=0.5;

const numPts=20;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);

	let randomPoints = [];
	for(let i=0; i<numPts; i++) {
		let x = random(width)*buf + width*buf/2;
		let y = random(height)*buf + height*buf/2;
		randomPoints.push(new pt(x, y));
	}
	let s = new Voronoi(randomPoints);
	s.drawPts('orange');
	//s.drawDelaunayTriangles('blue');
	s.drawVoronoiEdges('orange');

	$.getJSON("lewesche.json", function(json) {
    	console.log(json); // this will show the info it in firebug console
	});
}

