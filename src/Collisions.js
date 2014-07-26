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
		boxes:   new Layer( $('boxes'), width, height, 4)
	};

	//'#82B0E4'
	var c = this.layers.boxes;
	this.boxes = [
		//new Vertaxis.Box(c, 155, 405, 150, 150, -20),
		new Vertaxis.Box(c, 200, 300, 400, 80, 45),
		new Vertaxis.Circle(c, 200, 300,80)
		//Registry.add(new Box(150, 150, 70))
	];

	//402717088

	window.b1 = this.boxes[0];
	window.c1 = this.boxes[1];
	//window.c2 = this.boxes[2];
	//window.c3 = this.boxes[3];
	//window.c4 = this.boxes[4];

	this.drawBackground();

	this.drawBoxes();

	console.log( b1.collideWith(c1) )
	//console.log( b1.collideWith(c2) )
	//console.log( b1.collideWith(c3) )
	//console.log( b1.collideWith(c4) )

}

Game.prototype = {
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

		this.layers.back.set('fillStyle','#223769');
		this.layers.back.fillRect(0,0,this.width,this.height);
	}
}