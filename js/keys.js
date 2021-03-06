// The myKeys object will be in the global scope - it makes this script 
// really easy to reuse between projects

"use strict";

var app = app || {};

app.myKeys = function(){

var myKeys = {};

myKeys.KEYBOARD = Object.freeze({
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32,
	"KEY_SHIFT": 16
});

// myKeys.keydown array to keep track of which keys are down
// this is called a "key daemon"
// main.js will "poll" this array every frame
// this works because JS has "sparse arrays" - not every language does
myKeys.keydown = [];


// event listeners
window.addEventListener("keydown",function(e){
	myKeys.keydown[e.keyCode] = true;
});

window.addEventListener("keyup",function(e){
	myKeys.keydown[e.keyCode] = false;
	
	var char = String.fromCharCode(e.keyCode);
	if (char == "w" || char == "W" && app.main.player.state != "hurt"){
		app.main.player.prevcolor = app.main.player.color;
		app.main.player.color = "blue";
		app.main.player.img.src = "media/blueship.png";
	}
})
	
window.addEventListener("keyup",function(e){
	myKeys.keydown[e.keyCode] = false;
	
	var char = String.fromCharCode(e.keyCode);
	if (char == "q" || char == "Q" && app.main.player.state != "hurt"){
		app.main.player.prevcolor = app.main.player.color;
		app.main.player.color = "red";
		app.main.player.img.src = "media/redship.png";
	}
	if (char == "q" || char == "Q" && app.main.gameover){
		app.main.gameover = false;
		app.main.menu = true;
		app.main.init();
	}
})	
	
window.addEventListener("keyup",function(e){
	myKeys.keydown[e.keyCode] = false;
	
	var char = String.fromCharCode(e.keyCode);
	if (char == "e" || char == "E" && app.main.player.state != "hurt"){
		app.main.player.prevcolor = app.main.player.color;
		app.main.player.color = "orange";
		app.main.player.img.src = "media/orangeship.png";
	}
})	
	
window.addEventListener("keyup",function(e){
	myKeys.keydown[e.keyCode] = false;
	
	var char = String.fromCharCode(e.keyCode);
	if (char == "r" || char == "R" && app.main.player.state != "hurt"){
		app.main.player.prevcolor = app.main.player.color;
		app.main.player.color = "green";
		app.main.player.img.src = "media/greenship.png";
	}
})	
	
window.addEventListener("keyup",function(e){
	myKeys.keydown[e.keyCode] = false;
	
	// pausing and resuming
	var char = String.fromCharCode(e.keyCode);
	if (char == "p" || char == "P"){
		if (app.main.paused){
			app.main.resumeGame();
		} else {
			app.main.pauseGame();
		}
	}
})

window.addEventListener("keyup",function(e){
	myKeys.keydown[e.keyCode] = false;
	
	var char = String.fromCharCode(e.keyCode);
	if (char == "e" || char == "E" && app.main.menu){
		app.main.menu = false;
		app.main.instruct = true;
	}
})

window.addEventListener("keyup",function(e){
	myKeys.keydown[e.keyCode] = false;
	
	var char = String.fromCharCode(e.keyCode);
	if (char == "q" || char == "Q" && app.main.instruct){
		app.main.instruct = false;
		app.main.menu = true;
	}
})	
	
return myKeys;
}() //end IIFE