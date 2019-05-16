var Birb = [];

// Some defaults

// mapDim is the dimensions of the full (partially hidden) map
// viewDim is the dimensions of the viewport (visible map)

Birb.scale = 25;
Birb.base = {
	rows: 94,
	cols: 82
}
Birb.dim = {
	"map": {
		"w": Birb.scale * Birb.base.rows,
		"h": Birb.scale * Birb.base.cols
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