
var resources = [
	'helpers',
	'KeyboardManager',
	'Layer',
    'Circle',
    'Registry',
    'Arrow',
	//'GrabButton',
	'Lightning',
    'Grab',
	'App'
];

for (var i = 0; i < resources.length; i++)
{
	document.write('<script type="text/javascript" src="src/'+resources[i]+'.js"></script>');
}

