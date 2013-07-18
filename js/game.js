var can_fire = true;
var MAX_X = 768;
var MAX_Y = 640;
var LEVEL = 0;


var Gun = (function() {
    // constructor
    function Gun(ammo, reload_time){
        this._max_ammo = ammo;
        this._ammo = ammo;
        this.reload_time = reload_time;

    }

    Gun.prototype.ammo_count = function(){
        return this._ammo;
    };

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
                setTimeout(function() { self.reload(self); }, 500);
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

        this._goal_x = Math.floor(Math.random()*MAX_X+1);
        this._goal_y = Math.floor(Math.random()*MAX_Y+1);

        // Movement Counters
        this._can_move = true;
        this._until_move = 0;
    }

    Raptor.prototype.get_x = function() {
        return this._x;
    }

    Raptor.prototype.get_y = function() {
        return this._y;
    }

    Raptor.prototype.move = function(raptor) {
        if(this._can_move || this._until_move == 2){
            if(this._x == this._goal_x && this._y == this._goal_y) {
                this._goal_x = Math.floor(Math.random()*MAX_X+1);
                this._goal_y = Math.floor(Math.random()*MAX_Y+1);
            }
            if(((this._x < this._goal_x) && (this._x > this._goal_x - this._speed)) ||
                ((this._x > this._goal_x) && (this._x < this._goal_x + this._speed))) {
                this._x = this._goal_x;
            } else if(this._x < this._goal_x) {
                this._x = this._x + this._speed;
            } else if(this._x > this._goal_x) {
                this._x = this._x - this._speed;
            }

            if(((this._y < this._goal_y) && (this._y > this._goal_y - this._speed)) ||
                ((this._y > this._goal_y) && (this._y < this._goal_y + this._speed))) {
                this._y = this._goal_y;
            } else if(this._y < this._goal_y) {
                this._y = this._y + this._speed;
            } else if(this._y > this._goal_y) {
                this._y = this._y - this._speed;
            }
            this._can_move = false;
            this._until_move = 0;
        } else {
            this._until_move++;
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
    var nerf_img = rm.loadImage('images/nerf.png');

    var gun = new Gun(10, 100);
    var raptors = [];

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
            if(raptors.length == 0) {
                LEVEL++;
                var speed = Math.min(10*(LEVEL/2), 35);
                for(var i=0; i<(LEVEL/2)*10+5; i++) {
                    raptors[i] = new Raptor(speed);
                }
            }
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

            for(var i=0; i<gun.ammo_count(); i++){
                context.drawImage(nerf_img, i*10 + 650, 10, 8, 40);
            }
        }
    });

    game.run();
});