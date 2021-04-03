

var LogoutButton = document.querySelector('#LogoutButton')
var resultHere = document.querySelector('#resultHere')

LogoutButton.addEventListener('click' ,async (e) => {
    e.preventDefault()
    
    const response=await fetch('/logout',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    const final =await response.json()
    if(response.status==202){
        console.log(final)
        location.replace('/')
    }else{
        console.log("EROOR")
    }
    resultHere.innerHTML = final.result
})
