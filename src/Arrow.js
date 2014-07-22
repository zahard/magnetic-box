

Arrow = function(pos)
{
    if (pos === 'left')
    {
        this.x = 5;
        this.y = 5;
    }
    else
    {
        this.x = 900 - 64 - 5;
        this.y = 5;
    }
}


GrabButton = function()
{
    this.x = 450;
    this.y = 50;
}




Clickable = function() {

}

Clickable.prototype = {
    click: function()
    {
        //Should be implemented 
    }, 

    isMouseOver: function(mouse)
    {

    }

}
