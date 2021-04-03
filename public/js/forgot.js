const forgotpassword= document.querySelector('#Forgotpassword')
var resultHere = document.querySelector('#dsadsdasS')

forgotpassword.addEventListener('click' ,async (e) => {
    e.preventDefault()
    var email = document.querySelector('#emailLogin').value
    var data={email}
    const response=await fetch('/forgot',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: await JSON.stringify(data)
    })
    const final =await response.json()
    if(response.status==200){
        console.log(final)
        resultHere.innerHTML ='Email Sent Successfully.Please check spam folder if not recieved'
    }else{
        console.log("EROOR")
        resultHere.innerHTML='Internal Server Error'
    }
    
})