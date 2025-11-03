const io = require('socket.io')(8000,{
    cors:"http://localhost:5500"
});
console.log("server is running on 8000")
const users = {};

io.on("connection",(socket)=>{
    socket.on("user-joined",(name)=>{
        users[socket.id] = name
        socket.broadcast.emit("new-user-joined", name)
    })
    socket.on("send",(message)=>{
        socket.broadcast.emit("recieve", ({name:users[socket.id],message:message}))
    })
    socket.on("disconnect",()=>{
        let name = users[socket.id]
        delete users[socket.id]
        socket.broadcast.emit("user-left",name)
    })
})