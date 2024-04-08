
let snakeBody = []
let redDivRow , redDivCol;
let score = 0;
let blueDivCol,blueDivRow;
let x = 1 , y = 0;
let speed = 500;
let kk = 0;
let intervalId;
let pre_Score = 0;



function redDiv(){
    redDivRow = Math.floor(Math.random()*45);
    redDivCol = Math.floor(Math.random()*48);
    let c = redDivRow.toString() + '-' + redDivCol.toString();
    if(document.getElementById(c).style.backgroundColor != 'red' && document.getElementById(c).style.backgroundColor != 'blue'){
        document.getElementById(c).style.backgroundColor = 'red'
    }
    else{
        redDiv();
    }
}



function SetScore(){
    score++;
    let a = document.getElementById("score");
    a.innerText = score;
}



function SetBoard(){
    document.getElementById('start').remove();
    let a = document.createElement("p");
    a.id = 'Score-logo'
    a.innerText = "SCORE : ";
    a.style.color = 'white';
    a.style.display = 'inline';
    document.getElementById("buttons").appendChild(a);

    a = document.createElement("p");
    a.innerText = "0";
    a.id = "score";
    a.style.color = 'yellow';
    a.style.display = 'inline';
    document.getElementById("buttons").appendChild(a);

    for(let i = 0 ; i < 45 ; i++){
        for(let j = 0 ; j < 48 ; j++){
            let a = document.createElement('div');
            let c = i.toString() + '-' + j.toString();
            a.id = c;
            a.classList.add('tile');
            document.getElementById('board').appendChild(a);
        }
    }
    redDiv();
    snakeBody[0] = [4,4];
    solve();
    
    fetch('/profile', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        pre_Score = data['Snake'];
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
}



function solve(){
    intervalId = setInterval(function(){
        blueDivRow = snakeBody[0][0];
        blueDivCol = snakeBody[0][1];

        let l = snakeBody.length-1;
        let aa = snakeBody[l][0];
        let bb = snakeBody[l][1];
        for(let i = snakeBody.length - 1 ; i > 0 ; i--){
            snakeBody[i] = snakeBody[i-1];
        }

        
        let c = aa + '-' + bb;
        let blueDiv = document.getElementById(c);

        

        if(blueDivCol + y >= 0 && blueDivCol + y < 48 && blueDivRow + x >= 0 && blueDivRow + x < 45){
            blueDiv.style.backgroundColor = '';
            if(check(snakeBody,blueDivRow+x,blueDivCol+y)){
                GameOver();
            }
            snakeBody[0] = [blueDivRow+x,blueDivCol+y];
            if(snakeBody[0][0] == redDivRow && snakeBody[0][1] == redDivCol){
                snakeBody.push([aa,bb]);
                redDiv();
                SetScore();
            }
        }
        else{
            GameOver();
        }

        for(let i = 0 ; i < snakeBody.length ; i++){
            let nextRowId = snakeBody[i][0] + '-' + snakeBody[i][1];
            document.getElementById(nextRowId).style.backgroundColor = 'blue';
        }

        

    },100);
}

function showCelebrationPopup() {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = 'Congratulations! New High Score!';
    popup.style.color = 'black'
    document.body.appendChild(popup);
    // Close the pop-up after 3 seconds
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
        return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    setTimeout(() => {
        popup.remove();
    }, 5000);
}

document.addEventListener('keydown',function(event){
    switch(event.key){
        case 'ArrowUp':
            if(blueDivRow > 0){
                if(x != 1){
                x = -1;
                y = 0;
                }
            }
            else GameOver();
            break;
        case 'ArrowDown':
            if(blueDivRow < 44){
                if(x != -1){
                x = 1;
                y = 0;
                }
            }
            else GameOver();
            break;
        case 'ArrowLeft':
            if(blueDivCol > 0){
                if(y != 1){
                x = 0;
                y = -1;
                }
            }
            else GameOver();
            break;
        case 'ArrowRight':
            if(blueDivCol < 47){
                if(y != -1){
                x = 0;
                y = 1;
                }
            }
            else GameOver();
            break;
    }         
});


function GameOver(){
    update();
    clearInterval(intervalId);
    document.getElementById('message').style.display = 'block';
    if(score > pre_Score){
        showCelebrationPopup()
    }
    setTimeout(()=>{
        window.location.reload();
    },6000);
}

function check(snakeBody,row,col){
    for(let i = 0 ; i < snakeBody.length ; i++){
        if(snakeBody[i][0] == row && snakeBody[i][1] == col) return true;
    }
    return false;
}



async function update(){
    try{
        const res = await fetch('/snake',{
            method: 'POST',
            body: JSON.stringify({score}),
            headers: {'Content-Type':'application/json'}
        });
    }
    catch(err){
        console.log(err)
    } 
}






