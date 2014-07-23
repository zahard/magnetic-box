
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
	
	this.offsetTop = this.wrapper.offsetTop;
	this.offsetLeft = this.wrapper.offsetLeft;

	this.layers = {
		back:   new Layer( $('back'), width, height, 1),
		effect:  new Layer( $('effect'), width, height, 2),
		grab:  new Layer( $('grab'), width, height, 4),
		boxes:  new Layer( $('boxes'), width, height, 3),
		controls:  new Layer( $('controls'), width, height, 8),
	};
	
	//Iages and tiles used in game
	this.images = {
		back: $('img-back'),
		grab: $('img-grab'),
		box: $('img-box'),
		arrows: $('img-arrows'),
		magnet: $('img-magnet')
	};

	//YOU CAN KEEP LINKS TO SOUND HERE
	this.sounds = {
		//zap: $('audio-electro')
	};
	

	this.grab = new Grab(this.layers.grab, this.images.grab, 450);

	this.grab.lightnings = [
		new Lightning( this.layers.effect,{x:0,y:0},{x:1,y:1}),
		new Lightning( this.layers.effect,{x:0,y:0},{x:1,y:1})
	];
	
	var leftArrow = new Arrow( this.layers.controls, 'left',  this.images.arrows);
	leftArrow.onclick(function(arrow) {
		if (this.grab.speed >= 0)
		{
			this.grab.moveLeft();
		}
		else
		{
			this.grab.stop();
		}
	}.bind(this));

	var rightArrow = new Arrow( this.layers.controls, 'right',  this.images.arrows);
	rightArrow.onclick(function(arrow) {
		if (this.grab.speed <= 0)
		{
			this.grab.moveRight();
		} 
		else 
		{
			this.grab.stop();	
		}

	}.bind(this));

	this.clickables.push(
		Registry.add('l_arrow', leftArrow),
		Registry.add('r_arrow', rightArrow),
		Registry.add('grab', this.grab)
	);


	this.addBoxes();

	this.addListeners();	

	this.drawBackground();

	this.draw();

	this.drawBoxes();

	this.animate();

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

		if(this.grab.isMagnetOn)
		{
			this.grab.drawLightnings();
		}

		if (this.boxUpdates())
		{
			this.drawBoxes();
		}

		requestAnimationFrame(function(){
			this.animate();
		}.bind(this));
	},

	click: function()
	{
		var obj;
		for(var i = 0; i < this.clickables.length; i++)
		{
			obj = Registry.get(this.clickables[i]);
			if (obj.isClicked(this.activePoint))
			{
				obj.click();
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


	activateMagnet: function() {
	    

	},

	deactivateMagnet: function() {
	    this.layers.effect.empty();
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
		this.layers.controls.empty();
		
		Registry.get('l_arrow').draw();
		Registry.get('r_arrow').draw();

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

	activateArrow: function(type)
	{
		if (type == 'left')
		{
			Registry.get('l_arrow').active = true;
   			Registry.get('r_arrow').active = false;	
		} 
		else if(type == 'right')
		{
			Registry.get('l_arrow').active = false;
   			Registry.get('r_arrow').active = true;	
		}
		else
		{
			Registry.get('l_arrow').active = false;
   			Registry.get('r_arrow').active = false;	
		}

		this.drawArrows();
	},

	addBoxes: function()
	{
		this.boxes = [];
		this.boxes.push(
			Registry.add(new Box(300,150,100))
		);
	},

	boxUpdates: function()
	{
		var needRedraw = false;
		for (var i =0; i< this.boxes.length;i++)
		{
			if (Registry.get(this.boxes[i]).update())
			{
				needRedraw = true;
			}
		}

		return needRedraw;
	},

	drawBoxes: function()
	{
		this.layers.boxes.empty();

		for (var i =0; i< this.boxes.length;i++)
		{
			Registry.get(this.boxes[i]).draw();
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