var testLength = 8 * 60 * 1000; //8 minute test
var minus = 0;
var ZERO = '0'.charCodeAt(0);
var NINE = '9'.charCodeAt(0);
var diamonds = {};
var running;
var newDiamond;
var letterPermutations;
var removePermutation;
var startTime;

$(document).ready(function () {
    $('#startCLAN').click(startTest);
    showStart();
});

function startTest() {
	if (running == true) {
		return;
	}
	$('canvas').removeLayers();
	running = true;
	startTime = new Date().getTime();
	setTimeout(endTest, testLength);
	$(document).keypress(handleInput);
	$(document).on('keydown', function (e) {
		if (e.which === 8) { //backspace
			removeLast();
			e.preventDefault();
		}
	});
	addSections();
}

function endTest() {
	$('canvas').removeLayers();
	running = false;
	clearTimeout(newDiamond);
	clearTimeout(letterPermutations);
	clearTimeout(removePermutation);
	$(document).off('keypress');
	$(document).off('keydown');
	updateScore();
	showScore();
	$('canvas').drawLayers();
}

function addSections() {
	addLetters();
	addMathSum();
	addColorSections();
	addDiamonds();
}

//TODO Remove magic numbers.
function addPermutations(text, perms) {
	var data = {data: text};
	addText(60, 70, perms[0], 'perm1', data);
	addText(670, 70, perms[1], 'perm2', data);
	addText(60, 490, perms[2], 'perm3', data);
	addText(670, 490, perms[3], 'perm4', data);
}

function addLetters() {
	len = getSequenceLength();
	$('canvas').removeLayer('perm1');
	$('canvas').removeLayer('perm2');
	$('canvas').removeLayer('perm3');
	$('canvas').removeLayer('perm4');
	$('canvas').drawLayers();

	var text = generateText(len);
	addText(340, 70, text, 'letters', '');
	setTimeout(function() {
		$('canvas').removeLayer('letters');
		$('canvas').drawLayers();
		letterPermutations = setTimeout(function() {
			perms = generatePermutations(text, len);
			addPermutations(text, perms);
			removePermutation = setTimeout(addLetters, 17 * 1000); //Display new sequence after 17 seconds
		}, 12 * 1000); //Show permutations after 12 seconds
	}, 2 * 1000); //Two seconds to learn sequence
}

function addText(x, y, text, name, data) {
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
  		data: data
	});
}

function addMathSum() {
	var a =	Math.floor((Math.random() * 12) + 1);
	var b =	Math.floor((Math.random() * 12) + 1);
	var signs = ['*', '+', '/', '-'];
	var sign = signs[Math.floor(Math.random()*signs.length)];

	switch(sign) {
		case '*':
		case '+':
			var sum = a + ' ' + sign + ' ' + b;
			break;
		case '/':
			var sum = (a*b) + ' ' + sign + ' ' + b;
			break;
		case '-':
			if (a > b) {
				var sum = a + ' ' + sign + ' ' + b;
			}
			else {
				var sum = b + ' ' + sign + ' ' + a;
			}
			break;
	}

	var ans = eval(sum);
	sum += ' =  ';

	$('canvas').removeLayer('math');
	$('canvas').removeLayer('ans');

	addText(340, 490, sum, 'math', {data: ans});
	addText(431, 490, '', 'ans', '');

	$('canvas').drawLayers();
}

//TODO Remove magic numbers.
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

function addDiamonds() {
	addDiamond(250);
	newDiamond = setTimeout(addDiamonds, getDiamondInterval());
}

//TODO Remove magic numbers.
function showStart() {
	addText(350, 70, 'Press Start to begin. The test is 8 minutes long.', 'start', '');
	addSmallText(350, 150, 'I. Diamonds move from the left into coloured bands (red, green, yellow). When they reach the coloured band you must ‘cancel’ them using the [R], [G], [Y] keys. Wrong or surplus keys used here lose 1 point.');
	addSmallText(343, 190, 'II. Simple mathematical problems appear at the bottom of the screen. Use the num keys to type your answer and enter to submit. Wrong answers lose 1 point.');
	addSmallText(346, 230, 'III. Every 15-20 seconds, 5-9 alphanumeric digits appear at the top for a few seconds. 12 seconds later, four similar options are presented at each corner of the screen; you must select the option which appeared previously using W/E/S/D.');
}

//TODO Remove magic numbers.
function showScore() {
	addText(340, 370, 'Time Up!', 'time', '');
	addText(340, 420, 'You lost ' + minus + ' points.', 'score', '');
	showStart();
}

//Sequence between 5-9 chars increases with time.
function getSequenceLength() {
	timeElapsed = new Date().getTime() - startTime;
	return Math.floor((timeElapsed / testLength) * 5) + 5;
}

//Diamond interval time between 1 and 15 seconds. Decreases with time.
function getDiamondInterval() {
	timeElapsed = new Date().getTime() - startTime;
	return (15 - Math.floor((timeElapsed / testLength) * 15)) * 1000;
}

//TODO: Find a nicer way to do this.
function updateScore() {
	for (var name in diamonds) {
		if (diamonds[name]['x'] > 540) {
			minus += 1;
		}
	}
}

function addSmallText(x, y, text) {
	$('canvas').drawText({
		layer: true,
		type: 'text',
		fillStyle: '#000',
		text: text,
		x: x, y: y,
    	strokeWidth: 2,
    	fontSize: '10pt',
 		fontFamily: 'Verdana, sans-serif',
  		scale: 1,
		align: 'left',
  		maxWidth: 700
	});
}

function addDiamond(y) {
	var name = Math.random().toString(36).substring(2,7);
	var cols = [['#F00', 'r'], ['#FF0', 'y'], ['#0F0', 'g']];
	var col = Math.floor((Math.random() * 3));
	
	$('canvas').drawRect({
		layer: true,
		name: name,
		fillStyle: cols[col][0],
		x: 175, y: y,
		width: 9,
		height: 9,
		rotate: 45,
		data: cols[col][1]
	});

	var $diamond = $('canvas').getLayer(name);
	diamonds[name] = $diamond;
	moveDiamond(name, 10000);
}

function moveDiamond(name, time) {
	$('canvas').animateLayer(name, {
	  x: 600, y: 250,
	}, time, function() {
		$('canvas').removeLayer(name);
	});
}

function handleInput(event) {
	var r = 'r'.charCodeAt(0);
	var g = 'g'.charCodeAt(0);
	var y = 'y'.charCodeAt(0);
	var w = 'w'.charCodeAt(0);
	var e = 'e'.charCodeAt(0);
	var s = 's'.charCodeAt(0);
	var d = 'd'.charCodeAt(0);
	var enter = 13; //charCode for enter event

	var keyCode = event.keyCode;
	switch(keyCode) {
		case r:
		case g:
		case y:
			matchColor(keyCode);
			break;
		case w:
			matchLetters('perm1');
			break;
		case e:
			matchLetters('perm2');
			break;
		case s:
			matchLetters('perm3');
			break;
		case d:
			matchLetters('perm4');
			break;
		case enter:
			matchNumber();
			break;
		default:
			if (isNumber(keyCode)) {
				displayNumber(keyCode);
			}
	}
}

function removeLast() {
	var $ans = $('canvas').getLayer('ans');
	$ans['text'] = $ans['text'].slice(0,-1);
	$('canvas').drawLayers();
}

function displayNumber(asciiValue) {
	var num = String.fromCharCode(asciiValue);
	var $ans = $('canvas').getLayer('ans');
	$ans['text'] += num;
	$('canvas').drawLayers();
}

function matchNumber() {
	var $ans = $('canvas').getLayer('ans');
	var user = $ans['text'];

	var $math = $('canvas').getLayer('math');
	var actual = $math['data']['data']
	if (user == actual) {
		addMathSum();			
	} else {
		$ans['text'] = '';
		$('canvas').drawLayers();
		minus += 1;
	}
}

function matchColor(asciiValue) {
	var col = String.fromCharCode(asciiValue);
	var $region;
	switch(col) {
		case 'r':
			$region = $('canvas').getLayer('red');
			break;
		case 'g':
			$region = $('canvas').getLayer('green');
			break;
		case 'y':
			$region = $('canvas').getLayer('yellow');
			break;
	}
	var b1 = $region['x'];
	var b2 = b1 + $region['width'];

	for (var name in diamonds) {
		var x = diamonds[name]['x'];
		var diamondColor = diamonds[name]['data'][0];
		if (diamondColor == col && x >= b1 && x <=b2) {
			delete diamonds[name];
			$('canvas').removeLayer(name);
			return;
		}
	}
	minus += 1;
}

function matchLetters(perm) {
	var $perm = $('canvas').getLayer(perm);
	var guess = $perm['text'];
	var actual = $perm['data']['data'];
	if (actual == guess) {
		$('canvas').removeLayer('perm1');
		$('canvas').removeLayer('perm2');
		$('canvas').removeLayer('perm3');
		$('canvas').removeLayer('perm4');
		$('canvas').drawLayers();
		clearTimeout(removePermutation);
		addLetters();
	} else {
		minus += 1;
	}
}

function isNumber(asciiValue) {
	return asciiValue >= ZERO && asciiValue <= NINE;
}

function generateText(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i=0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function generatePermutations(text, len) {
	var perms = [];
	for (var i=0; i<3; i++) {
		var j =	Math.floor((Math.random() * len) + 1);
		var perm = text.replaceAt(j, generateText(1));
		perms.push(perm);
	}
	var x =	Math.floor((Math.random() * 3));
	perms.splice(x, 0, text);
	return perms;
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}
