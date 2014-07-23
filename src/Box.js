

function Box(x,y,size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.width = size;
    this.tile = Registry.get('app').images.box;

    this.speedY = 0;
    this.accY = 3;
    this.maxSpeed = 24;

    this.falling = true;
}

Box.prototype.draw = function()
{
    var cxt  = Registry.get('app').layers.boxes;

    if(this.falling)
    {
        var offset = this.speedY * 2;
        cxt.save();
        cxt.setProperties({
            'globalAlpha': 0.1,
            'fillStyle': '#fff'
        });

        cxt.fillRect(
            this.x - this.size/2, this.y - this.size/2 - offset,
            this.size,this.size + offset
        );

        cxt.drawImage(this.tile,
            0,0,100,100,
            this.x - this.size/2, this.y - this.size/2 - offset,
            this.size,this.size + offset
        );
        
        cxt.restore();
    }

    cxt.drawImage(this.tile,
        0,0,100,100,
        this.x - this.size/2, this.y - this.size/2,
        this.size,this.size
    );
}

Box.prototype.update = function()
{
    if (! this.falling) return false;


    this.speedY += this.accY;
    if (this.speedY >this.maxSpeed)
    {
        this.speedY = this.maxSpeed;
    }

    var new_y = this.y + this.speedY;
    
    var bottomY = new_y + this.size/2;

    if (bottomY >= 600)
    {
        new_y = 600 - this.size/2;
        this.falling = false;
    }

    this.y = new_y;
    return true;
}  