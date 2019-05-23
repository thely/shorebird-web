
function IslandMap(dim, data) {
	this.dim = dim;
	this.name = data["name"];
	this.pixelList = data["pixel_cover_list"];
	this.colorList = __fixColors(data["habitat_pixel_colors"]);

	// this.scaling = this.scaleFactor(dim.map);
	// this.scaling = {x:Birb.scale, y:Birb.scale};
}

IslandMap.prototype.drawHabitats = function(panning) {
	if (!panning) {
		panning = createVector();
	}

	for (var i = 0; i < this.pixelList.length; i++) {
		var hab = this.pixelList[i];

		// top-left of the tile & size of that tile
		var start = createVector(
			(Math.floor(i / B_ROWS) * B_MAPSCALE) + panning.x,
			((i % B_ROWS) * B_MAPSCALE) + panning.y
		);
		var size = createVector(B_MAPSCALE, B_MAPSCALE);

		push();
		noStroke();
		if (__isTileVisible(start, size, this.dim.view)) {
			var color = this.colorList[hab];
			fill(color[0], color[1], color[2]);
			rect(start.x, start.y, size.x, size.y);
		}
		pop();
	}
}

function __drawTileBorders(i) {
	// ----- tile border visualization when desired
	if (B_USEDTILES.includes(i)) {
		stroke("#FFFF00");
		rectect(start.x, start.y, size.x, size.y);
	}
}

function __generateColor(color) {
	var c = [color[0]*255, color[1]*255, color[2]*255];
	return c;
}

function __fixColors(colorList) {
	for (key in colorList) {
		colorList[key] = __generateColor(colorList[key]);
	}

	return colorList;
}

function __isTileVisible(start, size, mapDim) {
	if (start.x + size.x < 0 && start.y + size.y < 0) {
		return false;
	}
	if (start.x >= mapDim.x && start.y >= mapDim.y) {
		return false;
	}
	return true;
}


