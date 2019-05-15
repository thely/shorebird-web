
$(function() {
	$('.regenerate').click(function (evt) {
	    Birb.birds = Birb.maker.makeBirds(Birb.initialBirdData);
	    Birb.map.drawFullMap(Birb.birds);
		// Birb.birds = playBirds(Birb.birds, Birb.audioContext, Birb.targetNode);

		console.log("clicking regenerate!!!");
	});

	$('.play').click(function (evt) {
		// Birb.birds = playBirds(Birb.birds, Birb.audioContext, Birb.targetNode);
		Birb.audioPlayer.playBirds(Birb.birds);
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

	var timeout;

	$("#mapZone").mousemove(function(e){
		var panning = Birb.mouse.handleMouseMove(e);

		if (timeout) {
			window.cancelAnimationFrame(timeout);
		}
		
		if (panning) {
			// console.log(panning);
			timeout = window.requestAnimationFrame(function() {
				Birb.maker.updateBirdPlaces(panning);
				Birb.birds = Birb.maker.getBirds();
				Birb.map.drawFullMap(Birb.birds, panning);
				Birb.audioPlayer.handleMouseMove(Birb.birds);	
			});
			
		}
		
	});

	Birb.maker = new BirdMaker(Birb.initialBirdData, Birb.mapWidth, Birb.mapHeight, Birb.windowWidth, Birb.windowHeight);
	Birb.birds = Birb.maker.getBirds();

	Birb.map = new ShoreMap("mapZone", Birb.windowWidth, Birb.windowHeight, Birb.mapWidth, Birb.mapHeight);
	Birb.map.drawFullMap(Birb.birds);

	Birb.mouse = new MouseFollow(Birb.map.reOffset());

	Birb.audioPlayer = new AudioPlayer(Birb.birds, Birb.soundsDict);

});





