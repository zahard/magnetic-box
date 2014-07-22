
Grab = function(cxt, tile, x)
{
    this.tile = tile;
    this.cxt = cxt;

    this.x = x;
    this.y = 80;

    this.width = 120;
    this.height = 75;
    
    this.speed = 0;
    this.step = 5;
    
    this.prevFrame = 0;
}

Grab.prototype.draw = function() {
    this.cxt.empty();
    this.cxt.drawImage(
        this.tile,
        this.x - this.width / 2, this.y,
        this.width, this.height
    );
};

Grab.prototype.update = function() {
    if (!this.active)
    {
        return false;
    }

    var now = new Date().getTime();

    //Move with 0.5 sec interval like chained mech
    if(now - this.prevFrame < 1000/20)
    {
        return false;
    }
    else
    {
        this.prevFrame = now;    
    }


    var x = this.x + this.speed;
    if( x <= this.width / 2 || x >= 900 - this.width / 2)
    {
        this.stop();
        return false;
    }

    this.x = x;
    return true;
}; 

Grab.prototype.setSpeed = function(speed) {
    this.speed = speed;
};

Grab.prototype.moveLeft = function() {
    this.active = true;
    this.setSpeed(-this.step);
};

Grab.prototype.moveRight = function() {
    this.active = true;
    this.setSpeed(this.step);
};

Grab.prototype.stop = function() {
    this.active = false;
    this.setSpeed(0);  
};