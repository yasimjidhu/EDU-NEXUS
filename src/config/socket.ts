import {io} from 'socket.io-client'
const socket = io('http://localhost:3000')

// Join a conversation room
socket.emit('joinRoom',conversationId)

// Send a message
socket.emit('sendMessage',message)

// Recieve messages
socket.on('receiveMessage',(message)=>{
    console.log('new Message',message)
})