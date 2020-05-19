const buf=0.5;
const step=0.1;
const pts=[];
const v=[];

let voronoi;
const vmax=0.5;
const numPts=20;
const autoGen=true;
const cellColor="rgb(255,60,0)";

let resumeOld = {
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
			"Taught discrete math and algorithms (CSCI 107) in the fall of 2019.",
			"Teaching data structures and object oriented design (CSCI 104) from spring 2020 onward.",
			"Making content for weekly discussion sections, running a lab, contributing to assignment development, writing grading tools in C++, python, and bash."]},
		{"company":"SpaceX", "title":"Associate Engineer", "date":"Fall 2018 - Winter 2018", "summary":[
			"This was SpaceX's new grad program. I worked on the system of actuators that moved the seats with the interior mechanisms team on the dragon 2 crew capsule.",
			"Design and analysis of various metallic flight parts related to the seat actuators using first principles, CAD, and FEA.",
			"Built test hardware for actuator enviromental (vibration and thermal) testing, designed to simulate flight loads on the actuators during testing. Design informed by simple modal and thermal analysis.",
			"Wired up transducer hardware to monitor loads, interfaced hardware with labview, processed data in excell + python."]},
		{"company":"UW Human Ability and Engineering Lab", "title":"Undergrad Researcher", "date":"2017 - 2018", "summary":[
			"Ankle foot orthoses (AFOs) are commonly perscribed to cerebral palsy patients to assist with walking.",
			"Our goal was to build a simple deivce that could quantify various power losses and the overall efficiency of an AFO, then validate our deivce by comparing it to human data. I co-design and maufactured a test AFO and a fake-ankle type device to apply load to the AFO.",
			"Used our test AFO to attempt to validate the model. Recorded analog test data using an arduino C++ program and processed data with Matlab to attempt to quantify losses and user end power."]},
		{"company":"NASA MSFC", "title":"Intern", "date":"Summer 2017", "summary":[
			"I worked with three other interns to study additively manufactured (metal 3d printed) lattice structures. The ability to fabricate these web-like volumes is pretty new, and engineers are just begining to design parts with lattice structural/flow components.",
			"Lattice structures have proven dificult to analyze with traditional FEA, thus have seen limited use in aerospace design so far.",
			"Our goal was to quantify the physical (mechanical, thermal, and fluid) properties of additively manufactured lattice structures.",
			"We designed and conducted thermal and flow tests using Keysight DAQ to record pressure and temperature data. We also built lattice coupons to test in torsion/tension/shear. I used basic python to process our data."]}
	],
	"projects":[
		{"title":"News App", "summary":"Web Tech class projects", "details":[
			{"text":"Web Development Class Project. Built a live news Web App that fetched data from various APIs through a cloud hosted backend."},
			{"text":"html/css/js, python Flask backend hosten on AWS", "links":[
				{"text":"Link", "url":"http://homework6-env.eba-aqhnumkd.us-east-1.elasticbeanstalk.com/index.html"},
				{"text":"Video", "url":"https://www.youtube.com/watch?v=zYx_7yxwQbg"}]},
			{"text":"React frontend, node.js backend, GCP hosted", "links":[
				{"text":"Link", "url":"https://argon-retina-271020.wl.r.appspot.com/"},
				{"text":"Video", "url":"https://www.youtube.com/watch?v=adw-17RX2mw"}]},
			{"text":"Android App (Java), node.js backend, GCP hosted", "links":[
				{"text":"Video", "url":"https://www.youtube.com/watch?v=td6YLY7J3Xc&t=21s"}]}
		]},
		{"title":"Weenix", "summary":"Operating Systems class project", "details":[
			{"text":"Worked with two peers on a semester long project building a single threaded Unix 6th edition based kernel. Not from scratch, but we did implement signifigant components."},
			{"text":"The project was broken into three sub projects where we implemented processes and thread control, a virtual file system abstraction layer, and finaly a virtual memory system. Started by initializing the idle process all the way to running compiled user code."},
			{"text":"Implemented process thread data structures, a FIFO scheduler, kernel level mutex, virtual file system, Unix system calls, shadow objects and an on-demand paged virtual memory sytem."},
			{"text":"I got lot more of experience writing C, bug hunting with GDB, and learned a bit of assembly too."}
		]},
		{"title":"Matrix Music Visualizer", "summary":"Just for fun", "details":[
			{"text":"I designed, built, and open sourced an Arduino driven music visualizer with parts that come in under $30. Still works too!"},
			{"text":"An 8x8 array of individually addressed LEDs behind a black acrylic sheet form a 64 pixel “screen”."},
			{"text":"Designed a custom PCB, 3D printed housing, and C++ software with a few different animations"},
			{"text":"An integrated analog mic samples audio which is FFT’ed into eight frequency bins spanning audible sound. Bin data is used to animate the screen.", "links":[
				{"text":"Video", "url":"https://www.youtube.com/watch?v=jVYRgS695s0"}]}
		]},
		{"title":"Image Procesing Toolkit", "summary":"Just for fun", "details":[
			{"text":"A gimp-ish GUI application I built with the QT framework to try implement and layer different image processing algorithms."},
			{"text":"Implemented resizing/rotation, gaussian blurs, contrast adjustment, edge detection, and even functions to encode/decode subtle steganographic messages in images."}
		]}

	],
	"skills":[
		{"category":"Programming", "details":[
			{"title":"Languages", "text":"From favorite to least favorite: C/C++/Javascript, Python, Bash, Java, Matlab/Simulink."},
			{"title":"Web Development", "text":"Farmiliar with html/css/md, JQuery, Bootstrap, React, node.js, flask, browser debugging, and AWS/GCP products and interfaces."},
			{"title":"Software Development", "text":"I've mostly worked on Linux systems and I've used git, gdb, valgrind, and GTest."}
		]},
		{"category":"Math", "details":[
			{"title":"Algorithms", "text":"Farmiliar with graph algorithms, principle component analysis, dynamic/linear programming methods, and using complexity analysis to design code that scales."},
			{"title":"Simulation", "text":"I've built and <a href=\https://www.youtube.com/watch?v=WoiuuW4Uc2k\">animated</a> fun physics simulations, and done more pracical stuff like design PID systems with bode/nyquist plots and test them with simulink."},
			{"title":"Signal Processing", "text":"I've processed <a href=\https://www.youtube.com/watch?v=eyxP5UhLbM8\">audio</a> with Fourier analysis algorithms and worked with <a href=\"https://www.youtube.com/watch?v=NIxpzcMw3LA\">real world data collection</a>."}
		]},
		{"category":"Engineering", "details":[
			{"title":"Design", "text":"I've used CAD software for mechanical design (Solidworks, NX) and electrical design (KiCad), plus Anysis for FEA."},
			{"title":"Mechatronics", "text":"I've incorporated microcontrollers/RPis, LiPos power systems, brushed/brushless motors, RC receiver/transmitters, and other hardware into <a href=\"https://github.com/lewesche/RC_Car\">projects</a>."},
			{"title":"Manufacturing", "text":"Farmiliar with GD&T drafting, metal/plastic 3D printing, THT/SMD soldering, and 2 axis mills/lathes."}
		]},
		{"category":"Other", "details":[
			{"title":"For fun", "text":"playing drums 🥁🥁🥁"}
		]}
	]
}
 

$(document).ready(function() {	
	console.log("requesting json");
	$.getJSON("test.json", function(json) {
    	console.log(json);
		buildPage(json);
	});
});

function buildPage(resume) {
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
		var oldWidth = $(this.nextSibling).width();
		$(this.nextSibling).slideToggle(200, () => {$(this).width(oldWidth);} );
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
	let name = document.createElement("h1");
	name.innerHTML = c.name;
	let email = document.createElement("h4");
	email.innerHTML = c.email;
	
	div.append(name);
	div.append(email);
	appendInContainer(div);
}

function appendInContainer(inner) {
	let container = document.createElement("div");
	container.classList.add("center");
	container.append(inner);
	$("#resume").append(container);
}

function buildEducation(e) {
	let outer = document.createElement("div");
	let inner = document.createElement("div");
	let title = document.createElement("h2");
	title.innerHTML = "- Education";
	title.classList.add("left", "dropDown");
	outer.append(title);
	for(let i=0; i<e.length; i++) {
		if(i!=0) { inner.append(document.createElement("br")); }
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
		if(i!=0) { inner.append(document.createElement("br")); }
		let main = document.createElement("p");
		main.innerHTML = e[i].company + " - " + e[i].title + " - " + e[i].date;
		inner.append(main);
		for(let j=0; j<e[i].summary.length; j++) {
			let sub = document.createElement("p");
			sub.classList.add("indent");
			sub.innerHTML = "- " + e[i].summary[j];
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
		if(i!=0) { inner.append(document.createElement("br")); }
		let main = document.createElement("p");
		main.innerHTML = p[i].title; 
		if(p[i].summary) {main.innerHTML += " - " + p[i].summary }
		inner.append(main);
		for(let j=0; j<p[i].details.length; j++) {
			let sub = document.createElement("p");
			sub.classList.add("indent");
			sub.innerHTML = "- " + p[i].details[j].text;
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
		if(i!=0) { inner.append(document.createElement("br")); }
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









