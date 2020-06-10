//the game rules:
//In each turn, a player gets to roll the dice as many times as he wants and hold the value he wants, but if he gets 1 the round score becomes 0 and it becomes the next players tur. the first player reaches 100 wins the game.
//the round score is the current roll score, the global score is accumalted score.
/////////////////////////////////////////////////////////////////////////////////////////////

//now declaring variables:
let socket = io();
var scores , roundScore , activePlayer,gamePlaying ;

// document.querySelector("#current-0").textContent = dice;//this is used to just change the content
// document.querySelector("#current-0").innerHTML = '<em>'+dice+'</em>';//this is used to add HTML

// now we initialize variables:
scores = [0, 0];
activePlayer = 0;
roundScore = 0;
gamePlaying = true;
document.querySelector('#current-0').textContent = 0;
document.querySelector('#current-1').textContent = 0;
document.querySelector('#score-0').textContent = 0;
document.querySelector('#score-1').textContent = 0;
document.querySelector('.dice').style.display = 'none';

//now onto generating events:
//we have three event sources newgame , rolldice , hold.
//this is the rolling part

    document.querySelector('.btn-roll').addEventListener('click',function(){
        if (gamePlaying) {
        console.log(gamePlaying);
    //1.random number
        var dice=Math.floor(Math.random() * 6) + 1;
    //2.display result
        var diceDOM  = document.querySelector('.dice');
        diceDOM.style.display = "block";
        diceDOM.src = "dice-" + dice + ".png";
    //3.update the result IF rolled dice NOT 1
        if(dice !== 1){
            //Add score
            roundScore += dice;
            document.querySelector('#current-'+activePlayer).textContent = roundScore;
        }else{
            //next player
            nextPlayer();
        }
    }
});


function nextPlayer(){
    roundScore = 0;
    document.querySelector('#current-' + activePlayer).textContent = 0;
    activePlayer===0 ? activePlayer = 1 : activePlayer = 0;
    document.querySelector('.dice').style.display = "none";
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
}    

//this is the hold part

    document.querySelector('.btn-hold').addEventListener('click', function () {
        if (gamePlaying) {
        console.log(gamePlaying);
    //1.Add roundScore to the global score
        scores[activePlayer] += roundScore;
    //2.Update the UI-Display the result
        document.querySelector('#score-'+activePlayer).textContent = scores[activePlayer];
    //3.Decide the winner
        if(scores[activePlayer] >= 30){
            //Decide the winner
            document.querySelector('#name-'+activePlayer).textContent='Winner';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
            document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
            gamePlaying = false;
            console.log(gamePlaying);
        }else{
            //next player
            nextPlayer();
        }
    }
});


document.querySelector('.btn-new').addEventListener('click',init);
function init(){
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;
    document.querySelector('#current-0').textContent = 0;
    document.querySelector('#current-1').textContent = 0;
    document.querySelector('#score-0').textContent = 0;
    document.querySelector('#score-1').textContent = 0;
    document.querySelector('.dice').style.display = 'none';
    document.querySelector('#name-0').textContent = 'Player 1';
    document.querySelector('#name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('winner');
}