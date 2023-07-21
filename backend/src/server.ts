import http from 'http'
import WebSocket from 'ws'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = express()
const port: number = 3000

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

const sockets: any[] = []

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

// 바벨과 타입스크립트 충돌
// https://hoontae24.github.io/9

// 근데 타입스크립트를 사용하면 바벨을 사용할 필요 없는것인가?
// https://velog.io/@ckstn0777/12.5%EC%9D%BC-%EB%B0%94%EB%B2%A8%EA%B3%BC-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B4%80%EA%B3%84%EC%97%90-%EA%B4%80%ED%95%98%EC%97%AC