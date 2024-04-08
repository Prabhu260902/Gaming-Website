$(document).ready(async function(){
    try{
        const data = await fetch('/getData',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
        })

        const Data = await data.json();
        const table = $('<table>');
        const tr = $('<tr>');
        const td1 = $('<th>').text('User');
        const td2 = $('<th>').text('Score');
        tr.append(td1,td2);
        table.append(tr);
        for(let i = 0 ; i < Data.length ; i++){
            const tr = $('<tr>');
            const a = $('<a>');
            a.attr('href','/tempProfile?email='+encodeURIComponent(Data[i].email));
            const td1 = $('<td>');
            const td2 = $('<td>').addClass('value');
            a.text(Data[i].email);
            td2.text(Data[i].TotalScore);
            td1.append(a);
            tr.append(td1,td2);
            table.append(tr);
        }
        $('.section').append(table);
    }catch(err){
        console.log(err)
    }
})


// async function getData(){
//     try{
//         const data = await fetch('/getData',{
//             method: 'POST',
//             headers: {'Content-Type':'application/json'},
//         })

//         const Data = await data.json();
//         const table = document.createElement('table');
//         const tr = document.createElement('tr');
//         const td1 = document.createElement('th');
//         const td2 = document.createElement('th');
//         td1.innerText = 'User';
//         td2.innerText = 'Score';
//         tr.appendChild(td1);
//         tr.appendChild(td2);
//         table.appendChild(tr);
//         for(let i = 0 ; i < Data.length ; i++){
//             const tr = document.createElement('tr');
//             const a = document.createElement('a');
//             a.href = '/tempProfile?email='+encodeURIComponent(Data[i].email);
//             const td1 = document.createElement('td');
//             const td2 = document.createElement('td');
//             td2.classList.add('value');
//             a.innerText = Data[i].email;
//             td2.innerText = Data[i].TotalScore;
//             td1.appendChild(a);
//             tr.appendChild(td1);
//             tr.appendChild(td2);
//             table.appendChild(tr);
//         }
//         document.querySelector('.section').appendChild(table);
//     }
//     catch(err){
//         console.log(err);
//     }
// }

// getData();