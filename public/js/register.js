$(document).ready(function(){
    const form = $('form');
    let emailError = $('.email.error');
    let usernameError = $('.username.error');
    let passwordError = $('.password.error');
    let otpError = $('.valid.error');
    let val = 0 , OTP = null;

    form.on('submit',async (e)=>{
        e.preventDefault();

        emailError.text('');
        usernameError.text('');
        passwordError.text('');


        const email = form.find('input[name="email"]').val();
        const username = form.find('input[name="username"]').val();
        const password = form.find('input[name="password"]').val();
        const otp = form.find('input[name="valid"]').val();
        if(val == 0){
            val = 1;
            try{
                const res = await fetch('/register',{
                    method: 'POST',
                    body: JSON.stringify({email,username,password,val}),
                    headers: {'Content-Type':'application/json'}
                });

                const data = await res.json();
                OTP = data.otp;
                $('.otp').css('display' ,'inline');
            }
            catch(err){
                console.log(err)
            }
        }
        else{
            val = 2;
            const c = 0;
            if(OTP == otp){
                try{
                    const res = await fetch('/register',{
                        method: 'POST',
                        body: JSON.stringify({email,username,password,c}),
                        headers: {'Content-Type':'application/json'}
                    });

                    const data = await res.json();
                    if(data.errors){
                        emailError.text(data.errors.email);
                        passwordError.text(data.errors.password);
                        usernameError.text(data.errors.username);
                    }

                    if(data.user)
                    location.assign('/login');
                        
                }
                catch(err){
                    console.log(err)
                }
            }
            else{
                otpError.text('Enter valid OTP');
            }
        }
    })

})

// const form = document.querySelector('form');
// let emailError = document.querySelector('.email.error');
// let usernameError = document.querySelector('.username.error');
// let passwordError = document.querySelector('.password.error');
// let otpError = document.querySelector('.valid.error');
// let val = 0 , OTP = null;

// form.addEventListener('submit',async (e)=>{
//     e.preventDefault();

//     emailError.textContent = '';
//     usernameError.textContent = '';
//     passwordError.textContent = '';


//     const email = form.email.value;
//     const username = form.username.value;
//     const password = form.password.value;
//     const otp = form.valid.value;
//     if(val == 0){
//         val = 1;
//         try{
//             const res = await fetch('/register',{
//                 method: 'POST',
//                 body: JSON.stringify({email,username,password,val}),
//                 headers: {'Content-Type':'application/json'}
//             });

//             const data = await res.json();
//             OTP = data.otp;
//             document.querySelector('.otp').style.display = 'inline';
//         }
//         catch(err){
//             console.log(err)
//         }
//     }
//     else{
//         val = 2;
//         const c = 0;
//         if(OTP == otp){
//             try{
//                 const res = await fetch('/register',{
//                     method: 'POST',
//                     body: JSON.stringify({email,username,password,c}),
//                     headers: {'Content-Type':'application/json'}
//                 });

//                 const data = await res.json();
//                 if(data.errors){
//                     emailError.textContent = data.errors.email;
//                     passwordError.textContent = data.errors.password;
//                     usernameError.textContent = data.errors.username;
//                 }

//                 if(data.user)
//                 location.assign('/login');
                    
//             }
//             catch(err){
//                 console.log(err)
//             }
//         }
//         else{
//             otpError.textContent = 'Enter valid OTP';
//         }
//     }
// })


