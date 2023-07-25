import http from 'http'
import express, { Application } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import AuthRouter from './routes/auth'
import cookieParser from "cookie-parser"
import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'

dotenv.config()

const app: Application = express()
const port: number = 3000

const origin = `http://localhost:8000` 

app.use(cors({
    origin,
    credentials: true
}))
app.use(express.json()) // json 형태로 오는 요청의 본문을 해석해줄 수 있게 등록
app.use(express.urlencoded({ extended: true })) // form 방식일때
app.use(cookieParser())
app.use(express.static("public")) // public 폴더 사용

// 라우터 연결
app.use('/api/auth', AuthRouter)

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin
    }
})

server.listen(port, async () => console.log(`Listen on ${port}`))
io.on('connection', socket => {
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`)
    })
    
    socket.on('enter_room', (roomName, done) => {
        console.log(roomName)
        socket.join(roomName)
        done(socket.rooms)
    })
})
// const { email, name }: any = jwt.verify(parsed.token, process.env.JWT_SECRET || '')

// 바벨과 타입스크립트 충돌
// https://hoontae24.github.io/9

// 근데 타입스크립트를 사용하면 바벨을 사용할 필요 없는것인가?
// https://velog.io/@ckstn0777/12.5%EC%9D%BC-%EB%B0%94%EB%B2%A8%EA%B3%BC-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B4%80%EA%B3%84%EC%97%90-%EA%B4%80%ED%95%98%EC%97%AC