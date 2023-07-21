import React, { useState, useCallback, useRef, useEffect } from 'react'

const Chat = () => {
    const socket = useRef(new WebSocket(`ws://localhost:3000`))

    const [message, setMessage] = useState<string[]>([])

    useEffect(() => {
        console.log(socket.current)
        return () => {
            // 컴포넌트 사라졌을 때
            socket.current.close()
        }
    }, [])
    
    socket.current.addEventListener('open', () => {
        console.log('Connected to Browser')   
    })

    socket.current.addEventListener('message', msg => {
        console.log('New message:', msg.data, ' from the Server')
        setMessage([...message, msg.data])   
    })

    socket.current.addEventListener('close', () => {
        console.log('Disconnected from Server')   
    })

    const submitHandler = useCallback<(e: React.FormEvent<HTMLFormElement>) => void>(e => {
        e.preventDefault()
        const { text } = e.currentTarget
    
        socket.current.send(text.value)
        text.value = ''
    }, [])
    

  return (
    <div className='chat-wrapper'>
        <ul>
            { message.map((msg, index) => (
                <li key={index}>
                    {msg}
                </li>
            )) }
        </ul>
        <form 
            name='chat'
            onSubmit={submitHandler}
        >   
            <input 
                name='nickname'
                type='text'
                placeholder='닉네임'
            />
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