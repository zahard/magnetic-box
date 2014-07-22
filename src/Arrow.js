



Arrow = function(cxt,type,tile)
{
    this.cxt = cxt;
    this.tile = tile;
    this.type = type;

    this.clickCallbacks = [];

    if (type === 'left')
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

Arrow.prototype = 
{
    active: false,

    draw: function()
    {   
        var tileX = (this.type === 'left') ? 0 : 1;
        var tileY = (this.active) ? 0 : 1;

        this.cxt.drawImage(this.tile,
            tileX * 64, tileY * 64,
            64, 64,
            this.x, this.y,
            64, 64
        )
    },

    click: function()
    {
        if (this.clickCallbacks.length > 0)
        {
            for (var i = 0; i < this.clickCallbacks.length; i++)
            {
                this.clickCallbacks[i].call(this,this);
            }
        }
    },

    onclick: function(f)
    {
        this.clickCallbacks.push(f);
    },

    isClicked: function(mouse)
    {
        if (this.type == 'left' && mouse.x < 100 && mouse.y < 80 ||
            this.type == 'right' && mouse.x > 800 && mouse.y < 80)
        {
            return true;
        }
        return false;
    }
};

GrabButton = function()
{
    this.x = 450;
    this.y = 50;
}

