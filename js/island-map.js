
function IslandMap(ctx, dim, data) {
	this.orig = {
		"row": 94,
		"col": 82
	}
	this.dim = dim;
	this.name = data["name"];
	this.pixelList = data["pixel_cover_list"];
	this.colorList = data["habitat_pixel_colors"];
	this.ctx = ctx;

	this.scaling = this.scaleFactor(dim.map);
}

IslandMap.prototype.scaleFactor = function(dim) {
	var scale = { x: 0, y: 0 };
	scale.x = Math.floor(dim.w / this.orig.row);
	scale.y = Math.floor(dim.h / this.orig.col);

	return scale;
}

IslandMap.prototype.drawHabitats = function(panning) {
	if (!panning) {
		panning = { "x": 0, "y": 0 };
	}

	for (var i = 0; i < this.pixelList.length; i++) {
		var hab = this.pixelList[i];
		var color = __generateColor(this.colorList[hab]);
		this.ctx.fillStyle = color;

		// var start = {
		// 	"x": (Math.floor(i / this.orig.row) * this.scaling.x) + panning.x,
		// 	"y": ((i % this.orig.col) * this.scaling.y) + panning.y
		// }
		// var startNextY = i / this.orig.row

		var start = {
			"x": (Math.floor(i / this.orig.row) * this.scaling.x) + panning.x,
			"y": ((i % this.orig.row) * this.scaling.y) + panning.y,
		}
		var size = {
			"w": this.scaling.x,
			"h": this.scaling.y
		}

		this.ctx.fillRect(start.x, start.y, size.w, size.h);
	}
}

function __generateColor(color) {
	var c = "rgb("+ color[0]*255 +","+ color[1]*255 +","+ color[2]*255 +")";
	return c;
}

