import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const Login = () => {
    const [errors, setErrors] = useState<any>({})
    const { login } = useAuthStore(state => state)

    const submitHandler = useCallback(async (e: React.FormEvent) => {
      e.preventDefault()
      const { email, password } = e.currentTarget as HTMLFormElement

      try {
        const res = await axios.post('/auth/login', {
          email: email.value,
          password: password.value
        })

        login(res.data)
      } catch (error: any) {
        console.log(error)
        setErrors(error.response.data || {})
      }
    }, [errors]) 

  return (
    <div>
        <form onSubmit={submitHandler}>
            <input 
              type="email" 
              name='email' 
              placeholder='이메일'
            />
            <input 
              type="password" 
              name='password' 
              placeholder='비밀번호'
            />
            <button>로그인</button>
            <Link to="/register">회원가입</Link>
        </form>
    </div>
  )
}

export default React.memo(Login)