const buf=0.5;
const step=0.1;
const pts = [];
const v = [];

let voronoi;

let numPts;
let vmax;
let autoGen=false;
let drawPts=false;
let drawCells=false;
let drawTriangles=false;
let drawCircles=false;

let ptColor;
let cellColor;
let triangleColor;
let circleColor;

window.addEventListener('keydown', (event) => {
	if(event.key =="M") {
		$("#menu").toggle();
	}
	if(event.key =="F") {
		var elem = document.documentElement;
  		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) { /* Firefox */
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE/Edge */
			elem.msRequestFullscreen();
		}
	}
	if(event.key =="+" || event.key =="=") {
		vmax++;
		$("#vmax").val(vmax);
	}
	if(event.key =="-" || event.key =="_") {
		vmax--;
		$("#vmax").val(vmax);
	}
	if(event.key =="R") {
		newPts();
	}
	if(event.key =="N") {
		newV();
	}
	if(event.key =="!") {
		flipV();
	}
	if(event.key =="P") {
		$("#drawPts").prop("checked", !$("#drawPts").prop("checked"));
		drawPts=!drawPts;
	}
	if(event.key =="V") {
		$("#drawCells").prop("checked", !$("#drawCells").prop("checked"));
		drawCells=!drawCells;
	}
	if(event.key =="T") {
		$("#drawTriangles").prop("checked", !$("#drawTriangles").prop("checked"));
		drawTriangles=!drawTriangles;
	}
	if(event.key =="C") {
		$("#drawCircles").prop("checked", !$("#drawCircles").prop("checked"));
		drawCircles=!drawCircles;
	}
});

function setup() {
	let backgroundCanvas = createCanvas(windowWidth, windowHeight-5);
	backgroundCanvas.parent("backgroundCanvas");
	background(0);

	styleChange();
	getNewPts();
	voronoi = new Voronoi(pts);

	movePts();
}

function windowResized() {
  resizeCanvas(windowWidth-25, windowHeight-25);
}

function movePts() {
	for(let i=0; i<pts.length; i++) {
		pts[i].x += step*(v[i].x)*vmax;
		pts[i].y += step*(v[i].y)*vmax;
		if(outOfBounds(pts[i])) {
			pts.splice(i, 1);
			v.splice(i, 1);
			i--;
		}
		while(autoGen && pts.length<numPts) {
			newPt();
		}
	}
	voronoi.updatePts(pts);
	background(0);

	if(drawCircles) {voronoi.drawCircles(circleColor); }
	if(drawTriangles) { voronoi.drawDelaunayTriangles(triangleColor); }
	if(drawPts) { voronoi.drawPts(ptColor); }
	if(drawCells) { voronoi.drawVoronoiEdges(cellColor); }
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
	let vx = random(1)-0.5;
	let vy = random(1)-0.5;
	v.push({x:vx, y:vy});
	if(pts.length ==1) { console.log("starting"); movePts(); }
}

function getNewPts() {
	pts.length=0;
	for(let i=0; i<numPts; i++) {
		newPt();
	}
}

function newPt() {
	let x = random(width)*buf + width*buf/2;
	let y = random(height)*buf + height*buf/2;
	pts.push(new pt(x, y));
	let vx = random(1)-0.5;
	let vy = random(1)-0.5;
	v.push({x:vx, y:vy});
}

function newPts() {
	getNewPts();
	movePts();
}

function newV() {
	v.length=0;
	for(let i=0; i<pts.length; i++) {
		let vx = random(1)-0.5;
		let vy = random(1)-0.5;
		v.push({x:vx, y:vy});
		console.log(v[i]);
	}
}

function flipV() {
	for(let i=0; i<v.length; i++) {
		v[i].x *=-1;
		v[i].y *=-1;
	}
}

function styleChange() {
	numPts = $('#numPts')[0].valueAsNumber;
	vmax = $("#vmax")[0].valueAsNumber;
	autoGen = $("#autoGen")[0].checked;
	drawPts = $("#drawPts")[0].checked;
	drawCells = $("#drawCells")[0].checked;
	drawTriangles = $("#drawTriangles")[0].checked;
	drawCircles = $("#drawCircles")[0].checked;
	
	ptColor = $("#ptColor")[0].value;
	cellColor = $("#cellColor")[0].value;
	triangleColor = $("#triangleColor")[0].value;
	circleColor = $("#circleColor")[0].value;
}










