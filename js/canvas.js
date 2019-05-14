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
	this.center = { x: 0, y: 0 };

	this.reOffset = function(){
		var BB = this.canvas.getBoundingClientRect();
		var offset = { x: 0, y: 0 };
		offset.x = BB.left;
		offset.y = BB.top;
		return offset; 
	}
}

ShoreMap.prototype.drawFullMap = function(birds) {
	this.baseMap();
	// bigPanNonsense(ctx);
	this.birds = birds;
	this.drawBirds(birds);
}

ShoreMap.prototype.baseMap = function() {
	this.context.fillStyle = "#FFFFFF";
	this.context.fillRect(0, 0, this.width, this.height);

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
		x: this.width / 2,
		y: this.height / 2
	};
}


//   for(var x=-50;x<50;x++){ 
//   	ctx.fillText(x,x*20+netPanningX,ch/2);
//   }
  
//   for(var y=-50;y<50;y++){ 
//   	ctx.fillText(y,cw/2,y*20+netPanningY);
//   }