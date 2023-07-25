import React, { FormEvent, InputHTMLAttributes, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'

const Room = () => {
    const socket = useRef(io('http://localhost:3000'))
    
    const backendDone = useCallback((msg: object) => {
        console.log(`Create rooms:`)
        console.log(socket.current) 
    }, [])

    const handleRoomSubmit = useCallback((e: FormEvent) => {
        e.preventDefault()

        const { room } = e.currentTarget as HTMLFormElement

        socket.current.emit(
            'enter_room', 
            { payload: room.value },
            backendDone
        )

        room.value = ''
    }, [])

    return (
        <main className='room-page'>
            <h3>방 목록</h3>
            <ul>

            </ul>
            <div>
                <form onSubmit={handleRoomSubmit}>
                    <input 
                        type='text'
                        name="room"                 
                        placeholder='방 이름'
                    />
                    <button>방 생성하기</button>
                </form>
            </div>
        </main>
    )
}

export default Room