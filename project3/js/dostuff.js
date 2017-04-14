	window.onload=init;
	 
     var svg, svg2, player, enemy, scoreElement, difficulty, score, combo, playersprite;
	 var combomult;
	 var gamestate;
	 var hiscore;
	 var blockers = [];
	 var spawnrate;
	 var speed;
     var run;
	 var audio;
	 
	 function init(){
		audio = new Audio('audio/music.mp3');
		audio.volume = 0.05;
		audio.play();
		xmlns = 'http://www.w3.org/2000/svg';
		gamestate = 0;
		speed = 5;
		spawnrate = 500;
		if (localStorage.getItem("HighScore") > hiscore){
			hiscore = localStorage.getItem("HighScore");
		}
		combomult = 1;
        score = 0;
		svg3 = document.querySelector('#gameover');
		svg2 = document.querySelector( '#menu1' );
		svg = document.querySelector( '#game' );
		playersprite = svg.children[0];
        player = svg.children[ 1];
        scoreElement = svg.children[2];
		difficulty = svg.children[3];
		combo = svg.children[4];
		this.addEventListener('keydown', changeState );
	 }
	 
     function init2(){
        window.addEventListener( 'mousemove', hitTest );
		//window.addEventListener( 'collision', hitTest );
		this.addEventListener('keydown', keyDown );
		run = setInterval(runGame1, 500);
	}
	
	function changeState(e){
		//if press space when in menu
		if (e.keyCode == 32 && gamestate == 0){
			//game start
			console.log("menu change");
			gamestate = 1;
			svg2.classList.toggle("menuoff");
			document.querySelector("#startbutton").classList.toggle("menuoff");
			document.querySelector("#instructions").classList.toggle("menuoff");
			svg.classList.toggle("gameoff");
			init2();	
		}
		if (e.keyCode == 69 && gamestate == 0){
			gamestate = 2;
			document.querySelector("#Title").classList.toggle("menuoff");
			document.querySelector("#startbutton").classList.toggle("menuoff");
			document.querySelector("#instructions").classList.toggle("menuoff");
			document.querySelector("#Instructions").classList.toggle("menuoff");
			document.querySelector("#howtoplay1").classList.toggle("menuoff");
			document.querySelector("#gotomain2").classList.toggle("menuoff");
			
		}
		if (e.keyCode == 32 && gamestate == 2){
			document.querySelector("#Title").classList.toggle("menuoff");
			document.querySelector("#startbutton").classList.toggle("menuoff");
			document.querySelector("#instructions").classList.toggle("menuoff");
			document.querySelector("#Instructions").classList.toggle("menuoff");
			document.querySelector("#howtoplay1").classList.toggle("menuoff");
			document.querySelector("#gotomain2").classList.toggle("menuoff");
			gamestate = 0;
		}
		if (e.keyCode == 32 && gamestate == 4){
			reset();
		}
		if (e.keyCode == 17 && gamestate == 1){
			gamestate = -1;
		}
		else if (e.keyCode == 17 && gamestate == -1){
			gamestate = 1;
		}
	}
	
	function keyDown( e ){
		if (e.keyCode == 81){
			//q pressed
			console.log("q pressed");
			removeColors();
			player.classList.add("blueplayer");
			console.log(document.getElementById("player").className);
			
		}
		if (e.keyCode == 87){
			//w pressed
			console.log("w pressed");
			removeColors();
			player.classList.add("redplayer");
			console.log(document.getElementById("player").className);
		}
		if (e.keyCode == 69){
			//e pressed
			console.log("e pressed");
			removeColors();
			player.classList.add("greenplayer");
			console.log(document.getElementById("player").className);
		}
		if (e.keyCode == 82){
			//r pressed
			console.log("r pressed");
			removeColors();
			player.classList.add("orangeplayer");
			console.log(document.getElementById("player").className);
		}
	}
	
	function removeColors(){
		if (player.classList.contains("blueplayer")){
			player.classList.remove("blueplayer");
		}
		if (player.classList.contains("redplayer")){
			player.classList.remove("redplayer");
		}
		if (player.classList.contains("greenplayer")){
			player.classList.remove("greenplayer");
		}
		if (player.classList.contains("orangeplayer")){
			player.classList.remove("orangeplayer");
		}
	}
	
    function destroyEnemy() {
      combomult += .1;
	  combo.textContent = "Combo: " + combomult + "x";
      scoreElement.textContent = 'Score: ' + score;
    }
    
    function hitTest( e ) {
		player.setAttribute( 'cx', e.clientX + 'px' );
		player.setAttribute( 'cy', e.clientY + 'px' );
      
      // bounding boxes
      var playerBox = player.getBBox();
       
	  for ( var i = 0; i < blockers.length; i++){
		var blockBox = blockers[i].getBBox();
			if( playerBox.x + playerBox.width >= blockBox.x && playerBox.x < blockBox.x + blockBox.width ) { // horizontal hit
				if( playerBox.y + playerBox.height >= blockBox.y && playerBox.y < blockBox.y + blockBox.height ) { // vertical hit
					if (sameColors(blockers[i])){
						scoreElement.textContent = 'Score: ' + score;
						destroyBlocker(blockers[i]);
						combomult += .1;
						combomult = Math.round(combomult * 100) / 100;
						combo.textContent = "Combo: " + combomult + "x";
					}
					else{
						gamestate = 4;
						if (localStorage.getItem("HighScore") < score){
							localStorage.setItem("HighScore", score);
						}
						clearInterval(run);
						svg.classList.toggle("gameoff");
						svg2.classList.toggle("menuoff");
						document.querySelector("#Title").classList.toggle("menuoff");
						document.querySelector("#GameOverTitle").classList.toggle("menuoff");
						document.querySelector("#hiscore").classList.toggle("menuoff");
						document.querySelector("#hiscore").textContent = "High Score: " +localStorage.getItem("HighScore");
						document.querySelector("#gotomain").classList.toggle("menuoff");
					}
				}
			}
		}
    }
    
	function sameColors(blocker){
		if (player.classList.contains("blueplayer") && blocker.classList.contains("blueenemy")){
			return true;
		}
		else if (player.classList.contains("redplayer") && blocker.classList.contains("redenemy")){
			return true;
		}
		else if (player.classList.contains("greenplayer") && blocker.classList.contains("greenenemy")){
			return true;
		}
		else if (player.classList.contains("orangeplayer") && blocker.classList.contains("orangeenemy")){
			return true;
		}
		else {
			return false;
		}
	}
	
	/*
		Creates a new rectangle object and pushes it onto the
		rectangle array
	*/
	function createBlocker() {
		var side = document.createAttribute("side");
		side.value = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
		var rect = document.createElementNS( xmlns, 'rect' );
		rect.setAttributeNode(side);
		if (side.value == 1){
			rect.setAttribute( 'x' , Math.random() * window.innerWidth );
			rect.setAttribute( 'y' ,  0 );
		}
		if (side.value == 2){
			rect.setAttribute( 'x' , window.innerWidth - 75);
			rect.setAttribute( 'y' ,  Math.random() * window.innerHeight );
		}
		if (side.value == 3){
			rect.setAttribute( 'x' , Math.random() * window.innerWidth );
			rect.setAttribute( 'y' ,  window.innerHeight - 75);
		}
		if (side.value == 4){
			rect.setAttribute( 'x' , 0);
			rect.setAttribute( 'y' ,  Math.random() * window.innerHeight );
		}
		rect.setAttribute( 'width' , 75);
		rect.setAttribute( 'height' , 75);
		var rndm = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
		rect.speed = speed;
		console.log(rndm);
		if (rndm == 1){
			rect.classList.add("blueenemy");
		}
		if (rndm == 2){
			rect.classList.add("redenemy");
		}
		if (rndm == 3){
			rect.classList.add("greenenemy");
		}
		if (rndm == 4){
			rect.classList.add("orangeenemy");
		}
		blockers.push(rect);
    }
	
	/*
		Iterates through every element in the array and appends it 
		as a child of the svg scene
	*/
	function spawnBlockers () {
		for (var i = 0; i < blockers.length; i++){
			svg.appendChild( blockers[ i ] );
		}
		spawnrate += 5;
		score += (5 * combomult);
		scoreElement.textContent = 'Score: ' + score;
	}
	
	function moveRect( rect ){
		var x = parseFloat( rect.getAttribute( 'x' ) );
		var y = parseFloat( rect.getAttribute( 'y' ) );
		if (rect.getAttribute("side") == 1){
			y += rect.speed;
			if (y > window.innerHeight){
				destroyBlocker(rect);
			}
		}
		if (rect.getAttribute("side") == 2){
			x -= rect.speed;
			if (x < 0 - 50){
				destroyBlocker(rect);
			}
		}
		if (rect.getAttribute("side") == 3){
			y -= rect.speed;
			if (y < 0 - 50){
				destroyBlocker(rect);
			}
		}
		if (rect.getAttribute("side") == 4){
			x += rect.speed;
			if (x > window.innerWidth){
				destroyBlocker(rect);
			}
		}
		rect.setAttribute( 'x', x );
		rect.setAttribute( 'y', y );
	}
	
	function destroyBlocker(rect){
		var blockindex = blockers.indexOf(rect);
		blockers.splice(blockindex, 1);
		for (var i = 5; i < svg.children.length; i++){
			if (svg.children[i] == rect){
				svg.children[i].remove();
				console.log("removed once");
			}
		}
	}
	
	function reset(){
		clearInterval(run);
		blockers = [];
		combomult = 1;
		combo.textContent = "Combo: " + combomult + "x";
		score = 0;
		speed = 5;
		spawnrate = 500;
		scoreElement.textContent = 'Score: ' + score;
		var ln = svg.children.length;
		for (var i = 5; i < ln; i++){
			svg.children[5].remove();
		}
		removeColors();
		player.classList.toggle("blueplayer");
		gamestate = 0;
		document.querySelector("#Title").classList.toggle("menuoff");
		document.querySelector("#GameOverTitle").classList.toggle("menuoff");
		document.querySelector("#hiscore").classList.toggle("menuoff");
		document.querySelector("#gotomain").classList.toggle("menuoff");
		document.querySelector("#startbutton").classList.toggle("menuoff");
		document.querySelector("#instructions").classList.toggle("menuoff");
	}
	
	function runGame1(){
		difficulty.textContent = "Diff: Easy";
		scoreElement.textContent = 'Score: ' + score;
		console.log("easy");
		if (gamestate == 1 && spawnrate < 600){
			createBlocker();
			spawnBlockers();
		}
		else {
			console.log("next");
			clearInterval(run);
			run = setInterval(runGame2, 400);
		}
	}
	
	function runGame2(){
		difficulty.textContent = "Diff: Normal";
		scoreElement.textContent = 'Score: ' + score;
		console.log("normal");
		if (gamestate == 1 && spawnrate < 700){
			createBlocker();
			spawnBlockers();
		}
		else {
			console.log("next");
			clearInterval(run);
			run = setInterval(runGame3, 300);
		}
	}
	
	function runGame3(){
		difficulty.textContent = "Diff: Hard";
		if (gamestate == 1 && spawnrate < 800){
			createBlocker();
			spawnBlockers();
		}
		else {
			console.log("next");
			clearInterval(run);
			run = setInterval(runGame4, 200);
		}
	}
	
	function runGame4(){
		difficulty.textContent = "Diff: Very Hard";
		if (gamestate == 1 && spawnrate < 900){
			createBlocker();
			spawnBlockers();
		}
		else {
			console.log("next");
			clearInterval(run);
			run = setInterval(runGame5, 150);
		}
	}
	
	function runGame5(){
		difficulty.textContent = "Diff: Hardest";
		if (gamestate == 1){
			createBlocker();
			spawnBlockers();
		}
	}
	
	setInterval( function() {
		if (gamestate == 1){
		blockers.forEach( moveRect );}
	}, 1000 / 60 );
	