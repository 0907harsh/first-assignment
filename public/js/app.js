

var LoginButton = document.querySelector('#LoginButton')
var SignupButton = document.querySelector('#SignupButton')
var resultHere = document.querySelector('#resultHere')

SignupButton.addEventListener('click' ,async (e) => {
    e.preventDefault()
    var firstname = document.querySelector('#Firstname').value
    var lastname = document.querySelector('#Lastname').value
    var email = document.querySelector('#EmailSignup').value
    var password = document.querySelector('#passwordSignup').value
    console.log(Firstname + ',' + EmailSignup)
    var data={firstname,lastname,email,password}
    const response=await fetch('/signup',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: await JSON.stringify(data)
    })
    const final =await response.json()
    if(response.status==201){
        console.log(final)
        location.replace('/dashboard')
    }else{
        console.log("EROOR")
    }
    resultHere.innerHTML = final.result
})

LoginButton.addEventListener('click' ,async (e) => {
    e.preventDefault()
    e.preventDefault()
    var email = document.querySelector('#emailLogin').value
    var password = document.querySelector('#passwordLogin').value
    // socket.emit('DetailSubmit',username,password)
    var data={email,password}
    // console.log(data)
    const response=await fetch('/login',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)
    })
    
    const final =await response.json()
    // console.log(response.body)
    if(response.status==202){
        console.log(final)
        console.log('LoggedIN')
        location.replace('/dashboard')
        // console.log(response.status)
    }else{
        console.log('Error')
    }
    resultHere.innerHTML = final.result
})

// signupButton.addEventListener('click', (e) => {
//     e.preventDefault()
//   })