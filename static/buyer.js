let selectedResource = null;
let myResources = [];

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("userDisplay").innerText =
        "Welcome " + localStorage.getItem("userid");

    loadResources();

    document.getElementById("searchBtn").addEventListener("click", searchResources);
    document.getElementById("logoutBtn").addEventListener("click", logout);
    document.getElementById("confirmPurchase").addEventListener("click", () => {

        fetch("/transaction/purchase", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                userid: localStorage.getItem("userid"),
                rid: selectedResource
            })
        })
        .then(res => res.json())
        .then(data => {

            alert(data.message || data.error);

            document.getElementById("purchaseModal").style.display = "none";

            loadTransactions();

        });

    });


});
function loadResources(){

    fetch("/resources/resources")
    .then(res => res.json())
    .then(data => {

        let grid = document.getElementById("resourcesGrid");
        grid.innerHTML = "";

        data.forEach(r => {

            grid.innerHTML += `
            <div class="resource-card">
                <h3>${r.name}</h3>
                <p>${r.category}</p>
                <b>₹${r.price}</b>

                <button onclick="addToMyResources(${r.rid}, '${r.name}', '${r.category}', ${r.price})">
                    Add
                </button>

                <button onclick="openPurchase(${r.rid}, '${r.name}', ${r.price})">
                    Buy
                </button>
            </div>
            `
        });

    });

}

function searchResources(){

    let category = document.getElementById("categoryFilter").value;

    // If nothing selected → load all
    if(category === ""){
        loadResources();
        return;
    }

    fetch("/resources/search/" + category)
    .then(res => res.json())
    .then(data => {

        let grid = document.getElementById("resourcesGrid");
        grid.innerHTML = "";

        if(data.length === 0){
            grid.innerHTML = "<p>No resources found</p>";
            return;
        }

        data.forEach(r => {

            grid.innerHTML += `
            <div class="resource-card">
                <h3>${r.name}</h3>
                <p>${category}</p>
                <b>₹${r.price}</b>

                <button onclick="addToMyResources(${r.rid}, '${r.name}', '${category}', ${r.price})">
                    Add
                </button>

                <button onclick="openPurchase(${r.rid}, '${r.name}', ${r.price})">
                    Buy
                </button>
            </div>
            `
        });

    });

}

function addToMyResources(rid, name, category, price){

    let myResources = JSON.parse(localStorage.getItem("myResources")) || [];

    // prevent duplicates
    let exists = myResources.find(r => r.rid === rid);

    if(!exists){

        myResources.push({
            rid: rid,
            name: name,
            category: category,
            price: price
        });

        localStorage.setItem("myResources", JSON.stringify(myResources));

        alert("Added to My Resources");

    } else {
        alert("Already added");
    }

}

function loadMyResources(){

    let myResources = JSON.parse(localStorage.getItem("myResources")) || [];

    let grid = document.getElementById("myResourcesGrid");
    grid.innerHTML = "";

    if(myResources.length === 0){
        grid.innerHTML = "<p>No resources added</p>";
        return;
    }

    myResources.forEach(r => {

        grid.innerHTML += `
        <div class="resource-card">
            <h3>${r.name}</h3>
            <p>${r.category}</p>
            <b>₹${r.price}</b>
        </div>
        `
    });

}
function openPurchase(rid, name, price){

    selectedResource = rid;

    document.getElementById("purchaseModal").style.display = "block";
    document.getElementById("purchaseResourceInfo").innerText =
        name + " - ₹" + price;

}
document.getElementById("confirmPurchase").addEventListener("click", () => {

    fetch("/transaction/purchase", {  
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            userid: localStorage.getItem("userid"),
            rid: selectedResource
        })
    })
    .then(res => res.json())
    .then(data => {

        alert(data.message || data.error);

        document.getElementById("purchaseModal").style.display = "none";

        loadTransactions();

    });

});


function loadTransactions(){

    fetch("/transaction/purchase-history/" + localStorage.getItem("userid"))
    .then(res => res.json())
    .then(data => {

        let list = document.getElementById("transactionsList");
        list.innerHTML = "";

        if(!Array.isArray(data)){
            list.innerHTML = "<p>No purchases found</p>";
            return;
        }

        data.forEach(t => {

            list.innerHTML += `
            <div class="transaction-card">
                <h4>${t.resource_name}</h4>
                <p>${t.category}</p>
                <b>₹${t.price}</b>
            </div>
            `
        });

    });

}

// SIDEBAR VIEW SWITCHING

document.querySelectorAll(".sidebar-menu li").forEach(item => {

    item.addEventListener("click", () => {

        document.querySelectorAll(".sidebar-menu li")
        .forEach(i => i.classList.remove("active"));

        item.classList.add("active");

        document.querySelectorAll(".view")
        .forEach(v => v.classList.remove("active"));

        let view = item.getAttribute("data-view");

        if(view === "browse"){
            document.getElementById("browseView").classList.add("active");
        }

        if(view === "my-resources"){
            document.getElementById("myResourcesView").classList.add("active");
            loadMyResources();   // 🔥 from local storage
        }

        if(view === "transactions"){
            document.getElementById("transactionsView").classList.add("active");
            loadTransactions();  // 🔥 from DB
        }
    });

});

function logout(){
    localStorage.clear();
    window.location.href = "/";
}
