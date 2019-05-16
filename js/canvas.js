
// Draws and updates the map.

function ShoreMap(mapClass, dim, data) {
	// this.island = island;
	// this.birds = birds;
	this.canvas = document.getElementById(mapClass);
	this.context = this.canvas.getContext("2d");

	this.dim = dim;
	this.center = { x: 0, y: 0 };

	this.island = new IslandMap(this.context, dim, data);

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
	this.context.fillRect(0, 0, this.dim.view.w, this.dim.view.h);

	this.island.drawHabitats(panning);

	// draw the center point
	this.center = this.getCenter();
	this.context.fillStyle = "#000000";
	this.context.fillRect(this.center.x, this.center.y, 2, 2);
}

ShoreMap.prototype.drawBirds = function(birds) {
	for (var i = 0; i < birds.length; i++) {
		if (birds[i].visible.now) {
			var colortxt = 'rgb('+birds[i].color.r+','+birds[i].color.g+','+birds[i].color.b+')';
			this.context.fillStyle = colortxt;
			this.context.fillRect(birds[i].pos.x, birds[i].pos.y, 5, 5);
		}
	}
}

ShoreMap.prototype.getCenter = function() {
	return {
		x: this.dim.view.w / 2,
		y: this.dim.view.h / 2
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
	
	this.context.fillRect(start.x, start.y, this.dim.map.w, this.dim.map.h);
}


//   for(var x=-50;x<50;x++){ 
//   	ctx.fillText(x,x*20+netPanningX,ch/2);
//   }
  
//   for(var y=-50;y<50;y++){ 
//   	ctx.fillText(y,cw/2,y*20+netPanningY);
//   }