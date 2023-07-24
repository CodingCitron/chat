import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useAuthStore } from '../stores/auth'

const Chat = () => {
    const socket = useRef(new WebSocket(`ws://localhost:3000`))
    const [message, setMessage] = useState<string[]>([])

    const { token } = useAuthStore(state => state)

    useEffect(() => {
        return () => {
            // 컴포넌트 사라졌을 때
            socket.current.close()
        }
    }, [])

    const makeMessage = useCallback((msg: MessageEvent) => {
        const parsed = JSON.parse(msg.data)
        
        // console.log('New message:', msg.data, ' from the Server')
        setMessage([...message, parsed])   
    }, [message])

    socket.current.addEventListener('open', () => {
        console.log('Connected to Browser')   
    })

    socket.current.addEventListener('message', makeMessage)

    socket.current.addEventListener('close', () => {
        console.log('Disconnected from Server')   
    })

    const submitHandler = useCallback<(e: React.FormEvent<HTMLFormElement>) => void>(e => {
        e.preventDefault()
        const { text } = e.currentTarget

        socket.current.send(JSON.stringify({
            token: token,
            message: text.value
        }))

        text.value = ''
    }, [token])
    
  return (
    <div className='chat-wrapper'>
        <ul>
            { message.map((item: any, index) => (
                <li key={index}>
                    {item.message}
                </li>
            )) }
        </ul>
        <form 
            name='chat'
            onSubmit={submitHandler}
        >   
            <input 
                name='text'
                type='text'
                placeholder='메시지를 입력하세요.'
            />
            <button>전송</button>
        </form>
    </div>
  )
}

export default React.memo(Chat) 