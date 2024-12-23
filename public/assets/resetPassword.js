const form = document.querySelector('form');
const resetPassword = document.getElementById('resetPassword');
form.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const password = resetPassword.value;
    const requestId = window.location.pathname.split('/').pop();
    try{
        const response = await fetch(`/api/password/resetPassword/${requestId}`, {
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({newPassword: password})
        })

        if(response.ok){
            alert('Password has been reset successfully');
            window.location.href = '/login.html';
        }

    }catch(err){
        console.log("failed to reset password in front end", err);
    }
})