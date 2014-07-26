
var resources = [
	'helpers',
	'BaseClass',
	'Layer',
	'Registry',
	'Collisions'
];

for (var i = 0; i < resources.length; i++)
{
	document.write('<script type="text/javascript" src="src/'+resources[i]+'.js"></script>');
}

