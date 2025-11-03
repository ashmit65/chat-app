const socket = io("http://localhost:8000")

const name = prompt("Enter Your Name To Join the Chat")?.trim() || `User${Math.floot(Math.random() * 1000)}`
socket.emit("user-joined", name)

const first = document.querySelector(".first")
// const senter = document.querySelector(".center")

function generateMessage(side, message){
    const div = document.createElement('div')
    div.classList.add("alert")
    div.innerHTML = message
    if(side==="left"){
        div.classList.add("alert-primary")
        div.classList.add("left")
    }else if (side==="right"){
        div.classList.add("alert-secondary")
        div.classList.add("right")
    }
    else{
        div.classList.add("alert")
        div.classList.add("center")
    }
    first.appendChild(div)
}

socket.on("new-user-joined", name=>{
    if(name){
       generateMessage("center", `${name} Joined the Chat`) 
    }
    // generateMessage("center", `${name} Joined the Chat`)
})

// socket.on("recieve", data=>{
socket.on("recieve", ({name,message}) =>{
    generateMessage("left", `${name}: ${message}`)
})

socket.on("user-left", name=>{
    generateMessage("center", `${name} Left the Chat`)
})

function sendMessage(){
    let input = document.getElementById("message")
    if(input.value.length){
        generateMessage('right', input.value)
        socket.emit("send", input.value)
        input.value = ""
    }
}