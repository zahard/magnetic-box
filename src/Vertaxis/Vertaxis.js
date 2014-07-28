

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

	module: function(namespace, module)
	{
		var names = namespace.split('.');
		var moduleName = names.pop();
		var endpoint = this.createNamespace(window, names.join(''));
		endpoint[moduleName] = module;
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
	    if (string.length === 0)
	    {
	    	return base;
	    }

	    var parent = base;
	    var names = string.split('.');

	 	for (var i = 0; i < names.length; i++)
	    {
	    	if (typeof parent[names[i]] == 'undefined')
	        {
	            parent[names[i]] = {};
	        }
	 
	        parent = parent[names[i]];
	    }

	    return parent;
	},

	define2: function(namespace)
	{
		var names = namespace.split('.');
		var className = names.pop();
		var endpoint = this.createNamespace(window, names.join(''));
		
		if (arguments.length > 4)
		{
			//Multiple classes extension
			constructor = arguments[arguments.length - 2];
			prototype = arguments[arguments.length - 1];
			parents = Array.prototype.slice.call(arguments,1,-2);

			for(var n = 0; n < parents.length; n++)
			{
				this.extend(constructor,parents[n]);
			}
		}
		else
		{
			parent = arguments[1]
			constructor = arguments[2];
			prototype = arguments[3];
			this.extend(constructor,parent);
		}

		//Copy prototypes properties;
		for (var i in prototype)
		{
			constructor.prototype[i] = prototype[i];
		}

		//Apply changed constructor to namespace
		endpoint[className] = constructor;

	},
}


Vertaxis.define('Movable',null, 
	function Movable(){},
	{
		speed:0,
		acceleration:0,
		move:function(){

		},
		getPosition: function(){

		}
	}
);

Vertaxis.define('Paintable',null, 
	function Paintable(){

	},
	{
		color: '',
		paint:function(color)
		{
			this.color = color;
		}
	}
);

Vertaxis.define2('Car', Movable, Paintable, 
	function Car(model)
	{
		this.model = model || 'TAZ';
	},
	{
		engine: 'v8'
	}
);


