
function MouseFollow(offset) {
	// this.center = [0,0];
	this.setOffset(offset);
	this.netPanning = {
		x: 0, y: 0
	};
	
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
}

MouseFollow.prototype.setOffset = function(off) {
	this.offset = off;
}

MouseFollow.prototype.handleMouseDown = function(e){
	// tell the browser we're handling this event
	e.preventDefault();
	e.stopPropagation();

	// calc the starting mouse X,Y for the drag
	this.mouse.start.x = parseInt(e.clientX - this.offset.x);
	this.mouse.start.y = parseInt(e.clientY - this.offset.y);

	// set the isDragging flag
	this.isDown = true;
}

MouseFollow.prototype.handleMouseUp = function(e){
	// tell the browser we're handling this event
	e.preventDefault();
	e.stopPropagation();

	// clear the isDragging flag
	this.isDown = false;
}

MouseFollow.prototype.handleMouseOut = function(e){
	// tell the browser we're handling this event
	e.preventDefault();
	e.stopPropagation();

	// clear the isDragging flag
	this.isDown = false;
}

MouseFollow.prototype.down = function() {
	e.preventDefault();
	e.stopPropagation();

	if (this.isDown) {
		return true;
	}
	else {
		return false;
	}
}

MouseFollow.prototype.handleMouseMove = function(e){
	// only do this code if the mouse is being dragged
	e.preventDefault();
	e.stopPropagation();

	if(!this.isDown){return;}

	// get the current mouse position
	this.mouse.move.x = parseInt(e.clientX - this.offset.x);
	this.mouse.move.y = parseInt(e.clientY - this.offset.y);

	// dx & dy are the distance the mouse has moved since
	// the last mousemove event
	var dx = this.mouse.move.x - this.mouse.start.x;
	var dy = this.mouse.move.y - this.mouse.start.y;

	// reset the vars for next mousemove
	this.mouse.start.x = this.mouse.move.x;
	this.mouse.start.y = this.mouse.move.y;

	// accumulate the net panning done
	this.netPanning.x += dx;
	this.netPanning.y += dy;

	var maxXDiff = Birb.dim.map.w - Birb.dim.view.w;
	var maxYDiff = Birb.dim.map.h - Birb.dim.view.h;
	this.netPanning.x = Math.max(Math.min(this.netPanning.x, 0), -maxYDiff);
	this.netPanning.y = Math.max(Math.min(this.netPanning.y, 0), -maxXDiff);

	return this.netPanning;	
}


