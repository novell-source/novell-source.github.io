let canvas = document.getElementById("canvas");
let info = document.getElementById("info");
let alglife = document.getElementById("alglife");
let algdead = document.getElementById("algdead");
let object = document.getElementById("object");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight / 1.7;
const W = canvas.width;
const H = canvas.height;
let cellsize = 8;
let cellWidth = (W - (W % cellsize)) / cellsize;
let cellHeight = (H - (H % cellsize)) / cellsize;
let alivecells = 0;
const cells = [];
let neighboursNeeded = [false, false, true, true];
let neighboursForRevival = [false, false, false, true];
let mousedown = false;
let start = false;

createCells();

let timer = setInterval(nextframe, 60);

function nextframe() {
	if (start) {
		ctx.moveTo(0, 0);
		let array = [];
		for (let i = 0; i < cells.length; i++) {
			array.push(checkNeighbours(cells[i], i));
		}
		for (let i = 0; i < cells.length; i++) {
			cells[i] = array[i];
		}
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawCells();
}

function checkNeighbours(item, i) {
	if ((i - i % cellWidth) / cellWidth > 0 && (i - i % cellWidth) / cellWidth < cellHeight - 1 && i % cellWidth > 0 &&
		i %
		cellWidth < cellWidth - 1) {

		const neighboursalive = 0 +
			cells[i - cellWidth - 1] +
			cells[i - cellWidth] +
			cells[i - cellWidth + 1] +
			cells[i + 1] +
			cells[i + cellWidth + 1] +
			cells[i + cellWidth] +
			cells[i + cellWidth - 1] +
			cells[i - 1];

		if (item === true) {
			let life = false;
			for (let i = 0; i < neighboursNeeded.length; i++) {
				if (neighboursNeeded[i]) {
					if (neighboursalive === i) {
						life = true;
					}
				}
			}
			return life;
		}
		else {
			let life = false;
			for (let i = 0; i < neighboursForRevival.length; i++) {
				if (neighboursForRevival[i]) {
					if (neighboursalive === i) {
						life = true;
					}
				}
			}
			return life;
		}
	}
	else {
		return false;
	}
}

function buttonpressed(action) {
	switch (action) {
		case "clear":
			for (let i = 0; i < cells.length; i++) {
				cells[i] = false;
			}
			break;
		case "start_stop":
			start = !start;
			break;
		default:
			break;
	}
}

function mouseclicked(str) {
	if (mousedown) {
		let x = (event.offsetX - (event.offsetX % cellsize)) / cellsize;
		let y = (event.offsetY - (event.offsetY % cellsize)) / cellsize;
		for (let i = 0; i < cells.length; i++) {
			if (i % cellWidth === x && (i - i % cellWidth) / cellWidth === y) {
				if (str === "move") {
					if (object[object.selectedIndex].value === 'eraser') {
						chooseObject(i, object[object.selectedIndex].value);
					}
					else {
						cells[i] = true;
					}
				}
				else {
					chooseObject(i, object[object.selectedIndex].value);
				}
				drawCells();
			}
		}
	}
}

function chooseObject(i, name) {
	switch (name) {
		case 'glider':
			insertObject(i, [[0, true, 0], [0, 0, true], [true, true, true]]);
			break;
		case 'LWSS':
			insertObject(i,
				[[0, true, true], [true, true, true, true], [true, true, 0, true, true], [0, 0, true, true]]);
			break;
		case 'HWSS':
			insertObject(i,
				[[0, 0, 0, 0, true, true], [true, true, true, true, 0, true, true], [true, true, true, true, true, true],
					[0, true, true, true, true, 0]]);
			break;
		case 'GGG':
			insertObject(i, [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, 0, true],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, true, 0, 0, 0, 0, 0, 0, true, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					true, true],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, 0, 0, 0, true, 0, 0, 0, 0, true, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					true, true], [true, true, 0, 0, 0, 0, 0, 0, 0, 0, true, 0, 0, 0, 0, 0, true, 0, 0, 0, true, true],
				[true, true, 0, 0, 0, 0, 0, 0, 0, 0, true, 0, 0, 0, true, 0, true, true, 0, 0, 0, 0, true, 0, true],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, 0, 0, 0, 0, 0, true, 0, 0, 0, 0, 0, 0, 0, true],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, 0, 0, 0, true], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, true]]);
			break;
		case 'eraser':
			insertObject(i - 2 * cellWidth - 2,
				[[false, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]);
			break;
		default:
			cells[i] = !cells[i];
			break;
	}
}

function insertObject(i, array) {
	for (let j = 0; j < array.length; j++) {
		insertLine(i, j, array[j])
	}
}

function insertLine(j, index, item) {
	for (let i = 0; i < item.length; i++) {
		cells[j + index * cellWidth + i] = item[i];
	}
}

function createCells() {
	for (let i = 0; i < cellHeight; i++) {
		for (let j = 0; j < cellWidth; j++) {
			cells.push(false)
		}
	}
}

function updateSpeed(th) {
	clearInterval(timer);
	timer = setInterval(nextframe, th.value);
}

function updateCellSize(th) {
	cellsize = th.value;
	cellWidth = (W - (W % cellsize)) / cellsize;
	cellHeight = (H - (H % cellsize)) / cellsize;
	cells.length = 0;
	createCells();
}

function mouseclick(bool) {
	mousedown = bool;
}

function changeLifeAlg() {
	neighboursNeeded.length = 0;
	for (let i = 0; i < alglife.options.length; i++) {
		neighboursNeeded.push(alglife.options[i].selected);
	}
}

function changeDeadAlg() {
	neighboursForRevival.length = 0;
	for (let i = 0; i < algdead.options.length; i++) {
		neighboursForRevival.push(algdead.options[i].selected);
	}
}

function drawCells() {
	alivecells = 0;
	cells.forEach(forEachCell);
	info.innerText = "alive cells: " + alivecells;
}

function forEachCell(item, index) {
	if (item === true) {
		alivecells++;
		ctx.fillRect(index % cellWidth * cellsize, ((index - index % cellWidth) / cellWidth) * cellsize, cellsize, cellsize);
	}
}

