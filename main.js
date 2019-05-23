/*
$(function() {
	$('.regenerate').click(function (evt) {
		var today = cobb_data["birds_and_days"][0]["count"];
		var habitats = cobb_data["habitats_in_pixels"];
	    Birb.birds = Birb.maker.makeBirds(Birb.initialBirdData);
	    Birb.map.drawFullMap(Birb.birds);

		console.log("clicking regenerate!!!");
	});

	$('.play').click(function (evt) {
		Birb.audioPlayer.playBirds(Birb.birds);
	});
	$(".masterGainKnob").on("input", function(e) {
		// console.log(e.target.value);
		Birb.audioPlayer.master(e.target.value);
	});
*/

B_ROWS = 94;
B_COLS = 82;
B_MAPSCALE = 25;
B_POPSCALE = 1;
B_USEDTILES = [];
B_CENTER = 0;
B_FILEFOLDER = "http://localhost:8888/shorbord/";

birdSounds = [];
soundStarted = false;

var myp5 = new p5();

function mouseDragged (){
	panning.add(createVector(mouseX - pmouseX, mouseY - pmouseY));
	var maxDiff = p5.Vector.sub(dim.map, dim.view);
	panning.x = constrain(panning.x, -maxDiff.x, 0);
	panning.y = constrain(panning.y, -maxDiff.y, 0);

	b_maker.updateBirdPlaces(panning);
	b_birds = b_maker.getBirds();
	b_player.handleMouseMove(b_birds);	

	return false;
};

function mousePressed() {
	if (!soundStarted) {
		b_player.playBirds(b_birds);
		soundStarted = true;
	}
	loop();
}

function mouseReleased() {
	noLoop();
}


// function preload() {
// 	soundFormats("mp3", "ogg");
// 	for (var i = 0; i < bird_species_data.length; i++) {
// 		if (cobb_data["birds_and_days"][0]["count"][i] > 0) {
// 			birdSounds[i] = loadSound("audio/"+bird_species_data[i].name+".mp3", fileSuccess);
// 			// console.log("loading "+i);
// 		}
// 	}
// }

// function fileSuccess() {
// 	// console.log("loaded!");
// }

function setup() {
	dim = {
		map: createVector(B_COLS * B_MAPSCALE, B_ROWS * B_MAPSCALE),
		view: createVector(500, 500)
	};

	B_CENTER = p5.Vector.mult(dim.view, 0.5);
	var canvas = createCanvas(dim.view.x, dim.view.y);
	canvas.parent("mapZone");

	var today = cobb_data["birds_and_days"][0]["count"];
	var habitats = cobb_data["habitats_in_pixels"];
	b_maker = new BirdMaker(bird_species_data, today, habitats, dim);
	b_birds = b_maker.getBirds();

	b_map = new ShoreMap(dim, cobb_data);
	panning = createVector(0,0);
	b_player = new AudioPlayer(today, bird_species_data);
	// b_player.buildNodes(birdSounds, b_birds);
	// b_player.positionSounds(b_birds);

	frameRate(30);
	noLoop();
}

function draw() {
	b_map.drawFullMap(b_birds, panning);
}




