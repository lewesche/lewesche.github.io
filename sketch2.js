const buf=0.5;

const numPts=10;
const pts = [];
const crcs = [];


const voronoiEdges = [];

const bisectors = [];
const segs = [];

class pt {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	draw() { strokeWeight(20); point(this.x, this.y); }
}

class ln {
	constructor(p, m) {
		this.m = m;
		this.b = p.y - m*p.x;
		this.anchor = p; // used to create a segment around!
	}

	draw() { strokeWeight(2); line(0, this.b, width, this.m*width + this.b); }
}

class seg {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
		this.m = (p1.y-p2.y)/(p1.x-p2.x);
		this.b = p1.y - this.m*p1.x;
	}

	draw() { strokeWeight(2); line(this.p1.x, this.p1.y, this.p2.x, this.p2.y); }
}

class crc {
	constructor(p1, p2, p3) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.cx = ((p1.x*p1.x + p1.y*p1.y)*(p2.y-p3.y) + (p2.x*p2.x + p2.y*p2.y)*(p3.y-p1.y) + (p3.x*p3.x + p3.y*p3.y)*(p1.y-p2.y)) / (2*(p1.x*(p2.y-p3.y) - p1.y*(p2.x-p3.x) + p2.x*p3.y - p3.x*p2.y));
		this.cy = ((p1.x*p1.x + p1.y*p1.y)*(p3.x-p2.x) + (p2.x*p2.x + p2.y*p2.y)*(p1.x-p3.x) + (p3.x*p3.x + p3.y*p3.y)*(p2.x-p1.x)) / (2*(p1.x*(p2.y-p3.y) - p1.y*(p2.x-p3.x) + p2.x*p3.y - p3.x*p2.y));
		this.r = sqrt((this.cx-p1.x)*(this.cx-p1.x) + (this.cy-p1.y)*(this.cy-p1.y));
		this.c = new pt(this.cx, this.cy);
	}
	draw() { noFill(); stroke('grey'); strokeWeight(1); circle(this.cx, this.cy, 2*this.r);}
	drawCenter() { stroke('red'); strokeWeight(10); point(this.cx, this.cy);}
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(51);
	for(let i=0; i<numPts; i++) {
		let x = random(width)*buf + width*buf/2;
		let y = random(height)*buf + height*buf/2;
		pts.push(new pt(x, y));
		stroke('blue');
		pts[i].draw();
	}
	//pts.push(new pt(0, 0));
	//pts.push(new pt(0, height));
	//pts.push(new pt(width, 0));
	//pts.push(new pt(width, height));

	getCircles();
	//drawDelaunay();
	getVoronoiEdges();
	//getSegments();
}

function getCircles() {
	for(let i=0; i<pts.length; i++) {
		for(let j=i+1; j<pts.length; j++) {
			for(let k=j+1; k<pts.length; k++) {
				let c = new crc(pts[i], pts[j], pts[k]);
				if(!ptsInCircle(c)) {
					//c.draw();
					c.drawCenter();
					crcs.push(c);
				}
			}
		}
	}
	
}

function ptsInCircle(c) {
	for(let i=0; i<pts.length; i++) {
		let p = pts[i];
		let dx = p.x-c.cx; let dy = p.y-c.cy;
		let dist = sqrt(dx*dx + dy*dy);
		//console.log(dist-c.r);
		if(c.r>dist+0.0001) { return true; }
	}
	return false;
}

function drawDelaunay() {
	stroke('blue');
	strokeWeight(2);
	for(let i=0; i<crcs.length; i++) {
		let c = crcs[i];
		line(c.p1.x, c.p1.y, c.p2.x, c.p2.y);
		line(c.p1.x, c.p1.y, c.p3.x, c.p3.y);
		line(c.p3.x, c.p3.y, c.p2.x, c.p2.y);
	}
}

function getVoronoiEdges() {
	for(let i=0; i<crcs.length; i++) {
		let c = crcs[i];
		drawVoronoiEdge(c, c.p1, c.p2);
		drawVoronoiEdge(c, c.p1, c.p3);
		drawVoronoiEdge(c, c.p2, c.p3);
	}
}

function drawVoronoiEdge(c, p1, p2) {
	let n = hasNeighbor(c, p1, p2);
	if(n) {
		//console.log("has a neighbor!");
		stroke('red');
		strokeWeight(2);
		line(c.cx, c.cy, n.cx, n.cy);
	} else {
		//console.log("no neighbor!");	
		let midpoint = new pt((p1.x+p2.x)/2, (p1.y+p2.y)/2);
		let m = -1*(p1.x-p2.x)/(p1.y-p2.y);
		//stroke('yellow'); midpoint.draw();
		let b = c.cy - m*c.cx;

		if(ptInsideTriangle(c)) {
			//Line should go out towards the midpoint no matter what
			stroke('red'); strokeWeight(2);
			if(c.cx >= midpoint.x) { 
				line(c.cx, c.cy, 0, b);
			} else {
				line(c.cx, c.cy, width, width*m+b);
			}
			return;
		} else {
			//If we are dealing with the segment with the closest midpoint to the circumcenter, the line should go away from the midpoint. 
			if(closestMidpoint(c, midpoint)){	
				//Away form midpoint
				stroke('red'); strokeWeight(2);
				if(c.cx < midpoint.x) { 
					line(c.cx, c.cy, 0, b);
				} else {
					line(c.cx, c.cy, width, width*m+b);
				}
			} else {	
				//Towards the midpoint
				stroke('red'); strokeWeight(2);
				if(c.cx >= midpoint.x) { 
					line(c.cx, c.cy, 0, b);
				} else {
					line(c.cx, c.cy, width, width*m+b);
				}
			}
		}
	}
}

function hasNeighbor(c, p1, p2) {
	// Look for a circle with the same points a different r and c
	for(let i=0; i<crcs.length; i++) {
		let n = crcs[i];
		if(c.r!=n.r && (c.cx!=n.cx || c.cy!=n.cy)) {
			let e=0;
			e += (p1 == n.p1);
			e += (p1 == n.p2);
			e += (p1 == n.p3);
			e += (p2 == n.p1);
			e += (p2 == n.p2);
			e += (p2 == n.p3);
			if(e==2) {
				return n;
			}
		}		
	}
	return false;
}

function ptInsideTriangle(c) {
	let A = triArea(c.p1, c.p2, c.p3);
	let a1 = triArea(c.c, c.p2, c.p3);
	let a2 = triArea(c.p1, c.c, c.p3);
	let a3 = triArea(c.p1, c.p2, c.c);
	if(a1+a2+a3-0.000001 > A) { 
		return false;
	} else {
		return true;
	}

}

function triArea(p1, p2, p3) {
	let a = abs((p1.x*(p2.y-p3.y) + p2.x*(p3.y-p1.y) + p3.x*(p1.y-p2.y))/2);  
	return a;
}

function closestMidpoint(c, midpoint) {
	//Get midpoints
	let mp1 = new pt((c.p1.x+c.p2.x)/2, (c.p1.y+c.p2.y)/2);
	let mp2 = new pt((c.p1.x+c.p3.x)/2, (c.p1.y+c.p3.y)/2);
	let mp3 = new pt((c.p2.x+c.p3.x)/2, (c.p2.y+c.p3.y)/2);
	let d1 = distance(mp1, c.c);
	let d2 = distance(mp2, c.c);
	let d3 = distance(mp3, c.c);
	let dmin = min(d1, min(d2, d3));
	let dactual = distance(midpoint, c.c);
	if(dactual == dmin) {
		return true;
	}
	return false;
}

function distance(p1, p2) {
	d = sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
	return d;
}




