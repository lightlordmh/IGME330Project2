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
	enemytimer: 0,
	enemylimit: 120,

	//game state properties
	menu: true,
	game: false,
	paused: false,
	gameover: false,
	instruct: false,
	animationID: 0,

	sound: undefined,
	difficulty: undefined,
	
    // methods
	init : function() {
		console.log("app.main.init() called");

		// initialize properties
		this.mouseX = 0;
		this.mouseY = 0;
		this.menuradius = 0;
		this.totalScore = 0;
		this.enemies = [];
		this.enemytimer = 0;
		this.enemylimit = 120;
		this.difficulty = "Easy";
		for (var i = 0; i < 10; i ++){
			this.enemies.push(new this.Enemy(this.WIDTH, this.HEIGHT));
		}

		//setup the canvas
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');

		//setup the player
		this.player = new this.Player(this.WIDTH, this.HEIGHT); 
		this.canvas.addEventListener("mousemove", this.player.movePlayer); //link the mouse to the player moving 

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
		this.pulsar.numParticles=0;
		this.pulsar.xRange=1;
		this.pulsar.yRange=1;
		this.pulsar.useCircles=false;
		this.pulsar.useSquares=true;
		this.pulsar.createParticles({x:540,y:100});
		
		// start the game loop
		this.canvas.onmousemove = this.movePlayer.bind(this);
		this.update();
	},

	// gets the mouse position and move the player to it
	movePlayer: function(e){
		var mouse = getMouse(e);
		this.mouseX = mouse.x;
		this.mouseY = mouse.y;
		this.player.x = mouse.x-50;
		this.player.y = mouse.y-50;
	},
	
	//Function constructor for the Player 
	Player: function(width, height){

		//the players start location
		this.x = width/2;
		this.y = height/2;

		//setup the player's image, color, state, lives, damage timer, and previous color
		this.img = new Image();
		this.img.src = 'media/redship.png';
		this.color = "red";
		this.state = "alive";
		this.lives = 2;
		this.hurttimer = 0;
		this.prevcolor = this.color;
	},
	
	//moves an enemy based its side
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
	
	//Function constructor for an enemies
	//sets up the enemy
	Enemy: function(width, height){

		//randomly selects a side and color for the enemy
		this.side = Math.floor((Math.random()*4)+1); //return a random num between 1 & 4
		this.colornum = Math.floor((Math.random()*4)+1); //return a random num between 1 & 4
		
		//set up the state and image for the enemy
		this.state = true;
		this.img = new Image();
<<<<<<< HEAD
		var pulsar=new app.Emitter();
		pulsar.red=255;
		pulsar.green=Math.floor(getRandom(0,255));
		pulsar.blue=Math.floor(getRandom(0,255));
		pulsar.minXspeed=pulsar.minYspeed=-0.25;
		pulsar.maxXspeed=pulsar.maxYspeed=0.25;
		pulsar.lifetime=500;
		pulsar.expansionRate=0.05;
		pulsar.numParticles=10;//youcouldmakethissmaller!
		pulsar.xRange=1;
		pulsar.yRange=1;
		pulsar.useCircles=true;
		pulsar.useSquares=false;
		pulsar.createParticles({x:540,y:100});
		this.pulsar=pulsar;
=======
		
		//based on the side pick a random position for the enemy to start at
>>>>>>> 8ecc5b6517d1077304a987eb809923af14a5cc04
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

		//based on the color number picked set the enemies color and image
		if (this.colornum == 1){
			this.color = "red";
			this.img.src = 'media/redenemy.png';
		}
		if (this.colornum == 2){
			this.color = "blue";
			this.img.src = 'media/blueenemy.png';
		}
		if (this.colornum == 3){
			this.color = "orange";
			this.img.src = 'media/orangeenemy.png';
		}
		if (this.colornum == 4){
			this.color = "green";
			this.img.src = 'media/greenenemy.png';
		}
	},
	
	//Main game loop
	update: function(){

		// schedule a call to update()
	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	
	 	// if paused exit game loop
	 	if (this.paused){
			this.drawPauseScreen(this.ctx);
			return;
		}

		// if in the menu draw the menu screen
		if (this.menu){
			this.drawMenuScreen(this.ctx);
			var xdif = (this.mouseX-(this.WIDTH/2));
			var ydif = (this.mouseY-(this.HEIGHT/2 + 100));
			var distance = Math.sqrt((xdif*xdif) +(ydif*ydif));

			//if player is in the start circle expand the inner circle 
			if (distance < 100){
				this.menuradius += 1;

				//if the inner circle is at max then switch to the game and play background music
				if (this.menuradius > 100){
					this.menuradius = 0;
					this.menu = false;
					this.game = true;
					this.sound.playBGAudio();
				}
			}

			//if the player is not in the start circle decrease the inner circle until it is at 0
			else{
				this.menuradius -= 1;
				if (this.menuradius < 0){
					this.menuradius = 0;
				}
			}
			//setup the inner circle styles and draw it
			this.ctx.strokeStyle = "white";
			this.ctx.fillStyle = "white";
			this.ctx.beginPath();
			this.ctx.arc((this.WIDTH/2), (this.HEIGHT/2) + 100, this.menuradius, 0, 2*Math.PI);
			this.ctx.fill();
			this.ctx.closePath();
			return;
		}

		//draw background
		this.ctx.fillStyle = "black"; 
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 
		
		//if the current state is the instruction state draw that screen
		if (this.instruct){
			this.drawInstructScreen(this.ctx);
		}

		//if the current state is the game over state draw that to the screen
		if (this.gameover){
			this.drawGameOverScreen(this.ctx);
		}

		//if the current state is the game state 
		if (this.game){

			//based on the total score set the difficulty and enemylimit
			if (this.totalScore > 10){
				this.difficulty = "Normal";
				this.enemylimit = 60;
			}
			if (this.totalScore > 20){
				this.difficulty = "Hard";
				this.enemylimit = 45;
			}
			if (this.totalScore > 35){
				this.difficulty = "Very Hard";
				this.enemylimit = 30;
			}
			if (this.totalScore > 50){
				this.difficulty = "Insane";
				this.enemylimit = 15;
			}
			//spawn new enemies
			if (this.enemytimer > this.enemylimit){
				this.enemies.push(new this.Enemy(this.WIDTH, this.HEIGHT));
				this.enemytimer = 0;
			}

			//move the enemies, draw them, and remove them if they are dead
			for (var i = 0; i < this.enemies.length; i++){
				var enemy = this.enemies[i];
				//move enemies
				if (enemy.state){
					this.moveEnemy(enemy);
					if(enemy.pulsar){
						enemy.pulsar.updateAndDraw(this.ctx,{x:enemy.x+40,y:enemy.y+40});
			}
				}
				this.ctx.drawImage(enemy.img, enemy.x, enemy.y, 80, 80);
				//if the player is not hurt check for collision
				if (this.player.state != "hurt"){
					this.checkForCollisions(enemy);
				}
				//if the enemy is dead remove it from the list of enemies
				if (enemy.state == false){
					this.enemies.splice(i, 1);
					i --;
				}
			}

			//increment  player's hurt timer and change his color to indicate hurt
			if (this.player.state == "hurt"){
				this.player.hurttimer += 1;
					if (this.player.hurttimer > 120){
						this.player.hurttimer = 0;
						this.player.color = this.player.prevcolor;
						this.player.state = "alive";
				}
			}
			//draw the ui, player, and player border
			this.drawHUD(this.ctx);
			this.ctx.drawImage(this.player.img, this.player.x, this.player.y, 100, 100);
			this.ctx.beginPath();
			this.ctx.arc(this.player.x+50,this.player.y+50,75,0,2*Math.PI);
			this.ctx.strokeStyle = this.player.color;
			this.ctx.closePath();
			this.ctx.stroke();
			this.enemytimer ++;
		}
	},
	//from boomshine
	fillText: function(ctx, string, x, y, css, color) {
		ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	//from boomshine
	calculateDeltaTime: function(){
		var now,fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
	
	//draws the menu to the screen
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
	
	//draw the instructions to the screen
	drawInstructScreen: function(ctx){
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
	
	//draws the pause message to the screen
	drawPauseScreen: function(ctx){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaselibe - "middle";
		this.fillText(this.ctx, "... PAUSED ...", this.WIDTH/2, this.HEIGHT/2, "40pt courier", "white");
		ctx.restore();
	},
	
	//draws the game over screen
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

	//draws the HUD to the sceen	
	drawHUD: function(ctx){
		ctx.save(); // NEW

		var lives = this.player.lives +1;
		this.fillText(this.ctx, "Lives Remaining: " + lives + " of " + "3", 20, 20, "20pt courier", "#ddd");
		this.fillText(this.ctx, "Total Score: " + this.totalScore, this.WIDTH - 250, 20, "20pt courier", "#ddd");
		this.fillText(this.ctx, "Difficulty: " + this.difficulty , 20, 60, "20pt courier", "#ddd");
		
		ctx.restore(); // NEW
	},
	
	//checks for collision between the player and a given enemy
	checkForCollisions: function(enemy){
		var xdif = this.player.x - enemy.x;
		var ydif = this.player.y - enemy.y;
		var distance = Math.sqrt((xdif * xdif) + (ydif * ydif));

		// if the enemey and player are the same color kill the enemy, player a sound effect and give the player a point
		if (distance < 125 && this.player.color == enemy.color){
			this.sound.playEffect();
			enemy.state = false;
			this.totalScore += 1;
			this.sound.playEffect();
		}
		//if the enemy and player are different colors hurt the player and remove one life from the player and play a sound effect
		else if (distance < 125 && this.player.color != enemy.color){
			this.player.state = "hurt";
			this.player.lives -= 1;
			this.player.prevcolor = this.player.color;
			this.player.color = "white";
			this.sound.playEffect();
		}
		//if the player is dead end the game
		if (this.player.lives < 0){
			this.game = false;
			this.gameover = true;
		}
	},
	//from boomshine
	//pauses the game and audio
	pauseGame: function(){
		this.paused = true;
		cancelAnimationFrame(this.animationID);
		this.stopBGAudio();
		this.update();
	},
	//from boomshine
	//resumes the game and audio
	resumeGame: function(){
		cancelAnimationFrame(this.animationID);
		this.paused = false;
		this.sound.playBGAudio();
		this.update();
	},
	//stops the background audio
	stopBGAudio: function(){
		this.sound.stopBGAudio();
	},

	
}; // end app.main