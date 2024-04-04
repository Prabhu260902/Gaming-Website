
const form = document.getElementById('form');
let emailError = document.querySelector('.email.error');
let passwordError = document.querySelector('.password.error');

form.addEventListener('submit',async (e)=>{
    e.preventDefault();

    emailError.textContent = '';
    passwordError.textContent = '';

    const email = form.email.value;
    const password = form.password.value;

    try{
        document.querySelector(".loader").style.display = 'flex';
        const wrapper = document.querySelector(".section");
        const elementsToBlur = wrapper.querySelectorAll("*:not(.loader)");
        elementsToBlur.forEach(element => {
            element.classList.toggle("blur");
        });
        const res = await fetch('/login',{
            method: 'POST',
            body: JSON.stringify({email,password}),
            headers: {'Content-Type':'application/json'}
        });

        const data = await res.json();
        if(data.errors){
            document.querySelector(".loader").style.display = 'none';
            const wrapper = document.querySelector(".section");
            const elementsToBlur = wrapper.querySelectorAll("*:not(.loader)");
            elementsToBlur.forEach(element => {
                element.classList.remove("blur");
            });
            passwordError.textContent = data.errors.password;
            emailError.textContent = data.errors.email;
        }

        
        
        
        

        if(data.user){
            location.assign('/games');
        }
    }
    catch(err){
        console.log(err)
    } 
})


