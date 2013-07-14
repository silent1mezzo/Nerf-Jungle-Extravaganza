function Gun(ammo, reload_time) {
    this.max_ammo = ammo;
    this.ammo = ammo;
    this.reload_time = reload_time;
}

Gun.prototype.reload = function() {
    console.log('Reloading');
    this.ammo = this.max_ammo;
}

Gun.prototype.fire = function() {
    if(this.ammo > 0) {
        this.ammo--;
        if(this.ammo === 0) {
            setTimeout(this.reload, 500);
        }
    }
}

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
                console.log('Click Click');
                gun.fire();
                console.log(gun.ammo);
                //console.log(input.mouseAction.startPosition);
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