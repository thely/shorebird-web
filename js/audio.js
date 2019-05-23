
// Loads and plays the audio files. BufferLoader loads all files,
// and each node of sound is a BirdNode. BirdNodes and individual birds are
// not necessarily one to one.

function AudioPlayer(today, birdData) {
	this.context = audioContextCheck();
	this.birdNodes = [];
	this.sounds = __getSoundFilenames(today, birdData);
	this.masterGain = this.context.createGain();
	this.masterGain.gain.value = 0.5;
	this.masterGain.connect(this.context.destination);

	var sup = this;
	this.bufferLoader = new BufferLoader(this.context, this.sounds, this.__outsideSound);
	this.bufferLoader.load();
	this.bufferList = [];
}

function __getSoundFilenames(today, birdData) {
	var fList = [];
	for (var i = 0; i < today.length; i++) {
		if (today[i] > 0) {
			var filename = B_FILEFOLDER + "audio/"+birdData[i].name+".ogg";
			fList[i] = filename;
		}
		else {
			fList[i] = "";
		}
	}
	return fList;
}

AudioPlayer.prototype.playBirds = function(birds) {
	console.log("Trying to play");
	var hrtf = getHRTF(this.context);
	var list = this.bufferLoader.bufferList;

	for (var i = 0; i < birds.length; i++) {
		var source = list[birds[i].species];
		this.birdNodes[i] = new BirdNode(this.context, this.masterGain, hrtf, source, birds[i].azi, birds[i].dist);
		this.birdNodes[i].play();
	}
	// return birds;
}

AudioPlayer.prototype.master = function(val) {
	if (val != 0) { 
		this.masterGain.gain.exponentialRampToValueAtTime(val, this.context.currentTime + 0.5);
	}
	else {
		this.masterGain.gain.value = 0;	
	}
}

AudioPlayer.prototype.__outsideSound = function(bufferList) {
	this.bufferList = bufferList;
	console.log("end of load");
	console.log(this);
}

AudioPlayer.prototype.handleMouseMove = function(birds) {
	for (var i = 0; i < this.birdNodes.length; i++) {
		var b = birds[i];

		// pan it around if visible
		if (b.visible.now) {
			this.birdNodes[i].pan(b.azi, b.dist);
			
			var x = __gainFromDistance(b.dist, 0.4);
			// Math.min(1 / (4 * Math.PI * Math.pow(b.dist, 2)), 0.4);
			this.birdNodes[i].gain(x, this.context);
		}
		// bird just left the viewport
		else if (!b.visible.now && b.visible.then) {
			this.birdNodes[i].gain(0.00001, this.context);
		}

		// bird has been gone from the viewport, maybe fading out
		else if (!b.visible.now && !b.visible.then) {
			if (this.birdNodes[i].GainNode.gain.value <= 0.00001)
				this.birdNodes[i].gain(0);
		}
	}
}

function getHRTF(ctx) {
	// Recreate a buffer file for the HRTF out of the numeric data in hrtfs.js
	for (var i = 0; i < hrtfs.length; i++) {
		var buffer = ctx.createBuffer(2, 512, 44100);
		var buffLeft = buffer.getChannelData(0);
		var buffRight = buffer.getChannelData(1);
		for (var e = 0; e < hrtfs[i].fir_coeffs_left.length; e++) {
			buffLeft[e] = hrtfs[i].fir_coeffs_left[e];
			buffRight[e] = hrtfs[i].fir_coeffs_right[e];
		}
		hrtfs[i].buffer = buffer;
	}

	return hrtfs;
}


function audioContextCheck() {
	if (typeof AudioContext !== "undefined") {
		return new AudioContext();
	} else if (typeof webkitAudioContext !== "undefined") {
		return new webkitAudioContext();
	} else if (typeof mozAudioContext !== "undefined") {
		return new mozAudioContext();
	} else {
		alert( "can't create audio context");
	}
};





// copied JS: