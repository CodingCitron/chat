import http from 'http'
import WebSocket from 'ws'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = express()
const port = 3000

// app.set('')
app.use(express.static("public")) // public 폴더 사용
const origin = `http://localhost:${port}` 

app.use(cors({
    origin,
    credentials: true
}))
app.use(express.json()) // json 형태로 오는 요청의 본문을 해석해줄 수 있게 등록
app.use(express.urlencoded({ extended: true })) // form 방식일때

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const sockets = []

server.listen(port, () => console.log(`Listen on ${origin}`))
wss.on('connection', socket => {
    sockets.push(socket)
    socket.send('welcome to chat!')
    socket.send('hello!!!')
    socket.on('message', message => {
        sockets.forEach(otherSocket => otherSocket.send(message.toString()))
    })
    socket.on('close', () => {
        console.log('Disconnected from the Browser')
    })
})