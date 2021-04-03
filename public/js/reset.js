
var changepassword = document.querySelector('#changepassword')

changepassword.addEventListener('click' ,async (e) => {
    e.preventDefault()
    var newpassword = document.querySelector('#newpassword').value
    var confirmnewpassword = document.querySelector('#confirmnewpassword').value
    // socket.emit('DetailSubmit',username,password)
    if(newpassword === confirmnewpassword){
        var data={password:newpassword}
        // console.log(data)
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token')
        console.log(token)
        const response=await fetch('reset?token='+token, {
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
            location.replace('/signup')
            // console.log(response.status)
        }else{
            console.log('Error')
        }
        resultHere.innerHTML = final.result
    }else{
        resultHere.innerHTML = "Password Don't Match"
    }
})