let id1=null, id2=null,id3=null;
let flag1 = false , flag2 = false , flag3 = false;
let e1 = [['2--3'],['2--3','2--4'],['1--3','2--3'],['2--2','2--4','2--3'],['1--3','2--3','3--3'],['2--2','3--3','2--3'],['2--3','3--3','2--4'],
    ['1--2','1--3','2--3','2--2'],['2--1','2--3','2--2','2--4'],['1--3','2--3','3--3','4--3'],['1--3','2--3','2--2','3--3'],['1--3','3--3','2--3','2--4'],
    ['1--3','2--3','2--2','2--4'],['2--2','3--3','2--3','2--4'],['0--3','1--3','2--3','3--3','4--3'],['2--1','2--3','2--2','2--4','2--5'],
    ['1--2','1--3','2--2','1--4','2--3','2--4','3--3','3--4','3--2']];
let e2 = []
let e3 = []
let score = 0;



let selectedElement = null;
let offsetX = 0;
let offsetY = 0;

function handleDragStart(e) {
    selectedElement = e.target;
    offsetX = e.clientX - selectedElement.getBoundingClientRect().left;
    offsetY = e.clientY - selectedElement.getBoundingClientRect().top;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const cords = e.target.id.split('-');
    const sourceCords = selectedElement.id.split('-');
    const deltaX = cords[0] - sourceCords[0];
    const deltaY = cords[1] - sourceCords[1];

    const moveAllowed = true; // Check if move is allowed according to game rules

    if (moveAllowed) {
        selectedElement.style.top = (e.clientY - offsetY) + "px";
        selectedElement.style.left = (e.clientX - offsetX) + "px";
        selectedElement.id = cords.join('-');
    }
}

const tiles = document.querySelectorAll('.tile');
tiles.forEach(tile => {
    tile.draggable = true;
    tile.addEventListener('dragstart', handleDragStart);
});

const boardTiles = document.querySelectorAll('#board .tile');
boardTiles.forEach(tile => {
    tile.addEventListener('dragover', handleDragOver);
    tile.addEventListener('drop', handleDrop);
});


function SetBoard(){
    document.getElementById('start').remove();
    document.getElementById('score').style.display = 'flex';
    document.getElementById('board').style.display = 'flex';
    document.getElementById('hints').style.display = 'flex';
    for(let i = 0 ; i < 10 ; i++){
        for(let j = 0 ; j < 10 ; j++){
            let a = document.createElement('div');
            let c = i + '-' + j;
            a.id = c;
            a.classList.add("tile");
            a.addEventListener('click',set_el);
            document.getElementById("board").appendChild(a);
        }
    }

    let array = ["one","two","three"];
    for(let i = 0 ; i < 5 ; i++){
        for(let j = 0 ; j < 21 ; j++){
            let a = document.createElement('div');
            let c = i + '--' + j;
            a.id = c;
            a.classList.add("hint_tile");
            a.classList.add(array[parseInt(j/7)]);
            a.addEventListener('click',selected_el);
            document.getElementById("hints").appendChild(a);
        }
    }
    hint();
}

function add(c){
    for(let i = 0 ; i < c.length ; i++){
        document.getElementById(c[i]).classList.add('elem');
    }   
    
}
function sub(c){
    for(let i = 0 ; i < c.length ; i++)
    document.getElementById(c[i]).classList.remove('elem');
}

function hint(){
    for(let i = 0 ; i < 17 ; i++){
        let temp = [];
        for(let j = 0 ; j < e1[i].length ; j++){
            let c = e1[i][j].split('--');
            let d = c[0] + '--' + (parseInt(c[1])+7);
            temp.push(d);
        }
        e2.push(temp);
    }

    for(let i = 0 ; i < 17 ; i++){
        let temp = [];
        for(let j = 0 ; j < e1[i].length ; j++){
            let c = e1[i][j].split('--');
            let d = c[0] + '--' + (parseInt(c[1])+14);
            temp.push(d);
        }
        e3.push(temp);
    }

    id1 = Math.floor(Math.random()*17);
    id2 = Math.floor(Math.random()*17);
    id3 = Math.floor(Math.random()*17);
    add(e1[id1]);
    add(e2[id2]);
    add(e3[id3]);
    valid();

}
function selected_el(){
    flag1 = this.classList.contains('one');
    flag2 = this.classList.contains('two');
    flag3 = this.classList.contains('three');
}

function putt(e,id,cords){
    let temp = e[id];
    let c = temp[0].split('--');
    for(let i = 0 ; i < temp.length ; i++){
        let a = temp[i].split('--');
        let x = parseInt(cords[0]) + parseInt(a[0]-c[0]);
        let y = parseInt(cords[1]) + parseInt(a[1]-c[1]);
        if(x >= 0 && x < 10 && y >= 0 && y < 10){
            let r = (x) + '-' + (y);
            if(document.getElementById(r).classList.contains('elem')){
                return false;
            }
        }
        else{
            return false;
        }
    }
    return true;
}


function put(e,id,cords){
    let k = true;
    let p = []
    let temp = e[id];
    let c = temp[0].split('--');
    for(let i = 0 ; i < temp.length ; i++){
        let a = temp[i].split('--');
        let x = parseInt(cords[0]) + parseInt(a[0]-c[0]);
        let y = parseInt(cords[1]) + parseInt(a[1]-c[1]);
        let r = (x) + '-' + (y);
        if(x >= 0 && x < 10 && y >= 0 && y < 10){
            if(document.getElementById(r).classList.contains('elem')){
                k = false;
                break;
            }
            else{
                p.push(r);
            }
        }
        else{
            k = false;
            break;
        }
    }
    if(k){
        add(p);
        score += (p.length*100)  ;
        document.getElementById('score').textContent = "Score: "+score;
        sub(e[id]);
        let j = Math.floor(Math.random()*17);
        add(e[j]);
        return j;
        
    }
    else{
        valid();
        console.log("failed");
        return id;
    };
}

function set_el(){
    let cords = this.id.split('-');
    if(flag1) id1 = put(e1,id1,cords);
    if(flag2) id2 = put(e2,id2,cords);
    if(flag3) id3 = put(e3,id3,cords);
    check();
}

function valid(){
    let parent = document.getElementById('board');
    let child = parent.querySelectorAll("div:not(.elem)");
    let flag = false;
    if(id1 != null && id2 != null && id3 != null){
        child.forEach(ch=>{
            let cords = ch.id.split('-');
            let a1 = putt(e1,id1,cords);
            let a2 = putt(e2,id2,cords);
            let a3 = putt(e3,id3,cords);
            flag = (flag || a1 || a2 || a3);

        });
        if(flag){
            console.log("hiii")
        }
        if(!flag){
            console.log("failed!!!!!!!");
            update();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }
}

function check(){
    let temp = [];
    for(let i = 0 ; i < 10 ; i++){
        let cnt = 0 ,cnt1 = 0;
        let temp1 = [] , temp2 =[];
        for(let j = 0 ; j < 10 ; j++){
            let c = i + '-' + j;
            let c1 = j + '-' + i;
            if(document.getElementById(c).classList.contains('elem')){
                temp1.push(c);
                cnt++;
            }
            if(document.getElementById(c1).classList.contains('elem')){
                temp2.push(c1);
                cnt1++;
            }
            
        }
        if(cnt == 10){
            score += 500;
            document.getElementById('score').textContent = "Score: "+score;
            for(let i = 0 ; i < 10 ; i++) temp.push(temp1[i]);
        }
        if(cnt1 == 10){
            score += 500;
            document.getElementById('score').textContent = "Score: "+score;
            for(let i = 0 ; i < 10 ; i++) temp.push(temp2[i]);
        }
    }
    setTimeout(() => {
        sub(temp);
    }, 300);
    valid();
}

async function update(){
    try{
        const res = await fetch('/block',{
            method: 'POST',
            body: JSON.stringify({score}),
            headers: {'Content-Type':'application/json'}
        });
    }
    catch(err){
        console.log(err)
    } 
}


