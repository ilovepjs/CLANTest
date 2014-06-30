var running;
var testLength = 3005;
var testTimer;
var diamonds = [];


$(document).ready(function () {
    $('#startCLAN').click(startTest);
});

function startTest() {
	running = true;
	testTimer = setTimeout(endTest, testLength);
	$(document).keypress(handleInput);
	addSections();
}

function endTest() {
	running = false;
	$('canvas').removeLayers();
	$(document).off('keypress');
}

function addSections() {
	addLetters(390, 70, 'XYZWD', 'letters');
	addPermutations('XYZWD');
	addMathSum();
	addColorSections();
	addDiamond(250);
	moveDiamond(3000);
}

function addPermutations(text) {
	addLetters(70, 70, 'XYCWD', 'perm1');
	addLetters(730, 70, 'XEZWD', 'perm2');
	addLetters(70, 490, 'XYZRD', 'perm3');
	addLetters(730, 490, 'XYXWD', 'perm4');
}

function addLetters(x, y, text, name) {
	$('canvas').drawText({
		layer: true,
		name: name,
		type: 'text',
		fillStyle: '#000',
		text: text,
		x: x, y: y,
    	strokeWidth: 2,
    	fontSize: '15pt',
 		fontFamily: 'Verdana, sans-serif',
  		scale: 1,
	});
}

function addMathSum() {
	var a =	Math.floor((Math.random() * 12) + 1);
	var b =	Math.floor((Math.random() * 12) + 1);
	var signs = ['*', '+', '/', '-'];
	var sign = signs[Math.floor(Math.random()*signs.length)];

	var sum = a + ' ' + sign + ' ' + b;
	var ans = eval(sum);
	sum += ' =  ';

	$('canvas').removeLayer('math');
	$('canvas').removeLayer('ans');

	addLetters(370, 490, sum, 'math');
	addLetters(431, 490, '', 'ans');

	var $math = $('canvas').getLayer('math');
	$math['data'] = ans;
}

function addColorSections() {
	addRectangle('#000', 'left', 170, 150, 130, 250);
	addRectangle('#F00', 'red', 300, 150, 80, 250);
	addRectangle('#FF0', 'yellow', 380, 150, 80, 250);
	addRectangle('#0F0', 'green', 460, 150, 80, 250);
	addRectangle('#000', 'right', 540, 150, 60, 250);
}

function addRectangle(col, name, x, y, width, height) {
	$('canvas').drawRect({
		layer: true,
		name: name,
		fillStyle: col,
		x: x, y: y,
		width: width,
		height: height,
		fromCenter: false,
	});
}

function addDiamond(y) {
	// var name = Math.random().toString(36).substr(2, 4);
	// diamonds.push(name);
	$('canvas').drawRect({
		layer: true,
		name: 'asd',
		fillStyle: '#f00',
		x: 175, y: y,
		width: 9,
		height: 9,
		rotate: 45,
	});
}

function moveDiamond(time) {
	$('canvas').animateLayer('test', {
	  x: 600, y: 250,
	}, time);
}

function handleInput(event) {
	var r = 'r'.charCodeAt(0);
	var g = 'g'.charCodeAt(0);
	var y = 'y'.charCodeAt(0);
	var a = 'a'.charCodeAt(0);
	var s = 's'.charCodeAt(0);
	var z = 'z'.charCodeAt(0);
	var x = 'x'.charCodeAt(0);

	var asciiValue = event['charCode'];
	switch(asciiValue) {
		case r:
		case g:
		case y:
			// matchColor(asciiValue);
			console.log('color match');
			break;
		case a:
		case s:
		case z:
		case x:
			console.log('letter match');
			break;
		default:
			if (number(asciiValue)) {
				displayNumber(asciiValue);
				matchNumber();
			}
	}
}

function displayNumber(asciiValue) {
	var num = String.fromCharCode(asciiValue);
	var $ans = $('canvas').getLayer('ans');
	text = $ans['text'];

	if (text == '') {
		setTimeout(function() {
			$ans['text'] = '';
		}, 700);
	}
	
	$ans['text'] = text + num;
}

function matchNumber() {
	var $ans = $('canvas').getLayer('ans');
	var user = $ans['text'];

	var $math = $('canvas').getLayer('math');
	var actual = $math['data']
	if (user == actual) {
		addMathSum();			
	}
}

// function matchColor(asciiValue) {
// 	var col = String.fromCharCode(asciiValue);
// 	var $region;
// 	switch(col) {
// 		case 'r':
// 			$region = $('canvas').getLayer('red');
// 			break;
// 		case 'g':
// 			$region = $('canvas').getLayer('green');
// 			break;
// 		case 'y':
// 			$region = $('canvas').getLayer('yellow');
// 			break;
// 	}
// 	var b1 = $region['x'];
// 	var b2 = b1 + $region['width'];

// 	diamonds.forEach(function(diamond) {
// 		console.log($('canvas').getLayer(diamond))
// 	})
// }

function number(asciiValue) {
	var ZERO = '0'.charCodeAt(0);
	var NINE = '9'.charCodeAt(0);
	return asciiValue >= ZERO && asciiValue <= NINE;
}