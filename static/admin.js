// ================= SECTION TOGGLE =================

function openSection(id){
    document.querySelectorAll(".section").forEach(sec => sec.style.display="none");
    document.getElementById(id).style.display="block";
}

function openSub(id){
    document.querySelectorAll(".subsection").forEach(sec => sec.style.display="none");
    document.getElementById(id).style.display="block";
}
function addUser(){

    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;
    const role = document.getElementById("newRole").value;

    fetch("/user/register", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
            role: role
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("addMsg").innerText =
            data.message || data.error;
    });
}

function loadUsers(){

    fetch("/user/all")
    .then(res => res.json())
    .then(data => {

        let html = "";

        data.forEach(user => {
            html += `
                <p>
                    <b>${user.username}</b> - ${user.role}
                </p>
            `;
        });

        document.getElementById("userList").innerHTML = html;
    });
}
function deleteResource(rid){
    if(!confirm("Are you sure you want to delete this resource?")) return;

    fetch(`/resources/delete-resource/${rid}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadResources();
    })
    .catch(err => {
        console.error(err);
        alert("Delete failed");
    });
}

//view all resources
function loadResourcesAdmin(){

    fetch("/resources/resources")
    .then(res => res.json())
    .then(data => {

        let html = "";

        data.forEach(r => {
            html += `
                <p>
                    ID: <b>${r.rid}</b> |
                    ${r.name} - ${r.category} - ₹${r.price}
                </p>
            `;
        });

        document.getElementById("resourceList").innerHTML = html;
    });

}

// add resources
function addResourceAdmin(){

    const name = document.getElementById("resName").value;
    const category = document.getElementById("resCategory").value;
    const price = document.getElementById("resPrice").value;

    fetch("/resources/add-resource", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            name: name,
            category: category,
            price: parseFloat(price)
        })
    })
    .then(res => res.json())
    .then(data => {

        document.getElementById("addResMsg").innerText =
            data.message || data.error;

    });

}

//delete resources
function deleteResourceAdmin(){

    const rid = document.getElementById("deleteResId").value;

    fetch(`/resources/delete-resource/${rid}`, {
        method:"DELETE"
    })
    .then(res => res.json())
    .then(data => {

        document.getElementById("deleteResMsg").innerText =
            data.message || data.error;

    });

}
// section switching
function showViewResources(){
    document.getElementById("viewResourcesBox").style.display = "block";
    document.getElementById("addResourceBox").style.display = "none";
    document.getElementById("deleteResourceBox").style.display = "none";
}

function showAddResource(){
    document.getElementById("viewResourcesBox").style.display = "none";
    document.getElementById("addResourceBox").style.display = "block";
    document.getElementById("deleteResourceBox").style.display = "none";
}

function showDeleteResource(){
    document.getElementById("viewResourcesBox").style.display = "none";
    document.getElementById("addResourceBox").style.display = "none";
    document.getElementById("deleteResourceBox").style.display = "block";
}
function loadTransactionsAdmin(){

    fetch("/transaction/all-transactions")
    .then(res => res.json())
    .then(data => {

        let list = document.getElementById("transactionList");
        list.innerHTML = "";

        data.forEach(t => {

            list.innerHTML += `
            <div class="card">
                <p><b>Transaction ID:</b> ${t.tid}</p>
                <p><b>User:</b> ${t.username} (ID: ${t.userid})</p>
                <p><b>Resource:</b> ${t.resource_name} (ID: ${t.rid})</p>
                <p><b>Category:</b> ${t.category}</p>
                <p><b>Price:</b> ₹${t.price}</p>
            </div>
            `
        })

    })
}