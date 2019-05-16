var Birb = [];

// Some defaults

// mapDim is the dimensions of the full (partially hidden) map
// viewDim is the dimensions of the viewport (visible map)
Birb.dim = {
	"map": {
		"w": 20 * 94,
		"h": 20 * 82
	},
	"view": {
		"w": 500,
		"h": 500
	}
};
// Birb.total = 2;
Birb.birds = [];
Birb.soundsDict = [
	"audio/dove.wav",
	"audio/merlin.wav",
	"audio/breakbeat.wav"
];
Birb.initialBirdData = [
	0, 1, 2, 0, 1
]