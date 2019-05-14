var bufferLoader;
var aContext;
// var playlist = [];
// var binNodes = [];
// var gainSlide = [];
var myBirds;
var birdNodes = [];

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

function playBirds(birds, ctx, target) {
	myBirds = birds;
	aContext = ctx;

	bufferLoader = new BufferLoader(ctx, Birb.soundsDict, outsideSound);
	bufferLoader.load();

	return birds;
}

function outsideSound(bufferList) {
	var hrtf = getHRTF(Birb.audioContext);

	for (var i = 0; i < myBirds.length; i++) {
		birdNodes[i] = new BirdNode(hrtf, bufferList[myBirds[i].source], myBirds[i].azi, myBirds[i].dist);
		birdNodes[i].play(i * 0.5 + Math.random());
	}
}

// A collection of three nodes: a source node, a binaural FIR panner node,
// and a gain node.
function BirdNode(hrtf, source, azi, dist) {
	this.SoundSource = Birb.audioContext.createBufferSource(); 
	this.SoundSource.buffer = source;

	this.BinPan = new BinauralFIR({
		audioContext: Birb.audioContext
	});
	this.BinPan.HRTFDataset = hrtf;
	this.BinPan.setCrossfadeDuration(200);

	this.GainNode = Birb.audioContext.createGain();
	this.GainNode.gain.value = 0.2;

	this.SoundSource.connect(this.GainNode);
	this.GainNode.connect(this.BinPan.input);
	this.BinPan.connect(Birb.audioContext.destination);

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

function getHRTF(context) {
	// Recreate a buffer file for the HRTF out of the numeric data in hrtfs.js
	for (var i = 0; i < hrtfs.length; i++) {
		var buffer = context.createBuffer(2, 512, 44100);
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

