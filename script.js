/**
 *
 * @source: http://sourceforge.net/p/simonjs
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2018  Sergei
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

var canvas = document.getElementById("a");
var context = canvas.getContext("2d");
var canvasRect;
var sequence;
var nextToClick;
var shownSoFar;
var showingBright;
var mouseDisabled;

restart();

function drawAreaByNumber(bright, number)
{
	var colors = [["DarkGreen", "DarkRed", "#C0C000", "DarkBlue"], ["Green", "Red", "#FFFF00", "Blue"]];

	context.fillStyle = colors[bright ? 1 : 0][number];
	context.fillRect((number % 2) * canvasRect.width / 2, Math.floor(number / 2) * canvasRect.height / 2,
		canvasRect.width / 2, canvasRect.height / 2);
}

function show()
{
	showingBright = !showingBright;
	drawAreaByNumber(showingBright, sequence[shownSoFar]);
	if (!showingBright)
		shownSoFar++;

	if (shownSoFar < sequence.length)
		setTimeout(show, 250);
	else
		mouseDisabled = false;
}

function nextRound()
{
	mouseDisabled = true;
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	canvasRect = canvas.getBoundingClientRect();
	drawAreaByNumber(false, 0);
	drawAreaByNumber(false, 1);
	drawAreaByNumber(false, 2);
	drawAreaByNumber(false, 3);

	nextToClick = 0;
	showingBright = false;
	sequence.push(Math.floor(Math.random() * 4));
	shownSoFar = 0;
	show();
}

function restart()
{
	sequence = [];
	nextRound();
}

function showText(text)
{
	context.fillStyle = "Black";
	context.font = Math.min(canvasRect.width, canvasRect.height) / 4 + "px Arial";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(text, canvasRect.width / 2, canvasRect.height / 2);
}

function onClick(event)
{
	if (mouseDisabled)
		return;

	if (nextToClick == -1) {
		restart();
		return;
	}

	var x = event.clientX - canvasRect.left;
	var y = event.clientY - canvasRect.top;
	var number = 0;

	if (x >= canvasRect.width / 2)
		number++;
	if (y >= canvasRect.height / 2)
		number += 2;

	if (sequence[nextToClick] == number) {
		mouseDisabled = true;
		drawAreaByNumber(true, number);
		setTimeout(toNext, 250);
	} else {
		context.clearRect(0, 0, canvasRect.width, canvasRect.height);
		showText("Game over");
		nextToClick = -1;
	}
}

function toNext()
{
	drawAreaByNumber(false, sequence[nextToClick]);
	nextToClick++;
	if (nextToClick == sequence.length) {
		showText(nextToClick);
		setTimeout(nextRound, 1000);
	} else
		mouseDisabled = false;
}
