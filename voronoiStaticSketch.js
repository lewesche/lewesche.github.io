const buf=0.5;
const step=0.1;
const pts=[];
const v=[];

let voronoi;
const vmax=0.5;
const numPts=20;
const autoGen=true;
const cellColor="rgb(255,60,0)";

function setup() {	
	$.getJSON("lewesche.json", function(json) {
		buildPage(json);
	});
}

function buildPage(resume) {
	buildContact(resume.contact);	

	let outer = document.createElement("div");
	outer.classList.add("center");
	let inner = document.createElement("div");
	inner.classList.add("left");
	inner.classList.add("tight");
	inner.classList.add("blur");
	inner.append(buildEducation(resume.education));
	inner.append(buildAbout(resume.about));
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

function buildAbout(a) {
	let outer = document.createElement("div");
	let inner = document.createElement("div");
	let title = document.createElement("h2");
	title.innerHTML = "- About";
	title.classList.add("left" , "dropDown");
	outer.append(title);
	for(let i=0; i<a.length; i++) {
		if(i!=0) { inner.append(document.createElement("br")); }
		let main = document.createElement("p");
		main.innerHTML = a[i];
		main.classList.add("indent");
		inner.append(main);
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
		if(p[i].lang) {main.innerHTML += " - " + p[i].lang }
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









