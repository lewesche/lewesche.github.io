function clicked_read() {
	console.log("read");

}

function clicked_write() {
	console.log("write");

}

function clicked_delete() {
	console.log("delete");

}

function clicked_go() {
	console.log("go");
	
	let radios = document.getElementsByName('action_button');
	for(let i=0; i<radios.length; i++) {
		if(radios[i].checked) {
			send_query(radios[i].value)
			return;
		}
	}
}

function send_query(action) {
	key = document.getElementById('key_txt').value;
	idx = document.getElementById('idx_txt').value;
	tag = document.getElementById('tag_txt').value;
	usr = document.getElementById('usr_txt').value;
	dec = document.getElementById('dec_txt').value;

	console.log("in send_query()");
	console.log("usr: " + usr);
	console.log("key: " + key);
	console.log("idx: " + idx);
	console.log("tag: " + tag);
	console.log("dec: " + dec);
	
	let url = "http://ec2-3-22-175-149.us-east-2.compute.amazonaws.com:8000/usr/" + usr + "?" + action; 

	if(action=="w") {
		if(dec){
			url+= "=" + dec;
		} else {
			return;
		}
	}

	if(action=="r" || action=="w") 
		url += "&k=" + key;

	if(tag)
		url += "&t=" + tag;

	if(action!="w" && idx)
		url += "&i=" + idx;

	clear_fields();
	request(url, action);
}

function request(url) {
	console.log("url = " + url)

	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onload = function (e) {
  		if (xhr.readyState === 4) {
    		if (xhr.status === 200) {
				try {
					let obj = JSON.parse(xhr.responseText);
					buildTable(obj);
				} catch(e) {
					send_query("r");
				}
    		} else {
      			console.error(xhr.statusText);
    		}
  		}
	};
	xhr.onerror = function (e) {
  		console.error(xhr.statusText);
	};
	xhr.send(null); 
}


function buildTable(obj) {
	html_txt = "<table>";
	html_txt += "<tr>" + "<th>idx</th>" + "<th>tag</th>" + "<th>text</th>" + "</tr>";
	for(i=0; i<obj.length; i++) {
		html_txt += "<tr>"
		html_txt += "<td>" + obj[i].idx + "</td>";	
		html_txt += "<td>";	
		if(obj[i].hasOwnProperty('tag')){
			html_txt += obj[i].tag;	
		}
		html_txt += "</td>";	

		html_txt += "<td>" + obj[i].dec + "</td>";	
		html_txt += "</tr>"
	}
	html_txt += "</table>";
	document.getElementById("table_div").innerHTML = html_txt;
}

function clear_fields() {
	document.getElementById('key_txt').value = "";
	document.getElementById('idx_txt').value = "";
	document.getElementById('tag_txt').value = "";
	document.getElementById('dec_txt').value = "";
}
