module.exports = io =>{

    const games = {};
    const threshold = 20;
    const falseRoll = 6;
    
    class Game{

        static join({room , socket, name}){
    
            if (!games[room]) { 
                const game = new Game();

                game.id = room;
    
                const player = {
                    name ,
                    socket , 
                    score : 0, 
                    id : socket.id,
                    emit : socket.emit,
                    index : 0
                }
                game.player = [];
                game.player[0] = player;

                game.setToUnPlayable();
    
                socket.on('dice-roll',(event,ack)=> game.rollDice(player,ack));
                socket.on('hold',(event,ack)=> game.hold(player,ack));
                socket.on('new-game',(event,ack)=>game.newGame(ack));
                socket.on('disconnect',(event,ack)=> game.leave(player,ack));
    
                games[room] = game;
            }else{ 
                const game = games[room];
                if(game.player[1]){ 
                    return 'this game is already full';
                }
                if(game.player[0].name == name){ 
                    return 'this name is already taken';
                }

                const player = {
                    name ,
                    socket , 
                    score : 0, 
                    id : socket.id,
                    index : 1
                }
                game.player[1] = player;

                socket.on('dice-roll',(event,ack)=> game.rollDice(player,ack));
                socket.on('hold',(event,ack)=> game.hold(player,ack));
                socket.on('new-game',(event,ack)=>game.newGame(ack));
                socket.on('disconnect',(event,ack)=> game.leave(player,ack));
                
                game.player[0].socket.emit('join',name);
                game.player[1].socket.emit('join',game.player[0].name);

                game.setToPlayable();
            }
        }
    
        leave(player){
            if(player.index === 0){
                this.player.shift();
                if(!this.player[0]){
                    games[this.id] = null;
                    return;
                } 
                this.player[0].index = 0;
            }else{
                this.player.pop();
            }
            this.setToUnPlayable();
            this.emit('leave');
            return;
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
    
        rollDice(player,ack){
            if (!this.eligible(player,ack)) return;
            const dice = Math.ceil(Math.random() * 6);
            this.emit('dice-roll',dice);
            if (dice === falseRoll) return this.switchActive();
            this.roundScore += dice;
            const roundScore = this.roundScore;
            this.emit('round-score',roundScore);
        }
    
        hold(player,ack){
            if (!this.eligible(player,ack)) return;
            player.score += this.roundScore;
            this.emit('score',player.score);
            if(player.score < threshold) return this.switchActive();
            this.emit('win');
            this.playing = false;
        }
    
        newGame(ack){
            if (!this.playable) return ack('you can\'t play with your self');
            this.setToPlayable();
        }
    
        emit(event,data){
            io.to(this.id).emit(event,data);
        }

        setToPlayable(){
            this.playable = true;
            this.playing = true;
            this.roundScore = 0;
            this.player[0].score = 0;
            this.player[1].score = 0;
            
            this.emit('new-game');

            const randActive = Math.floor(Math.random() * 2);
            this.activePlayer = this.player[randActive];
            this.activePlayer.socket.emit('activate',true);
            const randUnactive = (randActive + 1) % 2;
            this.unactivePlayer = this.player[randUnactive];
            this.unactivePlayer.socket.emit('deactivate',true);
        }

        setToUnPlayable(){
            this.playable = false;
            this.playing = false;
            this.roundScore = 0;
            this.player[0].score = 0;
        }

        switchActive(){
            this.roundScore = 0;

            const temp = this.activePlayer;
            this.activePlayer = this.unactivePlayer;
            this.unactivePlayer = temp;

            this.activePlayer.socket.emit('activate');
            this.unactivePlayer.socket.emit('deactivate');
        }
    
    }
    return Game;
}