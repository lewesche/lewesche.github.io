const buf=0.5;

const numPts=20;
const vmax=5;
const step=0.1;

const pts = [];
const v = [];
let voronoi;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);

	for(let i=0; i<numPts; i++) {
		let x = random(width)*buf + width*buf/2;
		let y = random(height)*buf + height*buf/2;
		pts.push(new pt(x, y));

		let vx = random(2*vmax)-vmax;
		let vy = random(2*vmax)-vmax;
		v.push({x:vx, y:vy});
	}
	voronoi = new Voronoi(pts);
	voronoi.drawPts('orange');
	//s.drawDelaunayTriangles('blue');
	voronoi.drawVoronoiEdges('orange');

	movePts();
}

function movePts() {
	for(let i=0; i<pts.length; i++) {
		pts[i].x += step*v[i].x;
		pts[i].y += step*v[i].y;
		if(outOfBounds(pts[i])) {
			pts.splice(i, 1);
			v.splice(i, 1);
			i--;
		}
	}
	voronoi.updatePts(pts);
	background(0);
	voronoi.drawPts('orange');
	voronoi.drawVoronoiEdges('orange');
	if(pts.length==0) {
		console.log("stopping");
		return;
	}
	setTimeout(movePts, 0);
}

function outOfBounds(p) {
	if(p.x<0 || p.x>width || p.y<0 || p.y>height) {return true;}
	return false;
}

function mouseClicked() {
	pts.push(new pt(mouseX, mouseY));
	let vx = random(2*vmax)-vmax;
	let vy = random(2*vmax)-vmax;
	v.push({x:vx, y:vy});
	if(pts.length ==1) { console.log("starting"); movePts(); }
}

