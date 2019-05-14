

$(function() {
	$('.regenerate').click(function (evt) {
	    Birb.birds = makeBirds(Birb.initialBirdData, Birb.mapWidth, Birb.mapHeight);
	    drawFullMap(Birb.birds, Birb.canvasContext);
		Birb.birds = playBirds(Birb.birds, Birb.audioContext, Birb.targetNode);

		console.log("clicking regenerate!!!");
	});

	$('.play').click(function (evt) {
		// Birb.birds = playBirds(Birb.birds, Birb.audioContext, Birb.targetNode);
		Birb.audioPlayer.playBirds();
	});

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

	// Mouse drag: calculate the panning, redraw the map w/panning,
	// recalc all the azimuths/distances based on new data, use that
	// to update all the audio nodes
	$("#mapZone").mousemove(function(e){
		var panning = Birb.mouse.handleMouseMove(e);
		if (panning) {
			// console.log(panning);
			Birb.maker.updateBirdPlaces(panning);
			Birb.birds = Birb.maker.getBirds();
			Birb.map.drawFullMap(Birb.birds);	
		}
		
	});

	// Birb.canvasContext = buildMapViewer(Birb.windowWidth, Birb.windowHeight);
	Birb.maker = new BirdMaker(Birb.initialBirdData, Birb.mapWidth, Birb.mapHeight, Birb.windowWidth, Birb.windowHeight);
	Birb.birds = Birb.maker.getBirds();

	Birb.map = new ShoreMap("mapZone", Birb.windowWidth, Birb.windowHeight);
	Birb.map.drawFullMap(Birb.birds);

	Birb.mouse = new MouseFollow(Birb.map.reOffset());

	Birb.audioPlayer = new AudioPlayer(Birb.birds, Birb.soundsDict);
	// Birb.audioContext = audioContextCheck();
	// Birb.targetNode = Birb.audioContext.destination; //output node

	

	// drawFullMap(Birb.birds, Birb.canvasContext);
	// Birb.birds = playBirds(Birb.birds, audioContext, targetNode);
});





