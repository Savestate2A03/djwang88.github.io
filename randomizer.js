const characterHooks = [
	"", // 00 DRMARIO
	"", // 01 MARIO
	"", // 02 LUIGI
	"", // 03 BOWSER
	"", // 04 PEACH
	"", // 05 YOSHI
	"", // 06 DK
	"", // 07 CFALCON
	"", // 08 GANONDORF
	"", // 09 FALCO
	"C2220BE4", // 10 FOX
	"", // 11 NESS
	"", // 12 ICECLIMBERS
	"", // 13 KIRBY
	"", // 14 SAMUS
	"", // 15 ZELDA
	"C2221988", // 16 LINK
	"", // 17 YLINK
	"", // 18 PICHU
	"", // 19 PIKACHU
	"", // 20 JIGGLYPUFF
	"", // 21 MEWTWO
	"", // 22 MRGAMEWATCH
	"", // 23 MARTH
	"", // 24 ROY
];

const codeStart = " 00000019\n3C00801C 60004210\n7C0803A6 4E800021\n48000058 4E800021";
const codeEnd = "\n4BFFFFAD 806DC18C\n7D0802A6 3908FFF8\n80A30024 80E5002C\n80070010 2C0000D1\n40820030 38000000\n80C50028 C4080008\nC0280004 9006007C\nD0060038 D026003C\n80C70DD4 9006007C\nD0060050 D0260060\n80A50008 2C050000\n4180FFBC 00000000";

const bounds = [
	{}, // 00 DRMARIO
	{}, // 01 MARIO
	{}, // 02 LUIGI
	{}, // 03 BOWSER
	{}, // 04 PEACH
	{}, // 05 YOSHI
	{}, // 06 DK
	{}, // 07 CFALCON
	{}, // 08 GANONDORF
	{}, // 09 FALCO
	{x1: -100, y1: -100, x2: 100, y2: 100}, // 10 FOX
	{}, // 11 NESS
	{}, // 12 ICECLIMBERS
	{}, // 13 KIRBY
	{}, // 14 SAMUS
	{}, // 15 ZELDA
	{x1: -100, y1: -100, x2: 100, y2: 100}, // 16 LINK
	{}, // 17 YLINK
	{}, // 18 PICHU
	{}, // 19 PIKACHU
	{}, // 20 JIGGLYPUFF
	{}, // 21 MEWTWO
	{}, // 22 MRGAMEWATCH
	{}, // 23 MARTH
	{}, // 24 ROY
];

var exclusions = [];
exclusions[10] = [ // 10 FOX
	[ [-55, 80], [-15, 120] ],
	[ [115, -30], [145, 20] ],
	[ [-80, -100], [-60, 10] ],
];

function randomize() {
	var resultBox = document.querySelector('#result');

	var characterBox = document.querySelector('#character');
	var character = parseInt(characterBox.value);

	var result = characterHooks[character] + codeStart;
	for (let i = 0; i < 10; i++) {
		var invalid = true;
		while (invalid) {
			var x = getRandomDecimal(bounds[character].x1, bounds[character].x2);
			var y = getRandomDecimal(bounds[character].y1, bounds[character].y2);
			if (coordinatesValid(x, y, character)) {
				invalid = false;
			}
		}
		result += coordsToHex(x, y);
	}
	result += codeEnd;
	resultBox.value = result;
}

function coordinatesValid(x, y, character) {
	// exclusions
	if (exclusions[character] != null) {
		for (let i = 0; i < exclusions[character].length; i++) {
			var characterExclusions = exclusions[character][i];
			if (characterExclusions.length == 2) {
				// rectangle
				if (withinRectangle(x, y, exclusions[character][i])) {
					return false;
				}
			} else {
				if (withinPolygon(x, y, exclusions[character][i])) {
					return false;
				}
			}
		}
	}

	return true;
}

function withinRectangle(x, y, vs) {
	if (x >= vs[0][0] && // x1
		x <= vs[1][0] && // x2
		y >= vs[0][1] && // y1
		y <= vs[1][1]) { // y2
			return true;
	}
	return false;
}

// https://github.com/substack/point-in-polygon
function withinPolygon (x, y, vs) {
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

/*
var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];

console.dir([
    inside([ 1.5, 1.5 ], polygon),
    inside([ 4.9, 1.2 ], polygon),
    inside([ 1.8, 1.1 ], polygon)
]);
*/

function getRandomDecimal(min, max) {
	// two decimal places
	min = min * 100;
	max = max * 100;
	return Math.floor((Math.floor(Math.random() * (max - min + 1)) + min)) / 100;
}

function coordsToHex(x, y) {
	var hex = "\n" + toHex(x) + " " + toHex(y)
	return hex.toUpperCase();
}

function toHex(floatNum) {
	const getHex = i => ('00' + i.toString(16)).slice(-2);
	var view = new DataView(new ArrayBuffer(4)), result;
	view.setFloat32(0, floatNum);
	result = Array
		.apply(null, { length: 4 })
		.map((_, i) => getHex(view.getUint8(i)))
		.join('');
	return(result);
}

function copy() {
	var text = document.querySelector('#result');
	text.select();
	document.execCommand('copy');
}

// TODO "all" option for generating a single massive code
// TODO handle other quadrilateral bounds