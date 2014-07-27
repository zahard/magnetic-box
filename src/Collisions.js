window.onload = function()
{
	window.game = new Game(900,640);

	//Fix android browsers bug
	setTimeout(function(){
		//game.onResize();
	},100)
}

function Game(width, height)
{
	Registry.add('app',this);

	this.width = width;
	this.height = height;

	this.wrapper = $('wrapper');

	this.layers = {
		back:    new Layer( $('back'), width, height, 1),
		boxes:   new Layer( $('boxes'), width, height, 4),
		points:   new Layer( $('points'), width, height, 5)
	};

	//'#82B0E4'
	var c = this.layers.boxes;

	var ang = 15;

	this.boxes = [
		//new Vertaxis.Box(c, 155, 405, 150, 150, -20),
		new Vertaxis.Box(c, 240, 50, 100, 100, 0),	
		new Vertaxis.Box(c, 450, 400, 400, 50, 0),
		//new Vertaxis.Triangle(c, 450, 0, 120, 180)
		//Registry.add(new Box(150, 150, 70))
	];

	this.frameRate = 1000/40;

	//402717088

	window.b1 = this.boxes[0];
	window.b2 = this.boxes[1];
	//window.t1 = this.boxes[2];
	
	//window.c2 = this.boxes[2];
	//window.c3 = this.boxes[3];
	//window.c4 = this.boxes[4];

	this.drawBackground();

	this.drawBoxes();

	//console.log( t1.collideWith(c1) )
	//console.log( b1.collideWith(c2) )
	//console.log( b1.collideWith(c3) )
	//console.log( b1.collideWith(c4) )


	b1.acc = 1.5;
	b1.speed = 0;

	this.animate();
}

Game.prototype = {
	update: function()
	{

		if (b1.speed || b1.acc)
		{
			b1.speed += b1.acc;
			var old_y = b1.y;
			var old_x = b1.x;
			
			b1.move(0,b1.speed);
			if( ! b1.collideWith(b2) )
			{
				return true
			}
			else
			{
				b1.moveTo(old_x,old_y);
				this.moveClose(b1, b1.lastCollision.shape, b1.speed);
				b1.speed = 0;
				b1.acc = 0;
				return true;
			}
		}

		if (b1.tangAcc || b1.tangSpeed)
		{
			b1.tangSpeed += b1.tangAcc;
			
			if( Math.abs(b1.tangSpeed) > 10)
			{
				b1.tangSpeed = Vertaxis.Math.sign(b1.tangSpeed) * 10;
			}

			var speed = Vertaxis.Math.rad(b1.tangSpeed)

			var old_y = b1.y;
			var old_x = b1.x;
			var old_angle = b1.angle;

			b1.rotateAroundPoint(speed, b1.rotationPoint,true);

			if( ! b1.collideWith(b1.lastCollision.shape) )
			{
				return true
			}
			else
			{
				b1.moveTo(old_x,old_y,old_angle);
				this.rotateClose(b1, b1.lastCollision.shape, b1.tangSpeed);
				b1.tangSpeed = 0;
				b1.tangAcc = 0;
				return true;
			}

			return true;
		}

		return false;
	},

	moveClose: function(b1,b2,speed)
	{
		console.log('Plane impact found');

		var old_y = b1.y;
		var old_x = b1.x;

		for(var s = speed-1; s > 0; s--)
		{
			b1.move(0,s);
			if (b1.collideWith(b2)) 
			{
				b1.moveTo(old_x, old_y);
			}
			else
			{
				b1.impact(b2);
				return true;
			}
		}

		//If we cant move closer - leave it on its posistion
		b1.impact(b2);
	},

	rotateClose: function(b1,b2,speed)
	{
		console.log('Tangensial impact found');
		var old_angle = b1.angle;
		var old_x = b1.x;
		var old_y = b1.y;
		var sign = Vertaxis.Math.sign(speed);
		var speed  = Math.abs(speed);


		for(var s = speed-1; s > 0; s -= 1)
		{
			var sr = Vertaxis.Math.rad(s);

			b1.rotateAroundPoint(sign * sr, b1.rotationPoint);

			var isCollided = b1.collideWith(b2);
			if (isCollided)
			{
				//Move back to old position
				b1.moveTo(old_x,old_y,old_angle);
			}
			else
			{
				b1.impact(b2);
				return true;
			}
		}

		b1.impact(b2);

	},

	animate: function(){
		if (this.update())
		{
			this.drawBoxes();
		}
		//requestAnimationFrame
		setTimeout(function(){
			this.animate();
		}.bind(this),this.frameRate)

	},

	drawBoxes: function()
	{
		this.layers.boxes.empty();

		for (var i =0; i< this.boxes.length;i++)
		{
			this.boxes[i].draw();
		}
	},

	drawBackground: function()
	{
		this.layers.back
			.set('fillStyle','#223769')
			.set('strokeStyle','#284177')
			.fillRect(0,0,this.width,this.height)
			.beginPath();

		for(var x = 49; x < this.width; x += 50)
		{
			this.layers.back
				.moveTo(x, 0)
				.lineTo(x, this.height)
				.stroke();
		}

		for(var y = 49; y < this.height; y += 50)
		{
			this.layers.back
				.moveTo(0, y)
				.lineTo(this.width, y)
				.stroke();
		}

	}
}