

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
	}
}
