
// Example data (replace this with your JSON data)
const createDivButton = document.getElementById("graphbtn");
const chart = document.getElementById("myChart");
const clossBtn = document.getElementById('closeButton');
let myChart = null; 
clossBtn.addEventListener('click',function(){
    chart.style.display = 'none';
    clossBtn.style.display = 'none';
    const wrapper = document.querySelector(".section");
    const elementsToBlur = wrapper.querySelectorAll("*:not(#myChart):not(#closeButton)");
    elementsToBlur.forEach(element => {
        element.classList.remove("blur");
    });
})

createDivButton.addEventListener("click", function() {
    // Create a new div element
    console.log("hi")
    chart.style.display = 'flex';
    clossBtn.style.display = 'flex';
    
    const wrapper = document.querySelector(".section");
    const elementsToBlur = wrapper.querySelectorAll("*:not(#myChart):not(#closeButton)");
    elementsToBlur.forEach(element => {
        element.classList.toggle("blur");
    });

    let DATA;
    
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
        print(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
});


function print(Data){
    const Xaxis = [];
    const yaxis = []
    Object.keys(Data['TicTacToe']).forEach(key=>{
        const name = key.charAt(0).toUpperCase() + key.slice(1)
        Xaxis.push(name);
        yaxis.push(Data['TicTacToe'][key]);
    })

    Xaxis.push('Lose');
    yaxis.push(Data['TicTacToe']['played'] - (Data['TicTacToe']['win'] + Data['TicTacToe']['draw']))

    const bgcolors =  ['rgb(65,105,225,1)',
    'rgb(65,105,225,0.8)','rgb(65,105,225,0.5)']
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
                beginAtZero: true,
            },
        },
    };

    if (myChart) {
        myChart.destroy();
    }
      // Create bar graph
      const ctx = chart.getContext('2d');
      myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
      });
}




  