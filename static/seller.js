function addResource(){

    fetch("/resources/add-resource", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name: document.getElementById("name").value,
            category: document.getElementById("category").value,
            price: parseFloat(document.getElementById("price").value)
        })
    })
    .then(res=>res.json())
    .then(data=>{
        alert(data.message || data.error)
        loadResources()
    })

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
function loadResources(){

    fetch("/resources/resources")
    .then(res=>res.json())
    .then(data=>{
        let grid = document.getElementById("resourceGrid")
        grid.innerHTML = ""

        data.forEach(r=>{
            grid.innerHTML += `
            <div class="card">
                <h3>${r.name}</h3>
                <p><b>ID:</b> ${r.rid}</p>
                <p>${r.category}</p>
                <b>₹${r.price}</b>
            </div>
            `
        })
    })
}

window.onload = loadResources