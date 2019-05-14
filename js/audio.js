// var bufferLoader;
// var aContext;
// var myBirds;
var birdNodes = [];

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

	// console.log(this);
	// var hrtf = getHRTF(this.context);
	// console.log(this.birds);

	// for (var i = 0; i < this.birds.length; i++) {
	// 	this.birdNodes[i] = new BirdNode(hrtf, bufferList[this.birds[i].source], this.birds[i].azi, this.birds[i].dist);
	// 	this.birdNodes[i].play(i * 0.5 + Math.random());
	// }
}

AudioPlayer.prototype.handleMouseMove = function(birds) {
	console.log("inside mouse move for audio player?");
	for (var i = 0; i < this.birdNodes.length; i++) {
		var b = birds[i];
		if (!birds[i].isVisible) {
			this.birdNodes[i].gain(0);
		}
		else {
			this.birdNodes[i].pan(birds[i].azi, birds[i].dist);
			this.birdNodes[i].gain(0.2);
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

// -------- Old panner code ---------------------

$(".vs1").val(0);
$(".vs1").knob({
	'change': function(v) {
		Birb.changeAzimuth(v);
	}
});

// $(".vs3").val(0);
$(".vs3").on("input", function(evt) {
	console.log("elevation change: "+evt.target.value);
	var pos = binauralNode.getPosition();
	binauralNode.setPosition(pos.azimuth, evt.target.value, pos.distance);
});

// Distance
$(".vs2").on("input", function(evt) {
	Birb.changeDistance(evt.target.value);
});

