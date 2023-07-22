import React, { useCallback, useState } from 'react'

const Login = () => {
    const [errors, setErrors] = useState<any>({})

    const submitHandler = useCallback((e: React.FormEvent) => {
      e.preventDefault()
      const { email, password } = e.currentTarget as HTMLFormElement

      console.log(email, password)
    }, []) 

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
            <button>회원가입</button>
        </form>
    </div>
  )
}

export default React.memo(Login)