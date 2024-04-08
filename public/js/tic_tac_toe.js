let CNT = 0;
let array = [[0,0,0],[0,0,0],[0,0,0]];
let kk = 0;
let pre_move = -1;
let flag = true;
let firstStart = false;
var socket = io();

const joinButton = document.getElementById('join');
const room = document.getElementById('room')

joinButton.addEventListener('click',function(e){
  if(room.value){
    socket.emit('room',room.value);
    document.getElementById('connected-msg').innerText = `Room id: ${room.value}`
    room.style.display = 'none';
    joinButton.style.display = 'none';
    document.getElementById('reset').style.display = 'flex';
    resetBoard();
    CNT = 0;
    array = [[0,0,0],[0,0,0],[0,0,0]];
    kk = 0;
    pre_move = -1;
    flag = true;
    firstStart = false;
  }
})

function resetBoard(){
    for(let i = 0 ; i < 3 ; i++){
        for(let j = 0 ; j < 3 ; j++){
            let c = i.toString() + '-' + j.toString();
            temp = document.getElementById(c);
            img = temp.querySelector('img')
            console.log(temp)
            if(img){
                temp.removeChild(img)
            }
        }
    }
}
function SetBoard(){
    
    for(let i = 0 ; i < 3 ; i++){
        for(let j = 0 ; j < 3 ; j++){
            let a = document.createElement('div');
            let c = i.toString() + '-' + j.toString();
            a.id = c;
            a.classList.add('tile');
            a.addEventListener('click',icon);
            if(i == 0) a.classList.add('top');
            if(j == 0) a.classList.add('left');
            if(i == 2) a.classList.add('bottom');
            if(j == 2) a.classList.add('right');
            document.getElementById("board").appendChild(a);
        }
    }
    
}

SetBoard();

socket.on('nextMove',(cords,cnt)=>{
    const temp = document.getElementById(cords);
    if(cnt%2 == 0){
        const img = document.createElement('img')
        img.src = 'static/images/cross.png';
        img.classList.add('co');
        temp.appendChild(img);
    }
    else{
        const img = document.createElement('img')
        img.src = 'static/images/nought.png';
        img.classList.add('co');
        temp.appendChild(img);
    }
    CNT = cnt+1;
    // valid();
})

function showCelebrationPopup() {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = 'Congratulations! You Won!';
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

function icon(){
    const temp = this.querySelector('img');
    if(pre_move != CNT && flag){
        if(!temp){
            if(CNT%2 == 0){
                firstStart = true;
                const img = document.createElement('img')
                img.src = 'static/images/cross.png';
                img.classList.add('co');
                this.appendChild(img);
                let cords = this.id.split('-');
                socket.emit('move',this.id,CNT);
                pre_move = CNT;
                array[cords[0]][cords[1]] = 1;
            }
            else{
                const img = document.createElement('img')
                img.src = 'static/images/nought.png';
                img.classList.add('co');
                this.appendChild(img);
                socket.emit('move',this.id,CNT);
                pre_move = CNT;
                let cords = this.id.split('-');
                array[cords[0]][cords[1]] = 2;
            }
        }
    }
    valid();
}


async function update(win){
    if(win == 1){
        showCelebrationPopup();
    }
    try{
        const res = await fetch('/tictactoe',{
            method: 'POST',
            body: JSON.stringify({win}),
            headers: {'Content-Type':'application/json'}
        });
    }
    catch(err){
        console.log(err)
    } 
}
function valid(){
    let a = document.getElementById("message");
    if(check()){
        flag = false;
        if(CNT%2 != 0){
            if(firstStart){
                a.innerText = 'Opponent Won';
                update(0);
                socket.emit('win',0);
            }
            else{
                a.innerText = 'You Won';
                update(1);
                socket.emit('win',1);

            }
            
        }
        else{
            if(firstStart){
                a.innerText = 'You Won';
                update(1);
                socket.emit('win',1);
            }
            else{
                a.innerText = 'Opponent Won';
                update(0);
                socket.emit('win',0);
            }
        }
        a.style.display = 'flex';
        setTimeout(()=>{
            load()
        },5000);
    }
    else if(CNT == 8){
        update(2);
        socket.emit('win',2);
        a.style.display = "block";
        setTimeout(()=>{
            load()
        },5000);
    }
    
}

socket.on('wins',(id)=>{
    flag = false;
    let a = document.getElementById("message");
    if(id == 0){
        update(1);
        a.innerText = 'You Won';
    }
    else if(id == 1){
        update(0);
        a.innerText = 'Opponent Won'
    }
    else{
        update(2);
    }
    a.style.display = 'flex';
    setTimeout(()=>{
        load();
    },5000)
})

socket.on('reset',(id)=>{
    CNT = 0;
    array = [[0,0,0],[0,0,0],[0,0,0]];
    kk = 0;
    pre_move = -1;
    flag = true;
    firstStart = false;
    resetBoard();
})


function check(){
    if(array[0][0] != 0 && array[0][0] == array[1][1] && array[1][1] == array[2][2]) return true;
    if(array[0][2] != 0 && array[0][2] == array[1][1] && array[1][1] == array[2][0]) return true;
    if(array[0][0] != 0 && array[0][1] == array[0][0] && array[0][1] == array[0][2]) return true;
    if(array[1][0] != 0 && array[1][1] == array[1][0] && array[1][1] == array[1][2]) return true;
    if(array[2][0] != 0 && array[2][1] == array[2][0] && array[2][1] == array[2][2]) return true;
    if(array[0][0] != 0 && array[0][0] == array[1][0] && array[1][0] == array[2][0]) return true;
    if(array[0][1] != 0 && array[0][1] == array[1][1] && array[1][1] == array[2][1]) return true;
    if(array[0][2] != 0 && array[0][2] == array[1][2] && array[1][2] == array[2][2]) return true;
    return false;
}

function load(){
    window.location.reload();
}


