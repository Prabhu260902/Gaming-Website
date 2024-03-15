let prevDiv = null;
let new_id = []
let selected_div;
let chance = 0;
let checkingArray = [];
let flag = false;
let firstMove = 0;
let ksx = 0 , ksy = 4 , kgx = 7 ,kgy = 4;
let array1 = [[6,5,4,3,2,4,5,6],
                [1,1,1,1,1,1,1,1],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [11,11,11,11,11,11,11,11],
                [66,55,44,33,22,44,55,66]];

                

//player's turn
function Choice(){
    if(chance%2 != 0){
        document.getElementById('choice').innerText = "SILVER TURN";
        document.getElementById('choice').style.color = 'silver';
    }
    else{
        document.getElementById('choice').innerText = "GOLD TURN";
        document.getElementById('choice').style.color = 'gold';
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


function load(){
    window.location.reload();
}


//creating board with images
function SetBoard(){
    document.getElementById('start').remove();
    document.getElementById('reset').style.display = 'inline';
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

async function Move(oldId,newId,c){
    console.log(oldId,newId);
    let k = oldId.split('-');
    let l = newId.split('-');
    array1[l[0]][l[1]] = array1[k[0]][k[1]];
    if(array1[l[0]][l[1]] == 2) {ksx = l[0]; ksy = l[1];}
    if(array1[l[0]][l[1]] == 22) {kgx = l[0]; kgy = l[1];}
    array1[k[0]][k[1]] = 0;
    if(c) await socket.emit('chessMove',oldId,newId);
    SetImage(newId,document.getElementById(oldId).style.backgroundImage);
    document.getElementById(oldId).style.backgroundImage='';
}


socket.on('opMove',(oldCords,newCords)=>{
    firstMove = 2;
    console.log(oldCords,newCords)
    chance++;
    Move(oldCords,newCords,0);
    Choice();
    checkMate();
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
    if(firstMove == 0 || (firstMove == 1)){
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
    }
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
        if(array1[x-1][y] == 0){
            GBackTrack(x,y,-1,0,11);
        }
        if(y > 0 && array1[x-1][y-1] < 10 && array1[x-1][y-1] != 0){
            GBackTrack(x,y,-1,-1,11);
        }
        if(y < 7 && array1[x-1][y+1] < 10 && array1[x-1][y+1] != 0) {
            GBackTrack(x,y,-1,1,11);
        }
    }
    if(x == 6){
        if(array1[x-2][y] == 0){
            GBackTrack(x,y,-2,0,11);
        }
    }
}

//silver pawn move
function SPawn(x,y){
    x = parseInt(x);
    y = parseInt(y);
    if(x < 7){
        if(array1[x+1][y] == 0) SBackTrack(x,y,1,0,1);
        if(y > 0 && array1[x+1][y-1] > 10) SBackTrack(x,y,1,-1,1);
        if(y < 7 && array1[x+1][y+1] > 10) SBackTrack(x,y,1,1,1);
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


  const joinButton = document.getElementById('join');
  const room = document.getElementById('room')
  
  joinButton.addEventListener('click',function(e){
    if(room.value){
      socket.emit('room',room.value);
      document.getElementById('connected-msg').innerText = `Room id: ${room.value}`
      room.style.display = 'none';
      joinButton.style.display = 'none';
      document.getElementById('reset').style.display = 'flex';
    }
  })

