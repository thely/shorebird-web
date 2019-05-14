

// each bird needs its own x and y position, its own binaural node, and sound file
// its position will get drawn inside the canvas

// architecture:
// main.js comes last; contains the makeBird functions?
// globals.js declares Birb
// drawBird() is in canvas

$(function() {
	$('.regenerate').click(function (evt) {
		// var canvasContext = buildMapViewer(Birb.windowWidth, Birb.windowHeight);
		// var audioContext = audioContextCheck();
		// var targetNode = audioContext.destination; //output node

	    Birb.birds = makeBirds(Birb.initialBirdData, Birb.mapWidth, Birb.mapHeight);
	    drawFullMap(Birb.birds, Birb.canvasContext);
		Birb.birds = playBirds(Birb.birds, Birb.audioContext, Birb.targetNode);

		console.log("clicking regenerate!!!");
	});

	$('.play').click(function (evt) {
		Birb.birds = playBirds(Birb.birds, Birb.audioContext, Birb.targetNode);
	});

	function makeBirds(data, width, height) {
		var birds = [];
		var center = {
			x: width / 2,
			y: height / 2
		};

		for (var i = 0; i < data.length; i++) {
			birds[i] = makeBird(width, height, center, data[i]);
		}

		return birds;
	}

	function makeBird(w, h, center, s) {
		var bird = [];
		bird.pos = {
			x: Math.random() * w,
			y: Math.random() * h,
		};
		bird.mapPos = {};

		bird.azi = calcAngle(center, bird.pos);
		bird.dist = calcDistance(center, bird.pos);

		bird.color = {
			r: Math.random() * 255,
			g: Math.random() * 255,
			b: Math.random() * 255
		};

		bird.name = "dove";
		bird.source = s;
		return bird;
	}

	window.onscroll = function(e){ reOffset(); }
	window.onresize = function(e){ reOffset(); }
	function reOffset() {
		Birb.mouse.offset = Birb.map.reOffset();
	}

	$("#mapZone").mousedown(function(e){ 
		Birb.mouse.handleMouseDown(e);
	});
	
	$("#mapZone").mouseup(function(e){ 
		Birb.mouse.handleMouseUp(e);
	} );
	
	$("#mapZone").mouseout(function(e){ 
		Birb.mouse.handleMouseOut(e);
	} );

	// Mouse move: calculate the panning, redraw the map w/panning,
	// recalc all the azimuths/distances based on new data, use that
	// to update all the audio nodes
	$("#mapZone").mousemove(function(e){
		var panning = Birb.mouse.handleMouseMove(e);
		if (panning) {
			Birb.map.drawFullMap(Birb.birds, panning);	
		}
		
	});

	// Birb.canvasContext = buildMapViewer(Birb.windowWidth, Birb.windowHeight);
	Birb.map = new ShoreMap("mapZone", Birb.windowWidth, Birb.windowHeight);
	Birb.birds = makeBirds(Birb.initialBirdData, Birb.mapWidth, Birb.mapHeight);
	Birb.map.drawFullMap(Birb.birds);

	Birb.mouse = new MouseFollow();

	Birb.audioContext = audioContextCheck();
	Birb.targetNode = Birb.audioContext.destination; //output node

	

	// drawFullMap(Birb.birds, Birb.canvasContext);
	// Birb.birds = playBirds(Birb.birds, audioContext, targetNode);
});





