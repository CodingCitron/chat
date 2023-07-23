import axios from 'axios'
import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'

const Register = () => {
  const [errors, setErrors] = useState<any>({})
  const { login } = useAuthStore(state => state)

  const submitHandler = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, password, confirmPassword } = e.currentTarget as HTMLFormElement

    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', {
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
      })

      login(res.data)
    } catch (error: any) {
      console.error(error)
      setErrors(error.response.data || {})
    }
  }, [errors])
  
  return (
    <div>
        <form onSubmit={submitHandler}>
          <input 
            type='text' 
            name='name'
            placeholder='이름' 
          />
          <input 
            type='email' 
            name='email'
            placeholder='이메일' 
          />
          <input 
            type='password' 
            name='password'
            placeholder='비밀번호' 
          />
          <input 
            type='password' 
            name='confirmPassword'
            placeholder='비밀번호 확인' 
          />
          <button>회원가입</button>
          <Link to='/'>로그인</Link>
        </form>
    </div>
  )
}

export default React.memo(Register)