var running;
var testLength = 20005;
var testTimer;
var diamonds = {};
var newDiamond;


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
	clearInterval(newDiamond);
	$('canvas').removeLayers();
	$('canvas').drawLayers();
	$(document).off('keypress');
}

function addSections() {
	addLetters();
	addMathSum();
	addColorSections();
	addDiamonds();
}

function addPermutations(text, perms) {
	var data = {data: text};
	addText(70, 70, perms[0], 'perm1', data);
	addText(730, 70, perms[1], 'perm2', data);
	addText(70, 490, perms[2], 'perm3', data);
	addText(730, 490, perms[3], 'perm4', data);
}

function addLetters() {
	$('canvas').removeLayer('perm1');
	$('canvas').removeLayer('perm2');
	$('canvas').removeLayer('perm3');
	$('canvas').removeLayer('perm4');
	$('canvas').drawLayers();

	var text = generateText(5);
	addText(390, 70, text, 'letters', '');
	setTimeout(function() {
		$('canvas').removeLayer('letters');
		$('canvas').drawLayers();
		setTimeout(function() {
			perms = generatePermutations(text);
			addPermutations(text, perms);
		}, 5000);
	},1000);
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

	// var sum = a + ' ' + sign + ' ' + b;
	var ans = eval(sum);
	sum += ' =  ';

	$('canvas').removeLayer('math');
	$('canvas').removeLayer('ans');
	$('canvas').drawLayers();

	addText(370, 490, sum, 'math', {data: ans});
	addText(431, 490, '', 'ans', '');
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

function addDiamonds() {
	newDiamond = setInterval(function() {
		addDiamond(250);
	}, 6000);
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

	var asciiValue = event['charCode'];
	switch(asciiValue) {
		case r:
		case g:
		case y:
			matchColor(asciiValue);
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
		default:
			if (isNumber(asciiValue)) {
				displayNumber(asciiValue);
				matchNumber();
			}
	}
}

function displayNumber(asciiValue) {
	var num = String.fromCharCode(asciiValue);
	var $ans = $('canvas').getLayer('ans');
	text = $ans['text'];
	$('canvas').drawLayers();

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
	var actual = $math['data']['data']
	if (user == actual) {
		addMathSum();			
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
		}
	}
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

		addLetters();
	}
}

function isNumber(asciiValue) {
	var ZERO = '0'.charCodeAt(0);
	var NINE = '9'.charCodeAt(0);
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

function generatePermutations(text) {
	var perms = [text];
	for (var i=0; i<3; i++) {
		var j =	Math.floor((Math.random() * 5) + 1);
		var perm = text.replaceAt(j, generateText(1));
		perms.push(perm);
	}
	return perms;
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

