const buf=0.5;
const step=0.1;
const pts=[];
const v=[];

let voronoi;
const vmax=0.5;
const numPts=20;
const autoGen=true;
const cellColor="rgb(255,60,0)";

let resume = {
	"contact":{
		"name":"Leif Wesche",
		"email":"Lewesche@gmail.com"},
	"summary":[
		"paragraph 1",
		"paragraph 2"
	],
	"education":[
		{"school":"University of Southern California", "location":"Los Angeles, CA", "graduation":"Graduating Winter 2021", "degree":"MS in Computer Science", "gpa":"4.00"},
		{"school":"University of Washington", "location":"Seattle, WA", "graduation":"Graduated Summer 2018", "degree":"BS in Aerospace Engineering", "gpa":"3.75"}
	],
	"experience":[
		{"company":"USC", "title":"Teaching Assistant", "date":"Fall 2019 - Present", "summary":[
			"Taught discrete math and algorithms in the fall, teaching data structures and OO design in the spring.",
			"Running weekly discussion sections, designing C++ assignments, writing grading tools in C++, python, and bash."]},
		{"company":"SpaceX", "title":"Associate Engineer", "date":"Fall 2018 - Winter 2018", "summary":[]},
		{"company":"UW Human Ability and Engineering Lab", "title":"Undergrad Researcher", "date":"2017 - 2018", "summary":[]},
		{"company":"NASA MSFC", "title":"Intern", "date":"Summer 2017", "summary":[]}
	],
	"projects":[
		{"title":"News App", "summary":[
			{"text":"Web Development Class Project. Built a live news Web App"},
			{"text":"html/css/js, python backend, AWS hosted", "links":[
				{"text":"Link", "url":"http://homework6-env.eba-aqhnumkd.us-east-1.elasticbeanstalk.com/index.html"},
				{"text":"Video", "url":"https://www.youtube.com/"}]},
			{"text":"React frontend, node.js backend, GCP hosted", "links":[
				{"text":"Link", "url":"https://argon-retina-271020.wl.r.appspot.com/"},
				{"text":"Video", "url":"https://www.youtube.com/"}]},
			{"text":"Android App (Java), node.js backend, GCP hosted", "links":[
				{"text":"Video", "url":"https://www.youtube.com/"}]}
		]},
		{"title":"Weenix", "summary":[
			{"text":"Operating Systems class project with two peers. Semester long project building a single threaded Unix 6th edition based OS (not from scratch)."},
			{"text":"Started by initializing idle process all the way to running compiled user code."},
			{"text":"Implemented process and thread control, a FIFO scheduler, kernel level mutex, virtual file system, Unix system calls, and an on demand paged virtual memory sytem.", "links":[
				{"text":"Video", "url":"https://www.youtube.com/"}]}
		]}
	],
	"skills":[
		{"category":"Programming", "summary":[
			{"title":"languages", "text":"fortran"},
			{"title":"Web Development", "text":"React"},
			{"title":"Software Development", "text":"gdb, git, GTest"}
		]},
		{"category":"Math", "summary":[
			{"title":"languages", "text":"fortran"},
			{"title":"Web Development", "text":"React"},
			{"title":"Software Development", "text":"gdb, git, GTest"}
		]},
		{"category":"Engineering", "summary":[
			{"title":"languages", "text":"fortran"},
			{"title":"Web Development", "text":"React"},
			{"title":"Software Development", "text":"gdb, git, GTest"}
		]},
	]
}
 

function setup() {	
	console.log(resume);
	//$.getJSON("lewesche.json", function(json) {
    //	console.log(json); // this will show the info it in firebug console
	//});
	buildContact(resume.contact);	

	let outer = document.createElement("div");
	outer.classList.add("center");
	let inner = document.createElement("div");
	inner.classList.add("left");
	inner.classList.add("tight");
	inner.classList.add("blur");
	inner.append(buildEducation(resume.education));
	inner.append(document.createElement("br"));
	inner.append(buildExperience(resume.experience));
	outer.append(inner);
	$("#resume").append(outer);

	let backgroundCanvas = createCanvas(windowWidth-25, max(document.body.scrollHeight, windowHeight));
	backgroundCanvas.parent("backgroundCanvas");
	background(0);

	getNewPts();
	voronoi = new Voronoi(pts);
	movePts();
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

	voronoi.drawVoronoiEdges(cellColor);
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


function windowResized() {
	resizeCanvas(windowWidth-25, max(document.body.scrollHeight, windowHeight));
}


function buildContact(c) {
	let div = document.createElement("div");
	div.classList.add("blur");
	div.classList.add("tight");
	let name = document.createElement("h2");
	name.innerHTML = c.name;
	let email = document.createElement("h4");
	email.innerHTML = c.email;
	
	div.append(name);
	div.append(email);
	appendInContainer(div);
}

function buildEducation(e) {
	let div = document.createElement("div");
	let education = document.createElement("h2");
	education.innerHTML = "Education";
	education.classList.add("left");
	div.append(education);
	for(let i=0; i<e.length; i++) {
		let main = document.createElement("p");
		main.innerHTML = e[i].degree + " - " + e[i].school + " - " + e[i].location;
		let sub = document.createElement("p");
		sub.classList.add("indent");
		sub.innerHTML = e[i].gpa + " gpa, " + e[i].graduation;
		div.append(main);
		div.append(sub);
	}
	return div;
	appendInContainer(div);
}

function buildExperience(e) {
	let div = document.createElement("div");
	let education = document.createElement("h2");
	education.innerHTML = "Experience";
	education.classList.add("left");
	div.append(education);
	for(let i=0; i<e.length; i++) {
		let main = document.createElement("p");
		main.innerHTML = e[i].company + " - " + e[i].job + " - " + e[i].date;
		div.append(main);
		for(let j=0; j<e[i].summary.length; j++) {
			let sub = document.createElement("p");
			sub.classList.add("indent");
			sub.innerHTML = e[i].summary[j];
			div.append(sub);
		}
	}
	return div;
	appendInContainer(div);
}

function appendInContainer(inner) {
	let container = document.createElement("div");
	container.classList.add("center");
	container.append(inner);
	$("#resume").append(container);
}








