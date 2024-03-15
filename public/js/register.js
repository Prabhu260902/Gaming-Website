
const form = document.querySelector('form');
let emailError = document.querySelector('.email.error');
let usernameError = document.querySelector('.username.error');
let passwordError = document.querySelector('.password.error');

form.addEventListener('submit',async (e)=>{
    e.preventDefault();

    emailError.textContent = '';
    usernameError.textContent = '';
    passwordError.textContent = '';


    const email = form.email.value;
    const username = form.username.value;
    const password = form.password.value;

    try{
        const res = await fetch('/register',{
            method: 'POST',
            body: JSON.stringify({email,username,password}),
            headers: {'Content-Type':'application/json'}
        });

        const data = await res.json();
        console.log(data);
        if(data.errors){
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
            usernameError.textContent = data.errors.username;
        }

        if(data.user){
            location.assign('/login');
        }
    }
    catch(err){
        console.log(err)
    }
})


