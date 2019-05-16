
function IslandMap(ctx, dim, data) {
	// this.orig = {
	// 	"row": 94,
	// 	"col": 82
	// }
	this.dim = dim;
	this.name = data["name"];
	this.pixelList = data["pixel_cover_list"];
	this.colorList = __fixColors(data["habitat_pixel_colors"]);
	this.ctx = ctx;

	// this.scaling = this.scaleFactor(dim.map);
	this.scaling = {x:Birb.scale, y:Birb.scale};
}

// IslandMap.prototype.scaleFactor = function(dim) {
// 	var scale = { x: 0, y: 0 };
// 	scale.x = Math.floor(dim.w / this.orig.row);
// 	scale.y = Math.floor(dim.h / this.orig.col);

// 	return scale;
// }

IslandMap.prototype.drawHabitats = function(panning) {
	if (!panning) {
		panning = { "x": 0, "y": 0 };
	}

	for (var i = 0; i < this.pixelList.length; i++) {
		var hab = this.pixelList[i];

		// var xBare = (Math.floor(i / Birb.base.rows) * this.scaling.x);
		// var yBare = ((i % Birb.base.rows) * this.scaling.y);

		var start = {
			"x": (Math.floor(i / Birb.base.rows) * this.scaling.x) + panning.x,
			"y": ((i % Birb.base.rows) * this.scaling.y) + panning.y,
		}
		var size = {
			"w": this.scaling.x,
			"h": this.scaling.y
		}

		if (__isTileVisible(start, size, this.dim.map)) {
			var color = this.colorList[hab];
			this.ctx.fillStyle = color;
			this.ctx.fillRect(start.x, start.y, size.w, size.h);
			
			if (hab == 17) {
				// console.log(start.x);
				// console.log(i+" is in it!");
				this.ctx.strokeStyle = "#FF0000";
				this.ctx.strokeRect(start.x, start.y, size.w, size.h);
				//uncomfortable hack: start.y-Birb.scale
			}
			if (Birb.tileList.includes(i)) {
				this.ctx.strokeStyle = "#FFFF00";
				this.ctx.strokeRect(start.x, start.y, size.w, size.h);
			}
		}
	}
}

function __generateColor(color) {
	var c = "rgb("+ color[0]*255 +","+ color[1]*255 +","+ color[2]*255 +")";
	return c;
}

function __fixColors(colorList) {
	for (key in colorList) {
		colorList[key] = __generateColor(colorList[key]);
	}

	return colorList;
}

function __isTileVisible(start, size, mapDim) {
	if (start.x + size.w < 0 && start.y + size.y < 0) {
		return false;
	}
	if (start.x >= mapDim.w && start.y >= mapDim.h) {
		return false;
	}
	return true;
}


