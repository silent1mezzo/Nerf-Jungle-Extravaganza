var can_fire = true;
var MAX_X = 768;
var MAX_Y = 640;

var Gun = (function() {
    // constructor
    function Gun(ammo, reload_time){
        this._max_ammo = ammo;
        this._ammo = ammo;
        this.reload_time = reload_time;

    }

    Gun.prototype.reload = function(gun) {
        gun._ammo = gun._max_ammo;
    };

    Gun.prototype.fire = function() {
        var self = this;
        if(this._ammo > 0 && can_fire) {
            console.log('Firing');
            console.log(this._ammo);
            this._ammo--;
            if(this._ammo === 0) {
                console.log('Reloading');
                setTimeout(function() { self.reload(self); }, 750);
            }
        }
    };

    return Gun;
})();

var Raptor = (function() {
    // constructor
    function Raptor(speed){
        this._speed = speed;
        this._x = Math.floor(Math.random()*MAX_X+1);
        this._y = Math.floor(Math.random()*MAX_Y+1);
    }

    Raptor.prototype.get_x = function() {
        return this._x;
    }

    Raptor.prototype.get_y = function() {
        return this._y;
    }

    Raptor.prototype.move = function(raptor) {
        var rand = Math.random();
        if (rand < 0.5) {
            this._x = this._x + this._speed;
            this._y = this._y + this._speed;
        } else {
            this._x = this._x - this._speed;
            this._y = this._y - this._speed;
        }
    };

    Raptor.prototype.attack = function() {
    };

    return Raptor;
})();

// load the AMD modules we need
require([
    'frozen/GameCore',
    'frozen/ResourceManager',
    'dojo/keys'
], function(GameCore, ResourceManager, keys){

    var rm = new ResourceManager();
    var bg = rm.loadImage('images/jungle-bg.jpg');
    var raptor_img = rm.loadImage('images/raptor.png');
    var gun = new Gun(10, 100);
    var raptors = [];
    for(var i=0; i<10; i++) {
        raptors[i] = new Raptor(10);
    }

    var game = new GameCore({
        canvasId: 'game',
        resourceManager: rm,

        initInput: function(input){

        },
        handleInput: function(input){
            if(input.mouseAction.isPressed()){
                gun.fire();
                can_fire = false;
                //console.log(input.mouseAction.startPosition);
            }

            if(!input.mouseAction.isPressed()){
                can_fire = true;
            }

        },
        update: function(millis){
            for(var i=0; i<raptors.length; i++) {
                raptors[i].move();
            }
        },
        draw: function(context){
            context.drawImage(bg, 0, 0, this.width, this.height);
            for(var i=0; i<raptors.length; i++) {
                //console.log(raptors[i].get_x());
                //console.log(raptors[i].get_y());
                context.drawImage(raptor_img, raptors[i].get_x(), raptors[i].get_y(), 100, 100);
            }
        }
    });

    game.run();
});