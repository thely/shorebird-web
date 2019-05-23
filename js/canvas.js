
// Draws and updates the map.

function ShoreMap(dim, data) {
	// this.island = island;
	// this.birds = birds;
	this.dim = dim;
	this.center = { x: 0, y: 0 };

	this.island = new IslandMap(dim, data);
}

ShoreMap.prototype.drawFullMap = function(birds, panning) {
	this.baseMap(panning);
	this.drawBirds(birds);
}

ShoreMap.prototype.baseMap = function(panning) {
	noStroke();
	fill("#FFFFFF");
	rect(0, 0, this.dim.view.x, this.dim.view.y);

	this.island.drawHabitats(panning);
	// this.getLargerMap(panning);

	this.center = p5.Vector.div(this.dim.view, 2);
	fill("#000000");
	rect(this.center.x, this.center.y, 2, 2);
}

ShoreMap.prototype.drawBirds = function(birds) {
	for (var i = 0; i < birds.length; i++) {
		if (birds[i].visible.now) {
			fill(birds[i].color.r, birds[i].color.g, birds[i].color.b);
			rect(birds[i].pos.x, birds[i].pos.y, 5, 5);
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
	fill("#d3f2d3");
	var start;
	if (panning) {
		start = panning;
	}
	else {
		start = { x: 0, y: 0 };
	}
	
	rect(start.x, start.y, dim.map.x, dim.map.y);
}
