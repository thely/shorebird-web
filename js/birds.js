
// Generates and updates bird data off of defaults from globals.js, and eventually
// from the JSON bird data.

function BirdMaker(bird_data, today, habitats, dim) {
	this.dim = dim
	this.bird_data = bird_data
	this.visibleBirds = [];
	this.birds = this.makeBirds(today, habitats);
	this.center = p5.Vector.mult(this.dim.view, 0.5);
}

// only returns currently visible birds!!
BirdMaker.prototype.getBirds = function() {
	return this.birds;
}

BirdMaker.prototype.makeBirds = function(today, habitats) {
	var birds = [];
	var center = this.center;

	this.visibleBirds = [];

	// cycle through list of birds/day
	var bCount = 0;
	for (var i = 0; i < today.length; i++) {
		if (today[i] > 0) {
			// one color per species
			var color = {
				r: Math.random() * 255,
				g: Math.random() * 255,
				b: Math.random() * 255
			};

			// // place # birds of species i
			var pop = Math.ceil(today[i] / B_POPSCALE);

			for (var j = 0; j < pop; j++) {
				var b = new Bird(this.bird_data[i], habitats, color);
				b.species = i;
				b.id = bCount;
				
				// add to the list of lived-in tiles for collision detection/etc
				B_USEDTILES.push(b.tile);
				if (b.visible.now) {
					this.visibleBirds.push(b);
				}
				birds[bCount] = b;
				bCount++;
			}
		}
	}
	return birds;
}

BirdMaker.prototype.updateBirdPlaces = function(panning) {
	this.visibleBirds = [];

	for (var i = 0; i < this.birds.length; i++) {
		var bird = this.birds[i];
		bird.pos = p5.Vector.add(bird.fixedPos, panning);
		bird.visible.then = bird.visible.now;
		bird.visible.now = checkIsVisible(bird.pos, this.dim.view);
		if (bird.visible.now) {
			this.visibleBirds.push(bird);
		}

		push();
		translate(B_CENTER.x, B_CENTER.y);
		bird.azi = calcAngle(bird.pos);
		bird.dist = calcDistance(bird.pos);
		pop();

		this.birds[i] = bird;
	}
}

// pick habitat for this bird from its preferences, then
// pick tile belonging to this habitat

function Bird(info, habitats, color) {
	this.name = info.name;
	this.pickHabitat(info.land_preference, habitats);

	// find the top-left start pos of this tile
	var start = createVector(
		parseInt(Math.floor(this.tile / B_ROWS) * B_MAPSCALE),
		parseInt(((this.tile) % B_ROWS) * B_MAPSCALE)
	);
	// generate a bird position inside the tile
	this.pos = start.copy().add(B_MAPSCALE);
	this.fixedPos = this.pos.copy();

	this.visible = {
		then: checkIsVisible(this.pos, dim.view),
		now: checkIsVisible(this.pos, dim.view)
	};

	// get the azimuth/distance for binaural panning and gain
	push();
	translate(B_CENTER.x, B_CENTER.y);
	this.azi = calcAngle(this.pos);
	this.dist = calcDistance(this.pos);
	pop();

	this.color = color;
}

Bird.prototype.pickHabitat = function(prefs, habitats) {
	var ret = [];
	var hab = random(prefs);
	while (!(hab in habitats)) {
		hab = random(prefs);
	}
	var tile = random(habitats[hab]);
	this.tile = tile - 1;
	this.hab = hab;
	
	return tile;
}

/// ------------ Helpers ----------------------------------



function checkIsVisible(pos1, pos2) {
	if (pos1.x < 0 || pos1.y < 0) {
		return false;
	}
	if (pos1.x >= pos2.x || pos1.y >= pos2.y) {
		return false;
	}
	return true;
}

//p1 is the centerpoint in all cases
function calcAngle(p2) {
	// push();
	// translate(B_CENTER.x, B_CENTER.y);
	var diff = p5.Vector.sub(B_CENTER, p2).rotate(HALF_PI);
	var azi = degrees(diff.heading()).toFixed(2);
	// pop();
	return azi; 
}

function calcDistance(p2) {
	// push();
	// translate(B_CENTER.x, B_CENTER.y);
	var diff = p5.Vector.sub(B_CENTER, p2);
	var c = diff.mag().toFixed(2);
	// pop();

	return c / 300;
}

