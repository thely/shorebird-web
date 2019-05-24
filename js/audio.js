
// Loads and plays the audio files. BufferLoader loads all files,
// and each node of sound is a BirdNode. BirdNodes and individual birds are
// not necessarily one to one.


function AudioPlayer(today, birdData, maxNodes) {
	this.context = audioContextCheck();
	this.birdNodes = [];
	this.activeNodes = [];
	this.inactiveNodes = [];
	this.total = maxNodes;
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

AudioPlayer.prototype.buildNodes = function(birds) {
	var hrtf = getHRTF(this.context);
	var list = this.bufferLoader.bufferList;
	this.files = list;

	for (var i = 0; i < this.total; i++) {
		// var source = list[birds[i].species];
		var source = list[i]; // so the source node doesn't get angry
		this.inactiveNodes[i] = new BirdNode(this.context, this.masterGain, hrtf, source);
		// this.birdNodes[i].play();
	}
	console.log(this.inactiveNodes);
}

AudioPlayer.prototype.playBirds = function(birds) {
	console.log("Trying to play");
	var hrtf = getHRTF(this.context);
	var list = this.bufferLoader.bufferList;
	this.files = list;

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

function __birdFromId(arr, birdId) {
  return arr.filter(function(el) {
      return el.id == birdId;
  })
}

/*
for each node, check to see if it has an associated bird ID.
check to see if a bird like that is in the visible birds.
if yes:
	adjust azi/dist gain if visible
if no:
	The bird's node_id and the node's bird_id are set to null.
	source.stop()
	move the node from active to inactive.
*/

AudioPlayer.prototype.updateNodes = function(birds) {
	shuffle(birds, true);
	// console.log("INACTIVE AND ACTIVE");
	console.log(this.inactiveNodes);
	console.log(this.activeNodes);
	// console.log("STARTING ACTIVE LOOP");
	for (var i = this.activeNodes.length - 1; i >= 0; i--) {
		// console.log("looping the active. our node: ");

		// check if the bird we know is in the visible list
		// console.log(this.activeNodes[i]);
		var b = __birdFromId(birds, this.activeNodes[i].bird.id);
		if (b.length > 0) {
			// console.log("we have a bird");
			this.moveVisibleNode(b[0], this.activeNodes[i]);
		}
		// our bird is gone
		else {
			// console.log("our bird is gone");
			this.activeNodes[i].stop();
			this.activeNodes[i].mode = "fadeout";
			this.activeNodes[i].bird.hasAudioNode = false; // this should be illegal
			this.activeNodes[i].bird = null;
			var n = this.activeNodes.splice(i, 1);
			this.inactiveNodes.push(n[0]);
		}
	}

	// all our nodes are presently in use
	if (this.inactiveNodes.length <= 0) {
		console.log("all the inactive nodes are taken!");
		return;
	}

	// adding new birds
	// console.log("STARTING BIRD LOOP");
	// console.log(birds);
	for (var i = 0; i < birds.length; i++) {
		// if we weren't visible last frame, we haven't been added yet
		if (!birds[i].hasAudioNode && this.inactiveNodes.length > 0) {
			console.log("our next bird: ");
			console.log(birds[i]);
			var n = this.inactiveNodes.pop();
			n.bird = birds[i];
			birds[i].hasAudioNode = true;

			var file = this.files[birds[i].species];
			this.moveVisibleNode(birds[i], n);
			this.activeNodes.unshift(n);
			this.activeNodes[0].play(file);
		}
	}
}

AudioPlayer.prototype.moveVisibleNode = function(b, n) {
	if (b.visible.now) {
		n.pan(b.azi, b.dist);
				
		var x = __gainFromDistance(b.dist, 0.4);
		n.gain(x);
	}

	// just left the viewport
	else if (!b.visible.now && b.visible.then) {
		n.gain(0.00001);
	}

	// bird has been gone from the viewport, maybe still fading out
	else if (!b.visible.now && !b.visible.then) {
		if (n.gain() <= 0.00001) {
			n.gain(0);
			// n.stop();
		}
	}

	// just entered the viewport
	else if (b.visible.now && !b.visible.then) {
		// n.play();
		var x = __gainFromDistance(b.dist, 0.4);
		n.gain(x);
	}
}

AudioPlayer.prototype.handleMouseMove = function(birds) {
	this.updateNodes(birds);
	// var len = this.birdNodes.length > birds.length ? this.birdNodes.length : birds.length;
	// for (var i = 0; i < len; i++) {
	// 	var b = birds[i];

	// 	// pan it around if visible
	// 	if (b.visible.now) {
	// 		this.birdNodes[i].pan(b.azi, b.dist);
			
	// 		var x = __gainFromDistance(b.dist, 0.4);
	// 		this.birdNodes[i].gain(x, this.context);
	// 	}
	// 	// bird just left the viewport
	// 	else if (!b.visible.now && b.visible.then) {
	// 		this.birdNodes[i].gain(0.00001, this.context);
	// 	}

	// 	// bird has been gone from the viewport, maybe fading out
	// 	else if (!b.visible.now && !b.visible.then) {
	// 		if (this.birdNodes[i].GainNode.gain.value <= 0.00001) {
	// 			this.birdNodes[i].gain(0);
	// 			this.birdNodes[i].stop();
	// 		}
	// 	}
	// 	else if (b.visible.now && !b.visible.then) {
	// 		this.birdNodes[i].play();
	// 		var x = __gainFromDistance(b.dist, 0.4);
	// 		this.birdNodes[i].gain(x, this.context);
	// 	}
	// }
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