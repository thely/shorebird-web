
// Generates and updates bird data off of defaults from globals.js, and eventually
// from the JSON bird data.

function BirdMaker(data, dim) {
	// this.w = width;
	// this.h = height;
	// this.mapW = mapW;
	// this.mapH = mapH;
	this.dim = dim
	this.birds = this.makeBirds(data);
}

BirdMaker.prototype.getBirds = function() {
	return this.birds;
}

BirdMaker.prototype.makeBirds = function(data) {
	// var data = this.data;
	var width = this.dim.map.w;
	var height = this.dim.map.h;
	var birds = [];
	var center = {
		x: width / 2,
		y: height / 2
	};
	this.center = center;

	for (var i = 0; i < data.length; i++) {
		birds[i] = this.makeBird(width, height, center, data[i]);
	}

	this.birds = birds;

	return birds;
}

BirdMaker.prototype.makeBird = function(w, h, center, s) {
	var bird = [];
	bird.pos = {
		x: Math.random() * w,
		y: Math.random() * h,
	};
	bird.fixedPos = {
		x: bird.pos.x,
		y: bird.pos.y
	};
	bird.visible = {
		then: true,
		now: true
	};

	bird.azi = calcAngle(center, bird.pos);
	bird.dist = calcDistance(center, bird.pos);

	bird.color = {
		r: Math.random() * 255,
		g: Math.random() * 255,
		b: Math.random() * 255
	};

	bird.source = s;
	return bird;
}

BirdMaker.prototype.updateBirdPlaces = function(panning) {
	for (var i = 0; i < this.birds.length; i++) {
		var bird = this.birds[i];
		bird.pos.x = bird.fixedPos.x + panning.x;
		bird.pos.y = bird.fixedPos.y + panning.y;
		bird.visible.then = bird.visible.now;
		bird.visible.now = checkIsVisible(bird.pos.x, bird.pos.y, this.dim.map.w, this.dim.map.h);

		bird.azi = calcAngle(this.center, bird.pos);
		bird.dist = calcDistance(this.center, bird.pos);

		this.birds[i] = bird;
	}
}


/// ------------ Helpers ----------------------------------


function checkIsVisible(x, y, w, h) {
	if (x < 0 || y < 0) {
		return false;
	}
	if (x >= w || y >= h) {
		return false;
	}
	return true;
}

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

	return c / 300;
}

