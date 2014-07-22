
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
	var registry = new Registry();
	registry.add('app',this);

	this.width = width;
	this.height = height;

	this.wrapper = $('wrapper');
	
	this.offsetTop = this.wrapper.offsetTop;
	this.offsetLeft = this.wrapper.offsetLeft;

	this.layers = {
		back:   new Layer( $('back'), width, height, 1),
		effect:  new Layer( $('effect'), width, height, 2),
		grab:  new Layer( $('grab'), width, height, 4),
		boxes:  new Layer( $('boxes'), width, height, 3),
		objects:  new Layer( $('objects'), width, height, 8),
	};
	
	//Iages and tiles used in game
	this.images = {
		back: $('img-back'),
		grab: $('img-grab'),
		box: $('img-box'),
		arrows: {
			right: $('img-right'),
			left:  $('img-left'),
			up:    $('img-up')
		}
	};

	//YOU CAN KEEP LINKS TO SOUND HERE
	this.sounds = {
		//zap: $('audio-electro')
	};
	

	this.grab = new Grab(this.layers.grab, this.images.grab, 450);

	

	this.clickables.push(
		registry.add('l_arrow',   new Arrow('left') ),
		registry.add('r_arrow',   new Arrow('right') ),
		registry.add('up_button', new GrabButton() )
	);


	this.addListeners();	

	this.drawBackground();

	this.draw();

	this.animate();

	/*
	var duration = this.sounds.zap.duration;
	this.sounds.zap.addEventListener('timeupdate', function() {

		if(this.currentTime > 0.4)
		{	
			this.currentTime = 0;
	    	this.play();
		}
	    
	}, false);
	this.sounds.zap.play()*/
}

Game.prototype = {

	activePoint: {
		x:0, y:0
	},

	MOUSE_HOLDED: false,

	up:true,

	clickables: [],

	animate: function()
	{
		if (this.update())
		{
			this.draw();
		}

		requestAnimationFrame(function(){
			this.animate();
		}.bind(this));
	},

	click: function()
	{
		var reg = new Registry();
		var obj;
		for(var i = 0; i < this.clickables; i++)
		{
			obj = reg.get(this.clickables[i]);
			if (obj.isClicked(this.activePoint))
			{
				obj.click();
			}
		}

		if (this.activePoint.x > 450)
		{
			if (this.grab.speed <= 0)
			{
				this.grab.moveRight();	
			}
			else
			{
				this.grab.stop();	
			}
		} 
		else 
		{
			if (this.grab.speed >= 0)
			{
				this.grab.moveLeft();	
			}
			else
			{
				this.grab.stop();	
			}
			
		}
	},


	update: function()
	{

		var needRedraw = false;

		if(this.grab.update())
		{
			needRedraw = true;
		}

		return needRedraw;
	},

	draw: function()
	{

		this.drawArrows();

		this.drawGrab();

	},

	drawGrab: function()
	{
		this.grab.draw();
	},

	drawBackground: function()
	{
		
		this.layers.back.drawImage(
			this.images.back,
			0,0,
			//300,168,
			// /0,0,
			this.width, this.height
		);

	},


	drawArrows: function()
	{
		this.layers.objects.empty();

		this.layers.objects.drawImage(
			this.images.arrows.left,
			5,5
		);

		this.layers.objects.drawImage(
			this.images.arrows.right,
			this.width - 64 - 5, 5
		);

	},

	drawBox: function()
	{
		this.layers.boxes.empty();
		this.layers.boxes.drawImage(
			this.images.box,
			0,0,
			100,100,
			this.boxX,this.boxY,
			100,100
		);
	},

	drawTile: function(x,y,tile)
	{
		this.layers.squares.drawImage(
			this.images.tiles,
			100 * tile.color, 0,
			100, 100,
			x, y,
			55, 55
		);
	},

	addListeners: function()
	{	
		
		this.wrapper.addEventListener('mousedown',function(e) {
			this.updateActivePoint(e);
			
		}.bind(this));

		//Touch events
		this.wrapper.addEventListener('touchstart',function(e) {
			this.updateActivePoint(e.touches[0]);
		}.bind(this));


		window.addEventListener('resize', function(){
			this.onResize();
		}.bind(this), false);

		window.addEventListener('orientationchange', function(){
			this.onResize();
		}.bind(this), false);

		//Fullscren button click
		this.wrapper.addEventListener('click',function(e){
			
		}.bind(this));

	},

	updateActivePoint: function(e)
	{
		//Calculate ratio to allow resize canvas and keep track right mouse position related canvas
		var ratioX = this.wrapper.clientWidth / this.width;
		var ratioY = this.wrapper.clientHeight / this.height;
		this.activePoint.x =  Math.floor( (e.pageX - this.offsetLeft) / ratioX);
		this.activePoint.y =  Math.floor( (e.pageY - this.offsetTop)  / ratioY);
		this.click();
	},

	onResize: function()
	{

		
		this.offsetTop = this.wrapper.offsetTop;
		this.offsetLeft = this.wrapper.offsetLeft;

	},

};