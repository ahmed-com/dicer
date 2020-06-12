const socket = io();

function getParameter(parameter){
    const url = window.location.href;
    parameter = parameter.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + parameter + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let room = getParameter('room');
let name = getParameter('name');

while(!room) room = prompt('Please enter a room name');
while(!name) name = prompt('Please enter your name');

let activePlayer;

const me = {
    changeCurrent : function (current){
        document.querySelector('#current-0').textContent = current;
    },
    changeScore : function(score){
        document.querySelector('#score-0').textContent = score;
    },
    activate : function(){
        document.querySelector('.player-0-panel').classList.add('active');
    },
    deactivate : function(){
        document.querySelector('.player-0-panel').classList.remove('active');
        this.changeCurrent(0);
    },
    changeName : function (name){
        document.querySelector('#name-0').textContent = name;
    },
    win : function(){
        document.querySelector('.player-0-panel').classList.add('winner');
        alert('You Won !!');
    },
    init(){
        this.changeCurrent(0);
        this.changeScore(0);
        this.deactivate();
        document.querySelector('.player-0-panel').classList.remove('winner');
    }
}

const opponent = {
    changeCurrent : function (current){
        document.querySelector('#current-1').textContent = current;
    },
    changeScore : function(score){
        document.querySelector('#score-1').textContent = score;
    },
    activate : function(){
        document.querySelector('.player-1-panel').classList.add('active');
    },
    deactivate : function(){
        document.querySelector('.player-1-panel').classList.remove('active');
        this.changeCurrent(0);
    },
    changeName : function (name){
        document.querySelector('#name-1').textContent = name;
    },
    win : function(){
        document.querySelector('.player-1-panel').classList.add('winner');
        alert('You Lost !!');
    },
    init(){
        this.changeCurrent(0);
        this.changeScore(0);
        this.deactivate();
        document.querySelector('.player-1-panel').classList.remove('winner');
    }
}

const dice = {
    show : function(value){
        const diceDOM = document.querySelector('.dice');
        diceDOM.style.display = "block";
        diceDOM.src = `dice-${value}.png`;
    },
    hide : function(){
        const diceDOM = document.querySelector('.dice');
        diceDOM.style.display = "none";
    }
}

document.querySelector('.btn-roll').addEventListener('click',function(){
    socket.emit('dice-roll',null,alert);
})

document.querySelector('.btn-hold').addEventListener('click', function () {
    socket.emit('hold',null,alert);
});

document.querySelector('.btn-new').addEventListener('click',function(){
    socket.emit('new-game',null,alert);
});

me.changeName(name);

socket.emit('join',{name,room},alert);

socket.on('join',opponent.changeName);

socket.on('new-game',()=>{
    me.init();
    opponent.init();
    dice.hide();
});

socket.on('leave',()=>{
    opponent.init();
    me.init();
    dice.hide();
    opponent.changeName('Waiting...');
});

socket.on('dice-roll',dice.show);

socket.on('activate',()=>{
    activePlayer = me;
    me.activate();
    opponent.deactivate();
});

socket.on('deactivate',()=>{
    activePlayer = opponent;
    opponent.activate();
    me.deactivate();
});

socket.on('round-score',roundScore=>{
    if(activePlayer !== undefined) activePlayer.changeCurrent(roundScore);
});

socket.on('score',score=>{
    if(activePlayer !== undefined) activePlayer.changeScore(score);
});

socket.on('win',()=>{
    if(activePlayer !== undefined) activePlayer.win();
});