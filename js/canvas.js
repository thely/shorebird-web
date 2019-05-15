
// Draws and updates the map.

function ShoreMap(mapClass, w, h, mapW, mapH) {
	// this.island = island;
	// this.birds = birds;
	this.canvas = document.getElementById(mapClass);
	this.context = this.canvas.getContext("2d");
	this.width = w;
	this.height = h;

	// mapDim is the dimensions of the full (partially hidden) map
	// viewDim is the dimensions of the viewport (visible map)
	this.mapDim = {
		w: mapW,
		h: mapH
	}
	this.viewDim = {
		w: w,
		h: h
	}
	this.center = { x: 0, y: 0 };

	this.reOffset = function(){
		var BB = this.canvas.getBoundingClientRect();
		var offset = { x: 0, y: 0 };
		offset.x = BB.left;
		offset.y = BB.top;
		return offset; 
	}
}

ShoreMap.prototype.drawFullMap = function(birds, panning) {
	this.baseMap(panning);
	// this.birds = birds;
	this.drawBirds(birds);
}

ShoreMap.prototype.baseMap = function(panning) {
	this.context.fillStyle = "#FFFFFF";
	this.context.fillRect(0, 0, this.viewDim.w, this.viewDim.h);

	this.getLargerMap(panning);

	// draw the center point
	this.center = this.getCenter();
	this.context.fillStyle = "#000000";
	this.context.fillRect(this.center.x, this.center.y, 2, 2);
}

ShoreMap.prototype.drawBirds = function(birds) {
	for (var i = 0; i < birds.length; i++) {
		var colortxt = 'rgb('+birds[i].color.r+','+birds[i].color.g+','+birds[i].color.b+')';
		this.context.fillStyle = colortxt;
		this.context.fillRect(birds[i].pos.x, birds[i].pos.y, 5, 5);
	}
}

ShoreMap.prototype.getCenter = function() {
	return {
		x: this.viewDim.w / 2,
		y: this.viewDim.h / 2
	};
}

ShoreMap.prototype.getLargerMap = function(panning) {
	this.context.fillStyle = "#d3f2d3";
	var start;
	if (panning) {
		start = panning;
	}
	else {
		start = { x: 0, y: 0 };
	}
	
	this.context.fillRect(start.x, start.y, this.mapDim.w, this.mapDim.h);
}


//   for(var x=-50;x<50;x++){ 
//   	ctx.fillText(x,x*20+netPanningX,ch/2);
//   }
  
//   for(var y=-50;y<50;y++){ 
//   	ctx.fillText(y,cw/2,y*20+netPanningY);
//   }