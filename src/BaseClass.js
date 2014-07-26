

var Vertaxis = {

	define: function(namespace, parent, constructor, prototype)
	{
		var names = namespace.split('.');
		var className = names.pop();
		var endpoint = this.createNamespace(window, names.join(''));

		this.extend(constructor,parent);

		for (var i in prototype)
		{
			constructor.prototype[i] = prototype[i];
		}

		endpoint[className] = constructor;

	},
	extend: function(Child,Parent)
	{
		if (typeof Parent !== 'function')
		{
			Child.superclass = function(){};
			return;
		}

		var F = function() {};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.superclass = Parent;

		Object.defineProperty(Child.prototype, 'constructor', { 
		    enumerable: false, 
		    value: Child 
		});
	},

	createNamespace: function( base, string )
	{
	    var names = string.split('.');
	    var parent = base;
	    var endpoint = null;

	 	for (var i = 0; i < names.length; i++)
	    {
	        if (typeof parent[names[i]] == 'undefined')
	        {
	            parent[names[i]] = {};
	            var endpoint = parent[names[i]];
	        }
	 
	        parent = parent[names[i]];
	    }

	    return parent;
	},

	math: {

		sign: function(number)
		{
			return number && number / Math.abs(number);
		},

		distance: function(p1, p2)
		{
			return Math.sqrt( (p2.x - p1.x)*(p2.x - p1.x) + (p2.y - p1.y)*(p2.y - p1.y) );
		},

		/**
		 * Convert Angle Degrees to Radians
		 * and shift angle to -90 so 0 is represent UP direction
		 */
		rad: function(angle)
		{
			var radians = (Math.PI / 180) * angle;
			return radians;
		},

		/**
		 * Rotate point by angle around center point
		 */
		rotatePoint: function(point, angle, center)
		{
			var p = {
				x: point.x - center.x,
				y: point.y - center.y,
			};

			var rotated = {
				x: Math.round( p.x * Math.cos(angle) - p.y * Math.sin(angle) ) + center.x,
				y: Math.round( p.x * Math.sin(angle) + p.y * Math.cos(angle) ) + center.y
			};

			return rotated;
		},

		translatePoint: function (point, center, reverse)
		{
			return {
				x: point.x - center.x * (reverse ? -1 : 1),
				y: point.y - center.y * (reverse ? -1 : 1)
			}
		}
	}
}


Vertaxis.define('Vertaxis.Shape', null, function Shape()
{
	console.log('Shape init');
},
{

});


Vertaxis.define('Vertaxis.Box', Vertaxis.Shape, 
	function Boxy(cxt, x, y, width, height, angle)
	{
		Vertaxis.Box.superclass.apply(this,arguments);
		console.log('Box init');

		this.cxt = cxt;
		this.width = width;
		this.height = height;
		this.square = this.width * this.height;

		this.radius = Math.sqrt(this.width * this.width  + this.height * this.height) / 2;

		//this.size = size;
		this.halfW = this.width / 2;
		this.halfH = this.height / 2;

		if(angle)
		{
			this.angle = Vertaxis.math.rad(angle);
		}
		else
		{
			this.angle = 0;
		}

		this.moveTo(x,y);

	},
	{	
		type: 'rect',
		draw: function()
		{
			this.cxt.beginPath();
			this.cxt.moveTo(
				this.vertex[3].x,
				this.vertex[3].y
			);

			for(var i = 0; i < 4; i++)
			{
				this.cxt.lineTo(
					this.vertex[i].x,
					this.vertex[i].y
				);
			}

			this.cxt.lineTo(
				this.vertex[1].x,
				this.vertex[1].y
			);

			this.cxt.moveTo(
				this.vertex[0].x,
				this.vertex[0].y
			);

			this.cxt.lineTo(
				this.vertex[2].x,
				this.vertex[2].y
			);

			var top = {
				x: (this.vertex[0].x + this.vertex[1].x) / 2,
				y: (this.vertex[0].y + this.vertex[1].y) / 2
			}

			this.cxt.moveTo(this.x,this.y);
			this.cxt.lineTo(top.x, top.y);

			this.cxt.set('strokeStyle','#fff');
			this.cxt.closePath();
			this.cxt.stroke();

		},

		moveTo: function(x,y)
		{
			this.x = x;
			this.y = y;

			this.updateVertex();
		},

		updateVertex: function()
		{
			this.calculateVertex();
			if (this.angle != 0 )
			{
				this.translateVertex();
			}
		},

		setAngle: function(angle)
		{
			this.angle = Vertaxis.math.rad(angle);
			this.updateVertex();
		},

		calculateVertex: function()
		{
			var x1 = this.x - this.halfW;
			var x2 = this.x + this.halfW;
			var y1 = this.y - this.halfH;
			var y2 = this.y + this.halfH;

			this.vertex = [
				{ x: x1, y: y1},
				{ x: x2, y: y1},
				{ x: x2, y: y2},
				{ x: x1, y: y2}
			];
		},

		translateVertex: function()
		{
			var center = {x: this.x, y: this.y};
			for(var i = 0; i < 4; i++)
			{
				this.vertex[i] = Vertaxis.math.rotatePoint(this.vertex[i], this.angle, center);
			}
		},

		collideWith: function(shape)
		{
			if (this.distanceToCenter(shape) > this.radius + shape.radius)
			{
				console.log('too far')
				return false;
			}

			if (shape.type == 'circle')
			{
				return this.collideWithCircle(shape);
			}

			if(shape.angle == 0 && this.angle == 0)
			{
				return this.collideOrthogonalWith(shape);
			}

			var figures = [this,shape];
			var figure_a;
			var figure_b;
			var square;
			var v;
			var p1, p2;
			var point;
			var triangleSquare;


			for(var n = 0; n < 2; n++)
			{
				figure_a = figures[(n == 0) ? 0 : 1];
				figure_b = figures[(n == 0) ? 1 : 0];
				
				//Shape square calculated be triangles method
				square = 0;
				v = figure_b.vertex;
				for (var i = 0; i < 4; i++)
				{	
					p1 = i;
					p2 = (i < 3) ? i + 1 : 0;

					square += 1/2 * Math.abs( 
						(v[p2].x - v[p1].x) * (figure_b.y - v[p1].y) - 
						(v[p2].y - v[p1].y) * (figure_b.x - v[p1].x)
					);
				}


				for(var m = 0; m < 4; m++)
				{
					//Count squares of 4 triangles
					// generated by point and 4 sides of shape
					point = figure_a.vertex[m];
					triangleSquare = 0;
					v = figure_b.vertex;

					for (var i = 0; i < 4; i++)
					{
						p1 = i;
						p2 = (i < 3) ? i + 1 : 0;

						triangleSquare += 1/2 * Math.abs( 
							(v[p2].x - v[p1].x) * (point.y - v[p1].y) - 
							(v[p2].y - v[p1].y) * (point.x - v[p1].x)
						);
					}

					if(triangleSquare - square < 50) //Small gap 
					{
						return true;
					}
				}
			}

			return false
		},

		collideOrthogonalWith: function(shape)
		{
			if (
				this.x - this.halfW < shape.x + shape.halfW &&
		        this.x + this.halfW > shape.x - shape.halfW &&
		        this.y - this.halfH < shape.y + shape.halfH &&
		        this.y + this.halfH > shape.y - shape.halfH )
	        {
	        	return true;
	        }
			return false;
		},

		collideWithCircle: function(circle)
		{
			var center = {x:circle.x, y: circle.y};
			var r = circle.radius;

			//First check vertexes for belonging to circle
			var vertexesInCircle = 0;
			for (var i =0; i < this.vertex.length;i++)
			{	
				//If disatnce from cetner to point is less that radius
				//this point are belong to circle
				if( Vertaxis.math.distance(circle, this.vertex[i]) <= r)
				{
					vertexesInCircle++;
				}
			}

			//If we have vertexes in circle that mean that shapes are intersected
			if (vertexesInCircle > 0)
			{
				return true;
			}
			
			//Check all sidex of polygon for intersect with circle
			var s1, s2,a, b;
			for (var i = 0; i < this.vertex.length; i++)
			{
				s1 = i;
				s2 = (i < this.vertex.length - 1) ? i + 1 : 0;

				//Tranalsate points to local plane
				a = Vertaxis.math.translatePoint(this.vertex[s1], center);
				b = Vertaxis.math.translatePoint(this.vertex[s2], center);

				
				var dx = b.x - a.x;
				var dy = b.y - a.y;

				var dr = Math.sqrt(dx*dx + dy*dy);
				var dr2 = dx*dx + dy*dy;

				var D = (a.x * b.y) - (b.x * a.y);
				var DD = Math.pow(r, 2) * dr2 - Math.pow(D, 2) 
			
				if (DD >= 0)
				{
					//If both point in one quandrant, and not obviosly belones circle
					//we need skeep this line
					if (Vertaxis.math.sign(a.x) != Vertaxis.math.sign(b.x) ||
						Vertaxis.math.sign(a.y) != Vertaxis.math.sign(b.y) )
					{
						return true;
					}


					//POints of circle and line intersection

					/*
					var dt = Math.sqrt( DD );

					var x = Math.round( (  D * dy - ((dy < 0) ? -1 : 1) * dx * dt ) / dr2 );
					var y = Math.round( (- D * dx - Math.abs(dy) * dt ) / dr2 );
					var p1 = Vertaxis.math.translatePoint({x:x, y:y}, center, true);

					var x = Math.round( (  D * dy + ((dy < 0) ? -1 : 1) * dx * dt ) / dr2 );
					var y = Math.round( (- D * dx + Math.abs(dy) * dt ) / dr2 );
					var p2 = Vertaxis.math.translatePoint({x:x,y:y}, center, true);

					var points = [p1];
					if (p2.x != p1.x || p2.y != p1.y)
					{
						points.push(p2);
					}

					return points;
					*/
				}
			}

			//If there are nso insterseptions with all sides return false
			return false;
		},

		distanceToCenter: function(shape)
		{
			return Vertaxis.math.distance(this,shape);
		}
	}
);





Vertaxis.define('Vertaxis.Circle', Vertaxis.Box,
	function Circle(cxt, x, y, radius, angle)
	{
		//Vertaxis.Circle.superclass.apply(this,arguments);
		console.log('Circle init');

		this.cxt = cxt;
		this.width = radius*2;
		this.height = radius*2;
		this.radius = radius;
		this.square = Math.PI * this.radius * this.radius;

		if(angle)
		{
			this.angle = Vertaxis.math.rad(angle);
		}
		else
		{
			this.angle = 0;
		}

		this.moveTo(x,y);
	},
	{
		type: 'circle',
		draw: function()
		{
			this.cxt
				.save()
				.beginPath()
				.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
				.closePath()
				.set('strokeStyle','#fff')
				.stroke();

			var top = {
				x: this.x,
				y: this.y - this.radius
			};

			var topRotated = Vertaxis.math.rotatePoint(top, this.angle, this);

			this.cxt
				.beginPath()
				.moveTo(topRotated.x, topRotated.y)
				.lineTo(this.x, this.y)
				.closePath()
				.set('strokeStyle','#fff')
				.stroke();
		},

		updateVertex: function()
		{
			//empty because circle have no vertexes
		}
	}
);



