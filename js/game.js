// load the AMD modules we need
require([
    'frozen/GameCore',
    'dojo/keys'
], function(GameCore, keys){

    'use strict';

    var x = 100;
    var y = 100;
    var speed = 4;

    var game = new GameCore({
        canvasId: 'game',

        initInput: function(input){
            input.addKeyAction(keys.UP_ARROW);
            input.addKeyAction(keys.RIGHT_ARROW);
            input.addKeyAction(keys.DOWN_ARROW);
            input.addKeyAction(keys.LEFT_ARROW);
        },
        handleInput: function(input){
            if(input.keyActions[keys.LEFT_ARROW].isPressed()){
                x-= speed;
            }
            if(input.keyActions[keys.RIGHT_ARROW].isPressed()){
                x+= speed;
            }
            if(input.keyActions[keys.UP_ARROW].isPressed()){
                y-= speed;
            }
            if(input.keyActions[keys.DOWN_ARROW].isPressed()){
                y+= speed;
            }
        },
        update: function(millis){

        },
        draw: function(context){
            context.clearRect(0, 0, this.width, this.height);
            context.fillRect(x, y, 25, 50);
        }
    });

    game.run();
});