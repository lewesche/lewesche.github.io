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
		{"title":"News App", "summary":"Web Technologies class projects", "details":[
			{"text":"Web Development Class Project. Built a live news Web App"},
			{"text":"html/css/js, python backend, AWS hosted", "links":[
				{"text":"Link", "url":"http://homework6-env.eba-aqhnumkd.us-east-1.elasticbeanstalk.com/index.html"},
				{"text":"Video", "url":"https://www.youtube.com/watch?v=zYx_7yxwQbg"}]},
			{"text":"React frontend, node.js backend, GCP hosted", "links":[
				{"text":"Link", "url":"https://argon-retina-271020.wl.r.appspot.com/"},
				{"text":"Video", "url":"https://www.youtube.com/watch?v=adw-17RX2mw"}]},
			{"text":"Android App (Java), node.js backend, GCP hosted", "links":[
				{"text":"Video", "url":"https://www.youtube.com/watch?v=td6YLY7J3Xc&t=21s"}]}
		]},
		{"title":"Weenix", "details":[
			{"text":"Operating Systems class project with two peers. Semester long project building a single threaded Unix 6th edition based OS (not from scratch)."},
			{"text":"Started by initializing idle process all the way to running compiled user code."},
			{"text":"Implemented process and thread control, a FIFO scheduler, kernel level mutex, virtual file system, Unix system calls, and an on demand paged virtual memory sytem.", "links":[
				{"text":"Video", "url":"https://www.youtube.com/"}]}
		]}
	],
	"skills":[
		{"category":"Programming", "details":[
			{"title":"languages", "text":"fortran"},
			{"title":"Web Development", "text":"React"},
			{"title":"Software Development", "text":"gdb, git, GTest"}
		]},
		{"category":"Math", "details":[
			{"title":"languages", "text":"details"},
			{"title":"Web Development", "text":"React"},
			{"title":"Software Development", "text":"gdb, git, GTest"}
		]},
		{"category":"Engineering", "details":[
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
	inner.append(buildExperience(resume.experience));
	inner.append(buildProjects(resume.projects));
	inner.append(buildSkills(resume.skills));
	outer.append(inner);
	$("#resume").append(outer);

	let backgroundCanvas = createCanvas(windowWidth-25, max(document.body.scrollHeight, windowHeight));
	backgroundCanvas.parent("backgroundCanvas");
	background(0);

	$(".dropDown").click(function(){
		let curr = this.innerHTML;
		if(curr[0] == '+') {
			curr = curr.replace('+', '-');
		} else if (curr[0] == '-') {
			curr = curr.replace('-', '+');
		}
		this.innerHTML = curr;
		$(this.nextSibling).animate({
			height: 'toggle'
    	});
	});


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
	setTimeout(movePts, 10);
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
	let outer = document.createElement("div");
	let inner = document.createElement("div");
	let title = document.createElement("h2");
	title.innerHTML = "- Education";
	title.classList.add("left", "dropDown");
	outer.append(title);
	for(let i=0; i<e.length; i++) {
		let main = document.createElement("p");
		main.innerHTML = e[i].degree + " - " + e[i].school + " - " + e[i].location;
		let sub = document.createElement("p");
		sub.classList.add("indent");
		sub.innerHTML = e[i].gpa + " gpa, " + e[i].graduation;
		inner.append(main);
		inner.append(sub);
	}
	outer.append(inner);
	return outer;
}

function buildExperience(e) {
	let outer = document.createElement("div");
	let inner = document.createElement("div");
	let title = document.createElement("h2");
	title.innerHTML = "- Experience";
	title.classList.add("left" , "dropDown");
	outer.append(title);
	for(let i=0; i<e.length; i++) {
		let main = document.createElement("p");
		main.innerHTML = e[i].company + " - " + e[i].title + " - " + e[i].date;
		inner.append(main);
		for(let j=0; j<e[i].summary.length; j++) {
			let sub = document.createElement("p");
			sub.classList.add("indent");
			sub.innerHTML = e[i].summary[j];
			inner.append(sub);
		}
	}
	outer.append(inner);
	return outer;
}

function buildProjects(p) {
	let outer = document.createElement("div");
	let inner = document.createElement("div");
	let title = document.createElement("h2");
	title.innerHTML = "- Projects";
	title.classList.add("left", "dropDown");
	outer.append(title);
	for(let i=0; i<p.length; i++) {
		let main = document.createElement("p");
		main.innerHTML = p[i].title; 
		if(p[i].summary) {main.innerHTML += " - " + p[i].summary }
		inner.append(main);
		for(let j=0; j<p[i].details.length; j++) {
			let sub = document.createElement("p");
			sub.classList.add("indent");
			sub.innerHTML = p[i].details[j].text;
			inner.append(sub);
			if(p[i].details[j].links) {
				let subsub = document.createElement("p");
				subsub.classList.add("dubIndent");
				for(let k=0; k<p[i].details[j].links.length; k++) {
					if(k>0) { subsub.innerHTML += " + " }
					let a = document.createElement("a");
					let link = document.createTextNode(p[i].details[j].links[k].text);
					a.appendChild(link);
					a.title = p[i].details[j].links[k].text;
					a.href =  p[i].details[j].links[k].url;
					subsub.appendChild(a);
				}
				inner.append(subsub);
			}
		}

	}
	outer.append(inner);
	return outer;
}

function buildSkills(s) {
	let outer = document.createElement("div");
	let inner = document.createElement("div");
	let title = document.createElement("h2");
	title.innerHTML = "- Skills";
	title.classList.add("left", "dropDown");
	outer.append(title);
	for(let i=0; i<s.length; i++) {
		let main = document.createElement("p");
		main.innerHTML = s[i].category;
		inner.append(main);		
		for(let j=0; j<s[i].details.length; j++) {
			let sub = document.createElement("p");
			sub.classList.add("indent");
			sub.innerHTML = s[i].details[j].title + " - " + s[i].details[j].text;
			inner.append(sub);
		}
	}
	outer.append(inner);
	return outer;
}

function appendInContainer(inner) {
	let container = document.createElement("div");
	container.classList.add("center");
	container.append(inner);
	$("#resume").append(container);
}








