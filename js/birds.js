
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
		x: this.dim.view.w / 2,
		y: this.dim.view.h / 2
	};

	this.center = center;

	// cycle through list of birds/day
	var bCount = 0;
	for (var i = 0; i < today.length; i++) {
		if (today[i] > 0) {
			var color = {
				r: Math.random() * 255,
				g: Math.random() * 255,
				b: Math.random() * 255
			};

			// place # birds of species i
			var pop = Math.ceil(today[i] / Birb.popScale);
			for (var j = 0; j < pop; j++) {
				var tile = __pickHabitat(this.bird_data[i], habitats);
				birds[bCount] = this.makeBird(this.bird_data[i], tile[0], center, color);
				
				// adding tile/habitat information to this bird
				birds[bCount].species = i;
				birds[bCount].id = bCount;
				birds[bCount].tile = tile[0];
				birds[bCount].hab = tile[1];
				
				// add to the list of lived-in tiles for collision detection/etc
				Birb.tileList.push(tile[0]);
				bCount++;
			}
		}
	}
	return birds;
}

// pick habitat for this bird from its preferences, then
// pick tile belonging to this habitat
function __pickHabitat(bird, habitats) {
	var ret = [];
	var hab = random.pick(bird.land_preference);
	while (!(hab in habitats)) {
		hab = random.pick(bird.land_preference);
	}
	var tile = random.pick(habitats[hab]);
	ret[0] = tile - 1;
	ret[1] = hab;
	return ret;
}

BirdMaker.prototype.makeBird = function(info, tile, center, color) {
	var bird = {};
	bird.name = info.name;

	// find the top-left start pos of this tile
	var start = {
		x: (Math.floor(tile / Birb.base.rows) * Birb.scale),
		y: (((tile) % Birb.base.rows) * Birb.scale)
	};

	// generate a bird position inside the tile
	bird.pos = {
		x: random.integer(start.x, start.x + Birb.scale),
		y: random.integer(start.y, start.y + Birb.scale)
	};
	bird.fixedPos = {
		x: bird.pos.x,
		y: bird.pos.y
	};

	bird.visible = {
		then: checkIsVisible(bird.pos.x, bird.pos.y, this.dim.map.w, this.dim.map.h),
		now: checkIsVisible(bird.pos.x, bird.pos.y, this.dim.map.w, this.dim.map.h)
	};

	// get the azimuth/distance for binaural panning and gain
	bird.azi = calcAngle(center, bird.pos);
	bird.dist = calcDistance(center, bird.pos);

	bird.color = color;

	return bird;
}

BirdMaker.prototype.updateBirdPlaces = function(panning) {
	for (var i = 0; i < this.birds.length; i++) {
		var bird = this.birds[i];
		bird.pos.x = bird.fixedPos.x + panning.x;
		bird.pos.y = bird.fixedPos.y + panning.y;
		bird.visible.then = bird.visible.now;
		bird.visible.now = checkIsVisible(bird.pos.x, bird.pos.y, this.dim.map.w, this.dim.map.h);

		bird.azi = calcAngle(bird.pos, this.center);
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

	return c / 200;
}

