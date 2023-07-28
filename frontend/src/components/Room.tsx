import React, { FormEvent, useCallback, useRef, useState, useMemo, useEffect } from 'react'
import { io } from 'socket.io-client'
import { Messgae } from '../types'
import { useAuthStore } from '../stores/auth'

const Room = () => {
    const { token } = useAuthStore(state => state)

    const socket = useRef(io('http://localhost:3000', {
        auth: {
            token
        }
    }))
    const [isJoin, setIsJoin] = useState(false)
    const [roomName, setRoomName] = useState('')  
    const [message, setMessage] = useState<String[]>([])

    const showRoom = useCallback((roomName: any) => {
        setIsJoin(true)
        setRoomName(`방: ${roomName}` )
    }, [])

    const handleRoomSubmit = useCallback((e: FormEvent) => {
        e.preventDefault()

        const { room } = e.currentTarget as HTMLFormElement
        const roomName: String = room.value

        socket.current.emit(
            'enter_room', 
            roomName,
            () => showRoom(roomName)
        )

        room.value = ''
    }, [])

    const addMessage = useCallback((newMessage: String) => {
        setMessage([...message, newMessage])
    }, [message])

    const handleMessageSubmit = useCallback((e: FormEvent) => {
        e.preventDefault()
        const { new_message } = e.currentTarget as HTMLFormElement
        
        socket.current.emit('new_message', new_message.value, roomName, () => {
            addMessage(new_message.value)
        })
    }, [message])

    useEffect(() => {
        socket.current.on('welcome', () => {    
            addMessage('Someone Joined')
        })

        socket.current.on('bye', () => {    
            addMessage('Someone Left ')
        })

        socket.current.on('new_message', message => {    
            addMessage(message)
        })    
    }, [])

    const messageRender = useMemo(() => {
        console.log(message)
        return message.map((msg, index) => (
            <li key={index}>
                { msg }
            </li>
        ))
    }, [message])

    return (
        <main className='room-page'>
            { !isJoin && ( 
                <div>
                    <h3>방 생성하기</h3>
                    <ul>

                    </ul>
                    <div>
                        <form onSubmit={handleRoomSubmit}>
                            <input 
                                type='text'
                                name="room"                 
                                placeholder='방 이름'
                            />
                            <button>방 들어가기</button>
                        </form>
                    </div>
                </div>
            )}
            { isJoin && (
                <div>
                    <h3>{ roomName }</h3>
                    <ul>
                        { messageRender }
                    </ul>
                    <form onSubmit={handleMessageSubmit}>
                        <input 
                            type="text" 
                            name='new_message'
                            placeholder='메시지 입력'
                        />
                        <button>메시지 전송하기</button>
                    </form>
                </div>
            )}
        </main>
    )
}

export default Room