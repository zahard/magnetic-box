

function Box(x,y,size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.half = size/2;
    this.width = size;
    this.height = size;

    this.tile = Registry.get('app').images.box;

    this.speedY = 0;
    this.accY = 2;
    this.maxSpeed = 18;

    this.isFalling = true;
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
    var update = false;
    if (this.isFalling)
    {
        this.speedY += this.accY;
        if (this.speedY >this.maxSpeed)
        {
            this.speedY = this.maxSpeed;
        }

        Registry.get('app').moveBox(this, 0, this.speedY)

        update = true;
    }

    if (this.isMagniting)
    {
        return true;
    }

    return update;
}

Box.prototype.onMagnetGrab = function()
{
    this.isMagniting = true;
    this.isFalling = false;
}

Box.prototype.onMagnetRelease = function()
{
    this.isMagniting = false;
    this.isFalling = true;
}

