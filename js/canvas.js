var ctx;
var fullWidth, fullHeight;
// var myBirdsViewer;

function ShoreMap(mapClass, w, h) {
	// this.island = island;
	// this.birds = birds;
	this.canvas = document.getElementById(mapClass);
	this.context = this.canvas.getContext("2d");
	this.width = w;
	this.height = h;

	this.center = [0,0];
	this.offset = [0,0];
	this.netPanning = [0,0];

	this.isDown = false;
	this.mouse = {
		start: {
			x: 0,
			y: 0
		},
		move: {
			x: 0,
			y: 0
		}
	}

	var sup = this;

	window.onscroll = function(e){ sup.reOffset(); }
	window.onresize = function(e){ sup.reOffset(); }
	$("#"+mapClass).mousedown(function(e){ sup.handleMouseDown(e);} );
	$("#"+mapClass).mousemove(function(e){ sup.handleMouseMove(e);} );
	$("#"+mapClass).mouseup(function(e){ sup.handleMouseUp(e);} );
	$("#"+mapClass).mouseout(function(e){ sup.handleMouseOut(e);} );

	this.reOffset = function(){
		var BB = this.canvas.getBoundingClientRect();
		this.offset.x = BB.left;
		this.offset.y = BB.top;
		return this.offset; 
	}

	this.reOffset();
}

ShoreMap.prototype.drawFullMap = function(birds, panning) {
	this.baseMap();
	// bigPanNonsense(ctx);
	this.birds = birds;
	this.drawBirds(birds, panning);
}

ShoreMap.prototype.baseMap = function() {
	this.context.fillStyle = "#FFFFFF";
	this.context.fillRect(0, 0, this.width, this.height);

	// draw the center point
	this.center = this.getCenter();
	this.context.fillStyle = "#000000";
	this.context.fillRect(this.center.x, this.center.y, 2, 2);
}

// function buildMapViewer(w, h) {
// 	var cvs = document.getElementById("mapZone");
// 	ctx = cvs.getContext("2d");
// 	ctx.fillStyle = "#FFFFFF";
// 	ctx.fillRect(0, 0, w, h);
	
// 	//values we can store for calling this again
// 	fullWidth = w;
// 	fullHeight = h;

// 	// draw the center point
// 	var center = getCenter(cvs);
// 	ctx.fillStyle = "#000000";
// 	ctx.fillRect(center.x, center.y, 2, 2);

// 	return ctx;
// }

ShoreMap.prototype.drawBirds = function(birds, panning) {
	if (!panning) {
		panning = [];
		panning.x = 0; panning.y = 0;
	}
	for (var i = 0; i < birds.length; i++) {
		var colortxt = 'rgb('+birds[i].color.r+','+birds[i].color.g+','+birds[i].color.b+')';
		this.context.fillStyle = colortxt;
		this.context.fillRect(birds[i].pos.x+panning.x, birds[i].pos.y+panning.y, 5, 5);
	}
}

ShoreMap.prototype.getCenter = function() {
	return {
		x: this.width / 2,
		y: this.height / 2
	};
}

// Get Mouse Position
// function getMousePos(canvas, evt, center) {
//     var rect = canvas.getBoundingClientRect();

//     return {
//         x: Math.round(evt.clientX - rect.left),
//         y: evt.clientY - rect.top
//     };
// }

function calcAngle(p1, p2) {
	var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
	var newAngle = 0;
	if (angle >= 0) {
		if (angle + 90 >= 180) {
			newAngle = -90 + ((180 - angle) * -1);
		}
		else {
			newAngle = angle + 90;
		}
	}
	else if (angle < 0) {
		newAngle = angle + 90;
	}
	return newAngle;
}

function calcDistance(p1, p2) {
	var a = p1.x - p2.x;
	var b = p1.y - p2.y;
	var c = Math.sqrt(a*a + b*b);

	return c;
}

// ShoreMap.prototype.handleMouseDown = function(e){
// 	// tell the browser we're handling this event
// 	e.preventDefault();
// 	e.stopPropagation();

// 	// calc the starting mouse X,Y for the drag
// 	this.mouse.start.x = parseInt(e.clientX - this.offset.x);
// 	this.mouse.start.y = parseInt(e.clientY - this.offset.y);

// 	// set the isDragging flag
// 	this.isDown = true;
// 	console.log("inside handleMouseDown");
// 	console.log(this.isDown);
// }

// ShoreMap.prototype.handleMouseUp = function(e){
// 	// tell the browser we're handling this event
// 	e.preventDefault();
// 	e.stopPropagation();

// 	// clear the isDragging flag
// 	this.isDown = false;
// }

// ShoreMap.prototype.handleMouseOut = function(e){
// 	// tell the browser we're handling this event
// 	e.preventDefault();
// 	e.stopPropagation();

// 	// clear the isDragging flag
// 	this.isDown = false;
// }

// ShoreMap.prototype.handleMouseMove = function(e){

// 	// only do this code if the mouse is being dragged
// 	if(!this.isDown){return;}

// 	console.log("inside handleMouseMove after checking for down");
// 	console.log(this.isDown);

// 	// tell the browser we're handling this event
// 	e.preventDefault();
// 	e.stopPropagation();

// 	// get the current mouse position
// 	this.mouse.move.x = parseInt(e.clientX - this.offset.x);
// 	this.mouse.move.y = parseInt(e.clientY - this.offset.y);

// 	// dx & dy are the distance the mouse has moved since
// 	// the last mousemove event
// 	var dx = this.mouse.move.x - this.mouse.start.x;
// 	var dy = this.mouse.move.y - this.mouse.start.y;

// 	// reset the vars for next mousemove
// 	this.mouse.start.x = this.mouse.move.x;
// 	this.mouse.start.y = this.mouse.move.y;

// 	// accumulate the net panning done
// 	this.netPanning.x += dx;
// 	this.netPanning.y += dy;

// 	this.drawFullMap(this.birds);
// }


//   for(var x=-50;x<50;x++){ 
//   	ctx.fillText(x,x*20+netPanningX,ch/2);
//   }
  
//   for(var y=-50;y<50;y++){ 
//   	ctx.fillText(y,cw/2,y*20+netPanningY);
//   }