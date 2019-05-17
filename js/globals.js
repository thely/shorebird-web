var Birb = [];

// Some defaults

// mapDim is the dimensions of the full (partially hidden) map
// viewDim is the dimensions of the viewport (visible map)

Birb.scale = 25;
Birb.base = {
	rows: 94,
	cols: 82
};
// 33% chance of seeing relevant birds
Birb.homeFolder = "http://localhost:8888/shorbord/";
Birb.popScale = 1;
Birb.dim = {
	"map": {
		"h": Birb.scale * Birb.base.rows,
		"w": Birb.scale * Birb.base.cols
	},
	"view": {
		"w": 700,
		"h": 500
	}
};
Birb.tileList = [];
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