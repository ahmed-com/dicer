const games = {};

class Game{

    static join(room){
        if (!games.room) {
            games.room = this;
        }
    }
}
module.exports = Game;