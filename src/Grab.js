
Grab = function(cxt, tile, x)
{
    this.tile = tile;
    this.cxt = cxt;

    this.x = x;
    this.y = 80;

    this.width = 120;
    this.height = 75;
    
    this.speed = 0;
    this.step = 2;

    this.prevFrame = 0;

    this.isMagnetOn = false;
}

Grab.prototype.isClicked = function(mouse)
{
    var w = 32;
    var x =  this.x;
    var y =  this.y - 32;
    
    if (mouse.x >= x - w && mouse.x <= x + w &&
        mouse.y >= y - w && mouse.y <= y + w)
    {
        return true;
    }
    return false;
};

Grab.prototype.click = function(mouse)
{
    this.isMagnetOn = ! this.isMagnetOn;

    if (this.isMagnetOn)
    {
        Registry.get('app').activateMagnet(); 
    } else {
        Registry.get('app').deactivateMagnet();
    }
    
    this.draw();
};

Grab.prototype.drawLightnings = function(mouse)
{

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


    var l1 = this.lightnings[0];
    var l2 = this.lightnings[1];
    var point = {x: 500, y: 300,d:300,r:5};

    l1.pa = {
        x: this.x - 40,
        y: this.y + 40,
        d:-300,r:5
    }

    l2.pa = {
        x: this.x + 40,
        y: this.y + 40,
        d:-300,r:5
    }

    l1.pb = point;
    l2.pb = point;

    Registry.get('app').layers.effect.empty();
    l1.boom();
    l2.boom();
}

Grab.prototype.draw = function() {
    this.cxt.empty();
    this.cxt.drawImage(
        this.tile,
        this.x - this.width / 2, this.y,
        this.width, this.height
    );

    var mag = Registry.get('app').images.magnet;

    var tileX = this.isMagnetOn ? 0 : 1;
    this.cxt.drawImage(mag,
        tileX * 128, 0,
        128, 128,
        this.x - 32, this.y - 64,
        64, 64
    )
};

Grab.prototype.update = function() {
    if (!this.active)
    {
        return false;
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

     Registry.get('app').activateArrow('left')
};

Grab.prototype.moveRight = function() {
    this.active = true;
    this.setSpeed(this.step);

    Registry.get('app').activateArrow('right')
};

Grab.prototype.stop = function() {
    this.active = false;
    this.setSpeed(0);

    Registry.get('app').activateArrow()

};