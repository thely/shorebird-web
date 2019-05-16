
// Generates and updates bird data off of defaults from globals.js, and eventually
// from the JSON bird data.

function BirdMaker(bird_data, today, habitats, dim) {
	this.dim = dim
	this.bird_data = bird_data
	this.birds = this.makeBirds(today, habitats);
}

BirdMaker.prototype.getBirds = function() {
	return this.birds;
}

BirdMaker.prototype.makeBirds = function(today, habitats) {
	var birds = [];
	var center = {
		x: this.dim.map.w / 2,
		y: this.dim.map.h / 2
	};

	this.center = center;

	var bCount = 0;
	for (var i = 0; i < today.length; i++) {
		if (today[i] > 0) {
			var color = {
				r: Math.random() * 255,
				g: Math.random() * 255,
				b: Math.random() * 255
			};
			for (var j = 0; j < today[i]; j++) {
				// var b = this.bird_data[i];
				// console.log(today[i] + ": "+b.name);
				var tile = __pickHabitat(this.bird_data[i], habitats);
				// console.log(b.name+" in "+hab+" at "+tile);
				// console.log(tile);

				birds[bCount] = this.makeBird(this.bird_data[i], tile, center, color);
				birds[bCount].species = i;
				birds[bCount].tile = tile;
				Birb.tileList.push(tile)
				// console.log(birds[bCount].fixedPos);
				bCount++;
			}
		}
	}

	// console.log(birds);
	// console.log(birds[0].pos);

	// this.birds = birds;
	return birds;
}

function __pickHabitat(bird, habitats) {
	var hab = random.pick(bird.land_preference);
	while (!(hab in habitats)) {
		hab = random.pick(bird.land_preference);
	}
	var tile = random.pick(habitats[hab]);
	return tile;
}

BirdMaker.prototype.makeBird = function(info, tile, center, color) {
	var bird = {};
	bird.name = info.name;

	var start = {
		x: (Math.floor(tile / Birb.base.rows) * Birb.scale),
		y: (((tile-1) % Birb.base.rows) * Birb.scale)
	};
	// tile-1: uncomfortable hack

	bird.pos = {
		x: random.integer(start.x, start.x + Birb.scale),
		y: random.integer(start.y, start.y + Birb.scale)
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

	bird.color = color;

	return bird;
}

// BirdMaker.prototype.makeBirds = function(today, habitats) {
// 	// var data = this.data;
// 	var width = this.dim.map.w;
// 	var height = this.dim.map.h;
// 	var birds = [];
// 	var center = {
// 		x: width / 2,
// 		y: height / 2
// 	};
// 	this.center = center;

// 	for (var i = 0; i < data.length; i++) {
// 		birds[i] = this.makeBird(width, height, center, data[i]);
// 	}

// 	this.birds = birds;

// 	return birds;
// }

// BirdMaker.prototype.makeBird = function(w, h, center, s) {
// 	var bird = [];
// 	bird.pos = {
// 		x: Math.random() * w,
// 		y: Math.random() * h,
// 	};
// 	bird.fixedPos = {
// 		x: bird.pos.x,
// 		y: bird.pos.y
// 	};
// 	bird.visible = {
// 		then: true,
// 		now: true
// 	};

// 	bird.azi = calcAngle(center, bird.pos);
// 	bird.dist = calcDistance(center, bird.pos);

// 	bird.color = {
// 		r: Math.random() * 255,
// 		g: Math.random() * 255,
// 		b: Math.random() * 255
// 	};

// 	bird.source = s;
// 	return bird;
// }

BirdMaker.prototype.updateBirdPlaces = function(panning) {
	// console.log("-----------------------");
	for (var i = 0; i < this.birds.length; i++) {
		var bird = this.birds[i];
		bird.pos.x = bird.fixedPos.x + panning.x;
		bird.pos.y = bird.fixedPos.y + panning.y;
		bird.visible.then = bird.visible.now;
		// bird.visible.now = checkIsVisible(bird.pos.x, bird.pos.y, this.dim.map.w, this.dim.map.h);
		bird.visible.now = __isTileVisible(bird.pos, {w:5,h:5}, this.dim.map);
		// console.log(bird.visible.now);

		bird.azi = calcAngle(this.center, bird.pos);
		bird.dist = calcDistance(this.center, bird.pos);

		this.birds[i] = bird;
	}
	// console.log("---------------");
	// console.log(panning);
	// console.log(this.birds[0].fixedPos);
	// console.log(this.birds[0].pos);
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

