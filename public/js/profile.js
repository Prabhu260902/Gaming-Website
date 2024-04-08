
// // Example data (replace this with your JSON data)
// const createDivButton = document.querySelector(".graphbtn");
// const chess = document.querySelector(".graphbtnChess");
// const chart = document.getElementById("myChart");
// const clossBtn = document.getElementById('closeButton');
// let myChart = null; 
// clossBtn.addEventListener('click',function(){
//     if (myChart) {
//         myChart.destroy();
//     }
//     chart.style.display = 'none';
//     clossBtn.style.display = 'none';
//     const wrapper = document.querySelector(".section");
//     const elementsToBlur = wrapper.querySelectorAll("*:not(#myChart):not(#closeButton)");
//     elementsToBlur.forEach(element => {
//         element.classList.remove("blur");
//     });
// })


// function fectingData(choice){
    
//     fetch('/profile', {
//         method: 'POST',
//         headers: {
//         'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({}),
//     })
//     .then(response => {
//         return response.json();
//     })
//     .then(data => {
//         print(data,choice);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }


// createDivButton.addEventListener("click", function() {
//     chart.style.display = 'flex';
//     clossBtn.style.display = 'flex';
    
//     const wrapper = document.querySelector(".section");
//     const elementsToBlur = wrapper.querySelectorAll("*:not(#myChart):not(#closeButton)");
//     elementsToBlur.forEach(element => {
//         element.classList.toggle("blur");
//     });

//     fectingData(1);
// });


// function print(Data,choice){
//     const Xaxis = [];
//     const yaxis = []
//     let temp;
//     if(choice) temp = 'TicTacToe';
//     else temp = 'Chess';
//     Object.keys(Data[temp]).forEach(key=>{
//         const name = key.charAt(0).toUpperCase() + key.slice(1)
//         Xaxis.push(name);
//         yaxis.push(Data[temp][key]);
//     })


//     const bgcolors =  ['rgb(65,105,225,1)',
//     'rgb(65,105,225,0.8)','rgb(65,105,225,0.5)']
//     const data = {
//         labels: Xaxis,
//         datasets: [{
//           label: 'Stats',
//           backgroundColor: bgcolors,
//           borderColor: '#4169E1',
//           color: 'white',
//           borderWidth: 1,
//           data: yaxis
//         }]
//       };
//     const options = {
//         scales: {
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };

//     if (myChart) {
//         myChart.destroy();
//     }
//       // Create bar graph
//       const ctx = chart.getContext('2d');
//       myChart = new Chart(ctx, {
//         type: 'bar',
//         data: data,
//         options: options
//       });
// }


// chess.addEventListener('click',function(){
//     chart.style.display = 'flex';
//     clossBtn.style.display = 'flex';
    
//     const wrapper = document.querySelector(".section");
//     const elementsToBlur = wrapper.querySelectorAll("*:not(#myChart):not(#closeButton)");
//     elementsToBlur.forEach(element => {
//         element.classList.toggle("blur");
//     });

//     fectingData(0);
// })

  
$(document).ready(function() {
    const createDivButton = $(".graphbtn");
    const chess = $(".graphbtnChess");
    const chart = $("#myChart");
    const clossBtn = $('#closeButton');
    let myChart = null;

    clossBtn.on('click', function() {
        if (myChart) {
            myChart.destroy();
        }
        chart.css('display', 'none');
        clossBtn.css('display', 'none');
        const wrapper = $(".section");
        const elementsToBlur = wrapper.find("*:not(#myChart):not(#closeButton)");
        elementsToBlur.removeClass("blur");
    });

    function fectingData(choice) {
        $.ajax({
            url: '/profile',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({}),
            success: function(data) {
                print(data, choice);
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    }

    createDivButton.on("click", function() {
        chart.css('display', 'flex');
        clossBtn.css('display', 'flex');
        const wrapper = $(".section");
        const elementsToBlur = wrapper.find("*:not(#myChart):not(#closeButton)");
        elementsToBlur.toggleClass("blur");
        fectingData(1);
    });

    function print(Data, choice) {
        const Xaxis = [];
        const yaxis = [];
        let temp;
        if (choice) temp = 'TicTacToe';
        else temp = 'Chess';
        Object.keys(Data[temp]).forEach(key => {
            const name = key.charAt(0).toUpperCase() + key.slice(1)
            Xaxis.push(name);
            yaxis.push(Data[temp][key]);
        });

        const bgcolors = ['rgb(65,105,225,1)', 'rgb(65,105,225,0.8)', 'rgb(65,105,225,0.5)'];
        const data = {
            labels: Xaxis,
            datasets: [{
                label: 'Stats',
                backgroundColor: bgcolors,
                borderColor: '#4169E1',
                color: 'white',
                borderWidth: 1,
                data: yaxis
            }]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        if (myChart) {
            myChart.destroy();
        }
        // Create bar graph
        const ctx = chart[0].getContext('2d');
        myChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
    }

    chess.on('click', function() {
        chart.css('display', 'flex');
        clossBtn.css('display', 'flex');
        const wrapper = $(".section");
        const elementsToBlur = wrapper.find("*:not(#myChart):not(#closeButton)");
        elementsToBlur.toggleClass("blur");
        fectingData(0);
    });
});
