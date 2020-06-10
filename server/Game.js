// a key-value store of room-game
const games = {};

class Game{

    constructor(room){
        this = games[room];
    }

    /**
     * should return an error if the game is full or if we have a dublicate name
     * should return the game object otherwise
     */
    static join(room , socket, name){

        if (!games[room]) { // if no existing game 
            const game = new Game(room);
            game.player[0].name = name;
            game.player[0].socket = socket;
            game.player[0].score = 0;

            socket.on('dice-roll',game.rollDice);
            socket.on('hold',game.hold);
            socket.on('new-game',game.newGame);
            socket.on('disconnect',game.leave)

        }else{ // if a game exists
            const game = new Game(room);
            if(game.player[1]){ // if two players are already playing

            }
            if(game.player[0].name == name){ // if we have a dublicate name

            }
            game.player[1].name = name;
            game.player[1].socket = socket;
            game.player[1].score = 0;
            game.playable = true;
            game.playing = true;
            game.activePlayer = game.player[0];
            game.roundScore = 0;
        }
    }

    /**
     * issued upon disconnect
     * if the leaving player is player[0] you should shift it from the array leaving player[1] to be player[0]
     */
    leave(){

    }

    rollDice(event,ack){
        if(this.playable && this.playing){

        }else{// return an error

        }

    }

    hold(event,ack){
        if(this.playable && this.playing){

        }else{// return an error

        }

    }

    newGame(){
        if(this.playable){

        }else{// return an error

        }

    }

}
module.exports = Game;