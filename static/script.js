function loginUser() {

    fetch("/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.userid){

            localStorage.setItem("token", data.token);   // ✅ ADD THIS
            localStorage.setItem("userid", data.userid);
            localStorage.setItem("role", data.role);

            alert("Login Successful");

            if(data.role === "admin"){
                window.location.href = "/admin"
            }
            else if(data.role === "seller"){
                window.location.href = "/seller"
            }
            else if(data.role === "buyer"){
                window.location.href = "/buyer"
            }
        }
        else{
            alert(data.message || data.error)
        }
          
    });

}

function registerUser() {

    fetch("/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: document.getElementById("reg_username").value,
            password: document.getElementById("reg_password").value,
            role: document.getElementById("role").value
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error)
    })

}