(function () {

	var canvas, ctx, tileSize = 10, Sprites;

	var dropCounter = 0, dropInterval = 110, lastUpdate = 0, delta;

	var snake, food, maze, game, screens, maze, container = document.getElementById('container');


	function createCanvas (w, h) {
		canvas = document.createElement('canvas');
		canvas.width  = w;
		canvas.height = h;
		canvas.textContent = 'navegador sem suporte';

		container.appendChild(canvas);

		ctx = canvas.getContext('2d');

		[Sprite.prototype.canvas, Sprite.prototype.canvasContext, Sprite.prototype.tileSize] = [canvas, ctx, tileSize];

		setInputs();

		setSprites();

		requestAnimationFrame(update, canvas);
	};


	function setSprites () {
		Sprites = {
			game: {
				splash: new Sprite(),
				over  : new Sprite()
			},

			snake: {
				head: {
					up:    new Sprite(snake_graphics, 193, 1, 61, 61),
					left:  new Sprite(snake_graphics, 193, 65, 61, 61),
					right: new Sprite(snake_graphics, 257, 1, 61, 61),
					down:  new Sprite(snake_graphics, 257, 65, 61, 61)
				},

				body: {
					vertical:   new Sprite(snake_graphics, 133, 66, 54, 53),
					horizontal: new Sprite(snake_graphics, 62, 5, 53, 54)
				},

				curve: {
					UL: new Sprite(snake_graphics, 133, 133, 53, 53), // Up Left
					UR: new Sprite(snake_graphics, 5, 69, 53, 53),    // Up Right
					DL: new Sprite(snake_graphics, 133, 5, 53, 53),   // Down Left
					DR: new Sprite(snake_graphics, 5, 5, 53, 53)      // Down Right
				},

				tail: {
					up:    new Sprite(snake_graphics, 197, 127, 53, 60),
					left:  new Sprite(snake_graphics, 191, 197, 60, 53),
					right: new Sprite(snake_graphics, 260, 133, 60, 53),
					down:  new Sprite(snake_graphics, 261, 196, 53, 60)
				}
			},

			food: {
				apple: new Sprite(snake_graphics, 3, 193, 57, 62)
			},

			wall: {
				white: new Sprite(maze_graphics, 3, 8, 61, 65)
			},

			heart: {
				full:  new Sprite(heart_graphics, 0, 15, 97, 87),
				empty: new Sprite(heart_graphics, 595, 15, 97, 87)
			}
		};

		maze = new mazeManager(allMazes, Sprites.wall, 0);

		game  = new Controller(
			new Score(Sprites.heart), new Screens(), maze
		);

		snake =	new Snake(
			ctx, tileSize, new Segment(Sprites.snake, canvas), game
		);

		food  = new Food(
			Sprites.food, snake
		);
	};


	function random (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};


	function clearCanvas (newColor = 'white') {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawRect(0, 0, canvas.width, canvas.height, newColor);
	};


	function drawRect (x, y, w, h, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	};


	function drawArc (x, y, r, color) {
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = color;
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.closePath();
		ctx.stroke();
	};


	function verticalGradient (xGrad, yGrad, wGrad, hGrad, xCan, yCan, wCan, hCan, colorSet) {
		var gradient = ctx.createLinearGradient(xGrad, yGrad, wGrad, hGrad);

		gradient.addColorStop(0, colorSet.beg);
		gradient.addColorStop(1, colorSet.end);

		drawRect(xCan, yCan, wCan, hCan, gradient);
	};


	function loadImage (...files) {
		for (var i = 0, len = files.length, images = []; i < len; i++) {
			var image = new Image();
			image.src = files[i];
			images.push(image);
		};
		
		return images;
	};


	function draw () {
		clearCanvas();

		[maze, food, snake, game.score].forEach(itens => itens.draw());

		if (game.over) {
			ctx.fillStyle = 'red';
			ctx.fillText('perdeu', 100, 100);
		};

		if (game.paused) {
			verticalGradient(0, 0, 0, canvas.height, 0, 0, canvas.width, canvas.height,
				{ beg: 'rgba(0, 0, 0, .2)', end: 'rgba(0, 0, 0, .8)' }
			);
			ctx.fillStyle = 'red';
			ctx.fillText('paused', 100, 100);
		};
	};


	function update (time = 0) {
		delta = time - lastUpdate, lastUpdate = time;
		
		dropCounter += delta;
		if (dropCounter >= dropInterval) {

			if (game.current === 'running') {
				if (!game.paused)
					[food, snake].forEach(itens => itens.update());
			};

			draw();

			dropCounter = 0;
		};

		requestAnimationFrame(update, canvas);
	};


	function clickCanvas (event) {
		// game.setGameState();
	};


	function keydownCanvas (event) {
		var keyCode = event.keyCode;

		switch (keyCode) {
			case 80: // P key
				game.togglePause();
				break;
			case 37:
			case 38:
			case 39:
			case 40:
				(!game.over && !game.paused) && snake.changeDirection(keyCode);
				break;
		};
	};


	function setInputs () {
		canvas.addEventListener('click', clickCanvas, false);
		document.addEventListener('keydown', keydownCanvas, false);
	};


	window.onload = createCanvas(480, 480);
	console.log(ctx);
} ());