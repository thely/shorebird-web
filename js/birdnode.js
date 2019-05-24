// A collection of three nodes: a source node, a binaural FIR panner node,
// and a gain node.
function BirdNode(ctx, master, hrtf, source, azi, dist) {
	this.active = false;
	this.b_id = null;
	this.bird = null;
	this.ctx = ctx;

	this.SoundSource = ctx.createBufferSource(); 
	this.SoundSource.buffer = source;
	this.SoundSource.loop = true;

	this.BinPan = new BinauralFIR({
		audioContext: ctx
	});
	this.BinPan.HRTFDataset = hrtf;
	this.BinPan.setCrossfadeDuration(200);

	this.GainNode = ctx.createGain();
	// this.GainNode.gain.value = __gainFromDistance(dist, 0.4);
	this.GainNode.gain.value = 0;

	this.SoundSource.connect(this.GainNode);
	this.GainNode.connect(this.BinPan.input);
	this.BinPan.connect(master);

	// this.BinPan.setPosition(azi, 0, dist);
}

BirdNode.prototype.play = function(source) {
	this.SoundSource = this.ctx.createBufferSource(); 
	this.SoundSource.buffer = source;
	this.SoundSource.loop = true;

	var dur = this.SoundSource.buffer.duration;
	var fileOffset = random(0, dur);
	var startOffset = random(0, 2);
	this.SoundSource.connect(this.GainNode);
	this.SoundSource.start(startOffset, fileOffset);
	// this.SoundSource.start(val);
	// i * 0.5 + Math.random()
}

BirdNode.prototype.stop = function() {
	this.SoundSource.stop();
}

BirdNode.prototype.gain = function(val) {
	if (!val) {
		return this.GainNode.gain.value;
	}
	else if (val != 0) { 
		this.GainNode.gain.linearRampToValueAtTime(val, this.ctx.currentTime + 0.5);
		this.active = true;
	}
	else {
		this.GainNode.gain.value = 0;
		this.active = false;
	}
}

BirdNode.prototype.pan = function(azi, dist) {
	this.BinPan.setPosition(azi, 0, dist);
}

BirdNode.prototype.file = function(file) {
	if (file) {
		this.SoundSource.buffer = file;
	}
	return this.SoundSource.buffer;
}

function __gainFromDistance(dist, max) {
	// var x = Math.min(1 / (0.5 * Math.PI * Math.pow(dist, 2) + 1), max);
	var x = Math.min(1 / (0.5 * dist), max);
	return x;
}