
// Loads and plays the audio files. BufferLoader loads all files,
// and each node of sound is a BirdNode. BirdNodes and individual birds are
// not necessarily one to one.

function AudioPlayer(birds, allSounds) {
	this.context = audioContextCheck();
	// this.birds = birds;
	this.birdNodes = [];
	this.sounds = allSounds;

	var sup = this;
	this.bufferLoader = new BufferLoader(this.context, this.sounds, sup.outsideSound);
	this.bufferLoader.load();
	this.bufferList = [];
	console.log("end of load");
}

AudioPlayer.prototype.playBirds = function(birds) {
	var hrtf = getHRTF(this.context);
	var list = this.bufferLoader.bufferList;
	// console.log(this.birds);

	for (var i = 0; i < birds.length; i++) {
		this.birdNodes[i] = new BirdNode(this.context, hrtf, list[birds[i].source], birds[i].azi, birds[i].dist);
		this.birdNodes[i].play(i * 0.5 + Math.random());
	}
	// return birds;
}

AudioPlayer.prototype.outsideSound = function(bufferList) {
	this.bufferList = bufferList;
}

AudioPlayer.prototype.handleMouseMove = function(birds) {
	for (var i = 0; i < this.birdNodes.length; i++) {
		var b = birds[i];

		if (b.visible.now) {
			this.birdNodes[i].pan(b.azi, b.dist);
			
			var x = Math.min(1 / (4 * Math.PI * Math.pow(b.dist, 2)), 0.5);
			this.birdNodes[i].GainNode.gain.exponentialRampToValueAtTime(x, this.context.currentTime + 0.75);
		}
		else if (!b.visible.now && b.visible.then) {
			this.birdNodes[i].GainNode.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.5);
		}
		else {
			
		}
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
	this.GainNode.gain.value = 0.2;

	this.SoundSource.connect(this.GainNode);
	this.GainNode.connect(this.BinPan.input);
	this.BinPan.connect(ctx.destination);

	this.BinPan.setPosition(azi, 0, dist);
}

BirdNode.prototype.play = function(val) {
	this.SoundSource.start(val);
}

BirdNode.prototype.gain = function(val) {
	this.GainNode.gain.value = val;
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