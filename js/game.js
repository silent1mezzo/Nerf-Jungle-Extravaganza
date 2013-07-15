var can_fire = true;

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


// load the AMD modules we need
require([
    'frozen/GameCore',
    'frozen/ResourceManager',
    'dojo/keys'
], function(GameCore, ResourceManager, keys){

    var rm = new ResourceManager();
    var bg = rm.loadImage('images/jungle-bg.jpg');
    var gun = new Gun(10, 100)
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

        },
        draw: function(context){
            context.drawImage(bg, 0, 0, this.width, this.height);
        }
    });

    game.run();
});