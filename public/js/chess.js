let prevDiv = null;
let new_id = []
let selected_div;
let chance = 0;
let checkingArray = [];
let flag = false;
let firstMove = 0;
let duration = 10*60;
let ksx = 0 , ksy = 4 , kgx = 7 ,kgy = 4;
let array1 = [[6,5,4,3,2,4,5,6],
                [1,1,1,1,1,1,1,1],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [11,11,11,11,11,11,11,11],
                [66,55,44,33,22,44,55,66]];
let SKing = 0 , GKing = 0;
let sRrook = 0 , sLrook = 0 , gRrook = 0 , gLrook = 0;
let emsi = -1 , emsj = -1 , emgi = -1 , emgj = -1;

var socket = io();                

function showCelebrationPopup() {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = 'You are the Winner';
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
//player's turn
function Choice(){
    if(chance%2 != 0){
        if(firstMove == 1){
            document.getElementById('choice').innerText = "OPPONENT TURN";
            document.getElementById('choice').style.color = 'silver';
        }
        else{
            document.getElementById('choice').innerText = "YOUR TURN";
            document.getElementById('choice').style.color = 'silver';
        }
    }
    else{
        if(firstMove == 1){
            document.getElementById('choice').innerText = "YOUR TURN";
            document.getElementById('choice').style.color = 'gold';
        }
        else{
            document.getElementById('choice').innerText = "OPPONENT TURN";
            document.getElementById('choice').style.color = 'gold';
        }
    }
}


//to set the image
function SetImage(a,b){
    document.getElementById(a).style.backgroundImage = b;
    document.getElementById(a).style.backgroundSize = 'cover';
    document.getElementById(a).style.textAlign = "center";
    document.getElementById(a).style.backgroundPosition = "center";
    document.getElementById(a).style.backgroundSize = "50px 50px";
}

const build = ()=>{
    const res = [[6,5,4,3,2,4,5,6],
                    [1,1,1,1,1,1,1,1],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [11,11,11,11,11,11,11,11],
                    [66,55,44,33,22,44,55,66]];

    return res;
}

async function update(win){
    if(win == 1){
        showCelebrationPopup();
    }
    try{
        const res = await fetch('/chess',{
            method: 'POST',
            body: JSON.stringify({win}),
            headers: {'Content-Type':'application/json'}
        });
    }
    catch(err){
        console.log(err)
    } 
}


function load(){
    const div = document.getElementById('board');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    
    array1 = build()
    prevDiv = null;
    new_id = []
    selected_div;
    chance = 0;
    checkingArray = [];
    flag = false;
    firstMove = 0;
    duration = 10*60
    stopCountdown()
    ksx = 0 , ksy = 4 , kgx = 7 ,kgy = 4;
    SKing = 0 , GKing = 0;
    sRrook = 0 , sLrook = 0 , gRrook = 0 , gLrook = 0;
    document.getElementById('choice').innerText = "START THE GAME";
    document.getElementById('choice').style.color = 'gold';
    SetBoard();
}


//creating board with images
function SetBoard(){
    const ch = document.createElement('div');
    ch.id = 'popup';
    ch.classList.add('hidden');
    ch.innerText = 'CHECK';
    document.querySelector(".full-board").appendChild(ch);
    document.getElementById('countdown').style.display = 'flex';
    document.getElementById("board").style.display = 'flex';
    document.getElementById("choice").style.display = 'flex';
    for(let i = 0 ; i < 8 ; i++){
        for(let j = 0 ; j < 8 ; j++){
            let b = document.createElement("div");
            b.classList.add('dot');
            b.id = i + '-' + j + j;
            let a = document.createElement("div");
            a.id = i + '-' + j;
            a.classList.add('box');
            a.appendChild(b);
            a.addEventListener('click',select);
            if((i+j)%2 == 0) a.classList.add('color');
            document.getElementById("board").appendChild(a);
            if(array1[i][j] != 0) SetImage(i+'-'+j,`url('/static/images/chess/${array1[i][j]}.png')`)
        }
    }
    


}

//remove dots
function Remove(){
    for(let i = 0 ; i < new_id.length ; i++){
        let l = new_id[i].split('-');
        let n_id = l[0] + '-' + l[1] + l[1]; 
        document.getElementById(n_id).style.display = 'none';
    } 
    new_id.length = 0;
}

function Move(oldId,newId,c){
    let k = oldId.split('-');
    let l = newId.split('-');
    if(c){
        emsi = -1 , emsj = -1 , emgi = -1 , emgj = -1;
    }
    array1[l[0]][l[1]] = array1[k[0]][k[1]];
    if(array1[l[0]][l[1]] == 2) {ksx = l[0]; ksy = l[1];}
    if(array1[l[0]][l[1]] == 22) {kgx = l[0]; kgy = l[1];}
    if(array1[l[0]][l[1]] == 1 && (l[0] - k[0]) == 2){
        emsi = l[0];
        emsj = l[1];
    }
    if(array1[l[0]][l[1]] == 11 && (k[0] - l[0]) == 2){
        emgi = l[0];
        emgj = l[1];
    }
    if(array1[l[0]][l[1]] == 1 || array1[l[0]][l[1]] == 11){
        if(((l[0]-k[0]) == -1) && ((l[1]-k[1]) == -1)){
            document.getElementById(k[0]+'-'+l[1]).style.backgroundImage = '';
            array1[k[0]][l[1]] = 0;
        }
        if(((l[0]-k[0]) == -1) && ((l[1]-k[1]) == 1)){
            document.getElementById(k[0]+'-'+l[1]).style.backgroundImage = '';
            array1[k[0]][l[1]] = 0;
        }
        if(((l[0]-k[0]) == 1) && ((l[1]-k[1]) == -1)){
            document.getElementById(k[0]+'-'+l[1]).style.backgroundImage = '';
            array1[k[0]][l[1]] = 0;
        }
        if(((l[0]-k[0]) == 1) && ((l[1]-k[1]) == 1)){
            document.getElementById(k[0]+'-'+l[1]).style.backgroundImage = '';
            array1[k[0]][l[1]] = 0;
        }
    }

    array1[k[0]][k[1]] = 0;
    if(c){
        stopCountdown();
        socket.emit('chessMove',oldId,newId,1)
        pawnPromotion(l[0],l[1],array1[l[0]][l[1]] , oldId , newId);
    }
    SetImage(newId,document.getElementById(oldId).style.backgroundImage);
    document.getElementById(oldId).style.backgroundImage='';


    if(k[0] == 0){
        if(k[1] == 0) sLrook = 1;
        if(k[1] == 7) sRrook = 1;
    }
    if(k[0] == 7){
        if(k[1] == 0) gLrook = 1;
        if(k[1] == 7) gRrook = 1;
    }
    if(k[0] == 7 && k[1] == 4){
        
        if(l[0] == 7 && l[1] == 6 && GKing == 0 && c){
            array1[7][5] = 66;
            array1[7][7] = 0;
            socket.emit('castling','7-5',document.getElementById('7-7').style.backgroundImage,'7-7',66);
            SetImage('7-5',document.getElementById('7-7').style.backgroundImage);
            document.getElementById('7-7').style.backgroundImage='';
        }
        if(l[0] == 7 && l[1] == 2 && GKing == 0 && c){
            array1[7][3] = 66;
            array1[7][0] = 0;
            socket.emit('castling','7-3',document.getElementById('7-0').style.backgroundImage,'7-0',66);
            SetImage('7-3',document.getElementById('7-0').style.backgroundImage);
            document.getElementById('7-0').style.backgroundImage='';
        }
        GKing = 1;
    }
    if(k[0] == 0 && k[1] == 4 ){
        
        if(l[0] == 0 && l[1] == 6 && SKing == 0 && c){
            array1[0][5] = 6;
            array1[0][7] = 0;
            socket.emit('castling','0-5',document.getElementById('0-7').style.backgroundImage,'0-7',6);
            SetImage('0-5',document.getElementById('0-7').style.backgroundImage);
            document.getElementById('0-7').style.backgroundImage='';
        }
        if(l[0] == 0 && l[1] == 2 && SKing == 0 && c){
            array1[0][3] = 6;
            array1[0][0] = 0;
            socket.emit('castling','0-3',document.getElementById('0-0').style.backgroundImage,'0-0',6);
            SetImage('0-3',document.getElementById('0-0').style.backgroundImage);
            document.getElementById('0-0').style.backgroundImage='';
        }
        SKing = 1;
    }
}

socket.on('Castling',(New,img,old,val)=>{
    let k = New.split('-');
    let l = old.split('-');
    array1[k[0]][k[1]] = val;
    array1[l[0]][l[1]] = 0;
    SetImage(New,img);
    document.getElementById(old).style.backgroundImage='';
    Choice();
    checkMate();
})


socket.on('opMove',(oldCords,newCords,p)=>{
    if(firstMove == 0){
        firstMove = 2;
        document.getElementById('board').style.flexWrap = 'wrap-reverse';
    }
    if(p) chance++;
    Move(oldCords,newCords,0);
    Choice();
    checkMate();
    startCountdown();
})

socket.on('PawnPromotion',(place,img,ele)=>{
    let id = place.split('-');
    array1[id[0]][id[1]] = ele;
    SetImage(place,img);
    Choice();
    checkMate();
})

const joinButton = document.getElementById('join');
const room = document.getElementById('room')

joinButton.addEventListener('click',function(e){
if(room.value){
    socket.emit('room',room.value);
    document.getElementById('connected-msg').innerText = `Room id: ${room.value}`
    room.style.display = 'none';
    joinButton.style.display = 'none';
    load();
}
})

socket.on('reset',(msg)=>{
    load();
})

function checkMate(){
    if(check(ksx,ksy,0)){
        flag = true;
        checkingArray.length = 0;
        for(let row = 0 ; row < 8 ; row++){
            for(let col = 0 ; col < 8 ; col++){
                if(array1[row][col] < 10 && array1[row][col] > 0){
                    let k = array1[row][col]%10;
                    if(k == 1) SPawn(row,col);
                    if(k == 6) Rook(row,col,0);
                    if(k == 4) Bishop(row,col,0);
                    if(k == 3) Queen(row,col,0);
                    if(k == 5) Knight(row,col,0);
                    if(k == 2) King(row,col,0);
                }
            }
        }
        
        if(checkingArray.length <= 0){
            const popup = document.getElementById('popup');
            popup.innerText = 'CHECKMATE';
            if(chance%2 != 0){
                if(firstMove == 1){
                    update(!(firstMove-1))
                }
                else{
                    update(!(firstMove-1))
                }
            }
            else{
                if(firstMove == 1){
                    update((firstMove-1))
                }
                else{
                    update((firstMove-1))
                }
            }
            setTimeout(()=>{
                window.location.reload();
            },5000)
        }
        checkingArray.length = 0;
        flag = false;
        showPopup();
    }

    if(check(kgx,kgy,1)){
        flag = true;
        checkingArray.length = 0;
        for(let row = 0 ; row < 8 ; row++){
            for(let col = 0 ; col < 8 ; col++){
                if(array1[row][col] > 10){
                    let k = array1[row][col]%10;
                    if(k == 1) GPawn(row,col);
                    if(k == 6) Rook(row,col,1);
                    if(k == 4) Bishop(row,col,1);
                    if(k == 3) Queen(row,col,1);
                    if(k == 5) Knight(row,col,1);
                    if(k == 2) King(row,col,1);
                }
            }
        }
        if(checkingArray.length <= 0){
            const popup = document.getElementById('popup');
            popup.innerText = 'CHECKMATE';
            if(chance%2 != 0){
                if(firstMove == 1){
                    update(!(firstMove-1))
                }
                else{
                    update(!(firstMove-1))
                }
            }
            else{
                if(firstMove == 1){
                    update((firstMove-1))
                }
                else{
                    update((firstMove-1))
                }
            }
            setTimeout(()=>{
                window.location.reload();
            },5000)
        }
        checkingArray.length = 0;
        flag = false;
        showPopup();
    }
}


//selected move
function select(){
    let id = this.id.split('-');
    let x = parseInt(id[0]);
    let y = parseInt(id[1]);
    if(document.getElementById('choice').innerText == "START THE GAME" || document.getElementById('choice').innerText == "YOUR TURN"){
    if((firstMove == 0 || firstMove == 1)){
        firstMove = 1;
        if(array1[x][y] > 10){
            prevDiv = this;  
            Remove();
            let k = array1[x][y]%10;
            if(k == 1) GPawn(x,y);
            if(k == 6) Rook(x,y,1);
            if(k == 4) Bishop(x,y,1);
            if(k == 3) Queen(x,y,1);
            if(k == 5) Knight(x,y,1);
            if(k == 2) King(x,y,1);
        }
        else{
            if(prevDiv != null){
                for(let i = 0 ; i < new_id.length ; i++){
                    if(new_id[i] == this.id){
                        chance++;
                        Move(prevDiv.id,this.id,1);
                        prevDiv=null;
                        Remove();
                        Choice();
                        checkMate();
                        
                    }
                }  
            }
        }
    }

    else{
        firstMove = 2;
        if(array1[x][y] < 10 && array1[x][y] != 0){
            prevDiv = this;  
            Remove();
            let k = array1[x][y]%10;
            if(k == 1) SPawn(x,y);
            if(k == 6) Rook(x,y,0);
            if(k == 4) Bishop(x,y,0);
            if(k == 3) Queen(x,y,0);
            if(k == 5) Knight(x,y,0);
            if(k == 2) King(x,y,0);
        }
        else{
            if(prevDiv != null){
                for(let i = 0 ; i < new_id.length ; i++){
                    if(new_id[i] == this.id){
                        Move(prevDiv.id,this.id,1);
                        prevDiv = null;
                        Remove();
                        chance++;
                        Choice();         
                        checkMate();
                    }
                }  
            }
        }
    }}
}


//showing dots
function ppush(x,y){
    let k = x + '-' + y+y; 
    if(!flag){
        document.getElementById(k).style.display = "block";
        new_id.push(x+'-'+y);
    }
    checkingArray.push(1);
}


//make the move and checking weather it is correct or not for gold ones
function GBackTrack(x,y,i,j,k){
    let p = parseInt(x)+parseInt(i) , q = parseInt(y)+parseInt(j);
    let temp = array1[p][q];
    array1[p][q] = k;
    array1[x][y] = 0;
    if(k == 22){
        if(!check(p,q,1)) ppush(p,q);
    }
    else if(!check(kgx,kgy,1)){
        ppush(p,q);
    }
    array1[p][q] = temp;
    array1[x][y] = k;
}

//make the move and checking weather it is correct or not for silver ones
function SBackTrack(x,y,i,j,k){
    let p = parseInt(x)+parseInt(i) , q = parseInt(y)+parseInt(j);
    let temp = array1[p][q];
    array1[p][q] = k;
    array1[x][y] = 0;
    if(k == 2) {
        if(!check(p,q,0)) ppush(p,q);
    }
    else if(!check(ksx,ksy,0)){
        ppush(p,q);
    }
    array1[p][q] = temp;
    array1[x][y] = k;
}

//Gold Pawn move
function GPawn(x,y){
    x = parseInt(x);
    y = parseInt(y);
    if(x > 0){
        if(array1[x-1][y] == 0) GBackTrack(x,y,-1,0,11);
        if(y > 0 && array1[x-1][y-1] < 10 && array1[x-1][y-1] != 0) GBackTrack(x,y,-1,-1,11);
        if(y < 7 && array1[x-1][y+1] < 10 && array1[x-1][y+1] != 0) GBackTrack(x,y,-1,1,11);
        if(y > 0 && x == emsi && y-1 == emsj && array1[x-1][y-1] == 0) GBackTrack(x,y,-1,-1,11);
        if(y < 7 && x == emsi && y+1 == emsj && array1[x-1][y+1] == 0) GBackTrack(x,y,-1,1,11);
    }
    if(x == 6){
        if(array1[x-2][y] == 0) GBackTrack(x,y,-2,0,11);
    }
}

//silver pawn move
function SPawn(x,y){
    x = parseInt(x);
    y = parseInt(y);
    if(x < 7){
        if(array1[x+1][y] == 0) SBackTrack(x,y,1,0,1);
        if(y > 0 && array1[x+1][y-1] > 10) SBackTrack(x,y,1,-1,1);
        if(y < 7 && array1[x+1][y+1] > 10 && array1[x+1][y+1] != 0) SBackTrack(x,y,1,1,1);
        if(y > 0 && x == emgi && y-1 == emgj && array1[x+1][y-1] == 0) SBackTrack(x,y,1,-1,1);
        if(y < 7 && x == emgi && y+1 == emgj && array1[x+1][y+1] == 0) SBackTrack(x,y,1,1,1);
    }
    if(x == 1){
        if(array1[x+2][y] == 0) SBackTrack(x,y,2,0,1);
    }
}


//Rock move
function Rook(x,y,c){
    x = parseInt(x);
    y = parseInt(y);
    let dir = [[-1,0],[1,0],[0,1],[0,-1]];
    for(let k = 0 ; k < 4 ; k++){
        let i = parseInt(dir[k][0]) , j = parseInt(dir[k][1]);
        while(x+i >= 0 && y+j >= 0 && x+i < 8 && y+j < 8){
            if(array1[x+i][y+j] == 0) {
                if(c) GBackTrack(x,y,i,j,66);
                else SBackTrack(x,y,i,j,6);
            }
            else if(c && array1[x+i][y+j] < 10){
                GBackTrack(x,y,i,j,66);
                break;
            }
            else if(!c && array1[x+i][y+j] > 10){
                SBackTrack(x,y,i,j,6);
                break;
            }
            else break;
            if(i > 0) i++;
            else if(i < 0) i--;
            if(j > 0) j++;
            else if(j < 0) j--;
        }
    }
}


//Bishop move
function Bishop(x,y,c){
    x = parseInt(x);
    y = parseInt(y);
    let dir = [[-1,-1],[1,1],[-1,1],[1,-1]];
    for(let k = 0 ; k < 4 ; k++){
        let i = parseInt(dir[k][0]) , j = parseInt(dir[k][1]);
        while(x+i >= 0 && y+j >= 0 && x+i < 8 && y+j < 8){
            if(array1[x+i][y+j] == 0){
                if(c) GBackTrack(x,y,i,j,44);
                else SBackTrack(x,y,i,j,4);
            }
            else if(c && array1[x+i][y+j] < 10){
                GBackTrack(x,y,i,j,44);
                break;
            }
            else if(!c && array1[x+i][y+j] > 10){
                SBackTrack(x,y,i,j,4);
                break;
            }
            else break;
            if(i > 0) i++;
            else i--;
            if(j > 0) j++;
            else j--;
        }
    }
    
}


//Queen move
function Queen(x,y,c){
    x = parseInt(x);
    y = parseInt(y);
    let dir = [[-1,-1],[1,1],[-1,1],[1,-1]];
    for(let k = 0 ; k < 4 ; k++){
        let i = parseInt(dir[k][0]) , j = parseInt(dir[k][1]);
        while(x+i >= 0 && y+j >= 0 && x+i < 8 && y+j < 8){
            if(array1[x+i][y+j] == 0){
                if(c) GBackTrack(x,y,i,j,33);
                else SBackTrack(x,y,i,j,3);
            }
            else if(c && array1[x+i][y+j] < 10){
                GBackTrack(x,y,i,j,33);
                break;
            }
            else if(!c && array1[x+i][y+j] > 10){
                SBackTrack(x,y,i,j,3);
                break;
            }
            else break;
            if(i > 0) i++;
            else i--;
            if(j > 0) j++;
            else j--;
        }
    }
    dir = [[-1,0],[1,0],[0,1],[0,-1]];
    for(let k = 0 ; k < 4 ; k++){
        let i = parseInt(dir[k][0]) , j = parseInt(dir[k][1]);
        while(x+i >= 0 && y+j >= 0 && x+i < 8 && y+j < 8){
            if(array1[x+i][y+j] == 0) {
                if(c) GBackTrack(x,y,i,j,33);
                else SBackTrack(x,y,i,j,3);
            }
            else if(c && array1[x+i][y+j] < 10){
                GBackTrack(x,y,i,j,33);
                break;
            }
            else if(!c && array1[x+i][y+j] > 10){
                SBackTrack(x,y,i,j,3);
                break;
            }
            else break;
            if(i > 0) i++;
            else if(i < 0) i--;
            if(j > 0) j++;
            else if(j < 0) j--;
        }
    }
    
}


//Knight move
function Knight(x,y,c){
    let dir = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for(let i = 0 ; i < 8 ; i++){
        let p = parseInt(x)+parseInt(dir[i][0]) , q = parseInt(y)+parseInt(dir[i][1]);
        if(p >= 0 && p < 8 && q >= 0 && q < 8){
            if(array1[p][q] == 0){
                if(c) GBackTrack(x,y,dir[i][0],dir[i][1],55);
                else SBackTrack(x,y,dir[i][0],dir[i][1],5);
            }
            else if(c && array1[p][q] < 10){
                GBackTrack(x,y,dir[i][0],dir[i][1],55);
            }
            else if(!c && array1[p][q] > 10){
                SBackTrack(x,y,dir[i][0],dir[i][1],5);
            }
        }
    }
}


//king move
function King(x,y,c){
    x = parseInt(x);
    y = parseInt(y);
    let dir = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]];
    for(let i = 0 ; i < 8 ; i++){
        let p = x+parseInt(dir[i][0]) , q = y+parseInt(dir[i][1]);
        if(p >= 0 && p < 8 && q >= 0 && q < 8){
            if(array1[p][q] == 0){
                if(c) GBackTrack(x,y,dir[i][0],dir[i][1],22);
                else SBackTrack(x,y,dir[i][0],dir[i][1],2);
            }
            else if(c && array1[p][q] < 10) GBackTrack(x,y,dir[i][0],dir[i][1],22);
            else if(!c && array1[p][q] > 10) SBackTrack(x,y,dir[i][0],dir[i][1],2);
        }
    }
    if(GKing == 0 && gRrook == 0 && c){
        if(array1[7][5] == 0 && array1[7][6] == 0){
            GBackTrack(x,y,0,2,22);
        }
    }
    if(GKing == 0 && gLrook == 0 && c){
        if(array1[7][1] == 0 && array1[7][2] == 0 && array1[7][3] == 0){
            GBackTrack(x,y,0,-2,22);
        }
    }
    if(SKing == 0 && sRrook == 0 && !c){
        if(array1[0][5] == 0 && array1[0][6] == 0){
            SBackTrack(x,y,0,2,2);
        }
    }
    if(SKing == 0 && sLrook == 0 && !c){
        if(array1[0][1] == 0 && array1[0][2] == 0 && array1[0][3] == 0){
            SBackTrack(x,y,0,-2,2);
        }
    }
    
}


//valid move without check or not
function  check(x,y,c){
    x = parseInt(x);
    y = parseInt(y);
    let dir = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];

    if(c){
        if(x-1 >= 0 && y-1 >= 0 && array1[x-1][y-1] == 1) return true;
        if(x-1 >= 0 && y+1 >= 0 && array1[x-1][y+1] == 1) return true;
    }
    else{
        if(x+1 >= 0 && y-1 >= 0 && array1[x+1][y-1] == 11) return true;
        if(x+1 >= 0 && y+1 >= 0 && array1[x+1][y+1] == 11) return true;
    }
    for(let i = 0 ; i < 8 ; i++){
        let p = parseInt(x)+parseInt(dir[i][0]) , q = parseInt(y)+parseInt(dir[i][1]);
        if(p >= 0 && p < 8 && q >= 0 && q < 8){
            if(array1[p][q] == 0) continue;
            else if(c && array1[p][q] == 5) return true;
            else if(!c && array1[p][q] == 55) return true;
        }
    }

    dir = [[-1,-1],[1,1],[-1,1],[1,-1]];
    for(let k = 0 ; k < 4 ; k++){
        let i = parseInt(dir[k][0]) , j = parseInt(dir[k][1]);
        while(x+i >= 0 && y+j >= 0 && x+i < 8 && y+j < 8){
            if(array1[x+i][y+j] == 0){ 
                if(i > 0) i++;
                else i--;
                if(j > 0) j++;
                else j--;
                continue;
            }
            else if(c && (array1[x+i][y+j] == 4 || array1[x+i][y+j] == 3)) return true;
            else if(!c && (array1[x+i][y+j] == 44 || array1[x+i][y+j] == 33))return true;
            else break;
        }
    }

    dir = [[-1,0],[1,0],[0,1],[0,-1]];
    for(let k = 0 ; k < 4 ; k++){
        let i = parseInt(dir[k][0]) , j = parseInt(dir[k][1]);
        while(x+i >= 0 && y+j >= 0 && x+i < 8 && y+j < 8){
            if(array1[x+i][y+j] == 0){
                if(i > 0) i++;
                else if(i < 0) i--;
                if(j > 0) j++;
                else if(j < 0) j--;
                continue;
            }
            else if(c && (array1[x+i][y+j] == 6 || array1[x+i][y+j] == 3))return true;
            else if(!c && (array1[x+i][y+j] == 66 || array1[x+i][y+j] == 33)) return true;
            else break;
        }
    }

    return false;
}


function showPopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('hidden');
    setTimeout(() => {
      popup.classList.add('hidden');
    }, 3000); // Hide popup after 3 seconds
  }




function pawnPromotion(i,j,val , oldId , newId){
    let flag = false;
    if(i == 0){
        if(val == 11){
            document.getElementById('promotion-options').style.display = 'flex';
            const promotionOptions = document.querySelectorAll('.promotion-option');
            promotionOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const selectedPiece = parseInt(option.dataset.piece);
                    const ele = (selectedPiece*10) + selectedPiece;
                    array1[i][j] = ele;
                    SetImage(i+'-'+j,`url('/static/images/chess/${array1[i][j]}.png')`)
                    socket.emit('pawnPromotion',i+'-'+j,`url('/static/images/chess/${array1[i][j]}.png')`,ele)
                    document.getElementById('promotion-options').style.display = 'none';
                    return;
                });
            });
        }
    }
    else if(i == 7){
        if(val == 1){
            document.getElementById('promotion-options').style.display = 'flex';
            const promotionOptions = document.querySelectorAll('.promotion-option');
            promotionOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const selectedPiece = parseInt(option.dataset.piece);
                    const ele = selectedPiece;
                    array1[i][j] = ele;
                    SetImage(i+'-'+j,`url('/static/images/chess/${array1[i][j]}.png')`)
                    socket.emit('pawnPromotion',i+'-'+j,`url('/static/images/chess/${array1[i][j]}.png')`,ele)
                    document.getElementById('promotion-options').style.display = 'none';
                    return;
                });
            });
        }
    }
}

const countdownElement = document.getElementById('countdown');

let countdownInterval = null;

function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000); 
}

function stopCountdown() {
    clearInterval(countdownInterval);
}

function updateCountdown() {
    if (duration <= 0) {
        const popup = document.getElementById('popup');
        popup.innerText = 'Times Up';
        showPopup();
        stopCountdown();
        countdownElement.textContent = '00:00';
        return;
    }
    const formattedTime = formatTime(duration);
    countdownElement.textContent = formattedTime;
    duration--;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}








