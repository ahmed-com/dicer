module.exports = io =>{
    // a key-value store of room-game
    const games = {};
    const threshold = 30;
    const falseRoll = 6;
    
    class Game{
    
        constructor(room){
            this = games[room];
        }
    
        /**
         * should return an error if the game is full or if we have a dublicate name
         * should return the game object otherwise
         */
        static join({room , socket, name}){
    
            if (!games[room]) { // if no existing game 
                const game = new Game(room);
                game.playable = false;
                game.playing = false;
                game.id = room;
    
                const player = {
                    name ,
                    socket , 
                    score : 0, 
                    id : socket.id
                }

                game.player[0] = player;
                player.index = 0;
    
                socket.on('dice-roll',(event,ack)=> game.rollDice(player,ack));
                socket.on('hold',(event,ack)=> game.hold(player,ack));
                socket.on('new-game',(event,ack)=>game.newGame(ack));
                socket.on('disconnect',(event,ack)=> game.leave(player,ack));
    
            }else{ // if a game exists
                const game = new Game(room);
                if(game.player[1]){ // if two players are already playing
    
                }
                if(game.player[0].name == name){ // if we have a dublicate name
    
                }
                game.player[1].name = name;
                game.player[1].socket = socket;
                game.player[1].score = 0;
                // init game
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
        leave(player){
            if(player.index === 0){
                this.player.shift();
                if(!this.player[0]){
                    this = null;
                    return;
                } 
                this.player[0].index = 0;
            }else{
                this.player.pop();
            }
            this.playable = false;
            this.playing = false;
            return;
        }
    
        rollDice(player,ack){
            if (!this.eligible(player,ack)) return;
            const dice = Math.ceil(Math.random() * 6);
            this.emit('dice-roll',dice);
            if (dice === falseRoll) return this.nextPlayer();
            this.roundScore += dice;
        }

        eligible(player,ack){
            let error = false;
            if (!this.playable) error = 'you can\'t play with your self';
            if (!this.playing) error = 'please start the game';
            if (player.id !== this.activePlayer.id) error = 'that\'s not your turn';
            if (error){
                ack(error);
                return false;
            }
            ack();
            return true;
        }
    
        hold(player,ack){
            if (!this.eligible(player,ack)) return;
            this.emit('hold');
            player.score += this.roundScore;
            if(player.score < threshold) return this.nextPlayer();
            this.emit('winner');
        }
    
        newGame(ack){
            if (!this.playable) return ack('you can\'t play with your self');
            this.initGame();
        }
    
        emit(event,data){
            io.to(this.id).emit(event,data);
        }

        initGame(){
            this.playable = true;
            this.playing = true;
            this.roundScore = 0;
            this.player[0].score = 0;
            this.player[1].score = 0;
        }

        nextPlayer(){
            this.roundScore = 0;
            this.activePlayer.index === 0 ? activePlayer = this.player[1] : activePlayer = this.player[0];
        }
    
    }
    return Game;
}