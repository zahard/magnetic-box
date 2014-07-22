
window.onload = function()
{
	window.game = new Game(800,600);

	//Fix android browsers bug
	setTimeout(function(){
		//game.onResize();
	},100)
}

function Game(width, height)
{
	this.width = width;
	this.height = height;

	this.wrapper = $('wrapper');
	
	this.offsetTop = this.wrapper.offsetTop;
	this.offsetLeft = this.wrapper.offsetLeft;

	this.layers = {
		back:   new Layer( $('back'), width, height, 1),
		effect:  new Layer( $('effect'), width, height, 2),
		boxes:  new Layer( $('boxes'), width, height, 3)
	};
	
	//Iages and tiles used in game
	this.images = {
		back: $('img-back'),
		grab: $('img-grab'),
		box: $('img-box')
	};

	//YOU CAN KEEP LINKS TO SOUND HERE
	this.sounds = {
		zap: $('audio-electro')
	};
	
	this.addListeners();	

	this.drawBackground();

	this.boxY = 500;
	this.boxX = 205;

	this.l1 = new Lightning( this.layers.effect,
		{x:215,y:70},
		{x:this.boxX+50,y:this.boxY}
	);

	this.l2 = new Lightning( this.layers.effect,
		{x:295,y:70},
		{x:this.boxX+50,y:this.boxY}
	);

	this.animate();

	var duration = this.sounds.zap.duration;
	this.sounds.zap.addEventListener('timeupdate', function() {

		if(this.currentTime > 0.4)
		{	
			this.currentTime = 0;
	    	this.play();
		}
	    
	}, false);

	this.sounds.zap.play();
}

Game.prototype = {

	activePoint: {
		x:0, y:0
	},

	MOUSE_HOLDED: false,

	up:true,

	animate: function()
	{
		if(this.up)
		{
			if (this.boxY > 90)
			{
				this.boxY -= 4;
			}else{
				this.up = false;
			}
		}else{
			if (this.boxY < 500)
			{
				this.boxY += 7;
			}else{
				this.up = true;
			}
		}
		

		this.drawBox();

		this.l1.pb.y = this.boxY;
		this.l2.pb.y = this.boxY;

		this.l1.clear();
		this.l1.boom();
		this.l2.boom();

		setTimeout(function(){
			this.animate();
		}.bind(this),1000/60);
	},

	click: function(){
		console.log(this.activePoint)
	},


	update: function()
	{

		var needRedraw = false;
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

		this.layers.back.drawImage(
			this.images.grab,
			0,0,
			400,140,
			200,10,
			300,100
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

	draw: function()
	{
		var tile;
		this.layers.squares.empty();
		for(var i =0; i < this.tiles.length; i++)
		{
			tile = this.tiles[i];
			this.drawTile(tile.x, tile.y, tile);
		}
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
		console.log(e);
		//Calculate ratio to allow resize canvas and keep track right mouse position related canvas
		var ratioX = this.wrapper.clientWidth / 800;
		var ratioY = this.wrapper.clientHeight / 600;
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