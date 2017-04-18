// main.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 
 */
app.main = {
	//  properties
    WIDTH : window.innerWidth-15, 
    HEIGHT: window.innerHeight-15,
    canvas: undefined,
    ctx: undefined,
   	lastTime: 0, // used by calculateDeltaTime() 
    debug: true,
	gameState : undefined,
	//roundScore : 0,
	totalScore : 0,
	myKeys: undefined,
	Emitter: undefined,
	pulsar: undefined,
	exhaust: undefined,
	player: undefined,
	mouseX: undefined,
	mouseY: undefined,
	menuradius: undefined,
	enemies: [],
    
	// CIRCLE: Object.freeze( {
	// 	NUM_CIRCLES_START: 5,
	// 	NUM_CIRCLES_END : 20,
	// 	START_RADIUS : 8,
	// 	MAX_RADIUS : 45,
	// 	MIN_RADIUS : 2,
	// 	MAX_LIFETIME : 2.5,
	// 	MAX_SPEED : 80,
	// 	EXPLOSION_SPEED : 60,
	// 	IMPLOSION_SPEED : 84,
	// }),
	
	
	GAME_STATE: Object.freeze( { // another fake enumeration
		BEGIN : 0,
		DEFAULT : 1,
		EXPLODING : 2,
		ROUND_OVER : 3,
		REPEAT_LEVEL : 4,
		END : 5
	}),
	
	// CIRCLE_STATE: Object.freeze({
	// 	NORMAL: 0,
	// 	EXPLODING: 1,
	// 	MAX_SIZE: 2,
	// 	IMPLODING: 3,
	// 	DONE: 4,
	// }),
	// circles: [],
	// numCircles: this.NUM_CIRCLES_START,
	menu: true,
	game: false,
	paused: false,
	gameover: false,
	instruct: false,
	animationID: 0,
	// colors: ["#FD5B78","#FF6037","#FF9966","#FFFF66","#66FF66","#50BFE6","#FF6EFF","#EE34D2"],
	sound: undefined,
	
    // methods
	init : function() {
		console.log("app.main.init() called");
		// initialize properties
		this.mouseX = 0;
		this.mouseY = 0;
		this.menuradius = 0;
		this.totalScore = 0;
		this.enemies = [];
		for (var i = 0; i < 10; i ++){
			this.enemies.push(new this.Enemy(this.WIDTH, this.HEIGHT));
		}
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		this.player = new this.Player(this.WIDTH, this.HEIGHT);
		this.canvas.addEventListener("mousemove", this.player.movePlayer);
		this.player = new this.Player(this.WIDTH, this.HEIGHT); //setup the player
		this.canvas.addEventListener("mousemove", this.player.movePlayer); //link the mouse to the player moving 
		
		//setup background image

		//setting up sound effects
		this.bgAudio = document.querySelector("#bgAudio");
		this.bgAudio.volume = 0.25;
		this.effectAudio = document.querySelector("#effectAudio");
		this.effectAudio.volume = 0.3;
		
		//particles setup (Possible to be removed)
		this.exhaust = new this.Emitter();
		this.exhaust.numParticles = 100;
		this.exhaust.red = 255;
		this.exhaust.green = 150;
		this.exhaust.createParticles({x:100,y:100});
		
		//setup pulsar particles
		//use for enemy distruction
		this.pulsar = new this.Emitter();
		this.pulsar.red=255;
		this.pulsar.minXspeed=this.pulsar.minYspeed=-0.25;
		this.pulsar.maxXspeed=this.pulsar.maxYspeed=0.25;
		this.pulsar.lifetime=500;
		this.pulsar.expansionRate=0.05;
		this.pulsar.numParticles=100;
		this.pulsar.xRange=1;
		this.pulsar.yRange=1;
		this.pulsar.useCircles=false;
		this.pulsar.useSquares=true;
		this.pulsar.createParticles({x:540,y:100});
		
		// start the game loop
		// this.numCircles = this.CIRCLE.NUM_CIRCLES_START;
		// this.circles = this.makeCircles(this.numCircles);
		console.log("this.circles = " +this.circles);
		this.gameState = this.GAME_STATE.BEGIN;
		//this.canvas.onmousedown = this.doMousedown.bind(this);
		this.canvas.onmousemove = this.movePlayer.bind(this);
		this.reset();
		this.update();
	},
	
	movePlayer: function(e){
		var mouse = getMouse(e);
		this.mouseX = mouse.x;
		this.mouseY = mouse.y;
		this.player.x = mouse.x-50;
		this.player.y = mouse.y-50;
	},
	
	Player: function(width, height){
		this.x = width/2;
		this.y = height/2;
		this.img = new Image();
		this.img.src = 'media/redship.png';
		this.color = "red";
		this.state = "alive";
		this.lives = 2;
		this.hurttimer = 0;
		this.prevcolor = this.color;
	},
	
	moveEnemy: function(enemy){
		if (enemy.side == 1){//top
			enemy.y ++;
		}
		if (enemy.side == 2){//right
			enemy.x --;
		}
		if (enemy.side == 3){//bottom
			enemy.y --;
		}
		if (enemy.side == 4){//left
			enemy.x ++;
		}
	},
	
	Enemy: function(width, height){
		this.side = Math.floor((Math.random()*4)+1); //return a random num between 1 & 4
		this.state = true;
		if (this.side == 1){ //top
			this.x = Math.floor((Math.random()*width)+1);
			this.y = -50;
		}
		if (this.side == 2){ //right
			this.x = width+50;
			this.y = Math.floor((Math.random()*height)+1);
		}
		if (this.side == 3){ //bottom
			this.x = Math.floor((Math.random()*width)+1);
			this.y = height+50;
		}
		if (this.side == 4){ //left
			this.x = -50;
			this.y = Math.floor((Math.random()*height)+1);
		}
		this.img = new Image();
		this.img.src = 'media/redenemy.png';
		this.color = "red";
	},
	
	update: function(){
		// 1) LOOP
		// schedule a call to update()
	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	
	 	// 2) PAUSED?
	 	// if so, bail out of loop
	 	if (this.paused){
			this.drawPauseScreen(this.ctx);
			return;
		}
		//ctx.arc((this.WIDTH/2), (this.HEIGHT/2) + 100, 100, 0, 2*Math.PI);
		if (this.menu){
			this.drawMenuScreen(this.ctx);
			var xdif = (this.mouseX-(this.WIDTH/2));
			var ydif = (this.mouseY-(this.HEIGHT/2 + 100));
			var distance = Math.sqrt((xdif*xdif) +(ydif*ydif));

			//console.log("Distance: " +distance);
			if (distance < 100){
				this.menuradius += 1;
				if (this.menuradius > 100){
					this.menuradius = 0;
					this.menu = false;
					this.game = true;
					this.sound.playBGAudio();
				}
			}
			else{
				this.menuradius -= 1;
				if (this.menuradius < 0){
					this.menuradius = 0;
				}
			}
			this.ctx.strokeStyle = "white";
			this.ctx.fillStyle = "white";
			this.ctx.beginPath();
			this.ctx.arc((this.WIDTH/2), (this.HEIGHT/2) + 100, this.menuradius, 0, 2*Math.PI);
			this.ctx.fill();
			this.ctx.closePath();
			//console.log("Radius: " +this.menuradius);
			return;
		}
	 	// 3) HOW MUCH TIME HAS GONE BY?
	 	var dt = this.calculateDeltaTime();
	 	 
	 	// 4) UPDATE
	 	// move circles
		//this.moveCircles(dt);
		//this.checkForCollisions();
		//if circle leaves the screen
		if (this.circleHitLeftRight(this)){
			this.xSpeed *= -1;
			this.move(dt);
		}
		if (this.circleHitTopBottom(this)){
			this.ySpeed *= -1;
			this.move(dt);
		}
		
		// 5) DRAW	
		// i) draw background
		this.ctx.fillStyle = "black"; 
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 

		// ii) draw circles
		/*this.ctx.globalAlpha = 0.9;
		this.drawCircles(this.ctx);
		// iii) draw HUD
		this.ctx.globalAlpha = 1.0;
		this.drawHUD(this.ctx);
		*/

		if (this.gameState == this.GAME_STATE.BEGIN || this.gameState == this.GAME_STATE.ROUND_OVER){
			if (this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_UP] && this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_SHIFT]){
				this.totalScore ++;
				this.sound.playEffect();
			}
		}
		
		// iv) draw debug info
		if (this.debug){
			// draw dt in bottom right corner
			this.fillText(this.ctx, "dt: " + dt.toFixed(3), this.WIDTH - 150, this.HEIGHT - 10, "18pt courier", "white");
		}
		
		if (this.instruct){
			this.drawInstructScreen(this.ctx);
		}
		if (this.gameover){
			this.drawGameOverScreen(this.ctx);
		}
		if (this.game){
			this.ctx.drawImage(this.enemy.img, this.enemy.x, this.enemy.y, 80, 80);
			for (var i = 0; i < this.enemies.length; i++){
				var enemy = this.enemies[i];
				if (enemy.state){
					this.moveEnemy(enemy);
				}
				this.ctx.drawImage(enemy.img, enemy.x, enemy.y, 80, 80);
				if (this.player.state != "hurt"){
					this.checkForCollisions(enemy);
				}
				if (enemy.state == false){
					this.enemies.splice(i, 1);
					i --;
				}
			}
			if (this.player.state == "hurt"){
				this.player.hurttimer += 1;
					if (this.player.hurttimer > 120){
						this.player.hurttimer = 0;
						this.player.color = this.player.prevcolor;
						this.player.state = "alive";
				}
				console.log("Hurt Timer: " +this.player.hurttimer);
			}
			this.drawHUD(this.ctx);
			this.ctx.drawImage(this.player.img, this.player.x, this.player.y, 100, 100);
			this.ctx.beginPath();
			this.ctx.arc(this.player.x+50,this.player.y+50,75,0,2*Math.PI);
			this.ctx.strokeStyle = this.player.color;
			this.ctx.closePath();
			this.ctx.stroke();
		}
	},
	
	fillText: function(ctx, string, x, y, css, color) {
		ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	
	calculateDeltaTime: function(){
		var now,fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
	
	circleHitLeftRight: function (c){
		if (c.x <= c.radius || c.x >= this.WIDTH - c.radius){
			return true;
		}
	},
	
	circleHitTopBottom: function (c){
		if (c.y < c.radius || c.y > this.HEIGHT - c.radius){
			return true;
		}
	},
	
	makeCircles: function(num){
		var circleDraw = function(ctx){
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.fillStyle = this.fillStyle;
			ctx.fill();
			ctx.restore();
		};
		var circleMove = function(dt){
			this.x += this.xSpeed * this.speed * dt;
			this.y += this.ySpeed * this.speed * dt;
		};
		var array = [];
		for(var i=0; i < num; i++){
			var c = {};
			c.x = getRandom(this.CIRCLE.START_RADIUS*2, this.WIDTH - this.CIRCLE.START_RADIUS*2);
			c.y = getRandom(this.CIRCLE.START_RADIUS*2, this.HEIGHT - this.CIRCLE.START_RADIUS*2);
			c.radius = this.CIRCLE.START_RADIUS;
			var randomVector = getRandomUnitVector();
			c.xSpeed = randomVector.x;
			c.ySpeed = randomVector.y;
			c.speed = this.CIRCLE.MAX_SPEED;
			c.fillStyle = this.colors[i%this.colors.length];
			c.state = this.CIRCLE_STATE.NORMAL;
			c.lifetime = 0;
			c.draw = circleDraw;
			c.move = circleMove;
			var pulsar=new this.Emitter();
			pulsar.red=255;
			pulsar.green=Math.floor(getRandom(0,255));
			pulsar.blue=Math.floor(getRandom(0,255));
			pulsar.minXspeed=pulsar.minYspeed=-0.25;
			pulsar.maxXspeed=pulsar.maxYspeed=0.25;
			pulsar.lifetime=500;
			pulsar.expansionRate=0.05;
			pulsar.numParticles=100;//youcouldmakethissmaller!
			pulsar.xRange=1;
			pulsar.yRange=1;
			pulsar.useCircles=false;
			pulsar.useSquares=true;
			pulsar.createParticles({x:540,y:100});
			c.pulsar=pulsar;
			Object.seal(c);
			array.push(c);
		}
		return array;
	},
	
	drawCircles: function(ctx){
		if(this.gameState == this.GAME_STATE.ROUND_OVER) this.ctx.globalAlpha = 0.25;
		for(var i=0; i < this.circles.length; i++){
			var c = this.circles[i];
			if(c.state === this.CIRCLE_STATE.DONE) continue;
			c.draw(ctx);
			if(c.pulsar){
				c.pulsar.updateAndDraw(ctx,{x:c.x,y:c.y});
			}
		}
	},
	
	// moveCircles: function(dt){
	// 	for(var i=0;i<this.circles.length; i++){
	// 		var c = this.circles[i];
	// 		if(c.state === this.CIRCLE_STATE.DONE) continue;
	// 		if(c.state === this.CIRCLE_STATE.EXPLODING){
	// 			c.radius += this.CIRCLE.EXPLOSION_SPEED  * dt;
	// 			if (c.radius >= this.CIRCLE.MAX_RADIUS){
	// 				c.state = this.CIRCLE_STATE.MAX_SIZE;
	// 				console.log("circle #" + i + " hit CIRCLE.MAX_RADIUS");
	// 			}
	// 			continue;
	// 		}
		
	// 		if(c.state === this.CIRCLE_STATE.MAX_SIZE){
	// 			c.lifetime += dt; // lifetime is in seconds
	// 			if (c.lifetime >= this.CIRCLE.MAX_LIFETIME){
	// 				c.state = this.CIRCLE_STATE.IMPLODING;
	// 				console.log("circle #" + i + " hit CIRCLE.MAX_LIFETIME");
	// 			}
	// 			continue;
	// 		}
				
	// 		if(c.state === this.CIRCLE_STATE.IMPLODING){
	// 			c.radius -= this.CIRCLE.IMPLOSION_SPEED * dt;
	// 			if (c.radius <= this.CIRCLE.MIN_RADIUS){
	// 				console.log("circle #" + i + " hit CIRCLE.MIN_RADIUS and is gone");
	// 				c.state = this.CIRCLE_STATE.DONE;
	// 				continue;
	// 			}
			
	// 		}
		
	// 		// move circles
	// 		c.move(dt);
		
	// 		// did circles leave screen?
	// 		if(this.circleHitLeftRight(c)) c.xSpeed *= -1;
 	// 		if(this.circleHitTopBottom(c)) c.ySpeed *= -1;
	
	// 	} // end for loop
	// },
	
	drawMenuScreen: function(ctx){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaselibe - "middle";
		this.fillText(this.ctx, "Knockoffaruga", this.WIDTH/2, this.HEIGHT/2 - 200, "70pt courier", "white");
		this.fillText(this.ctx, "Hold mouse in the circle to start", this.WIDTH/2, this.HEIGHT/2 - 100, "40pt courier", "white");
		this.fillText(this.ctx, "Press 'e' to go to the instructions", this.WIDTH/2, this.HEIGHT/2 + 300, "30pt courier", "white");
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.arc((this.WIDTH/2), (this.HEIGHT/2) + 100, 100, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	},
	
	drawInstructScreen: function(ctx){
		console.log("Instructions: " +this.instruct);
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaselibe - "middle";
		this.fillText(this.ctx, "Instructions", this.WIDTH/2, this.HEIGHT/2 - 250, "70pt courier", "white");
		this.fillText(this.ctx, "Control the ship with the mouse", this.WIDTH/2, this.HEIGHT/2 - 150, "30pt courier", "white");
		this.fillText(this.ctx, "Match the color of your ship with incoming enemies to destroy them", this.WIDTH/2, this.HEIGHT/2 - 100, "30pt courier", "white");
		this.fillText(this.ctx, "Change color with the Q, W, E & R keys", this.WIDTH/2, this.HEIGHT/2 - 50, "30pt courier", "white");
		this.fillText(this.ctx, "Q -> Red", this.WIDTH/2 - 550, this.HEIGHT/2 + 50, "40pt courier", "red");
		this.fillText(this.ctx, "W -> Blue", this.WIDTH/2 - 200, this.HEIGHT/2 + 50, "40pt courier", "blue");
		this.fillText(this.ctx, "E -> Orange", this.WIDTH/2 + 170, this.HEIGHT/2 + 50, "40pt courier", "orange");
		this.fillText(this.ctx, "R -> Green", this.WIDTH/2 + 560, this.HEIGHT/2 + 50, "40pt courier", "green");
		this.fillText(this.ctx, "You have 3 lives", this.WIDTH/2, this.HEIGHT/2 + 150, "30pt courier", "white");
		this.fillText(this.ctx, "Increase your score by staying alive and destroying enemies", this.WIDTH/2, this.HEIGHT/2 + 200, "30pt courier", "white");
		this.fillText(this.ctx, "Press 'q' to return to the main menu", this.WIDTH/2, this.HEIGHT/2 + 300, "30pt courier", "white");
		ctx.restore();
	},
	
	drawPauseScreen: function(ctx){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaselibe - "middle";
		this.fillText(this.ctx, "... PAUSED ...", this.WIDTH/2, this.HEIGHT/2, "40pt courier", "white");
		ctx.restore();
	},
	
	drawGameOverScreen: function(ctx){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaselibe - "middle";
		this.fillText(this.ctx, "GAME OVER", this.WIDTH/2, this.HEIGHT/2, "70pt courier", "white");
		this.fillText(this.ctx, "Your score was: " +this.totalScore, this.WIDTH/2, this.HEIGHT/2 + 200, "40pt courier", "white");
		this.fillText(this.ctx, "Press 'q' to go back to the main menu", this.WIDTH/2, this.HEIGHT/2 + 300, "40pt courier", "white");
		ctx.restore();
	},
    
	// doMousedown: function(e){
	// 	this.sound.playBGAudio();
	// 	if (this.paused){
	// 		this.paused = false;
	// 		this.update();
	// 		return;
	// 	};
	// 	if(this.gameState == this.GAME_STATE.EXPLODING)return;
	// 	/*if(this.gameState == this.GAME_STATE.ROUND_OVER){
	// 		this.gameState = this.GAME_STATE.DEFAULT;
	// 		this.reset();
	// 		return;
	// 	}*/
	// 	console.log("e=" + e);
	// 	console.log("e.target=" + e.target);
	// 	console.log("this=" + this);
	// 	console.log("e.pageX=" +e.pageX);
	// 	console.log("e.pageY=" +e.pageY);
	// 	var mouse = getMouse(e);
	// 	console.log("(mouse.x, mouse.y)" + mouse.x + "," + mouse.y);
	// 	mouse = getMouse(e);
	// 	var rect = {x:295,y:215,width:50,height:50};
	// 	if(this.gameState == this.GAME_STATE.ROUND_OVER && rectangleContainsPoint(rect,mouse)){
	// 		console.log("YELLOW BYTTON PRESSED");
	// 		this.gameState = this.GAME_STATE.DEFAULT;
	// 		this.reset();
	// 		return;
	// 	}	
	// 	app.main.checkCircleClicked(mouse);
	// },
	
	// checkCircleClicked: function(mouse){
	// 	for(var i = this.circles.length-1; i >= 0; i-- ){
	// 		var c = this.circles[i];
	// 		if (pointInsideCircle(mouse.x, mouse.y, c)){
	// 			c.xSpeed = c.ySpeed = 0;
	// 			c.state = this.CIRCLE_STATE.EXPLODING;
	// 			this.gameState = this.GAME_STATE.EXPLODING;
	// 			this.roundScore ++;
	// 			this.sound.playEffect();
	// 			break;
	// 		}
	// 	}
	// },
		
	drawHUD: function(ctx){
		ctx.save(); // NEW
		// draw score
      	// fillText(string, x, y, css, color)
		var lives = this.player.lives +1;
		this.fillText(this.ctx, "Lives Remaining: " + lives + " of " + "3", 20, 20, "14pt courier", "#ddd");
		this.fillText(this.ctx, "Total Score: " + this.totalScore, this.WIDTH - 200, 20, "14pt courier", "#ddd");
		
		// if (this.gameState == this.GAME_STATE.DEFAULT){
		// 	document.querySelector("#button1").style.display = "none";
		// }
		
		// // NEW
		// if(this.gameState == this.GAME_STATE.BEGIN){
		// 	ctx.textAlign = "center";
		// 	ctx.textBaseline = "middle";
		// 	this.fillText(this.ctx, "To begin, click a circle", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "white");
		// 	document.querySelector("#button1").style.display = "none";
		// 	this.exhaust.updateAndDraw(this.ctx,{x:100,y:100});
		// 	this.pulsar.updateAndDraw(this.ctx,{x:540,y:100});
		// } // end if
	
		// // NEW
		// if(this.gameState == this.GAME_STATE.ROUND_OVER){
		// 	ctx.save();
		// 	ctx.textAlign = "center";
		// 	ctx.textBaseline = "middle";
		// 	this.fillText(this.ctx, "Round Over", this.WIDTH/2, this.HEIGHT/2 - 40, "30pt courier", "red");
		// 	this.fillText(this.ctx, "Click to continue", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "red");
		// 	this.fillText(this.ctx, "Next round there are " + (this.numCircles + 5) + " circles", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");
		// 	document.querySelector("#button1").style.display = "inline";
		// 	ctx.fillStyle = "yellow";
		// 	ctx.fillRect(295,215,50,50);
		// } // end if
		ctx.restore(); // NEW
	},
	
	
	checkForCollisions: function(enemy){
		var xdif = this.player.x - enemy.x;
		var ydif = this.player.y - enemy.y;
		var distance = Math.sqrt((xdif * xdif) + (ydif * ydif));
		if (distance < 125 && this.player.color == enemy.color){
			enemy.state = false;
			this.totalScore += 1;
			this.playEffect();
		}
		else if (distance < 125 && this.player.color != enemy.color){
			this.player.state = "hurt";
			this.player.lives -= 1;
			this.player.prevcolor = this.player.color;
			this.player.color = "white";
			this.playEffect();
		}
		if (this.player.lives < 0){
			this.game = false;
			this.gameover = true;
		}
	},
	
	pauseGame: function(){
		this.paused = true;
		cancelAnimationFrame(this.animationID);
		this.stopBGAudio();
		this.update();
	},
	
	resumeGame: function(){
		cancelAnimationFrame(this.animationID);
		this.paused = false;
		this.sound.playBGAudio();
		this.update();
	},
	
	stopBGAudio: function(){
		this.sound.stopBGAudio();
	},
	
	
	playEffect: function (){
		this.effectAudio.src = "media/" + this.effectSounds[this.currentEffect];
		this.effectAudio.play();
		
		this.currentEffect += this.currentDirection;
		if (this.currentEffect == this.effectSounds.length || this.currentEffect == -1){
			this.currentDirection *= -1;
			this.currentEffect += this.currentDirection;
		}
	},
	
	reset: function(){
		this.numCircles += 5;
		this.roundScore = 0;
		this.circles = this.makeCircles(this.numCircles);
	}
	
}; // end app.main