// A class for drawing voronoi diagrams from a collection of points, including some helper geometry classes
// Relies of p5.js for drawing. Assumes a canvas is initialized

class Voronoi {
	constructor(pts) {
		this.pts = pts;
		this.DelaunayTriangles = [];
		this.voronoiEdges = [];
		this.run();
	}

	run() {
		this.getDelaunayTriangles();
		this.getVoronoiEdges();
	}

	updatePts(newPts) {
		this.pts = newPts;
		this.DelaunayTriangles.length=0;
		this.voronoiEdges.length=0;;
		this.getDelaunayTriangles();
		this.getVoronoiEdges();
	}

	drawPts(color) {
		for(let i=0; i<this.pts.length; i++) {
			this.pts[i].draw(color);
		}
	}

	drawDelaunayTriangles(color) {
		for(let i=0; i<this.DelaunayTriangles.length; i++) {
			this.DelaunayTriangles[i].drawTriangle(color);
		}
	}

	drawCircles(color) {
		for(let i=0; i<this.DelaunayTriangles.length; i++) {
			this.DelaunayTriangles[i].drawCircle(color);
		}
	}

	drawVoronoiEdges(color) {
		for(let i=0; i<this.voronoiEdges.length; i++) {
			this.voronoiEdges[i].draw(color);
		}
	}

	getDelaunayTriangles() {
		for(let i=0; i<this.pts.length; i++) {
			for(let j=i+1; j<this.pts.length; j++) {
				for(let k=j+1; k<this.pts.length; k++) {
					let c = new crc(this.pts[i], this.pts[j], this.pts[k]);
					if(!this.ptsInCircle(c)) {
						//c.drawCircle('grey');
						//c.drawCenter('red');
						this.DelaunayTriangles.push(c);
					}
				}
			}
		}
	}

	ptsInCircle(c) {
		for(let i=0; i<this.pts.length; i++) {
			let p = this.pts[i];
			let dx = p.x-c.c.x; let dy = p.y-c.c.y;
			let dist = sqrt(dx*dx + dy*dy);
			if(c.r>dist+0.0001) { return true; }
		}
		return false;
	}
	
	getVoronoiEdges() {
		for(let i=0; i<this.DelaunayTriangles.length; i++) {
			let c = this.DelaunayTriangles[i];
			this.voronoiEdges.push(this.getVoronoiEdge(c, c.p[0], c.p[1]));
			this.voronoiEdges.push(this.getVoronoiEdge(c, c.p[0], c.p[2]));
			this.voronoiEdges.push(this.getVoronoiEdge(c, c.p[1], c.p[2]));
		}
	}

	getVoronoiEdge(c, p1, p2) {
		let n = this.hasNeighbor(c, p1, p2);
		if(n) {
			// Simple case - if the edge is shared by two triangles, connect them
			return(new seg(c.c, n.c));
		} else {
			// Need to draw an edge to infinity (or the edge of the bounding box)	
			let midpoint = new pt((p1.x+p2.x)/2, (p1.y+p2.y)/2);
			let m = -1*(p1.x-p2.x)/(p1.y-p2.y);
			let b = c.c.y - m*c.c.x;

			if(this.ptInsideTriangle(c)) {
				//Line should go out towards the midpoint no matter what
				if(c.c.x >= midpoint.x) { 
					return(new seg(c.c, new pt(0, b)));
				} else {
					return(new seg(c.c, new pt(width, width*m+b)));
				}
				return;
			} else {
				//If we are dealing with the segment with the closest midpoint to the circumcenter, the line should go away from the midpoint. 
				if(this.closestMidpoint(c, midpoint)){	
					//Away form midpoint
					if(c.c.x < midpoint.x) { 
						return(new seg(c.c, new pt(0, b)));
					} else {
						return(new seg(c.c, new pt(width, width*m+b)));
					}
				} else {	
					//Towards the midpoint
					stroke('red'); strokeWeight(2);
					if(c.c.x >= midpoint.x) { 
						return(new seg(c.c, new pt(0, b)));
					} else {
						return(new seg(c.c, new pt(width, width*m+b)));
					}
				}
			}
		}
	}

	hasNeighbor(c, p1, p2) {
		// Look for a circle with the same points a different r and c
		for(let i=0; i<this.DelaunayTriangles.length; i++) {
			let n = this.DelaunayTriangles[i];
			if(c.r!=n.r && (c.c.x!=n.c.x || c.c.y!=n.c.y)) {
				let e=0;
				e += (p1 == n.p[0]);
				e += (p1 == n.p[1]);
				e += (p1 == n.p[2]);
				e += (p2 == n.p[0]);
				e += (p2 == n.p[1]);
				e += (p2 == n.p[2]);
				if(e==2) {
					return n;
				}
			}		
		}
		return false;
	}

	ptInsideTriangle(c) {
		let A = this.triArea(c.p[0], c.p[1], c.p[2]);
		let a1 = this.triArea(c.c, c.p[1], c.p[2]);
		let a2 = this.triArea(c.p[0], c.c, c.p[2]);
		let a3 = this.triArea(c.p[0], c.p[1], c.c);
		if(a1+a2+a3-0.000001 > A) { 
			return false;
		} else {
			return true;
		}

	}

	triArea(p1, p2, p3) {
		return abs((p1.x*(p2.y-p3.y) + p2.x*(p3.y-p1.y) + p3.x*(p1.y-p2.y))/2);  
	}

	closestMidpoint(c, midpoint) {
		//Get midpoints
		let mp1 = new pt((c.p[0].x+c.p[1].x)/2, (c.p[0].y+c.p[1].y)/2);
		let mp2 = new pt((c.p[0].x+c.p[2].x)/2, (c.p[0].y+c.p[2].y)/2);
		let mp3 = new pt((c.p[1].x+c.p[2].x)/2, (c.p[1].y+c.p[2].y)/2);
		let d1 = mp1.distance(c.c);
		let d2 = mp2.distance(c.c);
		let d3 = mp3.distance(c.c);
		let dmin = min(d1, min(d2, d3));
		let dactual = midpoint.distance(c.c);
		if(dactual == dmin) {
			return true;
		}
		return false;
	}
}

class pt {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	distance(p) {
		return sqrt((this.x-p.x)*(this.x-p.x) + (this.y-p.y)*(this.y-p.y));
	}

	draw(color) { stroke(color); strokeWeight(15); point(this.x, this.y); }
}

class seg {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	draw(color) { stroke(color); strokeWeight(2); line(this.p1.x, this.p1.y, this.p2.x, this.p2.y); }
}

class crc {
	constructor(p1, p2, p3) {
		this.p = [p1, p2, p3];
		let cx = ((p1.x*p1.x + p1.y*p1.y)*(p2.y-p3.y) + (p2.x*p2.x + p2.y*p2.y)*(p3.y-p1.y) + (p3.x*p3.x + p3.y*p3.y)*(p1.y-p2.y)) / (2*(p1.x*(p2.y-p3.y) - p1.y*(p2.x-p3.x) + p2.x*p3.y - p3.x*p2.y));
		let cy = ((p1.x*p1.x + p1.y*p1.y)*(p3.x-p2.x) + (p2.x*p2.x + p2.y*p2.y)*(p1.x-p3.x) + (p3.x*p3.x + p3.y*p3.y)*(p2.x-p1.x)) / (2*(p1.x*(p2.y-p3.y) - p1.y*(p2.x-p3.x) + p2.x*p3.y - p3.x*p2.y));
		this.c = new pt(cx, cy);
		this.r = this.c.distance(this.p[0]);
	}
	drawCircle(color) { noFill(); stroke(color); strokeWeight(1); circle(this.c.x, this.c.y, 2*this.r);}
	drawCenter(color) { stroke(color); strokeWeight(10); point(this.c.x, this.c.y);}
	drawTriangle(color) { stroke(color); strokeWeight(2); 
		line(this.p[0].x, this.p[0].y, this.p[1].x, this.p[1].y);
		line(this.p[0].x, this.p[0].y, this.p[2].x, this.p[2].y);
		line(this.p[2].x, this.p[2].y, this.p[1].x, this.p[1].y);
	}

}

