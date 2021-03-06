var canvas = null;
var scale = 12;
var cells = null;
var drowsyUrl = "http://localhost:9292";
function getHiddenProp(){
    var prefixes = ['webkit','moz','ms','o'];
    
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';
    
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document) 
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}
function isHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;
    
    return document[prop];
}
// thanks to http://www.html5rocks.com/en/tutorials/pagevisibility/intro/ for these two functions
$(document).ready(function(){
	update();
	$.ajax({
		type: 'GET',
	 	url: drowsyUrl + '/lifemmo/cells/',
	 	success: function(data){
	 		cells = data;
	 	},
		error: function(){
			console.log("error");
		},
	});
	canvas = new fabric.Canvas('maincanvas');
	canvas.selection = false;
	//console.log("test");
	canvas.on('mouse:down', function(e){
		console.log(e);
			if(e.target != undefined){
				$.each(cells, function(i, item){
					//console.log("target.top: " + e.target.top + " cell y: " + item.y);
					//console.log("target.left: " + e.target.left + " cell x: " + item.x);
					if(e.target.top == (item.y * scale) && e.target.left == (item.x * scale)){
						var patch = {state: 0};
						$.ajax(drowsyUrl + '/lifemmo/cells/' + item._id.$oid, {
							type: 'patch',
							data: patch,
							success: function(item){
								//console.log(item);
								update();
							},
						});
						return;
					}
				});
			}
			else{
				$.each(cells, function(i, item){
					if((e.e.offsetX > item.x * scale && e.e.offsetX < item.x * scale + scale)  && (e.e.offsetY > item.y * scale && e.e.offsetY < item.y * scale + scale)){
					/*console.log("e.e.x: " + e.e.x);
					console.log("item.x: " + item.x * scale);
					console.log("e.e.y: " + e.e.y);
					console.log("item.y: " + item.y * scale);*/
					//if(item.x * scale - e.e.x < 10 && item.x * scale - e.e.x > 0 && item.y * scale - e.e.y < 10 && item.y * scale - e.e.y > 0){
						//console.log(drowsyUrl + '/lifemmo/cells/' + item._id.$oid);
						var patch = {state: 1};
						$.ajax(drowsyUrl + '/lifemmo/cells/' + item._id.$oid, {
							type: 'patch',
							data: patch,
							success: function(item){
								//console.log(item);
								update();
							},
						});
						return;
					}
				});
			}
	});
});

function update(){
	if(isHidden())
		return;
	var match = {"state": {"$in": ["1", 1]}};
	$.ajax({
		type: 'GET',
	 	url: drowsyUrl + '/lifemmo/cells/',
	 	data: {selector: JSON.stringify(match)},
	 	success: function(data){
	 		updateCells(data);
	 		updateButtons();
	 		updateRule();
	 	},
		error: function(){
			console.log("error");
		},
	});
}

function updateCells(data){
	canvas.clear();
	$.each(data, function(i, item){
		if(item.state == 1){
			var cell = new fabric.Rect({
				left: item.x * scale,
				top: item.y * scale,
				fill: 'red',
				width: scale,
				height: scale
			});
			cell.set('selectable', false);
			canvas.add(cell);
		}
	});
}

function resume(){
	var selector = {"command": "resume"};
	$.ajax({
		type: 'GET',
	 	url: drowsyUrl + '/lifemmo/events/',
	 	data: selector,
	 	success: function(data){
	 		//console.log(data.length);
	 		if(data.length == 0){
		 		var ins = {"command": "resume"};
		 		$.ajax({
		 			type: 'POST',
		 			url: drowsyUrl + '/lifemmo/events',
		 			data: ins,
		 			success: function(data){
		 				update();
		 				document.getElementById("pause").onclick = pause;
		 			}
		 		});
	 		}
	 	},
		error: function(){
			console.log("error");
		},
	});
}

function pause(){
	var selector = {"command": "pause"};
	$.ajax({
		type: 'GET',
	 	url: drowsyUrl + '/lifemmo/events/',
	 	data: selector,
	 	success: function(data){
	 		//console.log(data.length);
	 		if(data.length == 0){
		 		var ins = {"command": "pause"};
		 		$.ajax({
		 			type: 'POST',
		 			url: drowsyUrl + '/lifemmo/events',
		 			data: ins,
		 			success: function(data){
		 				update();
		 				document.getElementById("pause").onclick = resume;
		 			}
		 		});
	 		}
	 	},
		error: function(){
			console.log("error");
		},
	});
}

function updateButtons(){
	$.ajax({
		type: 'GET',
		url: drowsyUrl + '/lifemmo/state',
		success: function(data){
			$.each(data, function(i, item){
				if(item.paused == true){
					$("#pause").val("Resume")
				}
				if(item.paused == false){
					$("#pause").val("Pause");
				}
			});
		}
	});
}

function updateRule(){
	$.ajax({
		type: 'GET',
		url: drowsyUrl + '/lifemmo/state?selector=%7B"rule"%3A+%7B"%24exists"%3A+true%7D%7D',
		success: function(data){
			//console.log(data[0]);
			var s = "";
			$.each(data[0].rule.s, function(i, item){
				s += item;
			});
			if(!$("#ruleS").is(":focus") && !$("#ruleB").is(":focus")){
				$("#ruleS").val(s);
			}
			var b = "";
			$.each(data[0].rule.b, function(i, item){
				b += item;
			});
			if(!$("#ruleB").is(":focus") && !$("#ruleS").is(":focus")){
				$("#ruleB").val(b);
			}
		}
	});
}

function changeRule(){
	var newrule = {s: $("#ruleS").val().split(""), 
	b: $("#ruleB").val().split("")};
	var ins = {command: "changeRule", rule: newrule};
	$.ajax({
		type: 'POST',
		url: drowsyUrl + '/lifemmo/events',
		data: ins,
		success: function(data){
			update();
		}
	});
}

setInterval(update, 500);
