
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
        const res = await fetch('/login',{
            method: 'POST',
            body: JSON.stringify({email,password}),
            headers: {'Content-Type':'application/json'}
        });

        const data = await res.json();
        console.log(data);
        if(data.errors){
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


