
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
		boxes:  new Layer( $('boxes'), width, height, 2)
	};
	
	//Iages and tiles used in game
	this.images = {
		back: $('img-back'),
	};

	//YOU CAN KEEP LINKS TO SOUND HERE
	this.sounds = {
		//name: $('id-of-audio'),
	};
	
	this.addListeners();	

	this.drawBackground();

	//this.animate();
}

Game.prototype = {

	activePoint: {
		x:0, y:0
	},

	MOUSE_HOLDED: false,

	animate: function()
	{
		if (this.update())
		{
			this.draw();
		}

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
		//Draw levelx
		this.layers.back.setProperties({ fillStyle: '#6fbfe8' });
		this.layers.back.fillRect(
			0,0,this.width,this.height
		);

		this.layers.back.drawImage(
			this.images.back,
			0,0,
			//300,168,
			// /0,0,
			this.width, this.height
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