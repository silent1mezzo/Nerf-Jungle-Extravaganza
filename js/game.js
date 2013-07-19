var can_fire = true;
var MAX_X = 768;
var MAX_Y = 640;
var LEVEL = 0;
var HEALTH = 100;
var KILL_COUNT = 0;
var get_name = true;

var Gun = (function() {
    // constructor
    function Gun(ammo, reload_time){
        this._max_ammo = ammo;
        this._ammo = ammo;
        this._reload_time = reload_time;

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
                setTimeout(function() { self.reload(self); }, this._reload_time);
            }
        }
    };

    return Gun;
})();

var Raptor = (function() {
    // constructor
    function Raptor(speed){
        var self = this;

        this._speed = speed;
        this._x = Math.floor(Math.random()*MAX_X+1);
        this._y = Math.floor(Math.random()*MAX_Y+1);

        this._goal_x = Math.floor(Math.random()*MAX_X+1);
        this._goal_y = Math.floor(Math.random()*MAX_Y+1);

        // Movement Counters
        this._can_move = true;
        this._until_move = 0;
        this._attack_time = (Math.floor(Math.random()*6) + 3) * 1000;
        this._attack_timeout = setTimeout(function() { self.attack(self); }, this._attack_time);
    }

    Raptor.prototype.get_x = function() {
        return this._x;
    };

    Raptor.prototype.get_y = function() {
        return this._y;
    };

    Raptor.prototype.is_hit = function(coordinates) {
        var mouse_x = coordinates['x'];
        var mouse_y = coordinates['y'];

        if ((mouse_x > this._x && mouse_x < this._x + 100) &&  (mouse_y > this._y && mouse_y < this._y + 100)){
            return true;
        } else {
            return false;
        }
    };


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

    Raptor.prototype.attack = function(raptor) {
        var damage = Math.floor(Math.random()*6);
        HEALTH = HEALTH - damage;
        raptor._attack_timeout = setTimeout(function() { raptor.attack(raptor); }, raptor._attack_time);
    };

    Raptor.prototype.die = function(raptor) {
        window.clearInterval(this._attack_timeout);
    };

    return Raptor;
})();

// load the AMD modules we need
require([
    'frozen/box2d/Box',
    'frozen/box2d/BoxGame',
    'frozen/GameCore',
    'frozen/ResourceManager',
    'dojo/keys',
    //'frozen/plugins/loadSound!sounds/pew_sound',
    //'frozen/plugins/loadSound!sounds/gun_sound',
    //'frozen/plugins/loadSound!sounds/reload_sound',
    //'frozen/plugins/loadSound!sounds/raptor2',
], function(GameCore, Box, BoxGame, ResourceManager, keys/*, pew_sound, gun_sound, reload_sound, raptor2*/){

    var rm = new ResourceManager();
    var bg = rm.loadImage('images/jungle-bg.jpg');
    var game_over = rm.loadImage('images/game_over.jpg');
    var raptor_img = rm.loadImage('images/raptor.png');
    var nerf_img = rm.loadImage('images/nerf.png');
    var health_bar = rm.loadImage('images/health.jpg');

    var gun = new Gun(10, 500);
    var raptors = [];

    var game = new BoxGame({
        canvasId: 'game',
        height: 640,
        width: 768,
        box: new Box({resolveCollisions: true}),
        resourceManager: rm,

        initInput: function(input){

        },
        handleInput: function(input){
            if(input.mouseAction.isPressed()){
                //pew_sound.play(0.5);
                gun.fire();
                can_fire = false;
                for(var i=0; i<raptors.length; i++) {
                    if(raptors[i].is_hit(input.mouseAction.startPosition)) {
                        KILL_COUNT++;
                        raptors[i].die();
                        raptors.splice(i, 1);
                    }
                }
                //console.log(input.mouseAction.startPosition);
            }

            if(!input.mouseAction.isPressed()){
                can_fire = true;
            }

        },
        update: function(millis){
            if(HEALTH <= 0) {
                raptors.splice(0, raptors.length);
                return;
            }
            if(raptors.length == 0) {
                LEVEL++;
                gun.reload(gun);
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
            if(HEALTH <= 0) {
                context.drawImage(game_over, 0, 0, this.width, this.height);
                context.font = "40px Helvetica";
                context.fillStyle = "red";
                context.fillText('You killed ' + KILL_COUNT + ' raptors', 210, 400);

                if(get_name && KILL_COUNT > 0) {
                    var name = prompt("You've got a highscore! Please enter your name", "Y No Name?");
                    addScore(name, KILL_COUNT);
                    get_name = false;
                }
            } else {
                context.drawImage(bg, 0, 0, this.width, this.height);

                for(var i=0; i<raptors.length; i++) {
                    //console.log(raptors[i].get_x());
                    //console.log(raptors[i].get_y());
                    context.drawImage(raptor_img, raptors[i].get_x(), raptors[i].get_y(), 100, 100);
                }
                if(gun.ammo_count() == 0) {
                    context.font = "20px Helvetica";
                    context.fillStyle = "red";
                    context.fillText('Reloading...', 650, 30);
                }

                for(var i=0; i<gun.ammo_count(); i++){
                    context.drawImage(nerf_img, i*10 + 650, 10, 8, 40);
                }

                for(var i=0; i<HEALTH; i++){
                    context.drawImage(health_bar, i + 10, 10, 8, 40);
                }
            }
        }
    });
    
    game.run();
});