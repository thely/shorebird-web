
// Loads and plays the audio files. BufferLoader loads all files,
// and each node of sound is a BirdNode. BirdNodes and individual birds are
// not necessarily one to one.

function AudioPlayer(today, birdData) {
	this.context = audioContextCheck();
	// this.birds = birds;
	this.birdNodes = [];
	this.sounds = __getSoundFilenames(today, birdData);

	var sup = this;
	this.bufferLoader = new BufferLoader(this.context, this.sounds, this.__outsideSound);
	this.bufferLoader.load();
	this.bufferList = [];
}

function __getSoundFilenames(today, birdData) {
	var fList = [];
	for (var i = 0; i < today.length; i++) {
		if (today[i] > 0) {
			var filename = Birb.homeFolder + "audio/"+birdData[i].name+".wav";
			// console.log(filename);
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
	// console.log(this.birds);

	for (var i = 0; i < birds.length; i++) {
		// console.log(birds[i]);
		var source = list[birds[i].species];
		this.birdNodes[i] = new BirdNode(this.context, hrtf, source, birds[i].azi, birds[i].dist);
		this.birdNodes[i].play(i * 0.5 + Math.random());
	}
	// return birds;
}

AudioPlayer.prototype.__outsideSound = function(bufferList) {
	this.bufferList = bufferList;
	console.log("end of load");
	console.log(this);
}

AudioPlayer.prototype.handleMouseMove = function(birds) {
	// console.log("------visibility per frame-------");
	for (var i = 0; i < this.birdNodes.length; i++) {
		var b = birds[i];
		// console.log(b.visible);

		if (b.visible.now) {
			this.birdNodes[i].pan(b.azi, b.dist);
			
			var x = Math.min(1 / (4 * Math.PI * Math.pow(b.dist, 2)), 0.5);
			this.birdNodes[i].gain(x, this.context);
			// this.birdNodes[i].GainNode.gain.exponentialRampToValueAtTime(x, this.context.currentTime + 0.75);
		}
		else if (!b.visible.now && b.visible.then) {
			this.birdNodes[i].gain(0.00001, this.context);
			// this.birdNodes[i].GainNode.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.5);
		}
		else if (!b.visible.now && !b.visible.then) {
			this.birdNodes[i].gain(0);
		}
		// console.log(this.birdNodes[i].GainNode.gain.value);
	}
}

// A collection of three nodes: a source node, a binaural FIR panner node,
// and a gain node.
function BirdNode(ctx, hrtf, source, azi, dist) {
	this.SoundSource = ctx.createBufferSource(); 
	this.SoundSource.buffer = source;
	this.SoundSource.loop = true;

	this.BinPan = new BinauralFIR({
		audioContext: ctx
	});
	this.BinPan.HRTFDataset = hrtf;
	this.BinPan.setCrossfadeDuration(200);

	this.GainNode = ctx.createGain();
	var x = Math.min(1 / (4 * Math.PI * Math.pow(dist, 2)), 0.5);
	this.GainNode.gain.value = x;

	this.SoundSource.connect(this.GainNode);
	this.GainNode.connect(this.BinPan.input);
	this.BinPan.connect(ctx.destination);

	this.BinPan.setPosition(azi, 0, dist);
}

BirdNode.prototype.play = function(val) {
	this.SoundSource.start(val);
}

BirdNode.prototype.gain = function(val, ctx) {
	// var old = this.GainNode.gain.value;
	if (val != 0) { 
		this.GainNode.gain.exponentialRampToValueAtTime(val, ctx.currentTime + 0.5);
	}
	else {
		this.GainNode.gain.value = val;	
	}
	// console.log("new gain val: "+val);
}

BirdNode.prototype.pan = function(azi, dist) {
	this.BinPan.setPosition(azi, 0, dist);
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